import express from "express";
import morgan from "morgan";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "analytics.db");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  sessionId TEXT NOT NULL,
  ts INTEGER NOT NULL,
  type TEXT NOT NULL,
  stageId TEXT,
  domainId TEXT,
  appVersion TEXT,
  payload TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events(type, ts);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_stage ON events(stageId);
CREATE INDEX IF NOT EXISTS idx_events_domain ON events(domainId);
`);

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(morgan("tiny"));

const ADMIN_KEY = process.env.ANALYTICS_ADMIN_KEY || "";

// --- Admin middleware ---
function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) return next(); // dev mode open
  if (req.headers["x-admin-key"] === ADMIN_KEY) return next();
  return res.status(401).json({ error: "unauthorized" });
}

// --- SSE infrastructure ---
const sseClients = new Set();
function broadcast(data, event = "update") {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch {
      // silently drop dead client
    }
  }
}

// Quick async-ish aggregate (cheap)
function currentSummary() {
  const row = db.prepare(`SELECT COUNT(*) c FROM events`).get();
  const sess = db.prepare(`SELECT COUNT(DISTINCT sessionId) c FROM events`).get();
  const types = db.prepare(`SELECT type, COUNT(*) c FROM events GROUP BY type`).all();
  return { totalEvents: row.c, distinctSessions: sess.c, byType: types };
}

// Periodic heartbeat so clients know stream alive
setInterval(() => {
  if (sseClients.size) {
    broadcast({ ts: Date.now(), kind: "heartbeat" }, "heartbeat");
  }
}, 15000);

// --- CSV helpers ---
function toCsv(rows) {
  if (!rows || !rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map(h => escape(r[h])).join(","));
  }
  return lines.join("\n");
}

function sinceClause(sinceHoursRaw) {
  const sinceHours = parseFloat(sinceHoursRaw);
  if (Number.isFinite(sinceHours)) {
    const cutoff = Date.now() - sinceHours * 3600 * 1000;
    return { clause: "AND ts >= ?", param: cutoff };
  }
  return { clause: "", param: null };
}

// --- Ingest handler (also triggers SSE broadcast) ---
const ingestHandler = (req, res) => {
  const { sessionId, appVersion, events } = req.body || {};
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "events must be an array" });
  }
  const insert = db.prepare(`
    INSERT OR IGNORE INTO events (id, sessionId, ts, type, stageId, domainId, appVersion, payload)
    VALUES (@id, @sessionId, @ts, @type, @stageId, @domainId, @appVersion, @payload)
  `);
  const tx = db.transaction(rows => {
    rows.forEach(evt => {
      insert.run({
        id: evt.id,
        sessionId: evt.sessionId || sessionId,
        ts: evt.ts,
        type: evt.type,
        stageId: evt.stageId ?? null,
        domainId: evt.domainId ?? null,
        appVersion: appVersion ?? null,
        payload: evt.payload ? JSON.stringify(evt.payload) : null,
      });
    });
  });
  tx(events);

  // Broadcast only a light delta (count + last type)
  broadcast({
    ts: Date.now(),
    lastTypes: [...new Set(events.map(e => e.type))],
    summary: currentSummary()
  }, "delta");

  res.json({ ok: true, stored: events.length });
};

app.post("/analytics/events", ingestHandler);
app.post("/api/analytics/events", ingestHandler);

app.get("/analytics/health", (_req, res) => res.json({ ok: true }));
app.get("/api/analytics/health", (_req, res) => res.json({ ok: true }));

// --- Existing aggregate endpoints (shortened for brevity) ---
function buildSinceClause(sinceHours) {
  return sinceClause(sinceHours);
}

app.get("/api/analytics/summary", requireAdmin, (req, res) => {
  const { clause, param } = buildSinceClause(req.query.sinceHours);
  const args = param ? [param] : [];
  const total = db.prepare(`SELECT COUNT(*) c FROM events WHERE 1=1 ${clause}`).get(args).c;
  const sessions = db.prepare(`SELECT COUNT(DISTINCT sessionId) c FROM events WHERE 1=1 ${clause}`).get(args).c;
  const byType = db.prepare(`SELECT type, COUNT(*) c FROM events WHERE 1=1 ${clause} GROUP BY type ORDER BY c DESC`).all(args);
  res.json({ totalEvents: total, distinctSessions: sessions, byType });
});

// Stage stats
app.get("/api/analytics/stage-stats", requireAdmin, (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = db.prepare(`
    SELECT
      stageId,
      SUM(CASE WHEN type='stage_view' THEN 1 ELSE 0 END) AS stageViews,
      COUNT(DISTINCT CASE WHEN type='stage_view' THEN sessionId END) AS uniqueStageSessions
    FROM events
    WHERE stageId IS NOT NULL ${clause}
    GROUP BY stageId
    ORDER BY stageViews DESC
  `).all(args);
  res.json(rows);
});

// Domain dwell (from domain_view_end)
app.get("/api/analytics/domain-stats", requireAdmin, (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = db.prepare(`
    SELECT
      stageId,
      domainId,
      COUNT(*) AS closes,
      ROUND(AVG(CAST(json_extract(payload,'$.durationMs') AS REAL))) AS avgDurationMs,
      SUM(CAST(json_extract(payload,'$.durationMs') AS INTEGER)) AS totalDurationMs
    FROM events
    WHERE type='domain_view_end' ${clause}
    GROUP BY stageId, domainId
    ORDER BY totalDurationMs DESC
  `).all(args);
  res.json(rows);
});

// Project dwell (project_view_end)
app.get("/api/analytics/project-stats", requireAdmin, (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = db.prepare(`
    SELECT
      stageId,
      domainId,
      json_extract(payload,'$.projectId') AS projectId,
      COUNT(*) AS closes,
      ROUND(AVG(CAST(json_extract(payload,'$.durationMs') AS REAL))) AS avgDurationMs,
      SUM(CAST(json_extract(payload,'$.durationMs') AS INTEGER)) AS totalDurationMs
    FROM events
    WHERE type='project_view_end' ${clause}
    GROUP BY stageId, domainId, projectId
    ORDER BY totalDurationMs DESC
  `).all(args);
  res.json(rows);
});

// Question accuracy
app.get("/api/analytics/question-stats", requireAdmin, (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = db.prepare(`
    SELECT
      json_extract(payload,'$.questionId') AS questionId,
      SUM(CASE WHEN json_extract(payload,'$.correct')=1 THEN 1 ELSE 0 END) AS correctCount,
      COUNT(*) AS totalAnswers,
      ROUND(100.0 * SUM(CASE WHEN json_extract(payload,'$.correct')=1 THEN 1 ELSE 0 END) / COUNT(*), 1) AS percentCorrect
    FROM events
    WHERE type='question_answered' ${clause}
    GROUP BY questionId
    ORDER BY percentCorrect DESC, totalAnswers DESC
  `).all(args);
  res.json(rows);
});

// Quiz skipped counts
app.get("/api/analytics/quiz-skips", requireAdmin, (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = db.prepare(`
    SELECT stageId, domainId, COUNT(*) AS skips
    FROM events
    WHERE type='quiz_skipped' ${clause}
    GROUP BY stageId, domainId
    ORDER BY skips DESC
  `).all(args);
  res.json(rows);
});

// Screensaver activity
app.get("/api/analytics/screensaver", requireAdmin, (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = db.prepare(`
    SELECT type, COUNT(*) AS c
    FROM events
    WHERE type IN ('screensaver_shown','screensaver_exit') ${clause}
    GROUP BY type
  `).all(args);
  res.json(rows);
});

// Daily timeline (UTC days)
app.get("/api/analytics/daily", requireAdmin, (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const cutoff = Date.now() - days * 86400000;
  const rows = db.prepare(`
    SELECT
      strftime('%Y-%m-%d', ts/1000, 'unixepoch') AS day,
      COUNT(*) AS events,
      COUNT(DISTINCT sessionId) AS sessions
    FROM events
    WHERE ts >= ?
    GROUP BY day
    ORDER BY day ASC
  `).all([cutoff]);
  res.json(rows);
});

// Top sessions by activity
app.get("/api/analytics/top-sessions", requireAdmin, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const rows = db.prepare(`
    SELECT sessionId, COUNT(*) AS events
    FROM events
    GROUP BY sessionId
    ORDER BY events DESC
    LIMIT ?
  `).all([limit]);
  res.json(rows);
});

// --- CSV Export ---
// GET /analytics/export?kind=raw|stage|domain|project|question&sinceHours=24
app.get("/api/analytics/export", requireAdmin, (req, res) => {
  const { kind = "raw", sinceHours } = req.query;
  const { clause, param } = sinceClause(sinceHours);
  const args = param ? [param] : [];

  let rows = [];
  switch (kind) {
    case "raw":
      rows = db.prepare(`
        SELECT id, sessionId, ts, type, stageId, domainId, appVersion, payload
        FROM events
        WHERE 1=1 ${clause}
        ORDER BY ts ASC
      `).all(args);
      break;
    case "stage":
      rows = db.prepare(`
        SELECT stageId, COUNT(*) stageViews
        FROM events
        WHERE type='stage_view' ${clause} AND stageId IS NOT NULL
        GROUP BY stageId
        ORDER BY stageViews DESC
      `).all(args);
      break;
    case "domain":
      rows = db.prepare(`
        SELECT stageId, domainId,
          COUNT(*) closes,
          SUM(CAST(json_extract(payload,'$.durationMs') AS INTEGER)) totalDurationMs
        FROM events
        WHERE type='domain_view_end' ${clause}
        GROUP BY stageId, domainId
        ORDER BY totalDurationMs DESC
      `).all(args);
      break;
    case "project":
      rows = db.prepare(`
        SELECT stageId, domainId,
          json_extract(payload,'$.projectId') projectId,
          COUNT(*) closes,
          SUM(CAST(json_extract(payload,'$.durationMs') AS INTEGER)) totalDurationMs
        FROM events
        WHERE type='project_view_end' ${clause}
        GROUP BY stageId, domainId, projectId
        ORDER BY totalDurationMs DESC
      `).all(args);
      break;
    case "question":
      rows = db.prepare(`
        SELECT
          json_extract(payload,'$.questionId') questionId,
          SUM(CASE WHEN json_extract(payload,'$.correct')=1 THEN 1 ELSE 0 END) correctCount,
          COUNT(*) totalAnswers
        FROM events
        WHERE type='question_answered' ${clause}
        GROUP BY questionId
        ORDER BY totalAnswers DESC
      `).all(args);
      rows = rows.map(r => ({
        ...r,
        percentCorrect: r.totalAnswers ? Math.round((r.correctCount / r.totalAnswers) * 1000) / 10 : 0
      }));
      break;
    default:
      return res.status(400).json({ error: "invalid kind" });
  }

  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${kind}_export.csv"`);
  res.send(csv);
});

// --- SSE Stream ---
// Client connects: GET /analytics/stream
app.get("/api/analytics/stream", (req, res, next) => {
  if (ADMIN_KEY) {
    const headerKey = req.headers["x-admin-key"];
    const token = req.query.token;
    if (headerKey !== ADMIN_KEY && token !== ADMIN_KEY) {
      return res.status(401).end();
    }
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });
  res.write(`event: init\ndata: ${JSON.stringify({ summary: currentSummary(), ts: Date.now() })}\n\n`);
  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Analytics server listening on :${port}`));
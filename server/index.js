import express from "express";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import 'dotenv/config';
import cors from "cors";
import initSqlJs from "sql.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "analytics.db");

// Initialize sql.js (WASM) and load or create the database
const SQL = await initSqlJs({
  locateFile: (file) => path.join(__dirname, "node_modules", "sql.js", "dist", file),
});

const fileBuffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
const db = new SQL.Database(fileBuffer || undefined);

// Helper to persist DB to disk (debounced)
function saveDb() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}
let saveTimer = null;
function saveDbDebounced(delay = 200) {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveDb();
  }, delay);
}

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

// Skip morgan for OPTIONS
app.use(morgan("tiny", {
  skip: (req) => req.method === "OPTIONS"
}));

app.use(cors({
  origin: (origin, cb) => cb(null, true),          // keep permissive for now
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","x-admin-key"],
  maxAge: 600,                                      // cache preflight 10 min
  optionsSuccessStatus: 204
}));

// Fast path OPTIONS (after cors so headers are set)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "2mb" }));
// app.use(cors({ origin: ["capacitor://localhost","https://localhost","http://localhost:5173", "http://10.187.16.236:4000"], methods: ["GET","POST"], allowedHeaders: ["Content-Type","x-admin-key"] }));
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
// Lightweight query helpers for sql.js
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}
function get(sql, params = []) {
  const rows = all(sql, params);
  return rows[0] ?? null;
}

async function currentSummary() {
  const row = get(`SELECT COUNT(*) c FROM events`);
  const sess = get(`SELECT COUNT(DISTINCT sessionId) c FROM events`);
  const types = all(`SELECT type, COUNT(*) c FROM events GROUP BY type`);
  return { totalEvents: row?.c || 0, distinctSessions: sess?.c || 0, byType: types };
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
const ingestHandler = async (req, res) => {
  const { sessionId, appVersion, events } = req.body || {};
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "events must be an array" });
  }
  try {
    db.exec('BEGIN');
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO events (id, sessionId, ts, type, stageId, domainId, appVersion, payload)
      VALUES (:id, :sessionId, :ts, :type, :stageId, :domainId, :appVersion, :payload)
    `);
    for (const evt of events) {
      stmt.run({
        ":id": evt.id,
        ":sessionId": evt.sessionId || sessionId,
        ":ts": evt.ts,
        ":type": evt.type,
        ":stageId": evt.stageId ?? null,
        ":domainId": evt.domainId ?? null,
        ":appVersion": appVersion ?? null,
        ":payload": evt.payload ? JSON.stringify(evt.payload) : null,
      });
    }
    stmt.free();
    db.exec('COMMIT');
    saveDbDebounced();
  } catch (e) {
    try { db.exec('ROLLBACK'); } catch {}
    return res.status(500).json({ error: 'failed to store events' });
  }

  // Broadcast only a light delta (count + last type)
  const summary = await currentSummary();
  broadcast({
    ts: Date.now(),
    lastTypes: [...new Set(events.map(e => e.type))],
    summary
  }, "delta");

  res.json({ ok: true, stored: events.length });
};

app.post("/analytics/events", ingestHandler);
app.post("/api/analytics/events", ingestHandler);

// Alt no-preflight ingest (text/plain simple request)
app.post("/api/analytics/events-plain",
  express.text({ limit: "2mb" }),
  (req, res) => {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      return res.status(400).json({ error: "invalid json" });
    }
    ingestHandler(req, res);
  }
);

app.get("/analytics/health", (_req, res) => res.json({ ok: true }));
app.get("/api/analytics/health", (_req, res) => res.json({ ok: true }));

// --- Existing aggregate endpoints (shortened for brevity) ---
function buildSinceClause(sinceHours) {
  return sinceClause(sinceHours);
}

app.get("/api/analytics/summary", requireAdmin, async (req, res) => {
  const { clause, param } = buildSinceClause(req.query.sinceHours);
  const args = param ? [param] : [];
  const totalRow = get(`SELECT COUNT(*) c FROM events WHERE 1=1 ${clause}`, args);
  const sessionsRow = get(`SELECT COUNT(DISTINCT sessionId) c FROM events WHERE 1=1 ${clause}`, args);
  const byType = all(`SELECT type, COUNT(*) c FROM events WHERE 1=1 ${clause} GROUP BY type ORDER BY c DESC`, args);
  res.json({ totalEvents: totalRow?.c || 0, distinctSessions: sessionsRow?.c || 0, byType });
});

// Stage stats
app.get("/api/analytics/stage-stats", requireAdmin, async (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = all(`
    SELECT
      stageId,
      SUM(CASE WHEN type='stage_view' THEN 1 ELSE 0 END) AS stageViews,
      COUNT(DISTINCT CASE WHEN type='stage_view' THEN sessionId END) AS uniqueStageSessions
    FROM events
    WHERE stageId IS NOT NULL ${clause}
    GROUP BY stageId
    ORDER BY stageViews DESC
  `, args);
  res.json(rows);
});

// Domain dwell (from domain_view_end)
app.get("/api/analytics/domain-stats", requireAdmin, async (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  // Fetch raw rows and aggregate in JS (no JSON1 in sql.js by default)
  const raw = all(`
    SELECT stageId, domainId, payload
    FROM events
    WHERE type='domain_view_end' ${clause}
  `, args);

  const map = new Map();
  for (const r of raw) {
    let dur = 0;
    try { dur = Number(JSON.parse(r.payload || '{}').durationMs) || 0; } catch {}
    const key = `${r.stageId || ''}|||${r.domainId || ''}`;
    const acc = map.get(key) || { stageId: r.stageId, domainId: r.domainId, closes: 0, totalDurationMs: 0 };
    acc.closes += 1;
    acc.totalDurationMs += dur;
    map.set(key, acc);
  }
  const rows = [...map.values()].map(x => ({
    ...x,
    avgDurationMs: x.closes ? Math.round(x.totalDurationMs / x.closes) : 0,
  })).sort((a,b) => b.totalDurationMs - a.totalDurationMs);
  res.json(rows);
});

// Project dwell (project_view_end)
app.get("/api/analytics/project-stats", requireAdmin, async (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const raw = all(`
    SELECT stageId, domainId, payload
    FROM events
    WHERE type='project_view_end' ${clause}
  `, args);
  const map = new Map();
  for (const r of raw) {
    let dur = 0, projectId = null;
    try {
      const j = JSON.parse(r.payload || '{}');
      dur = Number(j.durationMs) || 0;
      projectId = j.projectId ?? null;
    } catch {}
    const key = `${r.stageId || ''}|||${r.domainId || ''}|||${projectId || ''}`;
    const acc = map.get(key) || { stageId: r.stageId, domainId: r.domainId, projectId, closes: 0, totalDurationMs: 0 };
    acc.closes += 1;
    acc.totalDurationMs += dur;
    map.set(key, acc);
  }
  const rows = [...map.values()].map(x => ({
    ...x,
    avgDurationMs: x.closes ? Math.round(x.totalDurationMs / x.closes) : 0,
  })).sort((a,b) => b.totalDurationMs - a.totalDurationMs);
  res.json(rows);
});

// Question accuracy
app.get("/api/analytics/question-stats", requireAdmin, async (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const raw = all(`
    SELECT payload
    FROM events
    WHERE type='question_answered' ${clause}
  `, args);
  const map = new Map();
  for (const r of raw) {
    let questionId = null, correct = 0;
    try {
      const j = JSON.parse(r.payload || '{}');
      questionId = j.questionId ?? null;
      correct = j.correct ? 1 : 0;
    } catch {}
    if (questionId == null) continue;
    const acc = map.get(questionId) || { questionId, correctCount: 0, wrongCount: 0, totalAnswers: 0 };
    acc.totalAnswers += 1;
    if (correct) acc.correctCount += 1; else acc.wrongCount += 1;
    map.set(questionId, acc);
  }
  const rows = [...map.values()].map(a => ({
    ...a,
    percentCorrect: a.totalAnswers ? Math.round((a.correctCount / a.totalAnswers) * 1000) / 10 : 0
  })).sort((x,y) => y.percentCorrect - x.percentCorrect || y.totalAnswers - x.totalAnswers);
  res.json(rows);
});

// Quiz skipped counts
app.get("/api/analytics/quiz-skips", requireAdmin, async (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = all(`
    SELECT stageId, domainId, COUNT(*) AS skips
    FROM events
    WHERE type='quiz_skipped' ${clause}
    GROUP BY stageId, domainId
    ORDER BY skips DESC
  `, args);
  res.json(rows);
});

// Screensaver activity
app.get("/api/analytics/screensaver", requireAdmin, async (req, res) => {
  const sinceHours = parseFloat(req.query.sinceHours);
  const { clause, param } = buildSinceClause(!isNaN(sinceHours) ? sinceHours : null);
  const args = param ? [param] : [];
  const rows = all(`
    SELECT type, COUNT(*) AS c
    FROM events
    WHERE type IN ('screensaver_shown','screensaver_exit') ${clause}
    GROUP BY type
  `, args);
  res.json(rows);
});

// Daily timeline (UTC days)
app.get("/api/analytics/daily", requireAdmin, async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const cutoff = Date.now() - days * 86400000;
  const rows = all(`
    SELECT
      strftime('%Y-%m-%d', ts/1000, 'unixepoch') AS day,
      COUNT(*) AS events,
      COUNT(DISTINCT sessionId) AS sessions
    FROM events
    WHERE ts >= ?
    GROUP BY day
    ORDER BY day ASC
  `, [cutoff]);
  res.json(rows);
});

// Top sessions by activity
app.get("/api/analytics/top-sessions", requireAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const rows = all(`
    SELECT sessionId, COUNT(*) AS events
    FROM events
    GROUP BY sessionId
    ORDER BY events DESC
    LIMIT ?
  `, [limit]);
  res.json(rows);
});

// --- CSV Export ---
// GET /analytics/export?kind=raw|stage|domain|project|question&sinceHours=24
app.get("/api/analytics/export", requireAdmin, async (req, res) => {
  const { kind = "raw", sinceHours } = req.query;
  const { clause, param } = sinceClause(sinceHours);
  const args = param ? [param] : [];

  let rows = [];
  switch (kind) {
    case "raw":
      rows = all(`
        SELECT id, sessionId, ts, type, stageId, domainId, appVersion, payload
        FROM events
        WHERE 1=1 ${clause}
        ORDER BY ts ASC
      `, args);
      break;
    case "stage":
      rows = all(`
        SELECT stageId, COUNT(*) stageViews
        FROM events
        WHERE type='stage_view' ${clause} AND stageId IS NOT NULL
        GROUP BY stageId
        ORDER BY stageViews DESC
      `, args);
      break;
    case "domain":
      {
        const raw = all(`
          SELECT stageId, domainId, payload
          FROM events
          WHERE type='domain_view_end' ${clause}
        `, args);
        const map = new Map();
        for (const r of raw) {
          let dur = 0;
          try { dur = Number(JSON.parse(r.payload || '{}').durationMs) || 0; } catch {}
          const key = `${r.stageId || ''}|||${r.domainId || ''}`;
          const acc = map.get(key) || { stageId: r.stageId, domainId: r.domainId, closes: 0, totalDurationMs: 0 };
          acc.closes += 1;
          acc.totalDurationMs += dur;
          map.set(key, acc);
        }
        rows = [...map.values()].sort((a,b) => b.totalDurationMs - a.totalDurationMs);
      }
      break;
    case "project":
      {
        const raw = all(`
          SELECT stageId, domainId, payload
          FROM events
          WHERE type='project_view_end' ${clause}
        `, args);
        const map = new Map();
        for (const r of raw) {
          let dur = 0, projectId = null;
          try {
            const j = JSON.parse(r.payload || '{}');
            dur = Number(j.durationMs) || 0;
            projectId = j.projectId ?? null;
          } catch {}
          const key = `${r.stageId || ''}|||${r.domainId || ''}|||${projectId || ''}`;
          const acc = map.get(key) || { stageId: r.stageId, domainId: r.domainId, projectId, closes: 0, totalDurationMs: 0 };
          acc.closes += 1;
          acc.totalDurationMs += dur;
          map.set(key, acc);
        }
        rows = [...map.values()].sort((a,b) => b.totalDurationMs - a.totalDurationMs);
      }
      break;
    case "question":
      {
        const raw = all(`
          SELECT payload
          FROM events
          WHERE type='question_answered' ${clause}
        `, args);
        const map = new Map();
        for (const r of raw) {
          try {
            const j = JSON.parse(r.payload || '{}');
            const qid = j.questionId;
            if (qid == null) continue;
            const correct = j.correct ? 1 : 0;
            const acc = map.get(qid) || { questionId: qid, correctCount: 0, totalAnswers: 0 };
            acc.totalAnswers += 1;
            acc.correctCount += correct;
            map.set(qid, acc);
          } catch {}
        }
        rows = [...map.values()].map(r => ({
          ...r,
          percentCorrect: r.totalAnswers ? Math.round((r.correctCount / r.totalAnswers) * 1000) / 10 : 0,
        })).sort((a,b) => b.totalAnswers - a.totalAnswers);
      }
      break;
    case "summary": {   // <-- added
      const total = (get(`SELECT COUNT(*) c FROM events WHERE 1=1 ${clause}`, args))?.c || 0;
      const sessions = (get(`SELECT COUNT(DISTINCT sessionId) c FROM events WHERE 1=1 ${clause}`, args))?.c || 0;
      const types = all(`
        SELECT type,
               COUNT(*) c,
               ROUND(100.0 * COUNT(*) / ?, 2) percentOfTotal
        FROM events
        WHERE 1=1 ${clause}
        GROUP BY type
        ORDER BY c DESC
      `, [total, ...(args || [])]);

      // First row: overall totals (type field = 'ALL')
      rows = [
        { type: "ALL", count: total, distinctSessions: sessions, percentOfTotal: 100 },
        ...types.map(t => ({
          type: t.type,
            count: t.c,
            distinctSessions: "",          // blank to keep CSV simple
            percentOfTotal: t.percentOfTotal
        }))
      ];
      break;
    }
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
app.get("/api/analytics/stream", async (req, res) => {
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
  const summary = await currentSummary();
  res.write(`event: init\ndata: ${JSON.stringify({ summary, ts: Date.now() })}\n\n`);
  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Analytics server listening on :${port}`));
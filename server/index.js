import express from "express";
import morgan from "morgan";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
// Optional CORS if you are not using the Vite proxy:
// import cors from "cors";
import 'dotenv/config';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "analytics.db");
const db = new Database(dbPath);

// Create table if not exists
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
CREATE INDEX IF NOT EXISTS idx_events_stage ON events(stageId);
CREATE INDEX IF NOT EXISTS idx_events_domain ON events(domainId);
`);

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
// If calling the server directly from the browser (no dev proxy), uncomment:
// app.use(cors());

// Define the ingest handler once so we can mount it on multiple paths
const ingestHandler = (req, res) => {
  const { sessionId, appVersion, events } = req.body || {};
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "events must be an array" });
  }
  const insert = db.prepare(`
    INSERT OR IGNORE INTO events (id, sessionId, ts, type, stageId, domainId, appVersion, payload)
    VALUES (@id, @sessionId, @ts, @type, @stageId, @domainId, @appVersion, @payload)
  `);
  const tx = db.transaction((rows) => {
    rows.forEach((evt) => {
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
  res.json({ ok: true, stored: events.length });
};

// Accept both /analytics/events and /api/analytics/events
app.post("/analytics/events", ingestHandler);
app.post("/api/analytics/events", ingestHandler);

// Health on both paths as well
app.get("/analytics/health", (_req, res) => res.json({ ok: true }));
app.get("/api/analytics/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Analytics server listening on :${port}`));
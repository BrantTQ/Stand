# Living Conditions — Life‑Course Data Explorer (Stand)

Interactive kiosk-style React app that explores life stages, domains, and projects with lightweight quiz prompts and a built‑in analytics backend. Designed for touch displays with an attract/screen‑saver loop and an admin dashboard for live stats, CSV export, and historical views.

## Highlights

- Touch‑friendly UI with Attract screen and idle ScreenSaver video overlay
- Stage and domain navigation with quiz prompts and animated transitions
- Local analytics service (Node + Express + SQLite) with:
  - Event ingest, aggregation endpoints, CSV export
  - Server‑Sent Events (SSE) live updates
  - Admin dashboard (Chart.js via react-chartjs-2)
- Vite + React + Tailwind for fast dev and simple builds

## Tech stack

- Frontend: React 19, Vite 7, TypeScript, Tailwind CSS, Framer Motion, Chart.js + react-chartjs-2
- Backend analytics: Node/Express, better‑sqlite3, SSE
- Data: JSON files in `src/data` (stages, domains, blurbs, questions)

## Monorepo layout

```
.
├─ src/
│  ├─ pages/                 # Attract, Stage, Domain, Question, Transition, AI Future
│  ├─ components/            # Header, Breadcrumbs, StageNav, ScreenSaver, etc.
│  ├─ admin/                 # Analytics Dashboard UI
│  ├─ analytics/             # Client helpers (init + track*)
│  ├─ data/                  # lifeStages.json, blurbs.json, domains.json, questions.json
│  └─ App.tsx                # App shell & navigation flow
├─ server/                   # Express analytics server (SQLite)
├─ public/                   # Static assets (images, videos, QR codes)
├─ vite.config.ts            # Dev proxy -> analytics server
├─ package.json              # Frontend scripts & deps
└─ server/package.json       # Analytics server scripts & deps
```

## Prerequisites

- Node.js 20+ (tested with 20.x and 22.x)
- npm 10+

## Quick start (local)

1) Install frontend deps and run the dev server

```bash
npm install
npm run dev
```

2) In a second terminal, start the analytics server (port 4000)

```bash
cd server
npm install
npm run start
```

Vite is configured to proxy API calls to `http://localhost:4000`:

- `/api/analytics/*` → analytics server
- `/analytics/*` → analytics server

Open http://localhost:5173. If the dashboard is needed, add `?admin=1` to the URL or press Shift + A three times to toggle it.

## Environment variables

Frontend (Vite): set in a `.env` file or your host’s env panel

- `VITE_APP_VERSION` (optional) — Displayed in analytics payloads
- `VITE_ANALYTICS_ENDPOINT` (optional) — Override analytics ingest endpoint
- `VITE_ANALYTICS_API_BASE` (optional) — Base for dashboard/API calls (defaults to `/api/analytics` via dev proxy)
- `VITE_ADMIN_KEY` (optional) — If the server enforces admin auth, provide this key so the dashboard can access admin endpoints and SSE

Backend (server): set in environment before `npm run start`

- `PORT` (default `4000`)
- `ANALYTICS_ADMIN_KEY` (optional) — If set, admin endpoints (including SSE/CSV) require either header `x-admin-key: <key>` or URL `?token=<key>`

## Admin dashboard

Open the dashboard by:

- Appending `?admin=1` to the URL, or
- Pressing Shift + A three times within 2 seconds

Features:

- Summary counters and events by type
- Charts: Stage views, Daily events/sessions, Question accuracy
- Top sessions, domain/project dwell times
- CSV export buttons: raw, stage, domain, project, question
- Live mode (SSE) for updates without page reload

If you see proxy errors, ensure the analytics server is running on port 4000.

## Data model and content

Content lives under `src/data/`:

- `lifeStages.json` — list of stages (ids, titles)
- `blurbs.json` — narrative copy and domain/question wiring per stage
- `domains.json` — stage/domain metadata
- `questions.json` — quiz questions per stage/domain

To add content:

1. Add a new stage entry in `lifeStages.json`.
2. Add corresponding entries in `blurbs.json` and `domains.json`.
3. Add questions in `questions.json` (optional).
4. Add any media under `public/` and reference via absolute paths (e.g. `/videos/transition.mp4`).

An optional helper script `scripts/build_json.py` exists to transform inputs; check the script for details before use.

## Analytics events (overview)

The app tracks user flow and dwell times. Common event types stored in SQLite:

- `stage_view` — entering a stage
- `domain_view_start` / `domain_view_end` — entering/leaving a domain (payload includes durationMs on end)
- `question_answered` — quiz answers (payload includes questionId and correctness)
- `quiz_skipped` — skipping quiz on a domain
- `screensaver_shown` / `screensaver_exit` — idle screensaver overlay
- `enter_app` / `exit_to_attract` — entering and exiting the app

Endpoints (prefixed with `/api/analytics`): `summary`, `stage-stats`, `domain-stats`, `project-stats`, `question-stats`, `quiz-skips`, `screensaver`, `daily`, `top-sessions`, `export`, `stream`.

## Build

```bash
npm run build
npm run preview
```

Build artifacts output to `dist/`.

## Deploy

Frontend (e.g., Cloudflare Pages, Netlify, Vercel):

- Build command: `npm ci && npm run build` (ensure `package-lock.json` is committed and in sync)
- Output directory: `dist`
- Set env variables as needed (`VITE_*`)

If your platform uses `npm ci`, resolve lockfile mismatches locally first with `npm install --package-lock-only`, commit the updated `package-lock.json`, and re‑deploy.

Analytics server:

- Deploy as a Node service (VM/container). Minimal steps:
  ```bash
  cd server
  npm ci
  PORT=4000 ANALYTICS_ADMIN_KEY=your_key npm run start
  ```
- Expose HTTPS and point the frontend to it via `VITE_ANALYTICS_API_BASE`/`VITE_ANALYTICS_ENDPOINT`.

## Troubleshooting

- Proxy error `/api/analytics`: Start the analytics server (`npm run start` in `server/`).
- Dashboard shows auth error: Set the same admin key in both server (`ANALYTICS_ADMIN_KEY`) and frontend (`VITE_ADMIN_KEY`).
- `npm ci` fails on CI: Commit a fresh `package-lock.json` generated from the current `package.json`.
- Reactstrap peer warnings with React 19: These are non‑blocking; consider replacing Reactstrap or downgrading to React 18 if strict peers are required.

## License

Copyright © 2025 LISER. All rights reserved.


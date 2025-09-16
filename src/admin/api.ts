const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "zxcasdqwe123";
const API_BASE = import.meta.env.VITE_ANALYTICS_API_BASE || "/api/analytics";

async function get<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: ADMIN_KEY ? { "x-admin-key": ADMIN_KEY } : {}
  });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    let bodySnippet = "";
    try {
      const txt = await res.text();
      bodySnippet = txt.slice(0, 120);
    } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${bodySnippet}`);
  }
  if (!/application\/json/i.test(ct)) {
    // Try to read text for debugging
    const txt = await res.text();
    throw new Error(`Non-JSON response (status ${res.status}): ${txt.slice(0, 120)}`);
  }
  return res.json();
}

export const AnalyticsAPI = {
  summary: (sinceHours?: number) =>
    get(`/summary${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  stageStats: (sinceHours?: number) =>
    get(`/stage-stats${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  domainStats: (sinceHours?: number) =>
    get(`/domain-stats${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  projectStats: (sinceHours?: number) =>
    get(`/project-stats${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  questionStats: (sinceHours?: number) =>
    get(`/question-stats${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  quizSkips: (sinceHours?: number) =>
    get(`/quiz-skips${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  screensaver: (sinceHours?: number) =>
    get(`/screensaver${sinceHours ? `?sinceHours=${sinceHours}` : ""}`),
  daily: (days = 7) => get(`/daily?days=${days}`),
  topSessions: (limit = 10) => get(`/top-sessions?limit=${limit}`),
  exportUrl: (kind: string, sinceHours?: number) => {
    const params = new URLSearchParams({ kind });
    if (sinceHours !== undefined) params.set("sinceHours", String(sinceHours));
//    if (ADMIN_KEY) params.set("token", ADMIN_KEY);
    return `${API_BASE}/export?${params.toString()}`;
  }
};
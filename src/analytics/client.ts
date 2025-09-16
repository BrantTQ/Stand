import type { AnalyticsEvent, AnalyticsEventType } from "./types";

type InitOptions = {
  endpoint?: string; // e.g., /api/analytics or http://localhost:4000/analytics/events
  sessionId?: string;
  appVersion?: string;
};

const DEFAULT_ENDPOINT = "http://10.187.16.236:4000/api/analytics/events";
let ENDPOINT = DEFAULT_ENDPOINT;
let SESSION_ID = "";
let APP_VERSION = "0.0.0";
let queue: AnalyticsEvent[] = [];
let sending = false;

const uuid = () =>
  (crypto?.randomUUID?.() ??
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }));

export function initAnalytics(opts?: InitOptions) {
  ENDPOINT =
    opts?.endpoint ||
    (import.meta as any).env?.VITE_ANALYTICS_ENDPOINT ||
    DEFAULT_ENDPOINT;
  SESSION_ID =
    opts?.sessionId || localStorage.getItem("analytics.sessionId") || uuid();
  localStorage.setItem("analytics.sessionId", SESSION_ID);
  APP_VERSION =
    opts?.appVersion ||
    (import.meta as any).env?.VITE_APP_VERSION ||
    APP_VERSION;

  // Flush on unload using beacon when possible
  window.addEventListener("beforeunload", () => {
    try {
      if (queue.length === 0) return;
      const payload = JSON.stringify({
        sessionId: SESSION_ID,
        appVersion: APP_VERSION,
        events: queue,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
        queue = [];
      }
    } catch {
      // ignore
    }
  });
}

function enqueue(event: AnalyticsEvent) {
  queue.push(event);
  void send();
}

async function send() {
  if (sending || queue.length === 0) return;
  sending = true;
  const batch = queue.splice(0, Math.min(queue.length, 50));

  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionId: SESSION_ID,
        appVersion: APP_VERSION,
        events: batch,
      }),
    });
  } catch {
    // Put events back to queue head to retry later
    queue = [...batch, ...queue];
  } finally {
    sending = false;
    // Throttle next send slightly
    if (queue.length > 0) {
      setTimeout(() => void send(), 250);
    }
  }
}

type TrackInput = {
  type: AnalyticsEventType;
  stageId?: string | null;
  domainId?: string | null;
  payload?: Record<string, unknown>;
};

export function track(input: TrackInput) {
  const evt: AnalyticsEvent = {
    id: uuid(),
    sessionId: SESSION_ID,
    ts: Date.now(),
    type: input.type,
    stageId: input.stageId ?? null,
    domainId: input.domainId ?? null,
    payload: input.payload,
  };
  enqueue(evt);
}
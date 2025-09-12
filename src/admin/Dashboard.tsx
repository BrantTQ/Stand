import React, { useEffect, useRef, useState } from "react";
import { AnalyticsAPI } from "./api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement);

interface Summary {
  totalEvents: number;
  distinctSessions: number;
  byType: { type: string; c: number }[];
}

const numberFmt = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString() : "—";

const SectionCard: React.FC<{ title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, children, actions }) => (
  <div className="bg-base-100 rounded-xl border border-base-300 p-4 shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-lg">{title}</h3>
      {actions}
    </div>
    {children}
  </div>
);

const downloadCsv = async (kind: string, sinceHours?: number) => {
  try {
    const url = AnalyticsAPI.exportUrl(kind, sinceHours);
    const adminKey = (import.meta as any).env?.VITE_ADMIN_KEY as string | undefined;
    const res = await fetch(url, {
      headers: adminKey ? { "x-admin-key": adminKey } : {}
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Export failed (${res.status}): ${txt.slice(0, 120)}`);
    }
    const csvText = await res.text();
    const blob = new Blob([csvText], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${kind}_export.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  } catch (e: any) {
    // Optionally surface error to UI; here we just alert & console
    console.error("CSV export error", e);
    alert(e.message || "CSV export failed");
  }
};

const Dashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [sinceHours, setSinceHours] = useState<number | undefined>(24);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [stageStats, setStageStats] = useState<any[]>([]);
  const [domainStats, setDomainStats] = useState<any[]>([]);
  const [projectStats, setProjectStats] = useState<any[]>([]);
  const [questionStats, setQuestionStats] = useState<any[]>([]);
  const [quizSkips, setQuizSkips] = useState<any[]>([]);
  const [screensaver, setScreensaver] = useState<any[]>([]);
  const [daily, setDaily] = useState<any[]>([]);
  const [topSessions, setTopSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [
        summaryData,
        stageData,
        domainData,
        projectData,
        questionData,
        skipData,
        screenData,
        dailyData,
        topSessionsData,
      ] = await Promise.all([
        AnalyticsAPI.summary(sinceHours),
        AnalyticsAPI.stageStats(sinceHours),
        AnalyticsAPI.domainStats(sinceHours),
        AnalyticsAPI.projectStats(sinceHours),
        AnalyticsAPI.questionStats(sinceHours),
        AnalyticsAPI.quizSkips(sinceHours),
        AnalyticsAPI.screensaver(sinceHours),
        AnalyticsAPI.daily(),
        AnalyticsAPI.topSessions(10),
      ]) as [
        Summary,
        any[],
        any[],
        any[],
        any[],
        any[],
        any[],
        any[],
        any[]
      ];
      setSummary(summaryData);
      setStageStats(stageData);
      setDomainStats(domainData);
      setProjectStats(projectData);
      setQuestionStats(questionData);
      setQuizSkips(skipData);
      setScreensaver(screenData);
      setDaily(dailyData);
      setTopSessions(topSessionsData);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll / load initial
  useEffect(() => {
    if (!live) {
      void load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sinceHours, live]);

  // Live SSE subscription
  useEffect(() => {
    if (!live) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }
    const base = import.meta.env.VITE_ANALYTICS_API_BASE || "/api/analytics";
    const token = import.meta.env.VITE_ADMIN_KEY ? `?token=${encodeURIComponent(import.meta.env.VITE_ADMIN_KEY)}` : "";
    const es = new EventSource(`${base}/stream${token}`);
    eventSourceRef.current = es;

    es.addEventListener("init", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.summary) setSummary(data.summary);
      } catch {}
    });
    es.addEventListener("delta", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.summary) setSummary(data.summary);
      } catch {}
    });
    es.addEventListener("error", () => {
      // Auto-retry after short delay
      es.close();
      setTimeout(() => {
        if (live) setLive(true); // triggers effect to re-open
      }, 3000);
    });

    // Still refresh other aggregates every 30s in live mode
    const interval = window.setInterval(() => {
      void load();
    }, 30000);

    return () => {
      es.close();
      window.clearInterval(interval);
    };
  }, [live]);

  const maxStageViews = stageStats.reduce((m, r) => Math.max(m, r.stageViews || 0), 0);

  // Chart data
  const stageBarData = {
    labels: stageStats.map(s => s.stageId),
    datasets: [{
      label: "Stage Views",
      data: stageStats.map(s => s.stageViews),
      backgroundColor: "#3b82f6",
      borderRadius: 4
    }]
  };

  const dailyLineData = {
    labels: daily.map(d => d.day),
    datasets: [{
      label: "Events",
      data: daily.map(d => d.events),
      fill: false,
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      tension: 0.25,
      pointRadius: 4
    }, {
      label: "Sessions",
      data: daily.map(d => d.sessions),
      fill: false,
      borderColor: "#6366f1",
      backgroundColor: "#6366f1",
      tension: 0.25,
      pointRadius: 4
    }]
  };

  const questionAccuracyData = {
    labels: questionStats.map(q => q.questionId),
    datasets: [{
      label: "% Correct",
      data: questionStats.map(q => q.percentCorrect),
      backgroundColor: "#f59e0b",
      borderRadius: 4
    }]
  };

  const chartOptionsSmall = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  const chartOptionsHorizontal = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, max: 100 } }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col p-4 overflow-y-auto">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <h1 className="text-white font-bold text-2xl flex-1">Analytics Dashboard</h1>
        <label className="text-white text-xs flex items-center gap-1">
          Live
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={live}
            onChange={() => setLive(l => !l)}
          />
        </label>
        <button className="btn btn-sm btn-error" onClick={onClose}>Close</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-white text-sm flex items-center gap-2">
          Since (hours):
          <input
            type="number"
            min={0}
            value={sinceHours ?? ""}
            onChange={(e) =>
              setSinceHours(e.target.value === "" ? undefined : parseFloat(e.target.value))
            }
            className="input input-sm input-bordered w-24"
            disabled={live}
          />
        </label>
        <button className="btn btn-sm btn-primary" onClick={() => load()} disabled={loading || live}>
          Refresh
        </button>
        {loading && <span className="text-xs text-white/70">Loading...</span>}
        {err && (
        <div className="alert alert-error py-1 px-2 text-xs flex items-center gap-2">
            <span>{err}</span>
            <button
            className="btn btn-ghost btn-xs"
            onClick={() => setErr(null)}
            aria-label="Dismiss error"
            >
            ✕
            </button>
        </div>
        )}
        <div className="flex flex-wrap gap-2">
          {["raw","stage","domain","project","question"].map(kind => (
            <button
              key={kind}
              className="btn btn-xs"
              onClick={() => downloadCsv(kind, sinceHours)}
            >
              CSV {kind}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-3 xl:grid-cols-2 md:grid-cols-2">
        <SectionCard title="Summary">
          {summary ? (
            <div className="text-sm space-y-2">
              <div>Total events: {numberFmt(summary.totalEvents)}</div>
              <div>Distinct sessions: {numberFmt(summary.distinctSessions)}</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {summary.byType.map(t => (
                  <div key={t.type} className="flex justify-between">
                    <span>{t.type}</span>
                    <span className="tabular-nums">{t.c}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="text-sm opacity-60">No data</div>}
        </SectionCard>

        <SectionCard title="Stage Views (Chart)">
          {stageStats.length
            ? <Bar data={stageBarData} options={chartOptionsSmall} />
            : <div className="text-xs opacity-60">No stage data</div>}
        </SectionCard>

        <SectionCard title="Daily Events / Sessions">
          {daily.length
            ? <Line data={dailyLineData} options={chartOptionsSmall} />
            : <div className="text-xs opacity-60">No daily</div>}
        </SectionCard>

        <SectionCard title="Domain Dwell (ms)">
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {domainStats.map(d => (
              <div key={d.stageId + d.domainId}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span>{d.stageId}/{d.domainId}</span>
                  <span>{d.totalDurationMs} (avg {d.avgDurationMs})</span>
                </div>
                <div className="h-1.5 w-full bg-base-200 rounded">
                  <div
                    className="h-1.5 bg-green-500 rounded"
                    style={{
                      width: `${Math.round((d.totalDurationMs /
                        (domainStats[0]?.totalDurationMs || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
            {!domainStats.length && <div className="text-xs opacity-60">No domain data</div>}
          </div>
        </SectionCard>

        <SectionCard title="Project Dwell (Top)">
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {projectStats.slice(0, 30).map(p => (
              <div key={p.stageId + p.domainId + p.projectId} className="text-[11px]">
                <div className="flex justify-between mb-0.5">
                  <span className="truncate max-w-[140px]">{p.projectId}</span>
                  <span>{p.totalDurationMs}</span>
                </div>
                <div className="h-1.5 w-full bg-base-200 rounded">
                  <div
                    className="h-1.5 bg-indigo-500 rounded"
                    style={{
                      width: `${Math.round((p.totalDurationMs /
                        (projectStats[0]?.totalDurationMs || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
            {!projectStats.length && <div className="text-xs opacity-60">No project data</div>}
          </div>
        </SectionCard>

        <SectionCard title="Question Accuracy (%)">
          {questionStats.length
            ? <Bar data={questionAccuracyData} options={chartOptionsHorizontal} />
            : <div className="text-xs opacity-60">No question data</div>}
        </SectionCard>

        <SectionCard title="Quiz Skips">
          <div className="text-xs space-y-1 max-h-64 overflow-y-auto">
            {quizSkips.map(q => (
              <div key={q.stageId + q.domainId} className="flex justify-between">
                <span>{q.stageId}/{q.domainId}</span>
                <span>{q.skips}</span>
              </div>
            ))}
            {!quizSkips.length && <div className="opacity-60">No skips</div>}
          </div>
        </SectionCard>

        <SectionCard title="Screensaver Events">
          <div className="text-xs space-y-1">
            {screensaver.map(s => (
              <div key={s.type} className="flex justify-between">
                <span>{s.type}</span>
                <span>{s.c}</span>
              </div>
            ))}
            {!screensaver.length && <div className="opacity-60">No screensaver</div>}
          </div>
        </SectionCard>

        <SectionCard title="Top Sessions">
          <div className="text-xs space-y-1 max-h-64 overflow-y-auto">
            {topSessions.map(s => (
              <div key={s.sessionId} className="flex justify-between">
                <span className="truncate max-w-[120px]">{s.sessionId}</span>
                <span>{s.events}</span>
              </div>
            ))}
            {!topSessions.length && <div className="opacity-60">No sessions</div>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Dashboard;
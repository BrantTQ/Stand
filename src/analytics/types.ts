export type AnalyticsEventType =
  | "enter_app"
  | "stage_view"
  | "domain_view_start"
  | "domain_view_end"
  | "quiz_skipped"
  | "question_answered"
  | "exit_to_attract"
  | "screensaver_shown"
  | "screensaver_exit"
  | "project_view_start"   // NEW
  | "project_view_end";    // NEW

export interface AnalyticsEventBase {
  id: string; // uuid
  sessionId: string;
  ts: number; // epoch ms
  type: AnalyticsEventType;
  stageId?: string | null;
  domainId?: string | null;
}

export interface QuestionAnsweredPayload {
  questionId: string;
  correct: boolean;
  selectedOptionIndex?: number;
  totalOptions?: number;
}

export interface DomainViewEndPayload {
  durationMs: number;
  projectsViewed?: number; // optional: hook up later from DomainScreen pagination
}

// NEW: optional payloads for project events
export interface ProjectViewStartPayload {
  projectId: string;
  index?: number;
}

export interface ProjectViewEndPayload {
  projectId: string;
  durationMs: number;
}

export type AnalyticsEvent = AnalyticsEventBase & {
  payload?: Record<string, unknown>;
};
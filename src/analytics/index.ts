import { track, initAnalytics } from "./client";

export { initAnalytics, track };

// Convenience helpers
export const trackEnterApp = () => track({ type: "enter_app" });

export const trackStageVisit = (stageId: string) =>
  track({ type: "stage_view", stageId });

export const trackDomainStart = (stageId: string, domainId: string) =>
  track({ type: "domain_view_start", stageId, domainId });

export const trackDomainEnd = (
  stageId: string,
  domainId: string,
  durationMs: number,
  projectsViewed?: number
) =>
  track({
    type: "domain_view_end",
    stageId,
    domainId,
    payload: { durationMs, projectsViewed },
  });

export const trackQuizSkipped = (stageId: string, domainId: string) =>
  track({ type: "quiz_skipped", stageId, domainId });

export const trackQuestionAnswered = (params: {
  stageId: string;
  domainId: string;
  questionId: string;
  correct: boolean;
  selectedOptionIndex?: number;
  totalOptions?: number;
}) =>
  track({
    type: "question_answered",
    stageId: params.stageId,
    domainId: params.domainId,
    payload: {
      questionId: params.questionId,
      correct: params.correct,
      selectedOptionIndex: params.selectedOptionIndex,
      totalOptions: params.totalOptions,
    },
  });

export const trackExitToAttract = (reason?: string) =>
  track({ type: "exit_to_attract", payload: { reason } });

export const trackScreensaverShown = () =>
  track({ type: "screensaver_shown" });

export const trackScreensaverExit = () =>
  track({ type: "screensaver_exit" });

// NEW: per-project dwell time
export const trackProjectStart = (
  stageId: string,
  domainId: string,
  projectId: string,
  index?: number
) =>
  track({
    type: "project_view_start",
    stageId,
    domainId,
    payload: { projectId, index },
  });

export const trackProjectEnd = (
  stageId: string,
  domainId: string,
  projectId: string,
  durationMs: number
) =>
  track({
    type: "project_view_end",
    stageId,
    domainId,
    payload: { projectId, durationMs },
  });
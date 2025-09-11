import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import DomainScreen from "./pages/DomainScreen";
import AttractScreen from "./pages/AttractScreen";
import StageScreen from "./pages/StageScreen";
import QuestionScreen from "./pages/QuestionScreen";
import TakeQuiz from "./pages/TakeQuiz";
import lifeStages from "./data/lifeStages.json";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import TransitionScreen from "./pages/TransitionScreen";
import blurbsData from "./data/blurbs.json";
import AiFutureScreen from "./pages/AiFutureScreen"; // NEW

function App() {
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [attractMode, setAttractMode] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showTakeQuiz, setShowTakeQuiz] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  // NEW: track which domains have been answered in this stage
  const [answeredDomainsThisStage, setAnsweredDomainsThisStage] = useState<Set<string>>(new Set());

  // Reset answered set whenever the stage changes (including going back to stage select)
  useEffect(() => {
    setAnsweredDomainsThisStage(new Set());
    // Also reset quiz/question panes if we’re back on stage select
    if (currentStageId === null) {
      setSelectedDomain(null);
      setShowQuestion(false);
      setShowTakeQuiz(false);
    }
  }, [currentStageId]);

  // Real viewport height variable (for mobile browser UI changes)
  const setViewportVar = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  }, []);

  useEffect(() => {
    setViewportVar();
    window.addEventListener("resize", setViewportVar);
    window.addEventListener("orientationchange", setViewportVar);
    return () => {
      window.removeEventListener("resize", setViewportVar);
      window.removeEventListener("orientationchange", setViewportVar);
    };
  }, [setViewportVar]);

  // Idle reset
  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setAttractMode(true);
      setCurrentStageId(null);
      setSelectedDomain(null);
    }, 600000); // 10 minutes
  };

  useEffect(() => {
    if (!attractMode) {
      const events = ["mousedown", "touchstart", "keydown"];
      events.forEach(e => window.addEventListener(e, resetIdleTimer));
      resetIdleTimer();
      return () => {
        events.forEach(e => window.removeEventListener(e, resetIdleTimer));
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
    }
  }, [attractMode]);

  let pageTitle = "";
  if (selectedDomain && currentStageId) {
    const stageObj = lifeStages.find(s => s.id === currentStageId);
    pageTitle = stageObj ? stageObj.title : "Dimension Details";
  } else {
    pageTitle = "Life Journey with Data";
  }

  const handleInteraction = () => {
    setAttractMode(false);
    setShowTransition(true);
  };

  // UPDATED: control quiz flow; skip if already answered this stage or if no questions
  const handleDomainSelect = (domainId: string | null, options?: { skipQuiz?: boolean }) => {
    setSelectedDomain(domainId);
    if (domainId && currentStageId) {
      const stageEntry = (blurbsData as Record<string, any>)[currentStageId];
      const domainsObj = stageEntry?.domains || stageEntry?.domain || {};
      const q = domainsObj?.[domainId]?.questions;
      const hasQuestions = Array.isArray(q) && q.length > 0;
      const alreadyAnswered = answeredDomainsThisStage.has(domainId);

      const shouldPromptQuiz = hasQuestions && !alreadyAnswered && !options?.skipQuiz;
      setShowTakeQuiz(shouldPromptQuiz);
      setShowQuestion(false);
    }
  };

  // Ensure AI Future stage never goes to domain/question UI
  useEffect(() => {
    if (currentStageId === "ai_future") {
      setSelectedDomain(null);
      setShowTakeQuiz(false);
      setShowQuestion(false);
    }
  }, [currentStageId]);

  return (
    <div className="viewport-frame">
      <div className="app-stage">
        <AnimatePresence mode="wait">
          {attractMode ? (
            <AttractScreen onInteraction={handleInteraction} />
          ) : showTransition ? (
            <TransitionScreen
              src="/videos/transition.mp4"
              onFinished={() => setShowTransition(false)}
            />
          ) : (
            <div className="relative app-grid">
              <Header pageTitle={pageTitle} />

              <Breadcrumbs
                currentStageId={currentStageId}
                setCurrentStageId={setCurrentStageId}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                showQuestion={showQuestion}
                setShowQuestion={setShowQuestion}
              />

              <div className="main-panel">
                {selectedDomain && currentStageId ? (
                  showTakeQuiz ? (
                    <TakeQuiz
                      currentStageId={currentStageId}
                      selectedDomain={selectedDomain}
                      onStart={() => {
                        setShowTakeQuiz(false);
                        setShowQuestion(true);
                      }}
                      onSkip={() => {
                        setAnsweredDomainsThisStage(prev => {
                          const next = new Set(prev);
                          next.add(selectedDomain);
                          return next;
                        });
                        setShowTakeQuiz(false);
                        setShowQuestion(false);
                      }}
                      onBack={() => {
                        setShowTakeQuiz(false);
                        setSelectedDomain(null);
                      }}
                    />
                  ) : showQuestion ? (
                    <QuestionScreen
                      currentStageId={currentStageId}
                      selectedDomain={selectedDomain}
                      onSelectDomain={(id) => handleDomainSelect(id)}
                      onBack={() => {
                        setShowQuestion(false);
                        setSelectedDomain(null);
                      }}
                      onNext={() => {
                        // Mark this domain as answered for the current stage and close question
                        setAnsweredDomainsThisStage(prev => {
                          const next = new Set(prev);
                          next.add(selectedDomain);
                          return next;
                        });
                        setShowQuestion(false);
                      }}
                    />
                  ) : (
                    <DomainScreen
                      stageId={currentStageId}
                      selectedDomain={selectedDomain}
                      onSelectDomain={id => {
                        const stageEntry = (blurbsData as Record<string, any>)[currentStageId];
                        const domainsObj = stageEntry?.domains || stageEntry?.domain || {};
                        const q = domainsObj?.[id]?.questions;
                        const hasQuestions = Array.isArray(q) && q.length > 0;
                        const alreadyAnswered = answeredDomainsThisStage?.has
                          ? answeredDomainsThisStage.has(id)
                          : false;

                        setSelectedDomain(id);
                        setShowQuestion(false);
                        setShowTakeQuiz(hasQuestions && !alreadyAnswered);
                      }}
                      onBack={() => setCurrentStageId(null)}
                      onExitToAttract={() => {
                        // Exit to attract screen and reset session UI
                        setShowTakeQuiz(false);
                        setShowQuestion(false);
                        setSelectedDomain(null);
                        setCurrentStageId(null);
                        setAttractMode(true);
                      }}
                    />
                  )
                ) : currentStageId === "ai_future" ? (
                  // NEW: AI Future video-only flow
                  <AiFutureScreen
                    src="/videos/living_conditions.mp4" // change this path to your AI video if needed
                    onBack={() => {
                      setSelectedDomain(null);
                      setShowTakeQuiz(false);
                      setShowQuestion(false);
                      setCurrentStageId(null);
                    }}
                  />
                ) : (
                  <StageScreen
                    currentStageId={currentStageId}
                    setCurrentStageId={setCurrentStageId}
                    selectedDomain={selectedDomain}
                    setSelectedDomain={handleDomainSelect}
                  />
                )}
              </div>

              <div>
                <hr className="max-w-full h-[2px] border-0 rounded-full bg-gradient-to-l from-blue-950 to-blue-50 via-blue-400" />
                <div className=" flex flex-row-reverse text-gray-500 text-left ">
                  <p className="text-sm text-gray-600 dark:text-neutral-500">
                    © 2025 LISER Living Conditions <strong>|</strong> Information Systems.
                  </p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
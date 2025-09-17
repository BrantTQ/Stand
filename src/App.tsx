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
import AiFutureScreen from "./pages/AiFutureScreen";
import { initAnalytics, trackEnterApp, trackStageVisit, trackDomainStart, trackDomainEnd, trackQuizSkipped, trackExitToAttract } from "./analytics";

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
    }, 360000); // 6 minutes
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
  } 
  else if(currentStageId==="ai_future"){
    pageTitle = "AI and the Future";
  } 
  else {
    pageTitle = "Life Journey with Data";
  }

  const domainEnterRef = useRef<number | null>(null);
  const lastDomainRef = useRef<string | null>(null);
  const lastStageRef = useRef<string | null>(null);

  // Init analytics once
  useEffect(() => {
    initAnalytics({
      endpoint: (import.meta as any).env?.VITE_ANALYTICS_ENDPOINT,
      appVersion: (import.meta as any).env?.VITE_APP_VERSION || "1.0.0",
    });
  }, []);

  const handleInteraction = () => {
    // entering app from attract
    trackEnterApp();
    setAttractMode(false);
    setShowTransition(true);
  };

  // Track stage visit when selected
  useEffect(() => {
    if (currentStageId) {
      trackStageVisit(currentStageId);
    }
  }, [currentStageId]);

  // Track domain duration: close previous, start new
  useEffect(() => {
    // Close previous domain, if any
    if (
      lastDomainRef.current &&
      lastStageRef.current &&
      domainEnterRef.current !== null &&
      (selectedDomain !== lastDomainRef.current || currentStageId !== lastStageRef.current)
    ) {
      const durationMs = Date.now() - domainEnterRef.current;
      trackDomainEnd(lastStageRef.current, lastDomainRef.current, durationMs);
      domainEnterRef.current = null;
      lastDomainRef.current = null;
      lastStageRef.current = null;
    }

    // Start new domain timer
    if (currentStageId && selectedDomain && !domainEnterRef.current) {
      domainEnterRef.current = Date.now();
      lastDomainRef.current = selectedDomain;
      lastStageRef.current = currentStageId;
      trackDomainStart(currentStageId, selectedDomain);
    }
  }, [currentStageId, selectedDomain]);

  // Ensure we end timing if user exits to attract via idle or button
  useEffect(() => {
    return () => {
      if (
        lastDomainRef.current &&
        lastStageRef.current &&
        domainEnterRef.current !== null
      ) {
        const durationMs = Date.now() - domainEnterRef.current;
        trackDomainEnd(lastStageRef.current, lastDomainRef.current, durationMs);
      }
    };
  }, []);

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
          {attractMode  ? (
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
                        // analytics
                        trackQuizSkipped(currentStageId, selectedDomain);
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
                    />
                  )
                ) : currentStageId === "ai_future" ? (
                  <AiFutureScreen
                    src="/videos/ai_future.mp4"
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
                    onExitToAttract={() => {
                        // analytics
                        trackExitToAttract("button");
                        // Exit to attract screen and reset session UI
                        setAttractMode(true);
                      }}
                  />
                )}
              </div>

              <div>
                <hr className="max-w-full h-[2px] border-0 rounded-full bg-gradient-to-l from-blue-950 to-blue-50 via-blue-400" />
                <div className=" flex flex-row-reverse text-gray-500 text-left ">
                  <p className="text-xs text-gray-600 dark:text-neutral-500">
                    © 2025 LISER Living Conditions <span className="font-medium">|</span> <span className="font-mono">IS</span>
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
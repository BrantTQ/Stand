import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import DomainScreen from "./pages/DomainScreen";
import AttractScreen from "./pages/AttractScreen";
import StageScreen from "./pages/StageScreen";
import QuestionScreen from "./pages/QuestionScreen";
import lifeStages from "./data/lifeStages.json";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import TransitionScreen from "./pages/TransitionScreen";

function App() {
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [attractMode, setAttractMode] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

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
    }, 45000);
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

  const handleDomainSelect = (domainId: string | null) => {
    setSelectedDomain(domainId);
    if (domainId) setShowQuestion(true);
  };

  const handleQuestionDone = () => setShowQuestion(false);

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
            <div className="app-grid">
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
                  showQuestion ? (
                    <QuestionScreen
                      currentStageId={currentStageId}
                      selectedDomain={selectedDomain}
                      onSelectDomain={id => handleDomainSelect(id)}
                      onBack={() => {
                        setShowQuestion(false);
                        setSelectedDomain(null);
                      }}
                      onNext={handleQuestionDone}
                    />
                  ) : (
                    <DomainScreen
                      stageId={currentStageId}
                      selectedDomain={selectedDomain}
                      onSelectDomain={id => {
                        setSelectedDomain(id);
                        setShowQuestion(false);
                      }}
                      onBack={() => setCurrentStageId(null)}
                    />
                  )
                ) : (
                  <StageScreen
                    currentStageId={currentStageId}
                    setCurrentStageId={setCurrentStageId}
                    selectedDomain={selectedDomain}
                    setSelectedDomain={handleDomainSelect}
                  />
                )}
              </div>

              <div className="footer-spacer" />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
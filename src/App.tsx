import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import DomainScreen from "./pages/DomainScreen";
import AttractScreen from "./pages/AttractScreen";
import StageScreen from "./pages/StageScreen";
import QuestionScreen from "./pages/QuestionScreen";
import lifeStages from "./data/lifeStages.json";
import Header from "./components/Header";
import domainsData from "./data/domains.json"; // keep if added earlier
import Breadcrumbs from "./components/Breadcrumbs"; // NEW

function App() {
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [attractMode, setAttractMode] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const idleTimerRef = useRef<number | null>(null);

  // Reset idle timer on any interaction
  const resetIdleTimer = () => {
  if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  idleTimerRef.current = window.setTimeout(() => {
      setAttractMode(true);
      setCurrentStageId(null);
      setSelectedDomain(null);
  }, 1745000); // 45 seconds
  };

  useEffect(() => {
    if (!attractMode) {
      const events = ["mousedown", "touchstart", "keydown"];
      events.forEach(event => window.addEventListener(event, resetIdleTimer));
      resetIdleTimer();
      return () => {
        events.forEach(event => window.removeEventListener(event, resetIdleTimer));
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
    }
  }, [attractMode]);

  let pageTitle = "";
  if (selectedDomain && currentStageId) {
    // Find the stage object for the current stageId
    const stageObj = lifeStages.find(s => s.id === currentStageId);
    pageTitle = stageObj ? stageObj.title : "Dimension Details";
  } else {
    pageTitle = "Life Journey with Data";
  }

  const domainLabel =
    selectedDomain
      ? (domainsData as Array<{ id: string; label: string }>).find(d => d.id === selectedDomain)?.label ?? selectedDomain
      : null;

  const handleInteraction = () => {
    setAttractMode(false);
  };

  // When a domain is selected, show the question screen
  const handleDomainSelect = (domainId: string | null) => {
    setSelectedDomain(domainId);
    if (domainId) {
      setShowQuestion(true);
    }
  };

  // When question is done, show domain screen
  const handleQuestionDone = () => {
    setShowQuestion(false);
  };

  return (
    <div className="items-center w-screen h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AnimatePresence>
        {attractMode ? (
          <AttractScreen onInteraction={handleInteraction} />
        ) : (
          <div className="grid grid-rows-[min-content_min-content_min-content_min-content] gap-4 p-8 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg transition-colors h-full">
            {/* Row 1: Header */}
            <Header pageTitle={pageTitle} />

            {/* Row 2: Breadcrumbs */}
            <Breadcrumbs
              currentStageId={currentStageId}
              setCurrentStageId={setCurrentStageId}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              showQuestion={showQuestion}
              setShowQuestion={setShowQuestion}
            />

            {/* Row 3: Domain Buttons or Question */}
            <div>
              {selectedDomain && currentStageId ? (
                showQuestion ? (
                  <QuestionScreen
                    currentStageId={currentStageId}                 // NEW
                    selectedDomain={selectedDomain}
                    onSelectDomain={(id) => handleDomainSelect(id)} // NEW
                    onBack={() => {
                      setShowQuestion(false);
                      setSelectedDomain(null); // Go to StageScreen
                    }}
                    onNext={handleQuestionDone}
                  />
                ) : (
                  <DomainScreen
                    stageId={currentStageId}
                    selectedDomain={selectedDomain}
                    onBack={() => setCurrentStageId(null)}
                  />
                )
              ) : (
                <div></div>
              )}
            </div>

            {/* Row 4: StageScreen or other content */}
            <div>
              {(!selectedDomain || !currentStageId) && (
                <StageScreen
                  currentStageId={currentStageId}
                  setCurrentStageId={setCurrentStageId}
                  selectedDomain={selectedDomain}
                  setSelectedDomain={handleDomainSelect}
                />
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StageNav from "./components/StageNav";
import DomainButtons from "./components/DomainButtons";
import StageScreen from "./pages/StageScreen";
import GraphPanel from "./components/GraphPanel";
import AttractScreen from "./pages/AttractScreen";
import "./App.css";

function App() {
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [attractMode, setAttractMode] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const idleTimerRef = useRef<number | null>(null);

  // Reset idle timer on any interaction
  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setAttractMode(true);
      setCurrentStageId(null);
      setSelectedDomain(null);
    }, 45000); // 45 seconds
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

  const handleInteraction = () => {
    setAttractMode(false);
  };

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
  };

  return (
    <div className="App">
      <AnimatePresence>
        {attractMode ? (
          <motion.div
            key="attract"
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
          >
            <AttractScreen onInteraction={handleInteraction} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <StageNav setCurrentStage={setCurrentStageId} currentStageId={currentStageId} />
            {currentStageId ? (
              <>
                <DomainButtons selectedDomain={selectedDomain} onSelect={handleDomainSelect} />
                <StageScreen
                  stageId={currentStageId}
                  selectedDomain={selectedDomain}
                  onBack={() => setCurrentStageId(null)}
                />
                <GraphPanel selectedDomain={selectedDomain} stageId={currentStageId} />
              </>
            ) : (
              <div className="text-center p-8">Please select a life stage</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

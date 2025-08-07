import React, { useState, useRef, useEffect, use } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DomainScreen from "./pages/DomainScreen";
import AttractScreen from "./pages/AttractScreen";
import StageScreen from "./pages/StageScreen";
import lifeStages from "./data/lifeStages.json";
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
    pageTitle = stageObj ? stageObj.title : "Domain Details";
  } else {
    pageTitle = "Life Journey with Data";
  }

  const handleInteraction = () => {
    setAttractMode(false);
  };
  
  return (
  <div className="App">
    <AnimatePresence>
      {attractMode ? (
        <AttractScreen onInteraction={handleInteraction} />
      ) : (
        <div className="flex flex-col justify-between items-stretch h-full">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-white drop-shadow">
          {pageTitle}
        </h1>
        <img src="/liser_logo.png" alt="Logo" className="h-12 w-12 object-contain" />
      </div>
          {selectedDomain && currentStageId ? (
        // DomainScreen with GraphPanel
          <DomainScreen
            stageId={currentStageId}
            selectedDomain={selectedDomain}
            onBack={() => setCurrentStageId(null)}
          />
        
      ) : (
        <StageScreen
          currentStageId={currentStageId}
          setCurrentStageId={setCurrentStageId}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
        />
      )}
        </div>
      )}
      
    </AnimatePresence>
  </div>
  );
}

export default App;

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StageNav from "./components/StageNav";
import DomainButtons from "./components/DomainButtons";
import DomainScreen from "./pages/DomainScreen";
import GraphPanel from "./components/GraphPanel";
import AttractScreen from "./pages/AttractScreen";
import "./App.css";
import lifeStages from "./data/lifeStages.json";

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
    }, 1045000); // 17 minutes and 25 seconds
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

useEffect(() => {
    setSelectedDomain(null);
  }, [currentStageId]);

  const handleInteraction = () => {
    setAttractMode(false);
  };
  
  // Handle domain selection
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
        ) : selectedDomain && currentStageId ? (
          // Show DomainScreen as a full overlay when a domain is selected
           
            <motion.div
            key="domain-screen"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <>
            <DomainScreen
              stageId={currentStageId}
              selectedDomain={selectedDomain}
              onBack={() => setCurrentStageId(null)}
            />
            <GraphPanel selectedDomain={selectedDomain} stageId={currentStageId} />
            </>
            
          </motion.div>
        ) : (
          // Main navigation and domain buttons
          <div className="flex flex-col justify-between items-stretch h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-600">
            {/* 1st row: Title left, Logo right */}
            <div className="flex justify-between items-center px-8 pt-8 pb-4">
              <h1 className="text-3xl font-bold text-white drop-shadow">
                <motion.div
                  key="heading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >Life Jorney with Data</motion.div></h1>
              {/* Replace with your logo image or component */}
              <img src="/logo192.png" alt="Logo" className="h-12 w-12 object-contain" />
            </div>
            {/* 2nd row: Domain Buttons */}
            <div className="flex-1 flex flex-col justify-center items-center">
              {currentStageId ? (
                <motion.div
                  key="domain-buttons"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center p-8 text-white text-xl font-semibold">Please select a domain</div>
                  <DomainButtons
                    selectedStageId={currentStageId}
                    selectedDomain={selectedDomain}
                    onSelect={handleDomainSelect}
                  />
                </motion.div>
              ) : (
                <div className="text-center p-8 text-white text-xl font-semibold">Please select a life stage</div>
              )}
            </div>
            {/* 3rd row: Stage Buttons */}
            <div className="pb-8">
              <motion.div
                  key="heading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  
              <StageNav setCurrentStage={setCurrentStageId} currentStageId={currentStageId} />
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

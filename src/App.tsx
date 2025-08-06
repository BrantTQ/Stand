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

  // Reset selected domain when stage changes
//    useEffect(() => {
//   if (currentStageId) {
//     // Find the stage and select its first domain
//     const stage = lifeStages.find((s: any) => s.id === currentStageId);
//     if (stage && stage.domains && stage.domains.length > 0) {
//       setSelectedDomain(stage.domains[0]);
//     } else {
//       setSelectedDomain(null);
//     }
//   } else {
//     setSelectedDomain(null);
//   }
// }, [currentStageId]);
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
          <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer">

        <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <StageNav setCurrentStage={setCurrentStageId} currentStageId={currentStageId} />
            {currentStageId ? (
              <motion.div
                key="domain-buttons"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.5 }}
              >
                <DomainButtons
                  selectedStageId={currentStageId}
                  selectedDomain={selectedDomain}
                  onSelect={handleDomainSelect}
                />
                <div className="text-center p-8">Please select a domain</div>
              </motion.div>
            ) : (
              <div className="text-center p-8">Please select a life stage</div>
            )}
          </motion.div>
          </div>
          
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

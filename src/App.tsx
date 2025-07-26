import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageNav from './components/StageNav';
import StageScreen from './pages/StageScreen';
import AttractScreen from './pages/AttractScreen';
import GraphPanel from './components/GraphPanel';
import './App.css';

function App() {
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [attractMode, setAttractMode] = useState(true);

  const handleInteraction = () => {
    setAttractMode(false);
  };

  return (
    <div className="App">
      <AnimatePresence>
        {attractMode && (
          <motion.div
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
          >
            <AttractScreen onInteraction={handleInteraction} />
          </motion.div>
        )}
      </AnimatePresence>

      {!attractMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StageNav setCurrentStage={setCurrentStageId} />
          {currentStageId ? (
            <>
              <StageScreen stageId={currentStageId} />
              <GraphPanel />
            </>
          ) : (
            <div className="text-center p-8">Please select a life stage</div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;

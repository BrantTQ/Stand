import React, { useState, useEffect } from "react";
import StageNav from "../components/StageNav";
import DomainButtons from "../components/DomainButtons";
import { motion, AnimatePresence } from "framer-motion";
import blurbsData from "../data/blurbs.json"; // NEW: read questions info

interface StageScreenProps {
  currentStageId: string | null;
  setCurrentStageId: (id: string | null) => void;
  selectedDomain: string | null;
  onExitToAttract?: () => void;
  // UPDATED: allow passing options to control whether to skip quiz flow
  setSelectedDomain: (domainId: string | null, options?: { skipQuiz?: boolean }) => void;
}
const stageEnter = {
  initial: { scale: 1, zIndex: 1 },
  animate: { scale: 1.06, zIndex: 10 },
  exit: { scale: 0.95, opacity: 0 }
};
const StageScreen: React.FC<StageScreenProps> = ({
  currentStageId,
  setCurrentStageId,
  selectedDomain,
  setSelectedDomain,
  onExitToAttract,
}) => {
  useEffect(() => {
    // Clear any previously selected domain when stage changes
    setSelectedDomain(null);
  }, [currentStageId, setSelectedDomain]);

  const isAiFuture = currentStageId === "ai_future"; // NEW
  const showDomainModal = Boolean(currentStageId) && !selectedDomain && !isAiFuture; // UPDATED
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // Decide if a picked domain has questions in the current stage
  const handleSelectDomain = (domainId: string) => {
    if (!currentStageId) {
      setSelectedDomain(domainId);
      return;
    }
    const stageEntry = (blurbsData as Record<string, any>)[currentStageId];
    const domainsObj = stageEntry?.domains || stageEntry?.domain || {};
    const q = domainsObj?.[domainId]?.questions;
    const hasQuestions = Array.isArray(q) && q.length > 0;

    setSelectedDomain(domainId, { skipQuiz: !hasQuestions });
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
      <motion.div className="h-full flex flex-col ">
        {/* Prompt (no longer consumes all vertical space) */}
        <div className="grid grid-cols-[4rem_auto_4rem] justify-stretch items-center px-10">
           <div/>
          <div className="justify-center text-base-content/70 text-center md:text-base mb-3 md:mb-4">
            <p className="text-lg">Select a life stage below to continue</p>
          </div>
         
          <div>
            <motion.button
                          key="stage-exit"
                          
                          variants={stageEnter}
                          initial="initial"
                          // animate={active ? "animate" : "initial"}
                          animate="animate"
                          exit="exit"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="btn btn-sm px-3 py-1.5 rounded-full btn-error text-white text-sm font-medium focus:outline-none focus:ring-2 flex items-center gap-2"
                  onClick={() => setShowExitConfirm(true)}
                  aria-label="Exit to attract screen"
                  disabled={!onExitToAttract}
                >
                  ✕
                  <span>Exit</span>
                </motion.button>
          </div>
          </div>
        

        {/* Domain modal remains unchanged */}
        <dialog
          className="modal bg-black/40 backdrop-blur-xs"
          open={showDomainModal}
          aria-modal="true"
          aria-label="Select a domain"
        >
          <div className="modal-box max-w-2xl p-0 bg-base-100 text-base-content shadow-2xl rounded-2xl border border-base-300/50">
            <div className="flex items-start justify-between border-b-2 border-base-200 px-6 py-2 rounded-t-2xl">
              <div>
                <h3 className="font-semibold text-xl leading-tight">
                  Choose a dimension
                </h3>
                <p className="text-sm text-base-content/70">
                  Pick an area you’d like to explore
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-label="Change stage"
                onClick={() => setCurrentStageId(null)}
              >
                ✕
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4">
              {currentStageId ? (
                <DomainButtons
                  selectedStageId={currentStageId}
                  selectedDomain={selectedDomain}
                  onSelect={handleSelectDomain} // UPDATED: use our handler
                  size="md"
                  orientation="row"
                />
              ) : null}
            </div>

            <div className="modal-action border-t border-base-200 px-6 py-3 rounded-b-2xl">
              <button
                type="button"
                className="btn rounded-full border border-transparent bg-gray-200 text-gray-700"
                onClick={() => setCurrentStageId(null)}
              >
                Change stage
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop bg-transparent"
            aria-label="Close"
            onClick={() => setCurrentStageId(null)}
          />
        </dialog>

        {/* Stage navigation now takes remaining vertical space and fits */}
        <div className="flex-1 min-h-0">
          <StageNav
            setCurrentStage={(id) => setCurrentStageId(id)}
            currentStageId={currentStageId}
            compact
            /* forcedRows={3} // uncomment if you want to lock to 3 rows */
          />
        </div>
      </motion.div>
      </AnimatePresence>
      

      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowExitConfirm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-base-100 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } }}
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.18 } }}
            >
              <div className="px-5 pt-4 pb-3 border-b border-base-300">
                <h3 id="exit-confirm-title" className="font-semibold text-xl">
                  Exit to attract screen?
                </h3>
                <p className="mt-1 text-md text-base-content/70">
                  You’ll leave the current view and return to the attract screen.
                </p>
              </div>
              <div className="px-5 py-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setShowExitConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-error text-white"
                  onClick={() => {
                    setShowExitConfirm(false);
                    onExitToAttract?.();
                  }}
                >
                  Yes, exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
   
  );
};

export default StageScreen;

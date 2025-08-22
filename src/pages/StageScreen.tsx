import React, { useEffect } from "react";
import StageNav from "../components/StageNav";
import DomainButtons from "../components/DomainButtons";
import { AnimatePresence } from "framer-motion";

interface StageScreenProps {
  currentStageId: string | null;
  setCurrentStageId: (id: string | null) => void;
  selectedDomain: string | null;
  setSelectedDomain: (domainId: string | null) => void;
}

const StageScreen: React.FC<StageScreenProps> = ({
  currentStageId,
  setCurrentStageId,
  selectedDomain,
  setSelectedDomain,
}) => {
  useEffect(() => {
    setSelectedDomain(null);
  }, [currentStageId, setSelectedDomain]);

  const showDomainModal = Boolean(currentStageId) && !selectedDomain;

  return (
    <AnimatePresence mode="wait">
      <div className="h-full flex flex-col min-h-0">
        {/* Prompt (no longer consumes all vertical space) */}
        { 
          <div className="text-base-content/70 text-center text-sm md:text-base mb-3 md:mb-4">
            Select a life stage below to continue
          </div>
        }

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
                  onSelect={(id) => setSelectedDomain(id)}
                  size="sm"
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
      </div>
      {/* <div className="flex flex-col mt-4 justify-center sm:flex-row gap-3">
        <div className="py-2.5 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg ">
                <img
                    src="/information_systems.png"
                    alt="Powered By LISER Information Systems"
                    className="h-18 w-auto object-contain"
                  />
          </div>

      <div className="border-t sm:border-t-0 sm:border-s border-gray-200 dark:border-neutral-700"></div>

      <div className="py-2.5 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg">
              <img
                src="/information_systems.png"
                alt="Powered By LISER Information Systems"
                className="h-18 w-auto object-contain"
              />
      </div>

</div> */}
      
    </AnimatePresence>
  );
};

export default StageScreen;

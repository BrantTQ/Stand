import React, { useEffect } from "react";
import StageNav from "../components/StageNav";
import DomainButtons from "../components/DomainButtons";

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
    // Clear selectedDomain when stage changes
    setSelectedDomain(null);
  }, [currentStageId, setSelectedDomain]);

  const showDomainModal = Boolean(currentStageId) && !selectedDomain;

  return (
    <div className="h-full flex flex-col">
      {/* Center area: prompt when no stage selected */}
      <div className="flex-1 flex items-center justify-center">
        {!currentStageId && (
          <div className="text-base-content/70 text-lg sm:text-xl">
            Select a life stage below to continue
          </div>
        )}
      </div>

      {/* DaisyUI Modal for Domain Buttons */}
      <dialog
        className="modal"
        open={showDomainModal}
        aria-modal="true"
        aria-label="Select a domain"
      >
        <div className="modal-box max-w-2xl p-0 bg-base-100 text-base-content shadow-2xl rounded-2xl border border-base-300/50">
          <div className="flex items-start justify-between border-b border-base-200 px-6 py-4 rounded-t-2xl">
            <div>
              <h3 className="font-semibold text-xl leading-tight">Choose a domain</h3>
              <p className="text-sm text-base-content/70">Pick an area you’d like to explore</p>
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
              />
            ) : null}
          </div>

          <div className="modal-action border-t border-base-200 px-6 py-3 rounded-b-2xl">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setCurrentStageId(null)}
            >
              Change stage
            </button>
          </div>
        </div>

        {/* Click outside to close (also clears stage selection) */}
        <button
          type="button"
          className="modal-backdrop bg-transparent"
          aria-label="Close"
          onClick={() => setCurrentStageId(null)}
        />
      </dialog>

      {/* Stage navigation stays available */}
      <StageNav setCurrentStage={setCurrentStageId} currentStageId={currentStageId} />
    </div>
  );
};

export default StageScreen;

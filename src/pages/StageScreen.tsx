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

  // Remove local handleDomainSelect, use setSelectedDomain directly
  return (
    <>
      {/* 1st row: Title left, Logo right */}

      {/* 2nd row: Domain Buttons */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {currentStageId ? (
          <DomainButtons
            selectedStageId={currentStageId}
            selectedDomain={selectedDomain}
            onSelect={setSelectedDomain} // Use parent handler
          />
        ) : (
          <div className="text-center p-8 text-white text-xl font-semibold">
            Please select a life stage
          </div>
        )}
      </div>

      {/* 3rd row: Stage Buttons */}
      <StageNav setCurrentStage={setCurrentStageId} currentStageId={currentStageId} />
    </>
  );
};

export default StageScreen;

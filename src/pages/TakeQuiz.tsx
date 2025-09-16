import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { swapCard } from "../assets/animations/variants";

interface TakeQuizProps {
  currentStageId: string;
  selectedDomain: string;
  onStart: () => void;   // proceed to QuestionScreen
  onSkip: () => void;    // go to DomainScreen
  onBack: () => void;    // back to stage selection
}

const TakeQuiz: React.FC<TakeQuizProps> = ({
  currentStageId,
  selectedDomain,
  onStart,
  onSkip,
}) => {

  return (
    <AnimatePresence mode="wait">
      <div className="h-full w-full flex items-center justify-center bg-base-200">
        <motion.div
          key={`${currentStageId}-${selectedDomain}-takequiz`}
          variants={swapCard}
          initial="hidden"
          animate="enter"
          exit="exit"
          layout
          className="card w-1/2 max-w-3xl bg-base-100 shadow-2xl"
        >
          <div className="card-body">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="card-title text-3xl">Take a short quiz?</h2>
                <p className="text-base-content/70 text-xl text-left">
                  Answer one quick question to test your knowledge, or skip to explore insights.
                </p>
              </div>
            </div>

            <div className="border-t border-base-200 pt-3 mt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1" />
              <button type="button" className="btn rounded-full bg-[#2a2986] text-[#fff]" onClick={onStart}>
                Start now
              </button>
              <button type="button" className="btn rounded-full border border-transparent bg-gray-200 text-gray-700" onClick={onSkip}>
                Skip
              </button>
              
              
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TakeQuiz;

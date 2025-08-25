import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import lifeStages from "../data/lifeStages.json";
import domainsData from "../data/domains.json";
import { swapCard } from "../assets/animations/variants";

type Domain = {
  id: string;
  label: string;
  color?: string;
  icon?: string;
};

type Stage = {
  id: string;
  title: string;
};

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
  onBack,
}) => {
  const stage = (lifeStages as Stage[]).find(s => s.id === currentStageId);
  const domain = (domainsData as Domain[]).find(d => d.id === selectedDomain);

  const accentStyle: React.CSSProperties | undefined = domain?.color
    ? { borderColor: domain.color, color: domain.color }
    : undefined;

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
          className="card w-full max-w-3xl bg-base-100 shadow-2xl"
        >
          <div className="card-body">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="card-title text-2xl">Take a short quiz?</h2>
                <p className="text-base-content/70 text-left">
                  You selected <span className="font-semibold">{domain?.label ?? "this dimension"}</span>
                  {stage ? (
                    <> in the <span className="font-semibold">{stage.title}</span> stage.</>
                  ) : (
                    "."
                  )}
                  {" "}Answer one quick question to test your knowledge, or skip to explore insights.
                </p>
              </div>
              <div className="hidden sm:block">
                <span className="badge badge-outline badge-lg" style={accentStyle} title={domain?.label}>
                  {domain?.label ?? "Dimension"}
                </span>
              </div>
            </div>

            <div className="border-t border-base-200 pt-3 mt-4 flex flex-col sm:flex-row gap-3">
                <button type="button" className="btn btn-ghost" onClick={onBack}>
                ← Back
              </button>
              <div className="flex-1" />
              <button type="button" className="btn rounded-full btn-primary" onClick={onStart}>
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

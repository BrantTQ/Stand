import React from "react";
import { motion } from "framer-motion";
import lifeStages from "../data/lifeStages.json";

const stageEnter = {
  initial: { scale: 1, zIndex: 1 },
  animate: { scale: 1.12, zIndex: 10 },
  exit: { scale: 0.95, opacity: 0 }
};

interface StageNavProps {
  setCurrentStage: (id: string) => void;
  currentStageId: string | null;
}

export const StageNav: React.FC<StageNavProps> = ({ setCurrentStage, currentStageId }) => (
  <div className="mt-10">
    <motion.div
      key="heading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center gap-6 sm:gap-8 flex-wrap"
    >
      {lifeStages.map(stage => (
        <div key={stage.id}>
          <motion.button
            style={{
              background: currentStageId === stage.id ? stage.color : "#fff",
              borderColor: stage.color,
              color: currentStageId === stage.id ? "#fff" : stage.color,
            }}
            variants={stageEnter}
            initial="initial"
            animate={currentStageId === stage.id ? "animate" : "initial"}
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setCurrentStage(stage.id)}
            className="rounded-2xl border-4 h-40 w-40 md:h-48 md:w-48 flex items-center justify-center text-center
                       font-semibold shadow-sm hover:shadow-lg transition
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95"
          >
            {stage.title}
          </motion.button>
        </div>
      ))}
    </motion.div>
  </div>
);

export default StageNav;

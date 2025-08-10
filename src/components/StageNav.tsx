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
      key="grid"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl"
    >
      {lifeStages.map(stage => (
        <motion.button
          key={stage.id}
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
          className="rounded-2xl border-4 h-40 w-full md:h-48 flex items-center justify-center text-center
                     text-lg md:text-xl font-semibold shadow-sm hover:shadow-lg transition
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95"
        >
          {stage.title}
        </motion.button>
      ))}
    </motion.div>
  </div>
);

export default StageNav;

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
  <div className="flex gap-4 justify-center py-8">
    {lifeStages.map(stage => (
      <motion.button
        key={stage.id}
        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition border-2`}
        style={{
          background: currentStageId === stage.id ? stage.color : "#fff",
          borderColor: stage.color,
          color: currentStageId === stage.id ? "#fff" : stage.color
        }}
        variants={stageEnter}
        initial="initial"
        animate={currentStageId === stage.id ? "animate" : "initial"}
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setCurrentStage(stage.id)}
      >
        <span className="mr-2">{stage.icon}</span>
        {stage.title}
      </motion.button>
    ))}
  </div>
);

export default StageNav;

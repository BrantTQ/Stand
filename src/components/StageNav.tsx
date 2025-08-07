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
  <div className="pb-8 h-12">
    <motion.div
      key="heading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
    >
  <div className="flex gap-4 justify-center py-8" style={{gap: "20px"}}>
    {lifeStages.map(stage => (
      <motion.button
        key={stage.id}
        style={{
          background: currentStageId === stage.id ? stage.color : "#fff",
          borderColor: stage.color,
          color: currentStageId === stage.id ? "#fff" : stage.color,
          height: "240px",
          width: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", 
          textAlign: "center"       
        }}
        variants={stageEnter}
        initial="initial"
        animate={currentStageId === stage.id ? "animate" : "initial"}
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setCurrentStage(stage.id)}
        className={`rounded-2xl`}
      >
        {/* <span className="mr-2">{stage.icon}</span> */}
        {stage.title}
      </motion.button>
    ))}
  </div>
  </motion.div>
  </div>
);

export default StageNav;

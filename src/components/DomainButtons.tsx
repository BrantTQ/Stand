import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import domains from "../data/domains.json";
import lifeStages from "../data/lifeStages.json";

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

import type { Variants } from "framer-motion";

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -40, scale: 0.8, transition: { duration: 0.2 } }
};

interface DomainButtonsProps {
  selectedDomain: string | null;
  onSelect: (domainId: string) => void;
  selectedStageId: string | null;
}

const DomainButtons: React.FC<DomainButtonsProps> = ({ selectedDomain, onSelect, selectedStageId }) => {
  const initialDomains = lifeStages.find(s => s.id === selectedStageId)?.domains || [];

  const domainsToShow = selectedStageId
    ? domains.filter(domain => initialDomains.includes(domain.id))
    : domains;

  // Fallback if no domains match
  const finalDomainsToShow = domainsToShow.length > 0 ? domainsToShow : domains;

  return (
    <motion.div
                      key="domain-buttons"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.5 }}
                    >
        <div className="text-center p-8 text-white text-xl font-semibold">Please select a domain</div>
    <motion.div
      className="flex justify-center my-4"
      style={{ gap: "20px" }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <AnimatePresence initial={false}>
        {finalDomainsToShow.map(domain => (
          <motion.button
            key={domain.id}
            variants={buttonVariants}
            aria-label={`Select domain: ${domain.label}`}
            className={`rounded-full font-semibold flex flex-col items-center justify-center gap-2 transition border-4 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            style={{
              background: selectedDomain === domain.id ? domain.color : "#fff",
              borderColor: domain.color,
              color: selectedDomain === domain.id ? "#fff" : domain.color,
              height: "100px",
              width: "100px",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
            onClick={() => onSelect(domain.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: selectedDomain === domain.id ? 1.1 : 1,
              boxShadow: selectedDomain === domain.id ? `0 0 0 4px ${domain.color}44` : "none"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            exit="exit"
            layout
          >
            {/* <span aria-hidden="true" className="text-2xl">{domain.icon}</span> */}
            <span className="text-center text-sm">{domain.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
    </motion.div>
  )
};

export default DomainButtons;
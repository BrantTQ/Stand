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

  const finalDomainsToShow = domainsToShow.length > 0 ? domainsToShow : domains;

  return (
    <motion.div
      key="domain-buttons"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      {/* Removed inner title to avoid duplication with modal header */}
      <motion.div
        className="flex justify-center flex-wrap gap-4 sm:gap-5"
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
              className="rounded-full font-semibold flex flex-col items-center justify-center text-center transition
                         border-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         hover:shadow-lg active:scale-95 h-24 w-24 sm:h-28 sm:w-28"
              style={{
                background: selectedDomain === domain.id ? domain.color : "#fff",
                borderColor: domain.color,
                color: selectedDomain === domain.id ? "#fff" : domain.color
              }}
              onClick={() => onSelect(domain.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: selectedDomain === domain.id ? 1.08 : 1,
                boxShadow: selectedDomain === domain.id ? `0 0 0 4px ${domain.color}44` : "none"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              exit="exit"
              layout
            >
              <span className="text-center text-xs sm:text-sm leading-tight px-2">{domain.label}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
};

export default DomainButtons;
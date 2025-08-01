import React from "react";
import { motion } from "framer-motion";

const DOMAINS = [
  { id: "poverty", label: "Poverty", color: "#e53e3e", icon: "💸" },
  { id: "family", label: "Family", color: "#38a169", icon: "👨‍👩‍👧‍👦" },
  { id: "education", label: "Education", color: "#3182ce", icon: "🎓" },
  { id: "wellbeing", label: "Well-being", color: "#d69e2e", icon: "😊" },
];

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface DomainButtonsProps {
  selectedDomain: string | null;
  onSelect: (domainId: string) => void;
}

const DomainButtons: React.FC<DomainButtonsProps> = ({ selectedDomain, onSelect }) => (
  <motion.div
    className="flex gap-4 justify-center my-4"
    variants={containerVariants}
    initial="hidden"
    animate="show"
  >
    {DOMAINS.map(domain => (
      <motion.button
        key={domain.id}
        variants={buttonVariants}
        aria-label={`Select domain: ${domain.label}`}
        className={`px-4 py-2 rounded font-semibold flex items-center gap-2 transition border-2 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        style={{
          background: selectedDomain === domain.id ? domain.color : "#fff",
          borderColor: domain.color,
          color: selectedDomain === domain.id ? "#fff" : domain.color
        }}
        onClick={() => onSelect(domain.id)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: selectedDomain === domain.id ? 1.1 : 1,
          boxShadow: selectedDomain === domain.id ? `0 0 0 4px ${domain.color}44` : "none"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span aria-hidden="true">{domain.icon}</span>
        {domain.label}
      </motion.button>
    ))}
  </motion.div>
);

export default DomainButtons;
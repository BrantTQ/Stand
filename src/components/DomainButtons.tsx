import React, { act } from "react";
import { motion, AnimatePresence } from "framer-motion";
import domains from "../data/domains.json";
import lifeStages from "../data/lifeStages.json";
import { buttonVariants } from "../assets/animations/variants";

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

interface DomainButtonsProps {
  selectedDomain: string | null;
  onSelect: (domainId: string) => void;
  selectedStageId: string | null;
  /** Size of circular buttons */
  size?: "sm" | "md" | "xs";
  /** Layout orientation (row keeps items on a single horizontal line until wrap if needed) */
  orientation?: "row" | "wrap";
  /** Optional className for outer wrapper */
  className?: string;
}

const sizeClassMap = {
  md: "h-28 w-28 text-xs sm:text-sm rounded-full border-3",
  sm: "h-20 w-20 text-[10px] sm:text-sm rounded-full",
  xs: "h-8 w-24 text-[12px] rounded-2xl border-2 text-gray-700"
};

const iconSizeMap = {
  md: "w-10 h-10 ",
  sm: "w-6 h-6",
  xs: "w-4 h-4 invisible"
};

const DomainButtons: React.FC<DomainButtonsProps> = ({
  selectedDomain,
  onSelect,
  selectedStageId,
  size = "md",
  orientation = "wrap",
  className = ""
}) => {
  const stage = lifeStages.find(s => s.id === selectedStageId);
  const allowed = stage?.domains || [];
  const stageColor = stage?.color || "#2a2a86";

  // Filter domains to only those allowed in the current stage, if any

  const domainsToShow = selectedStageId
    ? domains.filter(d => allowed.includes(d.id))
    : domains;

  const finalDomainsToShow = domainsToShow.length > 0 ? domainsToShow : domains;

  const sizeClasses = sizeClassMap[size];
  const iconClasses = iconSizeMap[size];

  const layoutClasses =
    orientation === "row"
      ? "flex flex-row justify-center flex-nowrap gap-4 md:gap-6 overflow-x-auto scrollbar-hide"
      : "flex justify-center flex-wrap gap-4 sm:gap-5";

  return (
    <motion.div
      key="domain-buttons"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      <motion.div
        className={layoutClasses + " py-1"}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <AnimatePresence initial={false}>
          {finalDomainsToShow.map(domain => {
            const isActive = selectedDomain === domain.id;
            return (
              <motion.button
                key={domain.id}
                variants={buttonVariants}
                aria-label={`Select domain: ${domain.label}`}
                className={`font-semibold flex flex-col items-center justify-center text-center transition
                            focus-visible:outline-none focus-visible:ring-offset-2
                            shadow-sm  ${sizeClasses}`}
                style={{
                  background: isActive ? stageColor : "#fff",
                  borderColor: stageColor,
                  color: isActive ? "#fff" : "#364153"
                }}
                onClick={() => onSelect(domain.id)}
                // whileHover={{ scale: 1.08 }}
                // whileTap={{ scale: 0.94 }}
                // animate={{
                //   scale: isActive ? 1 : 1,
                //   boxShadow: isActive ? `0 0 0 4px ${domain.color}44` : "none"
                // }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                exit="exit"
                layout
              >
                <div className="flex flex-col items-center justify-center">
                  {domain.icon && size !== "xs" ? (
                    <img
                      src={domain.icon || ""}
                      alt=""
                      className={`${iconClasses} mb-1 object-cover pointer-events-none select-none`}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="leading-tight px-1">{domain.label}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DomainButtons;
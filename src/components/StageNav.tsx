import React, { useMemo, useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import lifeStages from "../data/lifeStages.json";

const stageEnter = {
  initial: { scale: 1, zIndex: 1 },
  animate: { scale: 1.06, zIndex: 10 },
  exit: { scale: 0.95, opacity: 0 }
};

interface StageNavProps {
  setCurrentStage: (id: string) => void;
  currentStageId: string | null;
  /** Compact mode shrinks buttons to fit full set inside viewport */
  compact?: boolean;
  /** Optionally force number of grid rows (else auto = ceil(n/2)) */
  forcedRows?: number;
  /** Gap in px used for height calc (keep in sync with Tailwind gap) */
  rowGapPx?: number;
}

export const StageNav: React.FC<StageNavProps> = ({
  setCurrentStage,
  compact = true,
  forcedRows,
  rowGapPx = 32 // matches gap-8 (2rem=32px) on md; we’ll reduce in compact mode anyway
}) => {
  const total = lifeStages.length;
  const rows = forcedRows ?? Math.ceil(total / 2);

  // Container ref to derive usable height (fallback to window if unset)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowHeight, setRowHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const compute = () => {
      let available = window.innerHeight;
      if (containerRef.current) {
        // Use nearest scroll container height (parent) if helpful; here we just rely on viewport
        // Could subtract header/breadcrumb heights if passed in; currently we choose a fixed allowance.
      }
      // Allowance for header + breadcrumbs + padding inside your 1280x800 frame
      const headerAllowance = 150; // adjust if header area changes
      const usable = Math.max(400, available - headerAllowance);
      const totalGap = (rows - 1) * (compact ? 20 : rowGapPx);
      const rawPerRow = (usable - totalGap) / rows;
      setRowHeight(rawPerRow);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [rows, compact, rowGapPx]);

  const gapClass = compact ? "gap-5 md:gap-6" : "gap-6 sm:gap-8";
  const baseButtonHeight = useMemo(() => {
    if (!rowHeight) return compact ? "h-40" : "h-48"; // fallback
    // Clamp to a reasonable min/max
    const clamped = Math.min(Math.max(rowHeight, 120), compact ? 180 : 220);
    return `h-[${Math.round(clamped)}px]`;
  }, [rowHeight, compact]);

  const textSize = compact ? "text-base md:text-2xl" : "text-lg md:text-xl";
  const iconSize = compact ? "w-14 h-14 md:w-26 md:h-26" : "w-16 h-16 md:w-20 md:h-20";
  const rounding = compact ? "rounded-xl" : "rounded-2xl";

  return (
    <div ref={containerRef} className="h-full w-full">
      <motion.div
        key="stage-grid"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.35 }}
        className={`h-full mx-auto grid grid-cols-1 sm:grid-cols-2 ${gapClass} max-w-3xl pb-4`}
      >
        {lifeStages.map((stage, idx) => {
          const isLastOdd = total % 2 === 1 && idx === total - 1;
          // const active = currentStageId === stage.id;
          return (
            <motion.button
              key={stage.id}
              style={{
                background: stage.color,
                borderColor: stage.color,
                color: "#fff",
              }}
              variants={stageEnter}
              initial="initial"
              // animate={active ? "animate" : "initial"}
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => setCurrentStage(stage.id)}
              className={`${rounding} border-4 w-full ${baseButtonHeight} flex items-center justify-center text-center
                          ${textSize} font-semibold shadow-lg transition
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95
                          ${isLastOdd ? " sm:col-span-2 sm:justify-self-center sm:w-[calc(50%-0.75rem)]" : ""}`}
            >
              <div className="flex flex-col items-center justify-center">
                {stage.icon ? (
                  <img
                    src={stage.icon || ""}
                    alt=""
                    className={`${iconSize} mb-2  object-contain pointer-events-none select-none`}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="leading-snugs">{stage.title}</span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default StageNav;

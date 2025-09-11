import type { Variants } from "framer-motion";

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  enter:  { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.45, ease: [0.4,0.15,0.2,1] } },
  exit:   { opacity: 0, y: -24, filter: "blur(4px)", transition: { duration: 0.35, ease: [0.4,0.15,0.2,1] } }
};

export const fadeSwap: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  enter:  { opacity: 1, scale: 1, transition: { duration: 0.35 } },
  exit:   { opacity: 0, scale: 1.02, transition: { duration: 0.25 } },
};

export const buttonVariants: Variants = {
  initial: { y: 0, scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover:   { y: -2, scale: 1.03, boxShadow: "0 6px 18px -8px rgba(0,0,0,0.25)", transition: { type: "spring", stiffness: 280, damping: 18 } },
  tap:     { y: 0, scale: 0.97, boxShadow: "0 2px 8px -4px rgba(0,0,0,0.3)", transition: { duration: 0.12 } },
  focus:   { outline: "2px solid #6366f1" }
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  enter:  { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const childFade: Variants = {
  hidden: { opacity: 0, y: 10 },
  enter:  { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const instant: Variants = {
  hidden: { opacity: 0 },
  enter:  { opacity: 1 },
  exit:   { opacity: 0 },
};

export const pageFade: Variants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
  enter:  { opacity: 1, scale: 1,    filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25,0.6,0.3,0.9] } },
  exit:   { opacity: 0, scale: 1.02,  filter: "blur(4px)", transition: { duration: 0.30, ease: [0.4,0.15,0.2,1] } }
};

export const swapCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  enter:  { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35 } },
  exit:   { opacity: 0, y: -24, scale: 0.98, transition: { duration: 0.25 } }
};

export const pulseActive: Variants = {
  rest:   { scale: 1 },
  active: { scale: [1,1.06,1], transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }
};
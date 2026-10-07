import { Variants, Transition } from "framer-motion";

export const easeOutCustom: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeInOutCustom: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const standardTransition: Transition = {
  duration: 0.22,
  ease: easeOutCustom,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const pageFadeInVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easeOutCustom,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

export const itemFadeInVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: easeOutCustom },
  },
};

export const heroHeadlineWordVariants: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: easeOutCustom },
  },
};

export const shakeVariants: Variants = {
  shake: {
    x: [-6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

export const dialogEntranceVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: easeOutCustom },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 6,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const realtimePulseVariants: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.8, 1],
    transition: { duration: 0.6, ease: easeOutCustom },
  },
};

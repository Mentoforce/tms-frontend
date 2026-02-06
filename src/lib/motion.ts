import type { Variants, Transition } from "framer-motion";

export const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fast: Transition = {
  duration: 0.25,
  ease: easeOut,
};

export const sectionFade: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: fast,
  },
};

export const listStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const itemFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: fast,
  },
};

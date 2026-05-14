// lib/motion/tokens.ts
// Canonical motion primitives for PokéDex Ultimate.
// Import from here — never inline easing/duration values in components.

export const easing = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  page: 0.8,
} as const;

export const stagger = {
  cards: 0.08,
  letters: 0.03,
} as const;

export const viewport = {
  once: true,
  margin: '-100px',
} as const;

export const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, ease: easing },
  viewport,
} as const;

export const revealStagger = (delay = 0) => ({
  ...reveal,
  transition: { ...reveal.transition, delay },
});

// Hero content stagger — applied to the motion.div wrapper of main content
export const heroContent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
} as const;

// Individual items inside heroContent stagger container
export const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing },
  },
} as const;

// Reduced-motion counterparts — fade only, no y movement, no stagger
export const heroContentReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0, delayChildren: 0.1 },
  },
} as const;

export const heroItemReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast },
  },
} as const;

export const z = {
  base: 0,
  decorative: 10,
  content: 20,
  navbar: 50,
  modal: 100,
  cursor: 9999,
} as const;

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
};

export const z = {
  base: 0,
  decorative: 10,
  content: 20,
  navbar: 50,
  modal: 100,
  cursor: 9999,
} as const;

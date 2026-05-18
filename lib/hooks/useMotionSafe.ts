'use client';

import { useReducedMotion } from 'framer-motion';
import { duration, easing, viewport } from '@/lib/motion/tokens';

export function useMotionSafe() {
  const reduced = useReducedMotion();

  const reveal = reduced
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: duration.fast },
        viewport,
      }
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: duration.slow, ease: easing },
        viewport,
      };

  return { reduced: !!reduced, reveal };
}

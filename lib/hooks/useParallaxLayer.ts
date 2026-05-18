'use client';

import { useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { parallax, type ParallaxLayer } from '@/lib/motion/tokens';

interface ParallaxLayerOptions {
  /** Custom intensity in % displacement (overrides preset). */
  intensity?: number;
  /** Optional opacity range [start, end] driven by the same scrollYProgress. */
  opacity?: [number, number];
  /** Optional scale range [start, end]. */
  scale?: [number, number];
}

/**
 * Maps a scrollYProgress (0→1) MotionValue to a parallax style object.
 * Pass into a `motion.div` via the `style` prop.
 *
 * Returns inert (frozen) values when `prefers-reduced-motion` is set,
 * so callers don't need to gate the call site.
 */
export function useParallaxLayer(
  scrollYProgress: MotionValue<number>,
  layer: ParallaxLayer | 'custom',
  options: ParallaxLayerOptions = {},
) {
  const reduced = useReducedMotion();
  const intensity =
    options.intensity ?? (layer === 'custom' ? 0 : parallax[layer]);

  // Always call hooks unconditionally — but feed a frozen range when reduced
  // so the underlying transform yields a constant value with zero cost.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ['0%', '0%'] : ['0%', `${intensity}%`],
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    reduced || !options.opacity ? [1, 1] : options.opacity,
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced || !options.scale ? [1, 1] : options.scale,
  );

  return { y, opacity, scale, reduced: !!reduced };
}
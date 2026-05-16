'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { EvolutionMethod } from '@/lib/types/pokemon';

interface EvolutionArrowProps {
  method: EvolutionMethod | null;
  /** Hex color of the resulting (post-evolution) Pokémon — drives the flash tint. */
  glowColor?: string;
  /** Triggered when the user hovers/focuses the arrow — parents use this
   *  to drive optional companion effects (card scale, sound, etc.). */
  onTrigger?: () => void;
}

function methodLabel(method: EvolutionMethod | null): string {
  if (!method) return '';
  if (method.trigger === 'level-up' && method.minLevel) return `Nv. ${method.minLevel}`;
  if (method.trigger === 'trade') return 'Comerciar';
  if (method.trigger === 'use-item' && method.item) return method.item;
  if (method.trigger === 'friendship') return 'Amistad';
  return 'Especial';
}

const FLASH_COOLDOWN_MS = 800;
const FLASH_DURATION_MS = 1200;

export function EvolutionArrow({
  method,
  glowColor = '#FFD700',
  onTrigger,
}: EvolutionArrowProps) {
  const label = methodLabel(method);
  const reduced = useReducedMotion();
  const [flashing, setFlashing] = useState(false);
  const lastFireRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop any in-flight flash if the component unmounts mid-animation.
  useEffect(() => {
    const v = videoRef.current;
    return () => {
      if (v) {
        try {
          v.pause();
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  const trigger = useCallback(() => {
    const now = Date.now();
    if (now - lastFireRef.current < FLASH_COOLDOWN_MS) return;
    lastFireRef.current = now;

    setFlashing(true);
    onTrigger?.();

    if (!reduced && videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      } catch {
        /* swallow autoplay rejections — the radial overlay still plays */
      }
    }

    window.setTimeout(() => setFlashing(false), FLASH_DURATION_MS);
  }, [onTrigger, reduced]);

  return (
    <div
      className="group relative flex flex-col items-center gap-1.5 shrink-0 py-2 lg:py-0 cursor-pointer"
      onMouseEnter={trigger}
      onFocus={trigger}
      onClick={trigger}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={
        label
          ? `Ver evolución: ${label}`
          : 'Ver evolución'
      }
    >
      {/* Desktop: right-pointing arrow */}
      <svg
        className="w-8 h-8 hidden lg:block text-text-muted transition-colors duration-base ease-smooth group-hover:text-accent-yellow group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] group-focus:text-accent-yellow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        aria-hidden="true"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>

      {/* Mobile: down-pointing arrow */}
      <svg
        className="w-8 h-8 lg:hidden text-text-muted transition-colors duration-base ease-smooth group-hover:text-accent-yellow group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] group-focus:text-accent-yellow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>

      {label && (
        <span className="font-mono text-[10px] text-text-muted text-center leading-tight max-w-[72px]">
          {label}
        </span>
      )}

      {/* ── Flash overlay ──────────────────────────────────────────────
          Renders a radial gradient burst around the arrow that bleeds
          onto neighbouring cards. Anchored absolutely so it never
          affects the surrounding layout. */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            key="flash"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: reduced ? 1 : 1.6 }}
            exit={{ opacity: 0, scale: 1.8 }}
            transition={{
              duration: reduced ? 0.4 : 1.2,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute inset-0 -m-24 z-30"
            style={{
              background: `radial-gradient(circle, ${glowColor}cc 0%, ${glowColor}55 30%, transparent 70%)`,
              mixBlendMode: 'screen',
              filter: 'blur(6px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Flash video ────────────────────────────────────────────────
          One-shot playback, hidden on reduced-motion. Loaded with
          metadata-only so the page doesn't pay the bandwidth cost
          unless the user actually hovers an arrow. */}
      {!reduced && (
        <video
          ref={videoRef}
          src="/assets/evolution-flash.mp4"
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 z-40"
          style={{
            opacity: flashing ? 0.85 : 0,
            mixBlendMode: 'screen',
            transition: 'opacity 240ms ease-out',
          }}
        />
      )}
    </div>
  );
}

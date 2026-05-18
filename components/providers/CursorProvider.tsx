'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SPRING = { damping: 30, stiffness: 2500, mass: 0.08 } as const;
const HALO_SPRING = { damping: 26, stiffness: 700, mass: 0.3 } as const;

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input:not([type="hidden"]), select, textarea, [data-cursor="hover"]';

type CursorState = 'idle' | 'hover' | 'pressed';

/**
 * Renders a custom pokéball cursor that follows the mouse with spring smoothing.
 *
 * Disables itself (rendering nothing, leaving the native cursor) when:
 *  - the user prefers reduced motion
 *  - the device has no hover capability (touch)
 *  - viewport width < 1024px (cursor is a desktop-only flourish)
 *
 * Sets `body { cursor: none }` only while active so the native cursor
 * returns immediately if the provider unmounts.
 */
export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [state, setState] = useState<CursorState>('idle');

  // Raw mouse position, unsmoothed.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Spring-smoothed position for the pokéball; halo lags slightly more.
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const haloX = useSpring(x, HALO_SPRING);
  const haloY = useSpring(y, HALO_SPRING);

  // Track whether the cursor is currently visible inside the document.
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const wideEnough = window.innerWidth >= 1024;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!supportsHover || !wideEnough || reducedMotion) return;

    setActive(true);
    document.body.classList.add('cursor-none');

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      // Detect interactive element directly under the cursor.
      const target = e.target as Element | null;
      const interactive = target?.closest?.(INTERACTIVE_SELECTOR);
      setState((prev) => {
        if (prev === 'pressed') return prev;
        return interactive ? 'hover' : 'idle';
      });
    };

    const handleDown = () => setState('pressed');
    const handleUp = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const interactive = target?.closest?.(INTERACTIVE_SELECTOR);
      setState(interactive ? 'hover' : 'idle');
    };

    const handleLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const handleEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      document.body.classList.remove('cursor-none');
    };
  }, [x, y]);

  return (
    <>
      {children}

      {active && (
        <>
          {/* Halo — large, blurred, blends with both light and dark bgs */}
          <motion.div
            aria-hidden="true"
            className="pokeball-cursor-halo"
            style={{
              x: haloX,
              y: haloY,
              opacity: visible ? (state === 'hover' ? 0.7 : 0.35) : 0,
              scale: state === 'hover' ? 1.4 : state === 'pressed' ? 0.7 : 1,
            }}
          />

          {/* Pokéball — drawn inline so it animates without external assets */}
          <motion.div
            aria-hidden="true"
            className="pokeball-cursor"
            style={{
              x: springX,
              y: springY,
              opacity: visible ? 1 : 0,
              scale:
                state === 'hover' ? 1.45 : state === 'pressed' ? 0.85 : 1,
            }}
            animate={
              state === 'hover'
                ? { rotate: 360 }
                : { rotate: 0 }
            }
            transition={
              state === 'hover'
                ? {
                    rotate: {
                      repeat: Infinity,
                      duration: 4,
                      ease: 'linear',
                    },
                    default: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                  }
                : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <svg
              viewBox="0 0 32 32"
              width="22"
              height="22"
              role="presentation"
            >
              {/* Top half — red */}
              <path
                d="M16 2 A 14 14 0 0 1 30 16 L 2 16 A 14 14 0 0 1 16 2 Z"
                fill="#E3350D"
              />
              {/* Bottom half — white */}
              <path
                d="M16 30 A 14 14 0 0 1 2 16 L 30 16 A 14 14 0 0 1 16 30 Z"
                fill="#F5F5F5"
              />
              {/* Equator band */}
              <rect x="1.5" y="14" width="29" height="4" fill="#0a0a0f" />
              {/* Outer outline */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="#0a0a0f"
                strokeWidth="2"
              />
              {/* Center button — outer ring */}
              <circle
                cx="16"
                cy="16"
                r="4.5"
                fill="#F5F5F5"
                stroke="#0a0a0f"
                strokeWidth="2"
              />
              {/* Center button — inner dot */}
              <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
            </svg>
          </motion.div>
        </>
      )}
    </>
  );
}

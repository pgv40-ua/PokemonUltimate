import { useEffect, useRef, useState, type MutableRefObject, type CSSProperties } from 'react';

interface MagneticOptions {
  disableOnReducedMotion?: boolean;
  disableOnTouch?: boolean;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function useMagneticButton(
  strength = 0.05,
  options: MagneticOptions = {},
): { ref: MutableRefObject<HTMLButtonElement | null>; style: CSSProperties } {
  const { disableOnReducedMotion = true, disableOnTouch = true } = options;
  const ref = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (disableOnReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (disableOnTouch && window.matchMedia('(hover: none)').matches) return;

    let rafId: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;

    function animate() {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      setStyle({
        transform: `translate(${currentX}px, ${currentY}px)`,
        transition: 'none',
      });

      if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    function onMouseMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Only apply magnetic effect when cursor is within 2x the element radius
      const threshold = Math.max(rect.width, rect.height);
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < threshold) {
        targetX = distX * strength;
        targetY = distY * strength;
        isHovering = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(animate);
      } else if (isHovering) {
        isHovering = false;
        targetX = 0;
        targetY = 0;
        rafId = requestAnimationFrame(animate);
      }
    }

    function onMouseLeave() {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMouseMove);
    const el = ref.current;
    el?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      el?.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength, disableOnReducedMotion, disableOnTouch]);

  return { ref, style };
}

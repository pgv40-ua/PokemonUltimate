'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { easing } from '@/lib/utils/motion';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

const labelColorMap: Record<string, string> = {
  HP:  'bg-green-500',
  ATK: 'bg-red-500',
  DEF: 'bg-blue-400',
  SPA: 'bg-pink-500',
  SPD: 'bg-cyan-400',
  SPE: 'bg-yellow-400',
  VEL: 'bg-yellow-400',
};

function getBarColor(label: string, override?: string): string {
  if (override) return override;
  return labelColorMap[label.toUpperCase()] ?? 'bg-accent-yellow';
}

export function StatBar({
  label,
  value,
  max = 255,
  color,
  animate = true,
  className,
}: StatBarProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;
  const ratio = Math.min(Math.max(value / max, 0), 1);
  const barColor = getBarColor(label, color);

  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, amount: 0.05 });

  const barContent = shouldAnimate ? (
    <motion.div
      className={cn('h-full rounded-full origin-left', barColor)}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: inView ? ratio : 0 }}
      transition={{ duration: 0.6, ease: easing }}
    />
  ) : (
    <div
      className={cn('h-full rounded-full', barColor)}
      style={{ width: `${ratio * 100}%` }}
    />
  );

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="font-mono text-xs text-text-muted w-8 shrink-0 uppercase">
        {label}
      </span>
      <div ref={trackRef} className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
        {barContent}
      </div>
      <span className="font-mono text-xs text-text-secondary w-8 text-right shrink-0 tabular-nums">
        {value}
      </span>
    </div>
  );
}

StatBar.displayName = 'StatBar';

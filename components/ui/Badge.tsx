import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'neutral' | 'red' | 'yellow' | 'purple' | 'blue';
  size?: 'sm' | 'md';
  selected?: boolean;
}

const colorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  neutral: 'bg-surface text-text-secondary border border-border-soft',
  // #ff5c35 passes 4.5:1 on the darkest glass card glow background (#2b191a)
  red:     'bg-accent-red/10 text-[#ff5c35] border border-accent-red/30',
  yellow:  'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30',
  // #c080ff passes 4.5:1 on the darkest purple glow background (#20192b)
  purple:  'bg-accent-purple/10 text-[#c080ff] border border-accent-purple/30',
  blue:    'bg-accent-blue/10 text-accent-blue border border-accent-blue/30',
};

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  color = 'neutral',
  size = 'md',
  selected = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-body font-medium',
        'transition-all duration-base ease-smooth',
        colorClasses[color],
        sizeClasses[size],
        selected && 'ring-2 ring-accent-yellow shadow-glow-yellow',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

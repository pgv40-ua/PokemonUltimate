import React from 'react';
import type { PokemonType } from '@/lib/types/pokemon';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { TypeIcon } from './TypeIcon';
import { cn } from '@/lib/utils/cn';

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

interface TypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
}

const sizeClasses: Record<NonNullable<TypeBadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-xs gap-1.5',
  lg: 'px-4 py-1.5 text-sm gap-2',
};

const iconSizes: Record<NonNullable<TypeBadgeProps['size']>, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

export function TypeBadge({
  type,
  size = 'md',
  withIcon = false,
  className,
  style,
  ...rest
}: TypeBadgeProps) {
  const bgHex = typeHexMap[type];
  // Use dark text when the type background is bright (luminance > 0.18 ≈ contrast < 4.5:1 with white)
  const textColor = relativeLuminance(bgHex) > 0.18 ? '#1a1a1a' : '#ffffff';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-body font-medium',
        'transition-all duration-base ease-smooth',
        sizeClasses[size],
        className,
      )}
      // CSS variable injection for type color — dynamic, inline style is correct here
      style={{ backgroundColor: bgHex, color: textColor, ...style } as React.CSSProperties}
      {...rest}
    >
      {withIcon && (
        <TypeIcon
          type={type}
          size={iconSizes[size]}
          className="shrink-0"
        />
      )}
      {typeNamesES[type]}
    </span>
  );
}

TypeBadge.displayName = 'TypeBadge';

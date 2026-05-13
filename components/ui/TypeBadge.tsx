import React from 'react';
import type { PokemonType } from '@/lib/types/pokemon';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { TypeIcon } from './TypeIcon';
import { cn } from '@/lib/utils/cn';

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
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-body font-medium text-white',
        'transition-all duration-base ease-smooth',
        sizeClasses[size],
        className,
      )}
      // CSS variable injection for type color — dynamic, inline style is correct here
      style={{ backgroundColor: typeHexMap[type], ...style } as React.CSSProperties}
      {...rest}
    >
      {withIcon && (
        <TypeIcon
          type={type}
          size={iconSizes[size]}
          className="shrink-0 text-white"
        />
      )}
      {typeNamesES[type]}
    </span>
  );
}

TypeBadge.displayName = 'TypeBadge';

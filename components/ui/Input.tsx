'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ iconLeft, iconRight, className, wrapperClassName, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div
        className={cn(
          'glass-card flex items-center gap-3 px-4 py-3 rounded-card',
          'transition-all duration-base ease-smooth',
          focused && 'ring-2 ring-accent-yellow border-accent-yellow/50',
          wrapperClassName,
        )}
      >
        {iconLeft && (
          <span className="shrink-0 text-text-muted flex items-center" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'flex-1 bg-transparent text-text-primary placeholder:text-text-muted',
            'text-base font-body outline-none border-none min-w-0',
            className,
          )}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {iconRight && (
          <span className="shrink-0 text-text-muted flex items-center" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

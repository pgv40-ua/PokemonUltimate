'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { useMagneticButton } from '@/lib/hooks/useMagneticButton';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-accent-yellow text-text-inverse hover:scale-105 hover:shadow-glow-yellow',
  secondary:
    'bg-transparent text-text-primary border border-border-strong hover:bg-surface',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

const base =
  'inline-flex items-center justify-center rounded-full font-body font-medium ' +
  'transition-all duration-base ease-smooth ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-bg ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
  'select-none whitespace-nowrap';

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      magnetic = false,
      asChild = false,
      loading = false,
      iconLeft,
      iconRight,
      children,
      className,
      style,
      disabled,
      ...rest
    },
    forwardedRef,
  ) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!children && !rest['aria-label']) {
        console.error(
          '[Button] Icon-only button requires an aria-label for accessibility.',
        );
      }
    }

    const { ref: magneticRef, style: magneticStyle } = useMagneticButton(0.3);

    // Merge refs: forwarded ref + magnetic ref
    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        magneticRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          // forwardedRef is a RefObject — cast to mutable to assign
          (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [magneticRef, forwardedRef],
    );

    const computedStyle = magnetic ? { ...magneticStyle, ...style } : style;

    const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

    const content = (
      <>
        {loading ? <Spinner /> : iconLeft}
        {children && <span>{children}</span>}
        {!loading && iconRight}
      </>
    );

    if (asChild && React.isValidElement(children)) {
      // asChild: merge our props into the single child element
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement> & { className?: string; style?: React.CSSProperties }
      >;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        style: computedStyle ? { ...computedStyle, ...child.props.style } : child.props.style,
        ...rest,
      });
    }

    return (
      <button
        ref={magnetic ? setRef : forwardedRef}
        className={classes}
        style={computedStyle}
        disabled={disabled ?? loading}
        aria-busy={loading ? true : undefined}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';

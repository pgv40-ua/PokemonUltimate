'use client';

import { Children, isValidElement, type ElementType, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  duration,
  easing,
  revealVariants,
  type RevealVariant,
} from '@/lib/motion/tokens';

interface RevealProps {
  variant?: RevealVariant;
  delay?: number;
  /** If > 0, the wrapper acts as a stagger container and direct children are wrapped in <Reveal.Item>. */
  stagger?: number;
  as?: ElementType;
  className?: string;
  /** Viewport intersection threshold (0–1). Default: 0.2. */
  amount?: number;
  /** Animate every time the element enters viewport. Default: true (only once). */
  once?: boolean;
  /** Top/bottom margin for the IntersectionObserver root. Mirrors framer-motion's `viewport.margin`. */
  margin?: string;
  children: ReactNode;
}

function buildItemVariants(variant: RevealVariant, reduced: boolean): Variants {
  const preset = revealVariants[variant];
  const set = reduced ? preset.reduced : preset.motion;
  return {
    hidden: set.hidden,
    visible: {
      ...set.visible,
      transition: {
        duration: reduced ? duration.fast : duration.slow,
        ease: easing,
      },
    },
  };
}

function buildContainerVariants(
  stagger: number,
  delay: number,
  reduced: boolean,
): Variants {
  return {
    hidden: { opacity: reduced ? 0 : 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };
}

export function Reveal({
  variant = 'fade-up',
  delay = 0,
  stagger = 0,
  as: Tag = 'div',
  className,
  amount = 0.2,
  once = true,
  margin = '-80px',
  children,
}: RevealProps) {
  const reduced = !!useReducedMotion();
  const MotionTag = motion.create(Tag as ElementType);

  if (stagger > 0) {
    const containerVariants = buildContainerVariants(stagger, delay, reduced);
    const itemVariants = buildItemVariants(variant, reduced);

    return (
      <MotionTag
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin, amount }}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          // If the caller passed an explicit <Reveal.Item>, let it own its
          // variants and className — don't double-wrap (that would break
          // grid-area / col-span on the actual grid item).
          if (child.type === RevealItem) return child;
          return <motion.div variants={itemVariants}>{child}</motion.div>;
        })}
      </MotionTag>
    );
  }

  const itemVariants = buildItemVariants(variant, reduced);
  // Apply optional `delay` to the single-item path.
  const visibleWithDelay: Variants = {
    ...itemVariants,
    visible: {
      ...(itemVariants.visible as Record<string, unknown>),
      transition: {
        duration: reduced ? duration.fast : duration.slow,
        ease: easing,
        delay,
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={visibleWithDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin, amount }}
    >
      {children}
    </MotionTag>
  );
}

interface RevealItemProps {
  variant?: RevealVariant;
  className?: string;
  as?: ElementType;
  children: ReactNode;
}

/**
 * Use inside a <Reveal stagger> when a child needs a non-default variant
 * or when wrapping multiple direct children that should each animate
 * independently while inheriting the parent's stagger orchestration.
 */
export function RevealItem({
  variant = 'fade-up',
  className,
  as: Tag = 'div',
  children,
}: RevealItemProps) {
  const reduced = !!useReducedMotion();
  const MotionTag = motion.create(Tag as ElementType);
  const itemVariants = buildItemVariants(variant, reduced);

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}

Reveal.Item = RevealItem;
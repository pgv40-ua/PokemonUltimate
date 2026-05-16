'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { hallOfFameMock } from '@/lib/mock/hall-of-fame';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { cn } from '@/lib/utils/cn';
import { easing, duration, reveal, viewport } from '@/lib/motion/tokens';
import type { HallOfFamePokemon } from '@/lib/types/pokemon';

// ---------------------------------------------------------------------------
// Internal: HofCard
// ---------------------------------------------------------------------------

interface HofCardProps {
  pokemon: HallOfFamePokemon;
  isActive: boolean;
}

function HofCard({ pokemon, isActive }: HofCardProps) {
  return (
    <div
      className={cn(
        'w-[calc(100vw-4rem)] max-w-[260px] sm:w-56 lg:w-64 rounded-card overflow-hidden glass-card select-none',
        'transition-[border-color,box-shadow] duration-slow ease-smooth',
      )}
      style={
        isActive
          ? {
              boxShadow:
                '0 0 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.15)',
              borderColor: 'rgba(255, 215, 0, 0.4)',
            }
          : undefined
      }
    >
      {/* Gradient placeholder — no imageUrl available for any entry */}
      <div
        className="relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${pokemon.typeColor}60 0%, rgba(10,10,15,0.95) 100%)`,
        }}
        aria-hidden="true"
      >
        {/* Rank badge */}
        <span className="absolute top-3 left-3 font-mono text-xs text-accent-yellow/70">
          #{pokemon.hofRank}
        </span>

        {/* Large initial as decorative placeholder */}
        <span className="font-display font-black text-[60px] sm:text-[80px] leading-none text-white/8 select-none pointer-events-none">
          {pokemon.name.es.charAt(0)}
        </span>

        {/* Subtle radial spotlight on active */}
        {isActive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${pokemon.typeColor}20, transparent)`,
            }}
          />
        )}
      </div>

      {/* Card body */}
      <div className="p-5 text-center">
        {/* Type badges */}
        <div className="flex justify-center gap-1.5 mb-3">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>

        {/* Name */}
        <h3
          className="font-display font-black text-white leading-tight"
          style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}
        >
          {pokemon.name.es}
        </h3>

        {/* Generation */}
        <p className="font-mono text-xs text-text-muted mt-1">
          Gen {pokemon.generation}
        </p>

        {/* Epic quote */}
        <p className="font-body text-sm text-text-secondary mt-3 italic leading-relaxed">
          &ldquo;{pokemon.epicQuote}&rdquo;
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Arrow button shared component
// ---------------------------------------------------------------------------

interface ArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  ariaLabel: string;
}

function ArrowButton({ direction, onClick, ariaLabel }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute z-20 p-3 rounded-full glass-card',
        'hover:bg-white/10 transition-colors duration-base',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
        // Position: keep away from card edges with enough breathing room
        direction === 'left' ? 'left-0 sm:left-2' : 'right-0 sm:right-2',
      )}
      aria-label={ariaLabel}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {direction === 'left' ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function HallOfFame() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const total = hallOfFameMock.length;

  // Track viewport width so neighbour cards land closer on mobile.
  const [cardOffsetPx, setCardOffsetPx] = useState(260);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setCardOffsetPx(160);
      else if (w < 1024) setCardOffsetPx(220);
      else setCardOffsetPx(260);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Wrapping circular offset: range (-total/2, total/2]
  const getOffset = useCallback(
    (index: number): number => {
      let offset = index - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      return offset;
    },
    [activeIndex, total],
  );

  // Per-card transform props — two modes: full 3D and reduced
  const getCardProps = useCallback(
    (offset: number) => {
      const absOffset = Math.abs(offset);

      if (shouldReduceMotion) {
        // Reduced: show only active, fade others out; no spatial transforms
        if (offset !== 0) return { visible: false } as const;
        return { visible: true, scale: 1, opacity: 1, x: 0, rotateY: 0, zIndex: 10 } as const;
      }

      // Only render the ±2 neighbours around the active card
      if (absOffset > 2) return { visible: false } as const;

      const scale = offset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.68;
      const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.55 : 0.3;
      const x = offset * cardOffsetPx;
      const rotateY = -offset * 12;
      const zIndex = offset === 0 ? 10 : absOffset === 1 ? 5 : 1;

      return { visible: true, scale, opacity, x, rotateY, zIndex } as const;
    },
    [shouldReduceMotion, cardOffsetPx],
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % total),
    [total],
  );

  return (
    <section
      id="hall-of-fame"
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-label="Hall of Fame — Los inmortales"
    >
      {/* Section background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg-elevated/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(255,215,0,0.06),transparent)]" />
      </div>

      <div className="container-app">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative mb-16 lg:mb-20">
          {/* Decorative section number */}
          <span
            className="absolute -top-8 left-0 font-display font-black leading-none opacity-[0.04] blur-sm select-none pointer-events-none"
            style={{ fontSize: 'clamp(80px, 16vw, 160px)' }}
            aria-hidden="true"
          >
            08
          </span>

          <motion.p
            className="eyebrow mb-4"
            {...(shouldReduceMotion
              ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: duration.fast }, viewport }
              : reveal)}
          >
            Hall of Fame · Los inmortales
          </motion.p>

          <motion.h2
            className="font-display font-black uppercase text-white"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1 }}
            {...(shouldReduceMotion
              ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: duration.fast }, viewport }
              : { ...reveal, transition: { duration: duration.slow, ease: easing, delay: 0.08 } })}
          >
            Leyendas Inmortales
          </motion.h2>

          <motion.p
            className="font-body text-text-secondary mt-4 max-w-xl text-lg leading-relaxed"
            {...(shouldReduceMotion
              ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: duration.fast }, viewport }
              : { ...reveal, transition: { duration: duration.slow, ease: easing, delay: 0.16 } })}
          >
            Los Pokémon que han trascendido generaciones y marcado la cultura.
          </motion.p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Carousel                                                         */}
        {/* ---------------------------------------------------------------- */}
        <div
          role="region"
          aria-label="Carrusel Hall of Fame"
          aria-roledescription="carrusel"
          tabIndex={0}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-lg"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
          }}
        >
          {/* 3D track */}
          <div
            className="relative h-[400px] sm:h-[440px] lg:h-[460px] flex items-center justify-center overflow-hidden"
            style={{ perspective: '1200px' }}
          >
            {hallOfFameMock.map((pokemon, index) => {
              const offset = getOffset(index);
              const props = getCardProps(offset);

              if (!props.visible) return null;

              return (
                <motion.div
                  key={pokemon.id}
                  className="absolute cursor-pointer"
                  style={{ zIndex: props.zIndex }}
                  animate={{
                    x: props.x,
                    scale: props.scale,
                    opacity: props.opacity,
                    rotateY: props.rotateY,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? duration.fast : duration.slow,
                    ease: easing,
                  }}
                  onClick={() => setActiveIndex(index)}
                  // Non-active cards are presentational via tabIndex -1;
                  // keyboard users navigate with arrow keys on the container
                  tabIndex={offset === 0 ? -1 : -1}
                  aria-hidden={offset !== 0}
                >
                  <HofCard pokemon={pokemon} isActive={offset === 0} />
                </motion.div>
              );
            })}
          </div>

          {/* Live region — announces active Pokémon to screen readers */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {hallOfFameMock[activeIndex].name.es} — {hallOfFameMock[activeIndex].epicQuote}
          </div>

          {/* Navigation arrows */}
          <ArrowButton
            direction="left"
            onClick={prev}
            ariaLabel="Pokémon anterior"
          />
          <ArrowButton
            direction="right"
            onClick={next}
            ariaLabel="Pokémon siguiente"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Dot indicators                                                   */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="flex justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Pokémon en el Hall of Fame"
        >
          {hallOfFameMock.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Ver ${p.name.es}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'rounded-full transition-all duration-slow ease-smooth',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
                i === activeIndex
                  ? 'w-6 h-2 bg-accent-yellow'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

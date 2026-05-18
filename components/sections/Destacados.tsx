'use client';

import type { FC } from 'react';
import { useReducedMotion } from 'framer-motion';
import { featuredPokemonMock } from '@/lib/mock/featured';
import { PokemonCard } from '@/components/ui/PokemonCard';
import type { FeaturedPokemon, PokemonCardData } from '@/lib/types/pokemon';
import { Reveal } from '@/components/ui/Reveal';

// ─── Data adapter ────────────────────────────────────────────────────────────

function toCardData(fp: FeaturedPokemon): PokemonCardData {
  return {
    id: fp.id,
    name: fp.name.es,
    types: fp.types,
    sprite: fp.imageUrl,
    usagePercent: fp.usageRate,
    stats: fp.stats,
  };
}

// All 6 cards rendered equally — uniform 3-column bento grid
function getColSpan(): string {
  return 'col-span-1';
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Destacados: FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="destacados"
      aria-labelledby="destacados-heading"
      className="relative isolate overflow-hidden py-24 lg:py-32 scroll-snap-start"
    >
      {/* Background: gradient fallback + subtle looping video over it */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-[#0a0a0f] to-blue-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(123,47,190,0.1),transparent)]" />
        {!shouldReduceMotion && (
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src="/assets/featured-bg.mp4"
            poster="/assets/featured-bg.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            }}
          />
        )}
      </div>

      <div className="container-app">
        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="relative mb-12 lg:mb-16" data-section-num="02">

          <Reveal margin="-60px">
            <p className="eyebrow mb-4 text-accent-blue">
              Meta competitivo &middot; Temporada actual
            </p>
            <h2
              id="destacados-heading"
              className="font-display font-black uppercase text-text-primary"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1 }}
            >
              Los más poderosos del momento
            </h2>
            <p className="mt-4 text-text-secondary font-body text-base max-w-xl">
              Los Pokémon que dominan el meta SV OU esta temporada.
            </p>
          </Reveal>
        </div>

        {/* ── Bento grid ───────────────────────────────────────────────── */}
        <Reveal
          stagger={0.08}
          margin="-60px"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {featuredPokemonMock.map((fp) => (
            <div key={fp.id} className={getColSpan()}>
              <BentoCard fp={fp} featured={false} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

// ─── BentoCard ────────────────────────────────────────────────────────────────

interface BentoCardProps {
  fp: FeaturedPokemon;
  featured: boolean;
}

function BentoCard({ fp, featured }: BentoCardProps) {
  return (
    <div className="relative h-full">
      <PokemonCard
        pokemon={toCardData(fp)}
        variant="full"
        showStats={true}
        showUsage={false}
        className="h-full"
      />

      {/* Tier badge — decorative complement, not sole carrier of info */}
      <div className="absolute top-3 right-3 z-10" aria-hidden="true">
        <span className="font-mono text-xs text-accent-yellow bg-bg/80 px-2 py-0.5 rounded-full border border-accent-yellow/30">
          {fp.tier}
        </span>
      </div>

      {/* Role tag — only on featured cards, enough vertical space */}
      {featured && (
        <div className="absolute top-3 left-3 z-10" aria-hidden="true">
          <span className="font-mono text-xs text-text-muted bg-bg/80 px-2 py-0.5 rounded-full border border-border-soft">
            {fp.role}
          </span>
        </div>
      )}
    </div>
  );
}

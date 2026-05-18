'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { EvolutionArrow } from '@/components/pokemon/EvolutionArrow';
import { evolutionChainsMock } from '@/lib/mock/evolutions';
import { pokemonMock } from '@/lib/mock/pokemon';
import type { Pokemon } from '@/lib/types/pokemon';

// Enrich chains: join each stage with its full Pokemon record
const enrichedChains = evolutionChainsMock.map((chain) => ({
  ...chain,
  stages: chain.stages.map((stage) => ({
    ...stage,
    pokemon: pokemonMock.find((p) => p.id === stage.pokemonId) as Pokemon,
  })),
}));

// ── Motion variants ────────────────────────────────────────────────────────────

const chainVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as number[],
    },
  }),
};

const reducedChainVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.15, duration: 0.4 },
  }),
};

// ── Sub-components ─────────────────────────────────────────────────────────────

interface PokemonStageCardProps {
  pokemon: Pokemon;
  highlight: boolean;
}

function PokemonStageCard({ pokemon, highlight }: PokemonStageCardProps) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className="glass-card overflow-hidden text-center w-full lg:w-44 xl:w-48 shrink-0 flex flex-col"
      aria-label={`${pokemon.name.es}, #${pokemon.id.toString().padStart(4, '0')}`}
      animate={
        reduced
          ? undefined
          : highlight
          ? { scale: [1, 1.04, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={
        highlight
          ? {
              boxShadow: `0 0 36px ${pokemon.typeColor}66, 0 8px 32px rgba(0,0,0,0.45)`,
              borderColor: `${pokemon.typeColor}80`,
            }
          : undefined
      }
    >
      {/* Visual placeholder — gradient from primary type color */}
      <div
        className="w-full h-36 flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${pokemon.typeColor}55 0%, #0a0a0f 100%)`,
        }}
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-5xl select-none"
          style={{ color: `${pokemon.typeColor}40` }}
        >
          {pokemon.name.es.charAt(0)}
        </span>
      </div>

      {/* Card content */}
      <div className="p-4 flex flex-col items-center gap-2 flex-1">
        <p className="font-mono text-[10px] text-text-muted leading-none">
          #{pokemon.id.toString().padStart(4, '0')}
        </p>
        <h3 className="font-display font-bold text-white text-sm leading-tight">
          {pokemon.name.es}
        </h3>
        <div className="flex flex-wrap justify-center gap-1.5" role="list" aria-label="Tipos">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" role="listitem" />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

export function Evolutions() {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedChainVariants : chainVariants;

  // Tracks the most-recently triggered (chainId, stageIndex) so the matching
  // post-evolution card can pulse along with the flash.
  const [highlight, setHighlight] = useState<string | null>(null);

  return (
    <section
      id="evolutions"
      className="relative py-24 lg:py-32"
      aria-labelledby="evolutions-heading"
    >
      <div className="container-app">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="relative mb-12 lg:mb-16" data-section-num="05">

          <p className="eyebrow mb-4 relative">Cadenas de evolución · Gen I</p>
          <h2
            id="evolutions-heading"
            className="font-display font-black uppercase text-white leading-none relative"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            El camino de la evolución
          </h2>
          <p className="mt-4 text-text-secondary font-body text-base lg:text-lg max-w-xl">
            De semilla a leyenda. Cada evolución es un nuevo poder.
          </p>
        </div>

        {/* ── Evolution chains ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-10 lg:gap-12">
          {enrichedChains.map((chain, chainIndex) => (
            <motion.div
              key={chain.id}
              custom={chainIndex}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6"
              role="group"
              aria-label={`Cadena de evolución ${chainIndex + 1}: ${chain.stages.map((s) => s.pokemon.name.es).join(' → ')}`}
            >
              {chain.stages.map((stage, stageIndex) => {
                const highlightKey = `${chain.id}:${stageIndex}`;
                return (
                  <div
                    key={stage.pokemonId}
                    className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto"
                  >
                    {stageIndex > 0 && (
                      <EvolutionArrow
                        method={stage.method}
                        glowColor={stage.pokemon.typeColor}
                        onTrigger={() => {
                          setHighlight(highlightKey);
                          window.setTimeout(() => {
                            setHighlight((curr) =>
                              curr === highlightKey ? null : curr,
                            );
                          }, 900);
                        }}
                      />
                    )}

                    <PokemonStageCard
                      pokemon={stage.pokemon}
                      highlight={highlight === highlightKey}
                    />
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="mt-14 lg:mt-16 flex justify-center">
          <Button
            variant="secondary"
            size="md"
            magnetic
            iconRight={
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            }
          >
            Explorar todas las cadenas de evolución
          </Button>
        </div>
      </div>
    </section>
  );
}

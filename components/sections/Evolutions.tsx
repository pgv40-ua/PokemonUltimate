'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { evolutionChainsMock } from '@/lib/mock/evolutions';
import { pokemonMock } from '@/lib/mock/pokemon';
import type { EvolutionMethod, Pokemon } from '@/lib/types/pokemon';

// ── Helpers ────────────────────────────────────────────────────────────────────

function methodLabel(method: EvolutionMethod | null): string {
  if (!method) return '';
  if (method.trigger === 'level-up' && method.minLevel) return `Nv. ${method.minLevel}`;
  if (method.trigger === 'trade') return 'Comerciar';
  if (method.trigger === 'use-item' && method.item) return method.item;
  if (method.trigger === 'friendship') return 'Amistad';
  return 'Especial';
}

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
}

function PokemonStageCard({ pokemon }: PokemonStageCardProps) {
  return (
    <article
      className="glass-card overflow-hidden text-center w-full lg:w-44 xl:w-48 shrink-0 flex flex-col"
      aria-label={`${pokemon.name.es}, #${pokemon.id.toString().padStart(4, '0')}`}
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
    </article>
  );
}

interface EvoArrowProps {
  method: EvolutionMethod | null;
}

function EvoArrow({ method }: EvoArrowProps) {
  const label = methodLabel(method);
  return (
    /*
     * aria-hidden: the arrow is purely decorative — the method label text is
     * readable by screen readers as part of the surrounding list context.
     */
    <div className="group flex flex-col items-center gap-1.5 shrink-0 py-2 lg:py-0" aria-hidden="true">
      {/* Desktop: right-pointing arrow */}
      <svg
        className="w-8 h-8 hidden lg:block text-text-muted transition-colors duration-base ease-smooth group-hover:text-accent-yellow group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>

      {/* Mobile: down-pointing arrow */}
      <svg
        className="w-8 h-8 lg:hidden text-text-muted transition-colors duration-base ease-smooth group-hover:text-accent-yellow group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>

      {label && (
        <span className="font-mono text-[10px] text-text-muted text-center leading-tight max-w-[72px]">
          {label}
        </span>
      )}
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

export function Evolutions() {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedChainVariants : chainVariants;

  return (
    <section
      id="evolutions"
      className="relative py-24 lg:py-32"
      aria-labelledby="evolutions-heading"
    >
      <div className="container-app">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="relative mb-12 lg:mb-16">
          {/* Decorative section number — per catalog, sections 4 & 5 only have this.
              Section 7 (Evolutions) does NOT have a decorative number per the catalog spec.
              The number below follows the task brief ("05") which maps to Evolutions' visual position. */}
          <span
            className="absolute -top-6 left-0 font-display font-black text-[10rem] leading-none select-none pointer-events-none blur-sm text-white opacity-[0.04]"
            aria-hidden="true"
          >
            05
          </span>

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
              {chain.stages.map((stage, stageIndex) => (
                <div
                  key={stage.pokemonId}
                  className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto"
                >
                  {/* Arrow + method — shown before each stage except the first */}
                  {stageIndex > 0 && <EvoArrow method={stage.method} />}

                  <PokemonStageCard pokemon={stage.pokemon} />
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="mt-14 lg:mt-16 flex justify-center">
          <Button
            variant="secondary"
            size="md"
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

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { abilitiesMock } from '@/lib/mock/abilities';
import { naturesMock } from '@/lib/mock/natures';
import type { Ability, Nature } from '@/lib/types/pokemon';
import { easing, duration, viewport } from '@/lib/motion/tokens';

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterMode = 'all' | 'hidden';

// ─── Constants ───────────────────────────────────────────────────────────────

const STAT_KEYS = ['attack', 'defense', 'speed', 'spAttack', 'spDefense'] as const;
type NatureStat = (typeof STAT_KEYS)[number];

const STAT_LABEL: Record<string, string> = {
  attack: 'ATK',
  defense: 'DEF',
  speed: 'VEL',
  spAttack: 'ATE',
  spDefense: 'DES',
  hp: 'HP',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildNatureGrid(natures: Nature[]): (Nature | undefined)[][] {
  const map = new Map<string, Nature>();
  for (const n of natures) {
    if (n.raisedStat && n.loweredStat) {
      map.set(`${n.raisedStat}:${n.loweredStat}`, n);
    }
  }
  return STAT_KEYS.map((raised) =>
    STAT_KEYS.map((lowered) => map.get(`${raised}:${lowered}`)),
  );
}

// ─── Inline SVG icons (decorative, aria-hidden) ──────────────────────────────

function IconLightning() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M11 2L4 11h6l-1 7 7-9h-6l1-7Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHiddenEye() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="white" strokeWidth="1.5" />
      <line
        x1="3"
        y1="17"
        x2="17"
        y2="3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Ability card ─────────────────────────────────────────────────────────────

interface AbilityCardProps {
  ability: Ability;
  index: number;
  reducedMotion: boolean;
}

function AbilityCard({ ability, index, reducedMotion }: AbilityCardProps) {
  const motionProps = reducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: duration.fast },
        viewport,
      }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: {
          duration: duration.base,
          ease: easing,
          delay: index * 0.06,
        },
        viewport,
      };

  return (
    <motion.li {...motionProps}>
      <Card
        as="article"
        className="p-4 flex gap-4 items-start hover:border-white/20 transition-colors h-full"
        aria-label={`Habilidad: ${ability.nameEs}${ability.hidden ? ', habilidad oculta' : ''}, Slot ${ability.slot}`}
      >
        {/* Colored circle with icon */}
        <div
          aria-hidden="true"
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: ability.hidden
              ? 'linear-gradient(135deg, #7B2FBE, #4A1A8C)'
              : 'linear-gradient(135deg, #FFD700, #FFA500)',
          }}
        >
          {ability.hidden ? <IconHiddenEye /> : <IconLightning />}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-display font-bold text-white text-lg leading-tight">
              {ability.nameEs}
            </span>
            {ability.hidden && (
              <Badge color="purple" size="sm">
                Oculta
              </Badge>
            )}
          </div>

          <p className="font-mono text-xs text-text-muted mb-2">
            Slot {ability.slot}
          </p>

          <p className="font-body text-sm text-text-secondary leading-relaxed">
            {ability.description}
          </p>
        </div>
      </Card>
    </motion.li>
  );
}

// ─── Section 1: Abilities ────────────────────────────────────────────────────

function AbilitiesSection() {
  const reducedMotion = !!useReducedMotion();
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered =
    filter === 'hidden'
      ? abilitiesMock.filter((a) => a.hidden)
      : abilitiesMock;

  return (
    <section
      id="habilidades"
      aria-labelledby="habilidades-heading"
      className="relative py-16 lg:py-24"
    >
      <div className="container-app">
        {/* Decorative section number — aria-hidden, behind H1 */}
        <span
          aria-hidden="true"
          className="
            font-display font-black select-none pointer-events-none
            text-[160px] lg:text-[220px] leading-none
            opacity-[0.04] blur-sm
            absolute -top-8 -left-2 lg:-left-4
            text-white
          "
        >
          01
        </span>

        {/* Header */}
        <div className="relative mb-10">
          <p className="eyebrow mb-4">Guía competitiva · Habilidades</p>

          <div className="flex flex-wrap items-end gap-4 mb-4">
            <h1
              id="habilidades-heading"
              className="font-display font-black uppercase text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              Habilidades Pokémon
            </h1>

            {/* Live count */}
            <span
              aria-live="polite"
              aria-atomic="true"
              className="font-mono text-sm text-text-muted pb-1"
            >
              {filtered.length} habilidad{filtered.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <p className="font-body text-text-secondary text-base sm:text-lg max-w-2xl mb-8">
            Las habilidades que definen el meta. Filtra por tipo para encontrar la que necesitas.
          </p>

          {/* Filter bar */}
          <div
            role="group"
            aria-label="Filtrar habilidades"
            className="flex items-center gap-3 flex-wrap"
          >
            {(
              [
                { label: 'Todas', value: 'all' as FilterMode },
                { label: 'Ocultas', value: 'hidden' as FilterMode },
              ] as const
            ).map(({ label, value }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={[
                  'px-4 py-1.5 rounded-full text-sm font-body font-medium',
                  'border transition-colors duration-base',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]',
                  filter === value
                    ? 'bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700]'
                    : 'bg-white/[0.04] border-white/10 text-text-secondary hover:border-white/20 hover:text-white',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          role="list"
        >
          {filtered.map((ability, i) => (
            <AbilityCard
              key={ability.slug}
              ability={ability}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </ul>

        {/* Footer note */}
        <p className="mt-8 font-body text-xs text-text-muted">
          {abilitiesMock.length} habilidades del meta &middot; Base de datos completa disponible próximamente con integración PokéAPI
        </p>
      </div>
    </section>
  );
}

// ─── Natures 5×5 table ───────────────────────────────────────────────────────

interface NaturesTableProps {
  grid: (Nature | undefined)[][];
}

function NaturesTable({ grid }: NaturesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl">
      <table
        className="w-full min-w-[380px] border-collapse"
        aria-label="Tabla de naturalezas: filas indican el stat que sube, columnas el stat que baja"
      >
        <caption className="sr-only">
          Tabla de 25 naturalezas Pokémon. Cada fila corresponde al stat que aumenta
          en +10% y cada columna al stat que disminuye en -10%. Las naturalezas
          de la diagonal son neutras y no modifican ningún stat.
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="
                p-2 text-center font-mono text-[10px] uppercase tracking-wider
                text-text-muted border border-white/5 bg-white/[0.02]
              "
              aria-label="Stat que sube (filas) / Stat que baja (columnas)"
            >
              <span aria-hidden="true" className="block leading-none">&#x2191;</span>
              <span aria-hidden="true" className="block leading-none">&#x2193;</span>
            </th>

            {STAT_KEYS.map((stat) => (
              <th
                key={stat}
                scope="col"
                className="
                  p-2 text-center font-mono text-xs uppercase tracking-wider
                  text-text-muted border border-white/5 bg-white/[0.02]
                "
              >
                {STAT_LABEL[stat]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {STAT_KEYS.map((raisedStat, rowIdx) => (
            <tr key={raisedStat}>
              <th
                scope="row"
                className="
                  p-2 text-center font-mono text-xs uppercase tracking-wider
                  text-text-muted border border-white/5
                  bg-white/[0.02] whitespace-nowrap
                "
              >
                {STAT_LABEL[raisedStat]}
              </th>

              {grid[rowIdx].map((nature, colIdx) => {
                const loweredStat = STAT_KEYS[colIdx];
                const isNeutral = nature?.neutral ?? true;

                const ariaLabel = nature
                  ? isNeutral
                    ? `${nature.nameEs} — naturaleza neutra`
                    : `${nature.nameEs} — sube ${STAT_LABEL[raisedStat]}, baja ${STAT_LABEL[loweredStat]}`
                  : 'Sin dato';

                return (
                  <td
                    key={loweredStat}
                    aria-label={ariaLabel}
                    className={[
                      'p-2 text-center border border-white/5',
                      'transition-colors duration-base ease-smooth',
                      isNeutral
                        ? 'bg-white/[0.03]'
                        : 'bg-white/[0.06] hover:bg-white/[0.11]',
                    ].join(' ')}
                  >
                    {nature ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={[
                            'font-display font-bold text-[11px] leading-tight',
                            isNeutral ? 'text-text-muted' : 'text-white',
                          ].join(' ')}
                        >
                          {nature.nameEs}
                        </span>

                        {!isNeutral && (
                          <div className="flex items-center gap-0.5" aria-hidden="true">
                            <span
                              className="font-mono text-[9px] leading-none font-bold"
                              style={{ color: '#00FF88' }}
                            >
                              &#x25B2;
                            </span>
                            <span className="font-mono text-[9px] leading-none font-bold text-accent-red">
                              &#x25BC;
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-text-muted text-[11px]">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Natures pill list ───────────────────────────────────────────────────────

function NaturesPillList() {
  const neutralNatures = naturesMock.filter((n) => n.neutral);
  const modifierNatures = naturesMock.filter((n) => !n.neutral);

  return (
    <div className="space-y-6">
      {/* Non-neutral group */}
      <div>
        <p
          className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted mb-3"
          id="natures-modifiers-label"
        >
          Naturalezas con modificadores
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-labelledby="natures-modifiers-label"
        >
          {modifierNatures.map((n) => (
            <div
              key={n.nameEn}
              role="listitem"
              title={`${n.nameEs}: sube ${n.raisedStat ? STAT_LABEL[n.raisedStat] : ''}, baja ${n.loweredStat ? STAT_LABEL[n.loweredStat] : ''}`}
              className="
                inline-flex items-center gap-1.5
                px-3 py-1.5 rounded-full
                bg-white/[0.06] border border-white/10
                hover:border-white/20 transition-colors duration-base
                cursor-default
              "
            >
              <span className="font-display font-bold text-xs text-white">
                {n.nameEs}
              </span>
              {n.raisedStat && (
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color: '#00FF88' }}
                  aria-hidden="true"
                >
                  &#x25B2;{STAT_LABEL[n.raisedStat]}
                </span>
              )}
              {n.loweredStat && (
                <span
                  className="font-mono text-[10px] font-bold text-accent-red"
                  aria-hidden="true"
                >
                  &#x25BC;{STAT_LABEL[n.loweredStat]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Neutral group */}
      <div>
        <p
          className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted mb-3"
          id="natures-neutral-label"
        >
          Naturalezas neutras
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-labelledby="natures-neutral-label"
        >
          {neutralNatures.map((n) => (
            <div
              key={n.nameEn}
              role="listitem"
              title={`${n.nameEs}: naturaleza neutra, sin efecto en stats`}
              className="
                inline-flex items-center
                px-3 py-1.5 rounded-full
                bg-white/[0.03] border border-white/[0.06]
                cursor-default
              "
            >
              <span className="font-display font-bold text-xs text-text-muted">
                {n.nameEs}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: Natures ──────────────────────────────────────────────────────

function NaturesSection() {
  const reducedMotion = !!useReducedMotion();
  const grid = buildNatureGrid(naturesMock);

  const headerMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: duration.fast },
        viewport,
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: duration.base, ease: easing },
        viewport,
      };

  const tableMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: duration.fast },
        viewport,
      }
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: duration.slow, ease: easing, delay: 0.1 },
        viewport,
      };

  const pillsMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: duration.fast },
        viewport,
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: duration.base, ease: easing, delay: 0.2 },
        viewport,
      };

  return (
    <section
      id="naturalezas"
      aria-labelledby="naturalezas-heading"
      className="relative py-16 lg:py-24"
    >
      <div className="container-app">
        {/* Decorative section number */}
        <span
          aria-hidden="true"
          className="
            font-display font-black select-none pointer-events-none
            text-[160px] lg:text-[220px] leading-none
            opacity-[0.04] blur-sm
            absolute -top-8 -left-2 lg:-left-4
            text-white
          "
        >
          02
        </span>

        {/* Header */}
        <motion.div className="relative mb-12" {...headerMotion}>
          <p className="eyebrow mb-4">Guía competitiva · Naturalezas</p>

          <h2
            id="naturalezas-heading"
            className="font-display font-black uppercase text-white leading-none tracking-tight mb-4"
            style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}
          >
            Las 25 Naturalezas
          </h2>

          <p className="font-body text-text-secondary text-base sm:text-lg max-w-2xl">
            Cada naturaleza modifica un stat base en +10% y otro en −10%. Las neutras no tienen efecto.
          </p>
        </motion.div>

        {/* 5×5 table */}
        <motion.div className="mb-10" {...tableMotion}>
          <h3 className="font-display font-bold text-base text-white mb-4">
            Tabla de naturalezas
          </h3>

          <NaturesTable grid={grid} />

          {/* Legend */}
          <div
            className="mt-4 flex items-center gap-6 flex-wrap"
            role="note"
            aria-label="Leyenda de la tabla de naturalezas"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="font-mono text-xs font-bold"
                style={{ color: '#00FF88' }}
              >
                &#x25B2;
              </span>
              <span className="font-body text-xs text-text-secondary">
                Stat que sube (+10%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="font-mono text-xs font-bold text-accent-red"
              >
                &#x25BC;
              </span>
              <span className="font-body text-xs text-text-secondary">
                Stat que baja (−10%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-3 h-3 rounded-sm bg-white/[0.03] border border-white/10"
              />
              <span className="font-body text-xs text-text-secondary">
                Naturaleza neutra
              </span>
            </div>
          </div>
        </motion.div>

        {/* Complete pill list */}
        <motion.div {...pillsMotion}>
          <h3 className="font-display font-bold text-base text-white mb-6">
            Lista completa
          </h3>
          <NaturesPillList />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Root client component ───────────────────────────────────────────────────

export function HabilidadesClient() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <AbilitiesSection />
        <hr className="border-white/[0.06] my-0" />
        <NaturesSection />
      </main>
      <Footer />
    </>
  );
}

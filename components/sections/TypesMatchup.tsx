'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { typeChart } from '@/lib/mock/type-chart';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { cn } from '@/lib/utils/cn';
import { reveal } from '@/lib/motion/tokens';
import type { PokemonType, Effectiveness } from '@/lib/types/pokemon';

const TYPE_ORDER: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

// Short 3-4 char abbreviations for column headers (vertical text)
const TYPE_ABBR: Record<PokemonType, string> = {
  normal:   'Nor',
  fire:     'Fue',
  water:    'Agu',
  electric: 'Elé',
  grass:    'Pla',
  ice:      'Hie',
  fighting: 'Luc',
  poison:   'Ven',
  ground:   'Tie',
  flying:   'Vol',
  psychic:  'Psi',
  bug:      'Bic',
  rock:     'Roc',
  ghost:    'Fan',
  dragon:   'Dra',
  dark:     'Sin',
  steel:    'Ace',
  fairy:    'Had',
};

function effectivenessClasses(eff: Effectiveness): string {
  if (eff === 2 || eff === 4)   return 'bg-green-600/50 text-white';
  if (eff === 0.5 || eff === 0.25) return 'bg-orange-600/40 text-white';
  if (eff === 0)                return 'bg-red-900/60 text-red-300';
  return 'bg-white/[0.03] text-text-muted';
}

function effectivenessLabel(eff: Effectiveness): string {
  if (eff === 0)    return '✗';
  if (eff === 0.25) return '¼';
  if (eff === 0.5)  return '½';
  if (eff === 1)    return '';
  if (eff === 2)    return '×2';
  if (eff === 4)    return '×4';
  return '';
}

// ─── Desktop 18×18 Table ────────────────────────────────────────────────────

function DesktopTable() {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  return (
    <div className="hidden lg:block overflow-x-auto rounded-card border border-border-soft">
      <table
        className="border-collapse min-w-max"
        aria-label="Tabla de efectividad de tipos Pokémon: filas son el tipo atacante, columnas son el tipo defensor"
      >
        <caption className="sr-only">
          Tabla de efectividad de tipos Pokémon: filas son el tipo atacante, columnas son el tipo defensor
        </caption>

        <thead>
          <tr>
            {/* Corner cell */}
            <th
              scope="col"
              className="w-10 h-12 bg-bg-elevated"
              aria-label="Atacante / Defensor"
            >
              <span className="sr-only">Atacante / Defensor</span>
            </th>

            {/* Column headers — defender types */}
            {TYPE_ORDER.map((colType, colIdx) => (
              <th
                key={colType}
                scope="col"
                className={cn(
                  'w-8 h-12 bg-bg-elevated font-mono text-[9px] font-bold uppercase',
                  'transition-colors duration-100',
                  hovered?.col === colIdx && 'bg-white/10',
                )}
                style={{ color: typeHexMap[colType] }}
                aria-label={typeNamesES[colType]}
              >
                {/* Vertical text via writing-mode inline style */}
                <span
                  className="block text-center leading-none px-0.5"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' } as React.CSSProperties}
                >
                  {TYPE_ABBR[colType]}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {TYPE_ORDER.map((rowType, rowIdx) => (
            <tr key={rowType}>
              {/* Row header — attacker type */}
              <th
                scope="row"
                className={cn(
                  'w-10 h-8 bg-bg-elevated font-mono text-[9px] font-bold uppercase text-right pr-1.5',
                  'transition-colors duration-100 whitespace-nowrap',
                  hovered?.row === rowIdx && 'bg-white/10',
                )}
                style={{ color: typeHexMap[rowType] }}
              >
                {TYPE_ABBR[rowType]}
              </th>

              {/* Effectiveness cells */}
              {TYPE_ORDER.map((colType, colIdx) => {
                const eff = typeChart[rowType][colType];
                const isRowHighlighted = hovered?.row === rowIdx;
                const isColHighlighted = hovered?.col === colIdx;
                const isTarget = hovered?.row === rowIdx && hovered?.col === colIdx;

                return (
                  <td
                    key={colType}
                    className={cn(
                      'w-8 h-8 text-center text-[10px] font-mono font-bold cursor-default select-none',
                      'transition-colors duration-100 border border-white/[0.04]',
                      effectivenessClasses(eff),
                      (isRowHighlighted || isColHighlighted) && 'brightness-125',
                      isTarget && 'ring-1 ring-white/50 ring-inset z-10 relative',
                    )}
                    onMouseEnter={() => setHovered({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${typeNamesES[rowType]} vs ${typeNamesES[colType]}: ×${eff}`}
                  >
                    {effectivenessLabel(eff)}
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

// ─── Mobile Dropdown + Row Grid ─────────────────────────────────────────────

function MobileView() {
  const [selectedType, setSelectedType] = useState<PokemonType>('normal');

  return (
    <div className="block lg:hidden space-y-6">
      {/* Dropdown */}
      <div className="space-y-2">
        <label
          htmlFor="type-selector"
          className="block font-body text-sm font-medium text-text-secondary"
        >
          Selecciona el tipo atacante:
        </label>
        <div className="relative">
          <select
            id="type-selector"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as PokemonType)}
            className={cn(
              'w-full appearance-none rounded-card px-4 py-3 pr-10',
              'bg-bg-elevated border border-border-soft',
              'font-body font-medium text-text-primary text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow',
              'transition-colors duration-base ease-smooth',
            )}
            style={{ color: typeHexMap[selectedType] }}
          >
            {TYPE_ORDER.map((t) => (
              <option key={t} value={t} style={{ color: typeHexMap[t], backgroundColor: '#12121a' }}>
                {typeNamesES[t]}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Selected type label */}
      <div className="flex items-center gap-3">
        <span
          className="inline-block w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: typeHexMap[selectedType] }}
          aria-hidden="true"
        />
        <span className="font-body text-sm text-text-secondary">
          <span className="font-medium" style={{ color: typeHexMap[selectedType] }}>
            {typeNamesES[selectedType]}
          </span>
          {' '}atacando a cada tipo defensor:
        </span>
      </div>

      {/* 6-column grid of 18 defender cells */}
      <div
        className="grid grid-cols-6 gap-2"
        role="list"
        aria-label={`Efectividad de ${typeNamesES[selectedType]} contra cada tipo`}
      >
        {TYPE_ORDER.map((defType) => {
          const eff = typeChart[selectedType][defType];
          return (
            <div
              key={defType}
              role="listitem"
              className={cn(
                'rounded-lg p-2 text-center flex flex-col items-center gap-1',
                'border border-white/[0.06]',
                effectivenessClasses(eff),
              )}
              aria-label={`vs ${typeNamesES[defType]}: ×${eff}`}
            >
              <span
                className="font-mono text-[8px] font-bold uppercase leading-none"
                style={{ color: typeHexMap[defType] }}
              >
                {TYPE_ABBR[defType]}
              </span>
              <span className="font-mono text-xs font-bold leading-none">
                {effectivenessLabel(eff) || '×1'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Legend ─────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-3 mt-6 font-body text-sm text-text-secondary"
      aria-label="Leyenda de colores de efectividad"
    >
      <span className="flex items-center gap-2">
        <span className="bg-green-600/50 px-2 py-0.5 rounded font-mono text-white text-xs">×2</span>
        Súper efectivo
      </span>
      <span className="flex items-center gap-2">
        <span className="bg-white/5 px-2 py-0.5 rounded font-mono text-text-muted text-xs">×1</span>
        Normal
      </span>
      <span className="flex items-center gap-2">
        <span className="bg-orange-600/40 px-2 py-0.5 rounded font-mono text-white text-xs">½</span>
        Poco efectivo
      </span>
      <span className="flex items-center gap-2">
        <span className="bg-red-900/60 px-2 py-0.5 rounded font-mono text-red-300 text-xs">✗</span>
        Inmune
      </span>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function TypesMatchup() {
  const headingId = 'types-matchup-heading';

  return (
    <section
      id="types-matchup"
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-labelledby={headingId}
    >
      <div className="container mx-auto max-w-7xl px-6 lg:px-12">

        {/* Decorative section number — per catalog §8 (no numbered section for types in catalog, using 06 per spec) */}
        <span
          className="pointer-events-none select-none absolute -top-4 left-6 lg:left-12 font-display font-black text-[clamp(6rem,20vw,16rem)] leading-none text-white opacity-[0.04] blur-sm"
          aria-hidden="true"
        >
          06
        </span>

        {/* Header */}
        <motion.div
          {...reveal}
          className="mb-12 lg:mb-16 relative z-10"
        >
          <p className="font-body text-xs font-medium uppercase tracking-[0.3em] text-text-secondary mb-4">
            Matchups · 18 tipos Pokémon
          </p>
          <h2
            id={headingId}
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1 }}
          >
            DOMINA LOS TIPOS
          </h2>
          <p className="font-body text-text-secondary text-base lg:text-lg mt-4 max-w-2xl">
            Fila = atacante. Columna = defensor.{' '}
            <span className="hidden lg:inline">Haz hover sobre una celda para ver el detalle.</span>
            <span className="lg:hidden">Selecciona un tipo atacante para ver su fila completa.</span>
          </p>
        </motion.div>

        {/* Table — desktop */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <DesktopTable />
          <MobileView />
          <Legend />
        </motion.div>

      </div>
    </section>
  );
}

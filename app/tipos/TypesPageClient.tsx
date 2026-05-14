'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { typeChart, getDualEffectiveness } from '@/lib/mock/type-chart';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import type { PokemonType, Effectiveness } from '@/lib/types/pokemon';
import { easing, duration, viewport } from '@/lib/motion/tokens';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_ORDER: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const TYPE_ABBR: Record<PokemonType, string> = {
  normal: 'Nor', fire: 'Fue', water: 'Agu', electric: 'Elé', grass: 'Pla', ice: 'Hie',
  fighting: 'Luc', poison: 'Ven', ground: 'Tie', flying: 'Vol', psychic: 'Psi', bug: 'Bic',
  rock: 'Roc', ghost: 'Fan', dragon: 'Dra', dark: 'Sin', steel: 'Ace', fairy: 'Had',
};

// ─── Cell helpers ─────────────────────────────────────────────────────────────

function cellLabel(eff: Effectiveness): string {
  if (eff === 0) return '✗';
  if (eff === 4) return '×4';
  if (eff === 2) return '×2';
  if (eff === 0.25) return '¼';
  if (eff === 0.5) return '½';
  return '';
}

function cellColors(eff: Effectiveness): string {
  if (eff >= 2) return 'bg-green-600/50 text-white';
  if (eff === 0) return 'bg-red-900/60 text-red-300';
  if (eff < 1) return 'bg-orange-600/40 text-white';
  return 'bg-white/[0.03] text-white/35';
}

function ariaLabel(attacker: PokemonType, defender: PokemonType, eff: Effectiveness): string {
  const attackerName = typeNamesES[attacker];
  const defenderName = typeNamesES[defender];
  if (eff === 0) return `${attackerName} vs ${defenderName}: inmune`;
  if (eff < 1) return `${attackerName} vs ${defenderName}: poco efectivo ×${eff}`;
  if (eff > 1) return `${attackerName} vs ${defenderName}: súper efectivo ×${eff}`;
  return `${attackerName} vs ${defenderName}: normal`;
}

// ─── Type Chart Table ─────────────────────────────────────────────────────────

function TypeChartTable() {
  const [hovered, setHovered] = useState<{ row: PokemonType; col: PokemonType } | null>(null);
  const [mobileAttacker, setMobileAttacker] = useState<PokemonType>('normal');
  const shouldReduceMotion = useReducedMotion();

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: duration.slow, ease: easing },
        viewport,
      };

  return (
    <section id="type-chart" className="py-16 lg:py-24">
      <div className="container-app">

        {/* Section header */}
        <motion.div className="relative mb-12 lg:mb-16" {...revealProps}>
          {/* Decorative "01" */}
          <span
            aria-hidden="true"
            className="absolute -top-4 left-0 font-display font-black select-none pointer-events-none leading-none"
            style={{
              fontSize: 'clamp(80px, 15vw, 160px)',
              opacity: 0.04,
              color: '#FFD700',
              letterSpacing: '-0.05em',
              zIndex: 0,
            }}
          >
            01
          </span>

          <div className="relative z-10">
            <p className="eyebrow mb-4">
              Efectividad de Tipos · 18 tipos Pokémon
            </p>
            <h1
              className="font-display font-black uppercase text-white"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1 }}
            >
              DOMINA LOS TIPOS
            </h1>
          </div>
        </motion.div>

        {/* ── DESKTOP TABLE (md+) ── */}
        <motion.div
          className="hidden md:block w-full overflow-x-auto"
          {...revealProps}
          style={
            shouldReduceMotion
              ? {}
              : { transitionDelay: '0.1s' }
          }
        >
          <table
            className="w-full table-fixed border-collapse"
            aria-label="Tabla de efectividad de tipos: filas = atacante, columnas = defensor"
          >
            <thead>
              <tr>
                {/* Empty corner cell */}
                <th
                  scope="col"
                  className="w-10 p-0"
                  aria-label="Atacante / Defensor"
                />
                {TYPE_ORDER.map((colType) => (
                  <th
                    key={colType}
                    scope="col"
                    className="p-0 h-20 align-bottom"
                    style={{ width: `calc((100% - 40px) / 18)` }}
                  >
                    <div
                      className="flex items-center justify-center h-full pb-1"
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}
                    >
                      <span
                        className="font-display font-bold text-[10px] uppercase leading-none transition-all duration-200"
                        style={{
                          color: typeHexMap[colType],
                          opacity: hovered?.col === colType ? 1 : 0.75,
                          filter:
                            hovered?.col === colType
                              ? `drop-shadow(0 0 6px ${typeHexMap[colType]})`
                              : 'none',
                        }}
                      >
                        {TYPE_ABBR[colType]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPE_ORDER.map((rowType) => (
                <tr key={rowType}>
                  {/* Row header */}
                  <th
                    scope="row"
                    className="p-0 w-10 h-7 text-right pr-1"
                  >
                    <span
                      className="font-display font-bold text-[10px] uppercase leading-none transition-all duration-200"
                      style={{
                        color: typeHexMap[rowType],
                        opacity: hovered?.row === rowType ? 1 : 0.75,
                        filter:
                          hovered?.row === rowType
                            ? `drop-shadow(0 0 6px ${typeHexMap[rowType]})`
                            : 'none',
                      }}
                    >
                      {TYPE_ABBR[rowType]}
                    </span>
                  </th>
                  {/* Data cells */}
                  {TYPE_ORDER.map((colType) => {
                    const eff = typeChart[rowType][colType];
                    const isHighlighted =
                      hovered?.row === rowType || hovered?.col === colType;
                    return (
                      <td
                        key={colType}
                        className={[
                          'h-7 p-0 text-center cursor-default transition-all duration-150',
                          cellColors(eff),
                          isHighlighted ? 'brightness-125' : '',
                          'border border-white/[0.04]',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onMouseEnter={() =>
                          setHovered({ row: rowType, col: colType })
                        }
                        onMouseLeave={() => setHovered(null)}
                        aria-label={ariaLabel(rowType, colType, eff)}
                      >
                        <span className="font-mono text-[10px] font-medium leading-none select-none">
                          {cellLabel(eff)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* ── MOBILE VIEW (< md) ── */}
        <motion.div className="md:hidden" {...revealProps}>
          <div className="mb-6">
            <label
              htmlFor="mobile-attacker-select"
              className="block font-body text-sm text-text-secondary mb-2"
            >
              Selecciona tipo atacante:
            </label>
            <select
              id="mobile-attacker-select"
              value={mobileAttacker}
              onChange={(e) => setMobileAttacker(e.target.value as PokemonType)}
              className="w-full glass-card px-4 py-3 font-body text-white text-sm rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] appearance-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)' }}
              aria-label="Tipo atacante para ver efectividad"
            >
              {TYPE_ORDER.map((t) => (
                <option key={t} value={t} style={{ background: '#12121a' }}>
                  {typeNamesES[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile grid: 6 columns of defenders */}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
            role="table"
            aria-label={`Efectividad de ${typeNamesES[mobileAttacker]} como atacante`}
          >
            {TYPE_ORDER.map((defType) => {
              const eff = typeChart[mobileAttacker][defType];
              return (
                <div
                  key={defType}
                  role="cell"
                  className={[
                    'flex flex-col items-center justify-center gap-1 rounded-lg p-2',
                    cellColors(eff),
                    'border border-white/[0.06]',
                  ].join(' ')}
                  aria-label={ariaLabel(mobileAttacker, defType, eff)}
                >
                  <span
                    className="font-display font-bold text-[9px] uppercase leading-none"
                    style={{ color: typeHexMap[defType] }}
                  >
                    {TYPE_ABBR[defType]}
                  </span>
                  <span className="font-mono text-[11px] font-medium leading-none">
                    {cellLabel(eff) || '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
          {...revealProps}
        >
          {[
            { label: '×2 / ×4  Súper efectivo', cls: 'bg-green-600/50' },
            { label: '×1  Normal', cls: 'bg-white/[0.06]' },
            { label: '½ / ¼  Poco efectivo', cls: 'bg-orange-600/40' },
            { label: '✗  Inmune', cls: 'bg-red-900/60' },
          ].map(({ label, cls }) => (
            <span key={label} className="flex items-center gap-2 font-body text-xs text-text-secondary">
              <span
                className={`inline-block w-3 h-3 rounded-sm ${cls} border border-white/10`}
                aria-hidden="true"
              />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Defense Calculator ───────────────────────────────────────────────────────

function TypePillButton({
  type,
  selected,
  onClick,
}: {
  type: PokemonType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${typeNamesES[type]}${selected ? ' (seleccionado)' : ''}`}
      className={[
        'px-3 py-1.5 rounded-full font-body font-medium text-xs text-white transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]',
        selected ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0a0a0f]' : 'opacity-60 hover:opacity-90',
      ].join(' ')}
      style={{ backgroundColor: typeHexMap[type] }}
    >
      {typeNamesES[type]}
    </button>
  );
}

interface DefenseGroup {
  label: string;
  indicator: string;
  types: { type: PokemonType; eff: Effectiveness }[];
}

function DefenseCalculator() {
  const [type1, setType1] = useState<PokemonType | null>(null);
  const [type2, setType2] = useState<PokemonType | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: duration.slow, ease: easing },
        viewport,
      };

  function handleType1Click(t: PokemonType) {
    setType1((prev) => (prev === t ? null : t));
    if (type2 === t) setType2(null);
  }

  function handleType2Click(t: PokemonType) {
    if (t === type1) return;
    setType2((prev) => (prev === t ? null : t));
  }

  const defenseData: DefenseGroup[] | null = type1
    ? (() => {
        const defenders: [PokemonType] | [PokemonType, PokemonType] = type2
          ? [type1, type2]
          : [type1];

        const allResults = TYPE_ORDER.map((attacker) => ({
          type: attacker,
          eff: getDualEffectiveness(attacker, defenders),
        }));

        const weak = allResults
          .filter((r) => r.eff > 1)
          .sort((a, b) => b.eff - a.eff);
        const resists = allResults
          .filter((r) => r.eff < 1 && r.eff > 0)
          .sort((a, b) => a.eff - b.eff);
        const immune = allResults.filter((r) => r.eff === 0);
        const normal = allResults.filter((r) => r.eff === 1);

        return [
          { label: 'Débil a', indicator: '🔴', types: weak },
          { label: 'Resiste', indicator: '🟠', types: resists },
          { label: 'Inmune a', indicator: '⚫', types: immune },
          { label: 'Normal', indicator: '⚪', types: normal },
        ];
      })()
    : null;

  return (
    <section id="defense-calculator" className="py-16 lg:py-24 border-t border-white/[0.06]">
      <div className="container-app">

        {/* Section header */}
        <motion.div className="relative mb-12 lg:mb-16" {...revealProps}>
          {/* Decorative "02" */}
          <span
            aria-hidden="true"
            className="absolute -top-4 left-0 font-display font-black select-none pointer-events-none leading-none"
            style={{
              fontSize: 'clamp(80px, 15vw, 160px)',
              opacity: 0.04,
              color: '#00BFFF',
              letterSpacing: '-0.05em',
              zIndex: 0,
            }}
          >
            02
          </span>
          <div className="relative z-10">
            <p className="eyebrow mb-4">
              Perspectiva defensor
            </p>
            <h2
              className="font-display font-black uppercase text-white"
              style={{ fontSize: 'clamp(32px, 4vw, 60px)', lineHeight: 1 }}
            >
              Calculadora de Defensa
            </h2>
            <p className="mt-4 font-body text-text-secondary text-base max-w-xl">
              Elige 1 o 2 tipos de tu Pokémon para ver a qué ataques es débil,
              qué resiste y contra qué es inmune.
            </p>
          </div>
        </motion.div>

        {/* Type selectors */}
        <motion.div className="space-y-8 mb-12" {...revealProps}>

          {/* Tipo 1 */}
          <fieldset>
            <legend className="font-body text-sm font-medium text-text-secondary mb-4">
              Tipo 1{' '}
              <span className="text-text-muted text-xs">(requerido)</span>
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Selección de Tipo 1">
              {TYPE_ORDER.map((t) => (
                <TypePillButton
                  key={t}
                  type={t}
                  selected={type1 === t}
                  onClick={() => handleType1Click(t)}
                />
              ))}
            </div>
          </fieldset>

          {/* Tipo 2 */}
          <fieldset>
            <legend className="font-body text-sm font-medium text-text-secondary mb-4">
              Tipo 2{' '}
              <span className="text-text-muted text-xs">(opcional)</span>
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Selección de Tipo 2">
              {/* Ninguno button */}
              <button
                type="button"
                onClick={() => setType2(null)}
                aria-pressed={type2 === null}
                className={[
                  'px-3 py-1.5 rounded-full font-body font-medium text-xs text-white',
                  'border border-white/20 transition-all duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]',
                  type2 === null
                    ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0a0a0f] bg-white/10'
                    : 'opacity-60 hover:opacity-90 bg-transparent',
                ].join(' ')}
              >
                Ninguno
              </button>
              {TYPE_ORDER.filter((t) => t !== type1).map((t) => (
                <TypePillButton
                  key={t}
                  type={t}
                  selected={type2 === t}
                  onClick={() => handleType2Click(t)}
                />
              ))}
            </div>
          </fieldset>
        </motion.div>

        {/* Results or placeholder */}
        {!type1 ? (
          <motion.div
            className="glass-card p-8 text-center"
            {...revealProps}
          >
            <p className="font-body text-text-secondary">
              Selecciona al menos un tipo para ver la calculadora.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${type1}-${type2 ?? 'none'}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easing }}
          >
            {/* Selected type summary */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="font-body text-sm text-text-secondary">Analizando defensa de:</span>
              <span
                className="px-4 py-1.5 rounded-full font-body font-medium text-sm text-white"
                style={{ backgroundColor: typeHexMap[type1] }}
              >
                {typeNamesES[type1]}
              </span>
              {type2 && (
                <>
                  <span className="text-text-muted font-mono text-sm">+</span>
                  <span
                    className="px-4 py-1.5 rounded-full font-body font-medium text-sm text-white"
                    style={{ backgroundColor: typeHexMap[type2] }}
                  >
                    {typeNamesES[type2]}
                  </span>
                </>
              )}
            </div>

            {/* Defense groups grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {defenseData!.map(({ label, indicator, types }) => (
                <div key={label} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span aria-hidden="true" className="text-base leading-none">{indicator}</span>
                    <h3 className="font-display font-bold text-sm uppercase tracking-wide text-white">
                      {label}
                    </h3>
                    <span className="ml-auto font-mono text-xs text-text-muted">
                      {types.length}
                    </span>
                  </div>

                  {types.length === 0 ? (
                    <p className="font-body text-xs text-text-muted">Ninguno</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {types.map(({ type, eff }) => (
                        <div key={type} className="flex flex-col items-center gap-0.5">
                          <span
                            className="px-2.5 py-1 rounded-full font-body font-medium text-xs text-white"
                            style={{ backgroundColor: typeHexMap[type] }}
                          >
                            {typeNamesES[type]}
                          </span>
                          <span className="font-mono text-[10px] text-text-muted leading-none">
                            {eff === 0
                              ? '✗'
                              : eff === 4
                              ? '×4'
                              : eff === 2
                              ? '×2'
                              : eff === 0.25
                              ? '¼'
                              : eff === 0.5
                              ? '½'
                              : '×1'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Composed page ─────────────────────────────────────────────────────────────

export default function TypesPageClient() {
  return (
    <>
      <TypeChartTable />
      <DefenseCalculator />
    </>
  );
}

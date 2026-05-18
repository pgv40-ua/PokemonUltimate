'use client';

import type { FC } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { abilitiesMock } from '@/lib/mock/abilities';
import { naturesMock } from '@/lib/mock/natures';
import type { Nature } from '@/lib/types/pokemon';

// Canonical 5×5 row/column order for the natures grid
const STAT_KEYS = ['attack', 'defense', 'speed', 'spAttack', 'spDefense'] as const;
type NatureStat = (typeof STAT_KEYS)[number];

const STAT_LABEL: Record<NatureStat, string> = {
  attack: 'ATK',
  defense: 'DEF',
  speed: 'VEL',
  spAttack: 'ATE',
  spDefense: 'DES',
};

// Build a lookup so we can render cells in row-major order
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

// Ability icon — purely decorative SVG, no alt needed
function AbilityIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    // Eye with strike (hidden ability indicator)
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="shrink-0 mt-0.5 text-accent-purple"
      >
        <path
          d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="17" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  // Lightning bolt for regular abilities
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 mt-0.5 text-accent-yellow"
    >
      <path
        d="M11 2L4 11h6l-1 7 7-9h-6l1-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const AbilitiesNatures: FC = () => {
  const grid = buildNatureGrid(naturesMock);

  return (
    <section
      id="abilities-natures"
      className="relative py-24 lg:py-32"
      aria-labelledby="abilities-natures-heading"
    >
      <div className="container-app">
        {/* ── Section header ─────────────────────────────────────── */}
        <div className="relative mb-16" data-section-num="07">

          <Reveal>
            <p className="eyebrow mb-4">Guía competitiva &middot; Temporada actual</p>

            <h2
              id="abilities-natures-heading"
              className="
                font-display font-black uppercase
                text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                text-white leading-none tracking-tight
                max-w-3xl
              "
            >
              Construye tu equipo perfecto
            </h2>

            <p className="mt-5 font-body text-text-secondary text-base sm:text-lg max-w-xl">
              Las habilidades y naturalezas que marcan la diferencia en el meta.
            </p>
          </Reveal>
        </div>

        {/* ── Two-column layout ───────────────────────────────────── */}
        <Reveal stagger={0.12} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* ═══════════════════════════════════════════════════════
              Column 1 — Abilities
          ════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-6">
              Habilidades clave
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {abilitiesMock.map((ability) => (
                <li key={ability.slug}>
                  <Card
                    as="article"
                    className="
                      p-4 flex gap-3 items-start
                      hover:border-border-strong
                      focus-within:ring-2 focus-within:ring-accent-yellow focus-within:ring-offset-2 focus-within:ring-offset-bg
                    "
                  >
                    {/* Decorative icon */}
                    <AbilityIcon hidden={ability.hidden} />

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-display font-bold text-white text-sm sm:text-base leading-tight">
                          {ability.nameEs}
                        </span>
                        {ability.hidden && (
                          <Badge color="purple" size="sm" aria-label="Habilidad oculta">
                            Oculta
                          </Badge>
                        )}
                      </div>
                      <p className="font-body text-sm text-text-secondary leading-relaxed">
                        {ability.description}
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          {/* ═══════════════════════════════════════════════════════
              Column 2 — Natures 5×5
          ════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-6">
              Naturalezas
            </h3>

            {/* Overflow wrapper — table scrolls horizontally on narrow viewports */}
            <div className="overflow-x-auto rounded-xl">
              <table
                className="w-full min-w-[340px] border-collapse"
                aria-label="Tabla de naturalezas: filas indican el stat que sube, columnas el stat que baja"
              >
                <caption className="sr-only">
                  Tabla de 25 naturalezas Pokémon. Cada fila corresponde al stat que aumenta y
                  cada columna al stat que disminuye. Las naturalezas neutras no modifican ningún
                  stat. El stat que sube se muestra en verde y el que baja en rojo.
                </caption>

                <thead>
                  <tr>
                    {/* Top-left corner cell — describes both axes */}
                    <th
                      scope="col"
                      className="
                        p-2 text-center font-mono text-[10px] uppercase tracking-wider
                        text-text-muted border border-white/5
                        bg-white/[0.02]
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
                          p-2 text-center font-mono text-[10px] uppercase tracking-wider
                          text-text-muted border border-white/5
                          bg-white/[0.02]
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
                      {/* Row header — stat that goes up */}
                      <th
                        scope="row"
                        className="
                          p-2 text-center font-mono text-[10px] uppercase tracking-wider
                          text-text-muted border border-white/5
                          bg-white/[0.02]
                          whitespace-nowrap
                        "
                      >
                        {STAT_LABEL[raisedStat]}
                      </th>

                      {grid[rowIdx].map((nature, colIdx) => {
                        const loweredStat = STAT_KEYS[colIdx];
                        const isNeutral = nature?.neutral ?? true;

                        // Determine aria-label for accessibility
                        const ariaLabel = nature
                          ? isNeutral
                            ? `${nature.nameEs} — naturaleza neutra`
                            : `${nature.nameEs} — sube ${STAT_LABEL[raisedStat]}, baja ${STAT_LABEL[loweredStat]}`
                          : 'Sin dato';

                        return (
                          <td
                            key={loweredStat}
                            aria-label={ariaLabel}
                            className={`
                              p-1.5 text-center border border-white/5
                              transition-colors duration-base ease-smooth
                              ${isNeutral
                                ? 'bg-white/[0.03]'
                                : 'bg-white/[0.06] hover:bg-white/[0.10]'
                              }
                            `}
                          >
                            {nature ? (
                              <div className="flex flex-col items-center gap-0.5">
                                {/* Nature name */}
                                <span
                                  className={`
                                    font-display font-bold text-[10px] leading-tight
                                    ${isNeutral ? 'text-text-muted' : 'text-white'}
                                  `}
                                >
                                  {nature.nameEs}
                                </span>

                                {/* Stat indicators — only for non-neutral */}
                                {!isNeutral && (
                                  <div className="flex items-center gap-0.5">
                                    {/* Raised stat — green */}
                                    <span
                                      aria-hidden="true"
                                      className="font-mono text-[9px] leading-none font-bold"
                                      style={{ color: '#00FF88' }}
                                      title={`Sube ${STAT_LABEL[raisedStat]}`}
                                    >
                                      &#x25B2;
                                    </span>
                                    {/* Lowered stat — accent-red */}
                                    <span
                                      aria-hidden="true"
                                      className="font-mono text-[9px] leading-none font-bold text-accent-red"
                                      title={`Baja ${STAT_LABEL[loweredStat]}`}
                                    >
                                      &#x25BC;
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-text-muted text-[10px]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div
              className="mt-4 flex items-center gap-5 flex-wrap"
              role="note"
              aria-label="Leyenda de colores de la tabla"
            >
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] font-bold"
                  style={{ color: '#00FF88' }}
                >
                  &#x25B2;
                </span>
                <span className="font-body text-xs text-text-secondary">Stat que sube (+10%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] font-bold text-accent-red"
                >
                  &#x25BC;
                </span>
                <span className="font-body text-xs text-text-secondary">Stat que baja (−10%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-block w-3 h-3 rounded-sm bg-white/[0.03] border border-white/10"
                />
                <span className="font-body text-xs text-text-secondary">Naturaleza neutra</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA — link to full habilidades page */}
        <div className="mt-12 flex justify-center">
          <a
            href="/habilidades"
            className="inline-flex items-center gap-2 border border-[#FFD700]/50 text-[#FFD700] px-6 py-3 rounded-full font-body font-medium text-sm hover:bg-[#FFD700]/10 transition-colors duration-base ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
          >
            Ver guía completa de habilidades y naturalezas
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

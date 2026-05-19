'use client';

import { useMemo, useState } from 'react';
import type { MoveDetail, PokemonType } from '@/lib/types/pokemon';
import { pickTopMoves } from '@/lib/api/derivations';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { cn } from '@/lib/utils/cn';

interface MovesetTableProps {
  moves: MoveDetail[];
  types: [PokemonType] | [PokemonType, PokemonType];
}

const CATEGORY_LABEL: Record<MoveDetail['category'], string> = {
  physical: 'Físico',
  special: 'Especial',
  status: 'Estado',
};

const CATEGORY_TONE: Record<MoveDetail['category'], string> = {
  physical: 'bg-accent-red/15 text-accent-red border-accent-red/40',
  special: 'bg-accent-blue/15 text-accent-blue border-accent-blue/40',
  status: 'bg-white/5 text-text-secondary border-white/15',
};

export function MovesetTable({ moves, types }: MovesetTableProps) {
  const [typeFilter, setTypeFilter] = useState<PokemonType | 'all'>('all');

  const levelUpMoves = useMemo(
    () =>
      moves
        .filter((m) => m.learnMethod === 'level-up')
        .sort((a, b) => (a.learnLevel ?? 0) - (b.learnLevel ?? 0)),
    [moves],
  );

  const topMoves = useMemo(() => pickTopMoves(moves, types, 4), [moves, types]);

  const presentTypes = useMemo(() => {
    const set = new Set<PokemonType>();
    for (const m of levelUpMoves) set.add(m.type);
    return Array.from(set).sort();
  }, [levelUpMoves]);

  const filteredLevelUp = useMemo(
    () =>
      typeFilter === 'all'
        ? levelUpMoves
        : levelUpMoves.filter((m) => m.type === typeFilter),
    [levelUpMoves, typeFilter],
  );

  if (moves.length === 0) {
    return (
      <section className="relative py-16 lg:py-20" aria-labelledby="moves-heading">
        <div className="container-app">
          <div className="mb-6">
            <p className="eyebrow mb-2">Movimientos</p>
            <h2
              id="moves-heading"
              className="font-display font-black uppercase text-text-primary"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
            >
              Movimientos
            </h2>
          </div>
          <p className="font-body text-text-secondary italic">
            Sin datos de movimientos disponibles.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 lg:py-20" aria-labelledby="moves-heading">
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Movimientos</p>
          <h2
            id="moves-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Set de movimientos
          </h2>
        </div>

        {topMoves.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display font-bold text-xl text-text-primary mb-4 uppercase tracking-wide">
              Mejores movimientos
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topMoves.map((m) => (
                <li key={m.slug}>
                  <article
                    className="glass-card p-4 h-full flex flex-col gap-2 ring-1 ring-accent-yellow/30"
                    style={{ '--glow-color': `${typeHexMap[m.type]}55` } as React.CSSProperties}
                  >
                    <header className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-bold text-text-primary text-base leading-tight">
                        {m.nameEs}
                      </h4>
                      <TypePill type={m.type} />
                    </header>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border',
                          CATEGORY_TONE[m.category],
                        )}
                      >
                        {CATEGORY_LABEL[m.category]}
                      </span>
                    </div>
                    <dl className="grid grid-cols-3 gap-2 pt-2 mt-auto border-t border-border-soft text-center">
                      <Stat label="Pot." value={m.power ?? '—'} />
                      <Stat label="Prec." value={m.accuracy != null ? `${m.accuracy}%` : '—'} />
                      <Stat label="PP" value={m.pp} />
                    </dl>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="font-display font-bold text-xl text-text-primary uppercase tracking-wide">
              Aprende por nivel
            </h3>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtro por tipo">
              <FilterPill active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
                Todos
              </FilterPill>
              {presentTypes.map((t) => (
                <FilterPill
                  key={t}
                  active={typeFilter === t}
                  onClick={() => setTypeFilter(t)}
                  type={t}
                >
                  {typeNamesES[t]}
                </FilterPill>
              ))}
            </div>
          </div>

          {filteredLevelUp.length === 0 ? (
            <p className="font-body text-text-secondary italic">
              No hay movimientos por nivel para este filtro.
            </p>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-text-muted font-mono uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Nv.</th>
                      <th className="px-4 py-3 text-left">Movimiento</th>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Cat.</th>
                      <th className="px-4 py-3 text-right">Pot.</th>
                      <th className="px-4 py-3 text-right">Prec.</th>
                      <th className="px-4 py-3 text-right">PP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLevelUp.map((m, i) => (
                      <tr
                        key={`${m.slug}-${m.learnLevel ?? i}`}
                        className="border-t border-border-soft hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3 font-mono tabular-nums text-text-secondary">
                          {m.learnLevel ?? '—'}
                        </td>
                        <td className="px-4 py-3 font-display font-bold text-text-primary">
                          {m.nameEs}
                        </td>
                        <td className="px-4 py-3">
                          <TypePill type={m.type} />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border',
                              CATEGORY_TONE[m.category],
                            )}
                          >
                            {CATEGORY_LABEL[m.category]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-text-secondary">
                          {m.power ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-text-secondary">
                          {m.accuracy != null ? `${m.accuracy}%` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-text-secondary">
                          {m.pp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="md:hidden divide-y divide-border-soft">
                {filteredLevelUp.map((m, i) => (
                  <li key={`${m.slug}-${m.learnLevel ?? i}`} className="p-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display font-bold text-text-primary">{m.nameEs}</p>
                        <p className="font-mono text-xs text-text-muted">
                          Nv. {m.learnLevel ?? '—'}
                        </p>
                      </div>
                      <TypePill type={m.type} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-secondary">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full uppercase border',
                          CATEGORY_TONE[m.category],
                        )}
                      >
                        {CATEGORY_LABEL[m.category]}
                      </span>
                      <span>Pot. {m.power ?? '—'}</span>
                      <span>Prec. {m.accuracy != null ? `${m.accuracy}%` : '—'}</span>
                      <span>PP {m.pp}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="font-mono text-[10px] text-text-muted uppercase">{label}</dt>
      <dd className="font-mono text-sm text-text-primary tabular-nums">{value}</dd>
    </div>
  );
}

function TypePill({ type }: { type: PokemonType }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-medium text-white"
      style={{ backgroundColor: typeHexMap[type] }}
    >
      {typeNamesES[type]}
    </span>
  );
}

function FilterPill({
  active,
  onClick,
  type,
  children,
}: {
  active: boolean;
  onClick: () => void;
  type?: PokemonType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-body font-medium border transition-all',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
        active
          ? 'text-white border-white/30 scale-105'
          : 'text-text-secondary border-white/10 hover:border-white/20 opacity-70 hover:opacity-100',
      )}
      style={
        active && type
          ? { backgroundColor: typeHexMap[type] }
          : active
          ? { backgroundColor: 'rgba(255,255,255,0.1)' }
          : undefined
      }
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

import type { PokemonType, StatBlock } from '@/lib/types/pokemon';
import { StatBar } from '@/components/ui/StatBar';
import { typeHexMap } from '@/lib/utils/typeColors';

interface StatsPanelProps {
  stats: StatBlock;
  primaryType: PokemonType;
}

const STAT_LABELS: { key: keyof StatBlock; label: string; full: string }[] = [
  { key: 'hp',        label: 'HP',  full: 'Puntos de Salud' },
  { key: 'attack',    label: 'ATK', full: 'Ataque' },
  { key: 'defense',   label: 'DEF', full: 'Defensa' },
  { key: 'spAttack',  label: 'SPA', full: 'Ataque Especial' },
  { key: 'spDefense', label: 'SPD', full: 'Defensa Especial' },
  { key: 'speed',     label: 'SPE', full: 'Velocidad' },
];

export function StatsPanel({ stats, primaryType }: StatsPanelProps) {
  const total = Object.values(stats).reduce((sum, v) => sum + v, 0);
  const hex = typeHexMap[primaryType];

  return (
    <section
      className="relative py-16 lg:py-20"
      aria-labelledby="stats-heading"
    >
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Estadísticas base</p>
          <h2
            id="stats-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Stats de combate
          </h2>
        </div>

        <div
          className="glass-card p-6 lg:p-8 max-w-3xl"
          style={{ '--glow-color': `${hex}40` } as React.CSSProperties}
        >
          <div className="space-y-4">
            {STAT_LABELS.map((s) => (
              <div key={s.key} className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
                <span className="font-body text-sm text-text-secondary">
                  {s.full}
                </span>
                <StatBar
                  label={s.label}
                  value={stats[s.key]}
                  max={255}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border-soft flex items-center justify-between">
            <span className="font-display font-bold text-text-primary uppercase tracking-wide">
              Total
            </span>
            <span
              className="font-mono font-bold text-3xl tabular-nums"
              style={{ color: hex }}
            >
              {total}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

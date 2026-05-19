import type { Effectiveness, PokemonType } from '@/lib/types/pokemon';
import { TypeIcon } from '@/components/ui/TypeIcon';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { cn } from '@/lib/utils/cn';

interface WeaknessGridProps {
  weaknesses: Record<PokemonType, Effectiveness>;
}

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

function bucketLabel(eff: Effectiveness): string {
  if (eff === 0) return 'Inmune';
  if (eff === 4) return '4×';
  if (eff === 2) return '2×';
  if (eff === 0.5) return '½×';
  if (eff === 0.25) return '¼×';
  return '1×';
}

function bucketTone(eff: Effectiveness): string {
  if (eff === 4) return 'bg-accent-red/30 border-accent-red/60 text-accent-red';
  if (eff === 2) return 'bg-accent-red/15 border-accent-red/40 text-accent-red';
  if (eff === 0.5) return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
  if (eff === 0.25) return 'bg-emerald-500/30 border-emerald-500/60 text-emerald-200';
  if (eff === 0) return 'bg-white/5 border-white/15 text-text-muted';
  return 'bg-white/5 border-white/10 text-text-secondary';
}

export function WeaknessGrid({ weaknesses }: WeaknessGridProps) {
  const entries = ALL_TYPES.map((t) => ({ type: t, eff: weaknesses[t] }));

  const weak = entries.filter((e) => e.eff > 1);
  const resists = entries.filter((e) => e.eff < 1 && e.eff > 0);
  const immune = entries.filter((e) => e.eff === 0);

  weak.sort((a, b) => b.eff - a.eff);
  resists.sort((a, b) => a.eff - b.eff);

  return (
    <section
      className="relative py-16 lg:py-20"
      aria-labelledby="weakness-heading"
    >
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Defensa por tipo</p>
          <h2
            id="weakness-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Debilidades y resistencias
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          <WeaknessColumn title="Debilidades" subtitle="Recibe más daño" items={weak} emptyText="Sin debilidades notables" />
          <WeaknessColumn title="Resistencias" subtitle="Recibe menos daño" items={resists} emptyText="Sin resistencias notables" />
          <WeaknessColumn title="Inmunidades" subtitle="No recibe daño" items={immune} emptyText="No es inmune a ningún tipo" />
        </div>
      </div>
    </section>
  );
}

function WeaknessColumn({
  title,
  subtitle,
  items,
  emptyText,
}: {
  title: string;
  subtitle: string;
  items: { type: PokemonType; eff: Effectiveness }[];
  emptyText: string;
}) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <header>
        <h3 className="font-display font-bold text-lg text-text-primary uppercase">
          {title}
        </h3>
        <p className="text-xs text-text-muted font-mono uppercase tracking-wide">
          {subtitle}
        </p>
      </header>
      {items.length === 0 ? (
        <p className="font-body text-sm text-text-muted italic">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map(({ type, eff }) => (
            <li
              key={type}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2 rounded-lg border',
                bucketTone(eff),
              )}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                  style={{ backgroundColor: typeHexMap[type] }}
                >
                  <TypeIcon type={type} size={12} className="text-white" />
                </span>
                <span className="font-body text-sm text-text-primary">
                  {typeNamesES[type]}
                </span>
              </span>
              <span className="font-mono text-sm font-bold tabular-nums">
                {bucketLabel(eff)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

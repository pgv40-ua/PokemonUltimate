import type { Ability } from '@/lib/types/pokemon';
import { cn } from '@/lib/utils/cn';

interface AbilitiesPanelProps {
  abilities: Ability[];
  bestSlug: string;
}

export function AbilitiesPanel({ abilities, bestSlug }: AbilitiesPanelProps) {
  if (abilities.length === 0) return null;

  return (
    <section
      className="relative py-16 lg:py-20"
      aria-labelledby="abilities-heading"
    >
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Habilidades</p>
          <h2
            id="abilities-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Habilidades disponibles
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {abilities.map((a) => {
            const isBest = a.slug === bestSlug;
            return (
              <li key={a.slug}>
                <article
                  className={cn(
                    'glass-card p-6 h-full flex flex-col gap-3 transition-all',
                    isBest && 'ring-2 ring-accent-yellow/60 shadow-glow-yellow',
                  )}
                >
                  <header className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-bold text-xl text-text-primary">
                      {a.nameEs}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      {a.hidden && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono uppercase bg-accent-purple/20 text-accent-purple border border-accent-purple/40">
                          Oculta
                        </span>
                      )}
                      {isBest && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono uppercase bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/40">
                          Recomendada
                        </span>
                      )}
                    </div>
                  </header>
                  <p className="font-body text-sm text-text-secondary leading-relaxed">
                    {a.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

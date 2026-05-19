import type { EncounterByGame } from '@/lib/types/pokemon';

interface EncountersListProps {
  encounters: EncounterByGame[];
}

function titleCase(s: string): string {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export function EncountersList({ encounters }: EncountersListProps) {
  return (
    <section className="relative py-16 lg:py-24" aria-labelledby="encounters-heading">
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Dónde encontrarlo</p>
          <h2
            id="encounters-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Ubicaciones por juego
          </h2>
        </div>

        {encounters.length === 0 ? (
          <div className="glass-card p-6 lg:p-8 max-w-2xl">
            <p className="font-body text-text-secondary">
              No tiene ubicaciones registradas en estado salvaje. Probablemente
              solo se obtiene mediante <strong className="text-text-primary">evento especial</strong>,{' '}
              <strong className="text-text-primary">intercambio</strong> o{' '}
              <strong className="text-text-primary">evolución</strong>.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {encounters.map((e) => (
              <li key={e.game}>
                <article className="glass-card p-5 h-full flex flex-col gap-3">
                  <header>
                    <h3 className="font-display font-bold text-text-primary text-lg">
                      Pokémon {e.game}
                    </h3>
                    <p className="font-mono text-xs text-text-muted">
                      {e.locationsEs.length} {e.locationsEs.length === 1 ? 'ubicación' : 'ubicaciones'}
                    </p>
                  </header>
                  <ul className="flex flex-wrap gap-1.5">
                    {e.locationsEs.map((loc) => (
                      <li
                        key={loc}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-body text-text-secondary"
                      >
                        {titleCase(loc)}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

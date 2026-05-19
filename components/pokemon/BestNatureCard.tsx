import type { StatBlock } from '@/lib/types/pokemon';
import { pickBestNature, describeNatureBoost } from '@/lib/api/derivations';

interface BestNatureCardProps {
  stats: StatBlock;
}

export function BestNatureCard({ stats }: BestNatureCardProps) {
  const { nature, reason } = pickBestNature(stats);
  const { raisedLabel, loweredLabel } = describeNatureBoost(nature);

  return (
    <section
      className="relative py-16 lg:py-20"
      aria-labelledby="nature-heading"
    >
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Naturaleza recomendada</p>
          <h2
            id="nature-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Mejor naturaleza
          </h2>
        </div>

        <article className="glass-card p-6 lg:p-8 max-w-2xl">
          <header className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-display font-black text-3xl lg:text-4xl text-text-primary uppercase">
              {nature.nameEs}
            </h3>
            {nature.neutral && (
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 border border-white/15 text-text-muted">
                Versátil
              </span>
            )}
          </header>

          <p className="font-body text-text-secondary text-sm uppercase tracking-wide">
            En inglés: {nature.nameEn}
          </p>

          {raisedLabel && loweredLabel && (
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-body">
                <span aria-hidden="true">▲</span>
                <span>+10% {raisedLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-red/15 border border-accent-red/40 text-accent-red text-sm font-body">
                <span aria-hidden="true">▼</span>
                <span>−10% {loweredLabel}</span>
              </span>
            </div>
          )}

          <p className="mt-6 font-body text-text-secondary leading-relaxed">
            {reason}
          </p>
        </article>
      </div>
    </section>
  );
}

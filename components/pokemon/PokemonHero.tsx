import Image from 'next/image';
import type { PokemonCore } from '@/lib/types/pokemon';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { typeGlowMap, typeHexMap } from '@/lib/utils/typeColors';

interface PokemonHeroProps {
  pokemon: PokemonCore;
}

export function PokemonHero({ pokemon }: PokemonHeroProps) {
  const dex = pokemon.id.toString().padStart(4, '0');
  const glow = typeGlowMap[pokemon.primaryType];
  const hex = typeHexMap[pokemon.primaryType];

  return (
    <section
      className="relative isolate overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20"
      aria-labelledby="pokemon-name"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 30% 30%, ${glow} 0%, transparent 70%)`,
        }}
      />

      <div className="container-app">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          <div className="relative mx-auto lg:mx-0 w-full max-w-[480px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full blur-3xl opacity-60"
              style={{
                background: `radial-gradient(circle, ${hex}40 0%, transparent 65%)`,
              }}
            />
            <div className="relative aspect-square">
              <Image
                src={pokemon.artworkUrl}
                alt={`Ilustración oficial de ${pokemon.name.es}`}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-sm text-text-muted tabular-nums">
              <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5">
                #{dex}
              </span>
              <span>Generación {pokemon.generation}</span>
              {pokemon.isLegendary && (
                <span className="px-2 py-0.5 rounded-full bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30">
                  Legendario
                </span>
              )}
              {pokemon.isMythical && (
                <span className="px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
                  Singular
                </span>
              )}
            </div>

            <h1
              id="pokemon-name"
              className="font-display font-black uppercase text-text-primary leading-none"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              {pokemon.name.es}
            </h1>

            <p className="font-body text-text-secondary text-sm uppercase tracking-widest">
              {pokemon.category}
            </p>

            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((t) => (
                <TypeBadge key={t} type={t} size="lg" withIcon />
              ))}
            </div>

            <p className="font-body text-text-secondary text-base lg:text-lg max-w-prose">
              {pokemon.description}
            </p>

            <dl className="grid grid-cols-2 gap-4 pt-4 border-t border-border-soft max-w-md">
              <div>
                <dt className="font-mono text-xs text-text-muted uppercase">Altura</dt>
                <dd className="font-display font-bold text-2xl text-text-primary">
                  {pokemon.heightM.toFixed(1)} m
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-text-muted uppercase">Peso</dt>
                <dd className="font-display font-bold text-2xl text-text-primary">
                  {pokemon.weightKg.toFixed(1)} kg
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

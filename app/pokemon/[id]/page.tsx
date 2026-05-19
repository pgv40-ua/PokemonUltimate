import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { PokemonHero } from '@/components/pokemon/PokemonHero';
import { StatsPanel } from '@/components/pokemon/StatsPanel';
import { AbilitiesPanel } from '@/components/pokemon/AbilitiesPanel';
import { WeaknessGrid } from '@/components/pokemon/WeaknessGrid';
import { EvolutionTimeline } from '@/components/pokemon/EvolutionTimeline';
import { BestNatureCard } from '@/components/pokemon/BestNatureCard';
import { MovesetTable } from '@/components/pokemon/MovesetTable';
import { EncountersList } from '@/components/pokemon/EncountersList';
import {
  getPokemonCore,
  getPokemonEncounters,
  getPokemonMoves,
} from '@/lib/api/pokeapi';
import { GEN_3_MAX_ID, REVALIDATE_SECONDS } from '@/lib/api/endpoints';
import { pickBestAbility } from '@/lib/api/derivations';
import type { PokemonType } from '@/lib/types/pokemon';

export const revalidate = REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

function parseId(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > GEN_3_MAX_ID) return null;
  return n;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = parseId(params.id);
  if (id === null) return { title: 'Pokémon no encontrado — PokéDex Ultimate' };

  try {
    const p = await getPokemonCore(id);
    const dex = id.toString().padStart(4, '0');
    return {
      title: `${p.name.es} #${dex} — PokéDex Ultimate`,
      description: p.description,
      openGraph: {
        title: `${p.name.es} #${dex}`,
        description: p.description,
        images: [{ url: p.artworkUrl, alt: p.name.es }],
      },
    };
  } catch {
    return { title: 'Pokémon no encontrado — PokéDex Ultimate' };
  }
}

export default async function PokemonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseId(params.id);
  if (id === null) notFound();

  let pokemon;
  try {
    pokemon = await getPokemonCore(id);
  } catch {
    notFound();
  }

  const best = pickBestAbility(pokemon.abilities);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        <PokemonHero pokemon={pokemon} />
        <StatsPanel stats={pokemon.stats} primaryType={pokemon.primaryType} />
        <AbilitiesPanel abilities={pokemon.abilities} bestSlug={best.slug} />
        <WeaknessGrid weaknesses={pokemon.weaknesses} />
        <EvolutionTimeline chain={pokemon.evolutionChain} currentId={pokemon.id} />
        <BestNatureCard stats={pokemon.stats} />
        <Suspense fallback={<MovesSkeleton />}>
          <MovesAsync id={pokemon.id} types={pokemon.types} />
        </Suspense>
        <Suspense fallback={<EncountersSkeleton />}>
          <EncountersAsync id={pokemon.id} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function MovesAsync({
  id,
  types,
}: {
  id: number;
  types: [PokemonType] | [PokemonType, PokemonType];
}) {
  const moves = await getPokemonMoves(id);
  return <MovesetTable moves={moves} types={types} />;
}

async function EncountersAsync({ id }: { id: number }) {
  const encounters = await getPokemonEncounters(id);
  return <EncountersList encounters={encounters} />;
}

function MovesSkeleton() {
  return (
    <section className="relative py-16 lg:py-20" aria-busy="true" aria-live="polite">
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Movimientos</p>
          <h2
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Cargando movimientos…
          </h2>
        </div>
        <div className="glass-card p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <span className="sr-only">Cargando set de movimientos…</span>
    </section>
  );
}

function EncountersSkeleton() {
  return (
    <section className="relative py-16 lg:py-24" aria-busy="true" aria-live="polite">
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Dónde encontrarlo</p>
          <h2
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Cargando ubicaciones…
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-32 animate-pulse" />
          ))}
        </div>
      </div>
      <span className="sr-only">Cargando ubicaciones por juego…</span>
    </section>
  );
}

import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { PokedexExplorer } from '@/components/sections/PokedexExplorer';
import { Footer } from '@/components/sections/Footer';
import { getPokemonList } from '@/lib/api/pokeapi';
import { GEN_3_MAX_ID, REVALIDATE_SECONDS } from '@/lib/api/endpoints';

export const revalidate = REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: 'Pokédex — PokéDex Ultimate',
  description:
    'Busca y filtra entre los 386 Pokémon de Kanto, Johto y Hoenn. Stats, tipos, habilidades y datos reales de PokéAPI.',
};

export default async function PokedexPage() {
  const pokemon = await getPokemonList(GEN_3_MAX_ID, 0);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        <PokedexExplorer pokemon={pokemon} />
      </main>
      <Footer />
    </>
  );
}

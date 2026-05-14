import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { PokedexExplorer } from '@/components/sections/PokedexExplorer';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Pokédex — PokéDex Ultimate',
  description: 'Busca y filtra entre todos los Pokémon. Stats, tipos, habilidades y más.',
};

export default function PokedexPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <PokedexExplorer />
      </main>
      <Footer />
    </>
  );
}

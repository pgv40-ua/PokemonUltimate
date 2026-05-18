import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { NovedadesClient } from './NovedadesClient';

export const metadata: Metadata = {
  title: 'Novedades — PokéDex Ultimate',
  description:
    'Las últimas noticias del mundo Pokémon: juegos, torneos, anime y competitivo.',
};

export default function NovedadesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        <NovedadesClient />
      </main>
      <Footer />
    </>
  );
}

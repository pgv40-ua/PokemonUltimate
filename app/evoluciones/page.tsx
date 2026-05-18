import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Evolutions } from '@/components/sections/Evolutions';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Cadenas de Evolución — PokéDex Ultimate',
  description: 'Explora las cadenas de evolución de todos los Pokémon: métodos, niveles, objetos y condiciones.',
};

export default function EvolucionesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        <Evolutions />
      </main>
      <Footer />
    </>
  );
}

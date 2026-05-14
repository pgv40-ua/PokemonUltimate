import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import TypesPageClient from './TypesPageClient';

export const metadata: Metadata = {
  title: 'Tabla de Tipos — PokéDex Ultimate',
  description:
    'Tabla de efectividad de tipos 18×18 y calculadora de defensa para tu Pokémon.',
};

export default function TiposPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <TypesPageClient />
      </main>
      <Footer />
    </>
  );
}

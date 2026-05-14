import dynamic from 'next/dynamic';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TypeTicker } from '@/components/sections/TypeTicker';
import { Novedades } from '@/components/sections/Novedades';
import { Destacados } from '@/components/sections/Destacados';
import { Evolutions } from '@/components/sections/Evolutions';
import { AbilitiesNatures } from '@/components/sections/AbilitiesNatures';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

// Heavy client-only sections — deferred to reduce initial JS bundle
const PokedexExplorer = dynamic(
  () => import('@/components/sections/PokedexExplorer').then((m) => ({ default: m.PokedexExplorer })),
  { ssr: false }
);
const TypesMatchup = dynamic(
  () => import('@/components/sections/TypesMatchup').then((m) => ({ default: m.TypesMatchup }))
);
const HallOfFame = dynamic(
  () => import('@/components/sections/HallOfFame').then((m) => ({ default: m.HallOfFame })),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TypeTicker />
        <Novedades />
        <Destacados />
        <PokedexExplorer />
        <Evolutions />
        <TypesMatchup />
        <AbilitiesNatures />
        <HallOfFame />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

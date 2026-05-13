import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TypeTicker } from '@/components/sections/TypeTicker';
import { Novedades } from '@/components/sections/Novedades';
import { Destacados } from '@/components/sections/Destacados';
import { PokedexExplorer } from '@/components/sections/PokedexExplorer';
import { Evolutions } from '@/components/sections/Evolutions';
import { TypesMatchup } from '@/components/sections/TypesMatchup';
import { AbilitiesNatures } from '@/components/sections/AbilitiesNatures';
import { HallOfFame } from '@/components/sections/HallOfFame';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

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

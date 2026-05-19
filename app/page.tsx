import dynamic from 'next/dynamic';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TypeTicker } from '@/components/sections/TypeTicker';
import { Novedades } from '@/components/sections/Novedades';
import { Destacados } from '@/components/sections/Destacados';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

// Heavy client-only section — deferred to reduce initial JS bundle.
// PokedexExplorer, Evolutions, TypesMatchup and AbilitiesNatures live in their
// own routes (/pokedex, /evoluciones, /tipos, /habilidades) and are not
// inlined on the landing.
const HallOfFame = dynamic(
  () => import('@/components/sections/HallOfFame').then((m) => ({ default: m.HallOfFame })),
  { ssr: false, loading: () => <div className="h-[600px] bg-surface/30" aria-hidden="true" /> }
);

export default function HomePage() {
  return (
    <>
      {/* Preload hero poster so the browser fetches it in parallel with HTML parsing.
          Without this, Chrome discovers the image only when it parses the <video poster>
          inside the Hero component, delaying LCP by ~2-3 s on slow connections. */}
      <link
        rel="preload"
        as="image"
        href="/assets/hero-zekrom.jpg"
        fetchPriority="high"
      />
      <Navbar />
      <main id="main-content">
        <Hero />
        <TypeTicker />
        <Novedades />
        <Destacados />
        <HallOfFame />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

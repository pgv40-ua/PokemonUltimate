import Link from 'next/link';

export default function PokemonNotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen pt-16 flex items-center justify-center"
    >
      <div className="container-app py-24 text-center max-w-xl">
        <p className="eyebrow mb-4">404 · Pokémon desconocido</p>
        <h1
          className="font-display font-black uppercase text-text-primary leading-none"
          style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
        >
          No reconocemos a este Pokémon
        </h1>
        <p className="mt-6 font-body text-text-secondary">
          El número que has buscado no está dentro de nuestra Pokédex actual
          (Kanto, Johto y Hoenn). Vuelve al listado y explora los 386 disponibles.
        </p>
        <Link
          href="/pokedex"
          className="inline-flex items-center gap-2 mt-8 bg-accent-yellow text-text-inverse font-display font-bold px-6 py-3 rounded-full text-sm hover:bg-white hover:shadow-glow-yellow transition-all"
        >
          Volver a la Pokédex
        </Link>
      </div>
    </main>
  );
}

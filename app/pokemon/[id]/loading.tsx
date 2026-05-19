export default function PokemonLoading() {
  return (
    <div
      className="min-h-screen pt-16 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="container-app py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative mx-auto w-full max-w-[420px] aspect-square">
            <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-16 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />
              <div className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-4/6 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Cargando ficha del Pokémon…</span>
    </div>
  );
}

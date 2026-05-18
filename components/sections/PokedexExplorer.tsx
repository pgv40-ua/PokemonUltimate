'use client';

import { useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pokemonMock } from '@/lib/mock/pokemon';
import { PokemonCard } from '@/components/ui/PokemonCard';
import { Input } from '@/components/ui/Input';
import type { PokemonCardData, PokemonType } from '@/lib/types/pokemon';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { useMotionSafe } from '@/lib/hooks/useMotionSafe';
import { cn } from '@/lib/utils/cn';
import { easing } from '@/lib/motion/tokens';
import { Reveal } from '@/components/ui/Reveal';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_ORDER: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const toCardData = (p: (typeof pokemonMock)[number]): PokemonCardData => ({
  id: p.id,
  name: p.name.es,
  types: p.types,
  sprite: p.imageUrl,
});

// ─── Sub-components ──────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export function PokedexExplorer() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(e.target.value), 150);
  };
  const { reduced } = useMotionSafe();

  const filtered = useMemo(() => {
    return pokemonMock
      .filter((p) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          q === '' ||
          p.name.es.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          String(p.id).includes(q);
        const matchesType =
          selectedType === null || p.types.includes(selectedType);
        return matchesQuery && matchesType;
      })
      .slice(0, 12);
  }, [query, selectedType]);

  const hasActiveFilters = selectedType !== null || query.trim() !== '';

  const handleClearFilters = () => {
    setInputValue('');
    setQuery('');
    setSelectedType(null);
  };

  const handleTypeToggle = (type: PokemonType) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  return (
    <section
      id="pokedex"
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-labelledby="pokedex-heading"
    >
      {/* Subtle radial background glow — decorative */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 191, 255, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-app relative z-10">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="relative mb-12 lg:mb-16">
          {/* Decorative section number — aria-hidden, purely visual */}
          <span
            className="pointer-events-none absolute -top-6 left-0 select-none font-display font-black leading-none blur-sm opacity-[0.04]"
            style={{ fontSize: 'clamp(90px, 20vw, 220px)' }}
            aria-hidden="true"
          >
            04
          </span>

          <Reveal className="relative">
            <p className="eyebrow mb-4">Pokédex · Vista previa</p>
            <h2
              id="pokedex-heading"
              className="font-display font-black uppercase text-text-primary leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              Explora la Pokédex completa
            </h2>
            <p className="mt-4 font-body text-text-secondary text-base lg:text-lg max-w-2xl">
              Más de 1000 Pokémon. Busca, filtra y descubre. Aquí tienes{' '}
              {pokemonMock.length} para empezar.
            </p>
          </Reveal>
        </div>

        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <Reveal className="max-w-2xl mx-auto mb-8">
          <Input
            type="search"
            iconLeft={<SearchIcon />}
            placeholder="Busca por nombre, número o tipo..."
            value={inputValue}
            onChange={handleQueryChange}
            aria-label="Buscar Pokémon por nombre, número o tipo"
            className="text-lg"
          />
        </Reveal>

        {/* ── Type filter pills ───────────────────────────────────────────── */}
        <Reveal>
          <div
            className="flex flex-wrap gap-2 justify-center"
            role="group"
            aria-label="Filtros por tipo de Pokémon"
          >
            {TYPE_ORDER.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeToggle(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-body font-medium text-white',
                    'transition-all duration-200 ease-smooth border',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
                    isSelected
                      ? 'scale-105 ring-2 ring-white/40 ring-offset-1 ring-offset-bg'
                      : 'opacity-70 hover:opacity-100 hover:scale-105',
                  )}
                  style={{
                    backgroundColor: `${typeHexMap[type]}CC`,
                    borderColor: isSelected ? typeHexMap[type] : 'transparent',
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Filtrar por tipo ${typeNamesES[type]}`}
                >
                  {typeNamesES[type]}
                </button>
              );
            })}
          </div>

          {/* Clear filters link — only visible when a filter is active */}
          {hasActiveFilters && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-text-muted text-xs underline underline-offset-2 hover:text-text-primary transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow rounded-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </Reveal>

        {/* ── Results counter + grid ──────────────────────────────────────── */}
        <div className="mt-10">
          {/* Live result count — politely announced by screen readers via aria-live on output */}
          <output
            aria-live="polite"
            aria-atomic="true"
            className="block text-text-muted text-sm mb-4 font-mono tabular-nums"
          >
            Mostrando {filtered.length} de {pokemonMock.length} Pokémon
          </output>

          {/* Card grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            role="list"
            aria-label="Pokémon encontrados"
          >
            {reduced ? (
              // Reduced motion: render cards without AnimatePresence/motion wrappers
              <>
                {filtered.map((p) => (
                  <div key={p.id} role="listitem">
                    <PokemonCard pokemon={toCardData(p)} variant="compact" />
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-16 text-text-muted font-body">
                    No se encontraron Pokémon con esos criterios.
                  </div>
                )}
              </>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      role="listitem"
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.2,
                        ease: easing,
                        delay: i * 0.03,
                      }}
                    >
                      <PokemonCard
                        pokemon={toCardData(p)}
                        variant="compact"
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="empty"
                    className="col-span-full text-center py-16 text-text-muted font-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    No se encontraron Pokémon con esos criterios.
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <Reveal className="text-center mt-16">
          <a
            href="/pokedex"
            className={cn(
              'inline-flex items-center gap-2',
              'bg-accent-yellow text-text-inverse font-display font-bold',
              'px-8 py-4 rounded-full text-base',
              'transition-all duration-base ease-smooth',
              'hover:bg-white hover:shadow-glow-yellow hover:scale-105',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
            )}
          >
            Ver los +1000 Pokémon
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="text-text-muted text-sm mt-3 font-body">
            Integración completa con PokéAPI próximamente
          </p>
        </Reveal>
      </div>
    </section>
  );
}

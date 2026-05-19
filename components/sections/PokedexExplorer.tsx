'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { PokemonCard } from '@/components/ui/PokemonCard';
import { Input } from '@/components/ui/Input';
import type { Pokemon, PokemonCardData, PokemonType } from '@/lib/types/pokemon';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import { useMotionSafe } from '@/lib/hooks/useMotionSafe';
import { cn } from '@/lib/utils/cn';
import { easing } from '@/lib/motion/tokens';
import { Reveal } from '@/components/ui/Reveal';

const TYPE_ORDER: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const PAGE_SIZE = 48;

const toCardData = (p: Pokemon): PokemonCardData => ({
  id: p.id,
  name: p.name.es,
  types: p.types,
  sprite: p.imageUrl,
});

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

interface PokedexExplorerProps {
  pokemon: Pokemon[];
}

export function PokedexExplorer({ pokemon }: PokedexExplorerProps) {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(e.target.value);
      setVisibleCount(PAGE_SIZE);
    }, 150);
  };
  const { reduced } = useMotionSafe();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pokemon.filter((p) => {
      const matchesQuery =
        q === '' ||
        p.name.es.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        String(p.id).includes(q);
      const matchesType =
        selectedType === null || p.types.includes(selectedType);
      return matchesQuery && matchesType;
    });
  }, [pokemon, query, selectedType]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;
  const hasActiveFilters = selectedType !== null || query.trim() !== '';

  const handleClearFilters = () => {
    setInputValue('');
    setQuery('');
    setSelectedType(null);
    setVisibleCount(PAGE_SIZE);
  };

  const handleTypeToggle = (type: PokemonType) => {
    setSelectedType((prev) => (prev === type ? null : type));
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section
      id="pokedex"
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-labelledby="pokedex-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 191, 255, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-app relative z-10">
        <div className="relative mb-12 lg:mb-16" data-section-num="04">
          <Reveal className="relative">
            <p className="eyebrow mb-4">Pokédex · Kanto · Johto · Hoenn</p>
            <h2
              id="pokedex-heading"
              className="font-display font-black uppercase text-text-primary leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              Explora la Pokédex completa
            </h2>
            <p className="mt-4 font-body text-text-secondary text-base lg:text-lg max-w-2xl">
              {pokemon.length} Pokémon reales con datos oficiales de PokéAPI.
              Busca, filtra y abre cada ficha para ver stats, debilidades, evoluciones y movimientos.
            </p>
          </Reveal>
        </div>

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

        <div className="mt-10">
          <output
            aria-live="polite"
            aria-atomic="true"
            className="block text-text-muted text-sm mb-4 font-mono tabular-nums"
          >
            Mostrando {visible.length} de {filtered.length} (de {pokemon.length} en total)
          </output>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            role="list"
            aria-label="Pokémon encontrados"
          >
            {reduced ? (
              <>
                {visible.map((p, i) => (
                  <div key={p.id} role="listitem">
                    <Link
                      href={`/pokemon/${p.id}`}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow rounded-card"
                      aria-label={`Ver ficha de ${p.name.es}`}
                    >
                      <PokemonCard pokemon={toCardData(p)} variant="compact" priority={i < 12} />
                    </Link>
                  </div>
                ))}
                {visible.length === 0 && (
                  <div className="col-span-full text-center py-16 text-text-muted font-body">
                    No se encontraron Pokémon con esos criterios.
                  </div>
                )}
              </>
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.length > 0 ? (
                  visible.map((p, i) => (
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
                        delay: Math.min(i, 12) * 0.02,
                      }}
                    >
                      <Link
                        href={`/pokemon/${p.id}`}
                        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow rounded-card"
                        aria-label={`Ver ficha de ${p.name.es}`}
                      >
                        <PokemonCard
                          pokemon={toCardData(p)}
                          variant="compact"
                          priority={i < 12}
                        />
                      </Link>
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

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className={cn(
                  'inline-flex items-center gap-2',
                  'bg-white/5 border border-white/10 text-text-primary font-body font-medium',
                  'px-6 py-3 rounded-full text-sm',
                  'transition-all duration-base ease-smooth',
                  'hover:bg-white/10 hover:scale-105',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
                )}
              >
                Cargar más
                <span className="text-text-muted font-mono text-xs">
                  +{Math.min(PAGE_SIZE, filtered.length - visibleCount)}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

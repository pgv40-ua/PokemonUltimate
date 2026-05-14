import type { FC } from 'react';
import { TypeIcon } from '@/components/ui/TypeIcon';
import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';
import type { PokemonType } from '@/lib/types/pokemon';

const POKEMON_TYPES: readonly PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

interface TypePillProps {
  type: PokemonType;
}

const TypePill: FC<TypePillProps> = ({ type }) => {
  const hex = typeHexMap[type];

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (
    <span
      className="inline-flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 font-display font-bold text-sm text-white select-none"
      style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.20)`,
        border: `1px solid rgba(${r}, ${g}, ${b}, 0.40)`,
        color: '#ffffff',
      }}
      aria-label={`Tipo ${typeNamesES[type]}`}
    >
      <span style={{ color: hex }} className="flex-shrink-0">
        <TypeIcon type={type} size={20} />
      </span>
      {typeNamesES[type]}
    </span>
  );
};

export function TypeTicker() {
  const doubled = [...POKEMON_TYPES, ...POKEMON_TYPES];

  return (
    <section
      id="type-ticker"
      className="relative w-full overflow-hidden bg-bg-elevated py-8"
      aria-label="Los 18 tipos Pokémon"
    >
      {/*
        Fade edges: two gradient overlays on left/right to soften the loop seam.
        pointer-events-none so they never block interaction.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{
          background: 'linear-gradient(to right, #12121a, transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{
          background: 'linear-gradient(to left, #12121a, transparent)',
        }}
        aria-hidden="true"
      />

      {/*
        The animated track.
        - aria-hidden: the ticker is purely decorative; the 18 type names are
          present twice in the DOM for the loop trick, which would be confusing
          to screen readers. The section aria-label above conveys the intent.
        - Duration uses a CSS custom property so mobile can override via a
          <style> tag without adding a new Tailwind animation token.
        - [animation-duration:var(--ticker-duration)] applies the variable;
          Tailwind's arbitrary property syntax keeps this in-file without
          needing a new keyframe.
      */}
      <div
        className="flex w-max animate-marquee gap-8 lg:gap-12 [animation-duration:var(--ticker-duration)]"
        style={{ '--ticker-duration': '28s' } as React.CSSProperties}
        aria-hidden="true"
      >
        {doubled.map((type, index) => (
          <TypePill key={`${type}-${index}`} type={type} />
        ))}
      </div>

      {/*
        Override: on lg+ screens, use the 40s duration defined in tailwind.config.ts.
        We inject a minimal <style> block here; no new Tailwind token is needed.
        prefers-reduced-motion: pause the animation entirely.
      */}
      <style>{`
        @media (min-width: 1024px) {
          #type-ticker .animate-marquee {
            --ticker-duration: 40s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #type-ticker .animate-marquee {
            animation-play-state: paused;
          }
        }
      `}</style>
    </section>
  );
}

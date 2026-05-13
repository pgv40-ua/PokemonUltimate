// TODO Fase 2: iconos definitivos — formas geométricas distinguibles por tipo en Fase 1
import React from 'react';
import type { PokemonType } from '@/lib/types/pokemon';

interface TypeIconProps {
  type: PokemonType;
  size?: number;
  className?: string;
}

// Each path is a simple geometric shape uniquely assigned to a type.
// Color is inherited via currentColor from the parent element.
const iconPaths: Record<PokemonType, React.ReactNode> = {
  // Normal — square
  normal: <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />,
  // Fire — flame shape
  fire: (
    <path
      d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-2-1-3.5-1-5 0 0-1 2-2 2s-1-3 1-7z"
      fill="currentColor"
    />
  ),
  // Water — teardrop
  water: (
    <path
      d="M12 2L6 12a6 6 0 0012 0L12 2z"
      fill="currentColor"
    />
  ),
  // Electric — lightning bolt
  electric: (
    <path
      d="M13 2L5 13h6l-2 9 10-12h-6l2-8z"
      fill="currentColor"
    />
  ),
  // Grass — four-leaf clover (simplified)
  grass: (
    <path
      d="M12 12c-2-4-6-4-6-8a6 6 0 0112 0c0 4-4 4-6 8zm0 0c0 3 2 6 2 8a2 2 0 01-4 0c0-2 2-5 2-8z"
      fill="currentColor"
    />
  ),
  // Ice — snowflake / star
  ice: (
    <path
      d="M12 2v20M2 12h20M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  ),
  // Fighting — fist
  fighting: (
    <path
      d="M8 6h8v6l-2 2H6L4 12V9l2-3h2zm0 8v2a2 2 0 004 0v-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  ),
  // Poison — skull simplified
  poison: (
    <>
      <circle cx="12" cy="10" r="6" fill="currentColor" />
      <rect x="9" y="15" width="6" height="5" rx="1" fill="currentColor" />
      <circle cx="10" cy="9" r="1.5" fill="white" />
      <circle cx="14" cy="9" r="1.5" fill="white" />
    </>
  ),
  // Ground — triangle (mountain)
  ground: (
    <path
      d="M12 3L2 21h20L12 3z"
      fill="currentColor"
    />
  ),
  // Flying — wings
  flying: (
    <path
      d="M12 12C8 8 2 9 2 14c4 0 7-1 10-2zm0 0c4-4 10-3 10 2-4 0-7-1-10-2z"
      fill="currentColor"
    />
  ),
  // Psychic — eye
  psychic: (
    <>
      <path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7S5 17 2 12z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </>
  ),
  // Bug — hexagon
  bug: (
    <path
      d="M17 4H7L2 12l5 8h10l5-8-5-8z"
      fill="currentColor"
    />
  ),
  // Rock — diamond
  rock: (
    <path
      d="M12 2l6 8-6 12-6-12 6-8z"
      fill="currentColor"
    />
  ),
  // Ghost — ghost shape
  ghost: (
    <path
      d="M6 4a6 6 0 0112 0v11l-2-2-2 2-2-2-2 2-2-2-2 2V4z"
      fill="currentColor"
    />
  ),
  // Dragon — five-point star
  dragon: (
    <path
      d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6L12 2z"
      fill="currentColor"
    />
  ),
  // Dark — crescent moon
  dark: (
    <path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      fill="currentColor"
    />
  ),
  // Steel — shield
  steel: (
    <path
      d="M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4z"
      fill="currentColor"
    />
  ),
  // Fairy — four-petal flower
  fairy: (
    <>
      <ellipse cx="12" cy="7" rx="3" ry="5" fill="currentColor" />
      <ellipse cx="12" cy="17" rx="3" ry="5" fill="currentColor" />
      <ellipse cx="7" cy="12" rx="5" ry="3" fill="currentColor" />
      <ellipse cx="17" cy="12" rx="5" ry="3" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </>
  ),
};

export function TypeIcon({ type, size = 16, className }: TypeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {iconPaths[type]}
    </svg>
  );
}

TypeIcon.displayName = 'TypeIcon';

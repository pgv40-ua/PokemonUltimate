'use client';

import React from 'react';
import Image from 'next/image';
import type { PokemonCardData } from '@/lib/types/pokemon';
import { typeHexMap, typeGlowMap } from '@/lib/utils/typeColors';
import { TypeBadge } from './TypeBadge';
import { StatBar } from './StatBar';
import { cn } from '@/lib/utils/cn';

interface PokemonCardProps {
  pokemon: PokemonCardData;
  variant?: 'compact' | 'full' | 'featured';
  priority?: boolean;
  showStats?: boolean;
  showUsage?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PokemonCard({
  pokemon,
  variant = 'compact',
  priority = false,
  showStats = false,
  showUsage = false,
  onClick,
  className,
}: PokemonCardProps) {
  const primaryType = pokemon.types[0];
  const glowColor = typeGlowMap[primaryType];
  const typeColor = typeHexMap[primaryType];

  const isInteractive = !!onClick;
  const Tag = (isInteractive ? 'button' : 'article') as React.ElementType;

  const isFull = variant === 'full' || variant === 'featured';
  const isFeatured = variant === 'featured';

  const imageHeight = isFeatured ? 180 : variant === 'full' ? 140 : 96;

  return (
    <Tag
      className={cn(
        'glass-card text-left w-full',
        'hover:[box-shadow:0_12px_40px_var(--glow-color)]',
        isInteractive &&
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow ' +
          'focus-visible:ring-offset-2 focus-visible:ring-offset-bg cursor-pointer',
        className,
      )}
      // Dynamic CSS vars — dynamic values require inline style injection
      style={
        {
          '--glow-color': glowColor,
          '--type-color': typeColor,
          borderColor: `${typeColor}60`,
        } as React.CSSProperties
      }
      onClick={isInteractive ? onClick : undefined}
      aria-label={isInteractive ? `Ver ${pokemon.name}` : undefined}
    >
      {/* Sprite or fallback gradient */}
      <div
        className={cn(
          'w-full rounded-t-card overflow-hidden flex items-center justify-center relative',
        )}
        style={{ height: imageHeight }}
      >
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            fill
            className="object-contain p-2"
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          // Gradient fallback — uses type color via CSS variable
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--type-color) 0%, rgba(10,10,15,0.9) 100%)',
            }}
            aria-hidden="true"
          >
            <span className="font-display font-bold text-white/30 text-3xl select-none">
              {pokemon.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Header: ID + name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-text-primary text-base leading-tight line-clamp-1">
            {pokemon.name}
          </h3>
          <span className="font-mono text-xs text-text-muted shrink-0 tabular-nums">
            #{pokemon.id.toString().padStart(4, '0')}
          </span>
        </div>

        {/* Type badges */}
        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size={isFeatured ? 'md' : 'sm'} />
          ))}
        </div>

        {/* Stats — only for full/featured variants. 6 canonical Pokémon stats */}
        {isFull && showStats && pokemon.stats && (
          <div className="space-y-1.5 pt-1">
            <StatBar label="HP"  value={pokemon.stats.hp}        max={255} />
            <StatBar label="ATK" value={pokemon.stats.attack}    max={255} />
            <StatBar label="DEF" value={pokemon.stats.defense}   max={255} />
            <StatBar label="SPA" value={pokemon.stats.spAttack}  max={255} />
            <StatBar label="SPD" value={pokemon.stats.spDefense} max={255} />
            <StatBar label="SPE" value={pokemon.stats.speed}     max={255} />
          </div>
        )}

        {/* Usage bar — only for featured variant */}
        {isFeatured && showUsage && pokemon.usagePercent !== undefined && (
          <div className="pt-1 border-t border-border-soft">
            <StatBar label="Uso" value={pokemon.usagePercent} max={100} color="bg-accent-yellow" />
          </div>
        )}
      </div>
    </Tag>
  );
}

PokemonCard.displayName = 'PokemonCard';

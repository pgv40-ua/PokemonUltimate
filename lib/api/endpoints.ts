export const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export const POKEMON_URL = (idOrSlug: number | string) =>
  `${POKEAPI_BASE}/pokemon/${idOrSlug}`;

export const SPECIES_URL = (idOrSlug: number | string) =>
  `${POKEAPI_BASE}/pokemon-species/${idOrSlug}`;

export const EVOLUTION_CHAIN_URL = (id: number | string) =>
  `${POKEAPI_BASE}/evolution-chain/${id}`;

export const ENCOUNTERS_URL = (id: number) =>
  `${POKEAPI_BASE}/pokemon/${id}/encounters`;

export const ABILITY_URL = (slug: string) =>
  `${POKEAPI_BASE}/ability/${slug}`;

export const MOVE_URL = (slug: string) =>
  `${POKEAPI_BASE}/move/${slug}`;

export const LOCATION_AREA_URL = (slug: string) =>
  `${POKEAPI_BASE}/location-area/${slug}`;

export const SPRITE_OFFICIAL_ARTWORK = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const SPRITE_HOME = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

export const SPRITE_DEFAULT = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const REVALIDATE_SECONDS = 60 * 60 * 24;

export const GEN_3_MAX_ID = 386;

export function extractIdFromUrl(url: string): number {
  const segments = url.split('/').filter(Boolean);
  return Number(segments[segments.length - 1]);
}

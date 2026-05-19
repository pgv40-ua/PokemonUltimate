export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type StatKey = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed';
export type MoveCategory = 'physical' | 'special' | 'status';
export type Tier = 'Uber' | 'OU' | 'UU' | 'RU' | 'NU' | 'PU';
export type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Effectiveness = 0 | 0.25 | 0.5 | 1 | 2 | 4;
export type EvolutionTrigger = 'level-up' | 'use-item' | 'trade' | 'friendship' | 'other';
export type NewsCategory = 'Juego' | 'Torneo' | 'Anime' | 'Competitivo';

export interface StatBlock {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface Ability {
  slug: string;
  nameEn: string;
  nameEs: string;
  description: string;
  hidden: boolean;
  slot: 1 | 2 | 3;
}

export interface Nature {
  nameEn: string;
  nameEs: string;
  raisedStat: StatKey | null;
  loweredStat: StatKey | null;
  neutral: boolean;
}

export interface Move {
  slug: string;
  nameEn: string;
  nameEs: string;
  type: PokemonType;
  category: MoveCategory;
  power: number | null;
  accuracy: number | null;
  pp: number;
  description: string;
}

export interface EvolutionMethod {
  trigger: EvolutionTrigger;
  minLevel?: number;
  item?: string;
  location?: string;
  timeOfDay?: 'day' | 'night' | '';
  knownMoveType?: PokemonType;
  minAffection?: number;
  condition?: string;
}

export interface EvolutionStage {
  pokemonId: number;
  stage: 0 | 1 | 2;
  method: EvolutionMethod | null;
}

export interface EvolutionChain {
  id: number;
  stages: EvolutionStage[];
}

export interface EvolutionStageRich extends EvolutionStage {
  nameEs: string;
  types: [PokemonType] | [PokemonType, PokemonType];
  primaryType: PokemonType;
  spriteUrl: string;
}

export interface EvolutionChainRich {
  id: number;
  stages: EvolutionStageRich[];
}

export interface PokemonRef {
  id: number;
  nameEs: string;
  slug: string;
}

export interface Pokemon {
  id: number;
  slug: string;
  name: { en: string; es: string };
  types: [PokemonType] | [PokemonType, PokemonType];
  primaryType: PokemonType;
  typeColor: string;
  stats: StatBlock;
  abilities: Ability[];
  generation: Generation;
  category: string;
  description: string;
  heightM: number;
  weightKg: number;
  isLegendary: boolean;
  isMythical: boolean;
  evolutionChainId: number | null;
  imageUrl?: string;
}

export interface FeaturedPokemon extends Pokemon {
  usageRate: number;
  tier: Tier;
  role: string;
}

export interface HallOfFamePokemon extends Pokemon {
  hofRank: number;
  epicQuote: string;
}

export interface PokemonCardData {
  id: number;
  name: string;
  types: [PokemonType] | [PokemonType, PokemonType];
  sprite?: string;
  usagePercent?: number;
  stats?: StatBlock;
}

export interface TypeMatchupRow {
  attacker: PokemonType;
  effectiveness: Record<PokemonType, Effectiveness>;
}

export type MoveLearnMethod = 'level-up' | 'machine' | 'egg' | 'tutor';

export interface MoveDetail {
  slug: string;
  nameEs: string;
  nameEn: string;
  type: PokemonType;
  category: MoveCategory;
  power: number | null;
  accuracy: number | null;
  pp: number;
  learnMethod: MoveLearnMethod;
  learnLevel?: number;
}

export interface EncounterByGame {
  game: string;
  locationsEs: string[];
}

export interface BestNaturePick {
  nature: Nature;
  reason: string;
}

export interface PokemonCore extends Pokemon {
  artworkUrl: string;
  weaknesses: Record<PokemonType, Effectiveness>;
  evolutionChain: EvolutionChainRich;
}

export interface PokemonFull extends PokemonCore {
  moves: MoveDetail[];
  encounters: EncounterByGame[];
}

export interface NewsItem {
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  excerpt: string;
  featured: boolean;
  gradientFrom: string;
  gradientTo: string;
}

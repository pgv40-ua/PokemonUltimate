export interface PokeApiNamedRef {
  name: string;
  url: string;
}

export interface PokeApiName {
  name: string;
  language: PokeApiNamedRef;
}

export interface PokeApiFlavorText {
  flavor_text: string;
  language: PokeApiNamedRef;
  version: PokeApiNamedRef;
}

export interface PokeApiGenus {
  genus: string;
  language: PokeApiNamedRef;
}

export interface PokeApiSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: { front_default: string | null };
    home?: { front_default: string | null };
    dream_world?: { front_default: string | null };
  };
}

export interface PokeApiStat {
  base_stat: number;
  stat: PokeApiNamedRef;
}

export interface PokeApiAbilityEntry {
  ability: PokeApiNamedRef;
  is_hidden: boolean;
  slot: 1 | 2 | 3;
}

export interface PokeApiTypeEntry {
  slot: 1 | 2;
  type: PokeApiNamedRef;
}

export interface PokeApiVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: PokeApiNamedRef;
  version_group: PokeApiNamedRef;
}

export interface PokeApiMoveEntry {
  move: PokeApiNamedRef;
  version_group_details: PokeApiVersionGroupDetail[];
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokeApiSprites;
  stats: PokeApiStat[];
  types: PokeApiTypeEntry[];
  abilities: PokeApiAbilityEntry[];
  moves: PokeApiMoveEntry[];
}

export interface PokeApiSpecies {
  id: number;
  name: string;
  names: PokeApiName[];
  flavor_text_entries: PokeApiFlavorText[];
  genera: PokeApiGenus[];
  evolution_chain: { url: string };
  generation: PokeApiNamedRef;
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface PokeApiEvoDetail {
  trigger: PokeApiNamedRef;
  min_level: number | null;
  item: PokeApiNamedRef | null;
  held_item: PokeApiNamedRef | null;
  min_happiness: number | null;
  known_move: PokeApiNamedRef | null;
  time_of_day: string;
  location: PokeApiNamedRef | null;
}

export interface PokeApiEvoNode {
  species: PokeApiNamedRef;
  evolution_details: PokeApiEvoDetail[];
  evolves_to: PokeApiEvoNode[];
}

export interface PokeApiEvolutionChain {
  id: number;
  chain: PokeApiEvoNode;
}

export interface PokeApiEncounterVersionDetail {
  version: PokeApiNamedRef;
  max_chance: number;
}

export interface PokeApiEncounter {
  location_area: PokeApiNamedRef;
  version_details: PokeApiEncounterVersionDetail[];
}

export interface PokeApiAbility {
  id: number;
  name: string;
  names: PokeApiName[];
  effect_entries: {
    short_effect: string;
    effect: string;
    language: PokeApiNamedRef;
  }[];
  flavor_text_entries: PokeApiFlavorText[];
}

export interface PokeApiMove {
  id: number;
  name: string;
  names: PokeApiName[];
  type: PokeApiNamedRef;
  damage_class: PokeApiNamedRef;
  power: number | null;
  accuracy: number | null;
  pp: number;
  flavor_text_entries: PokeApiFlavorText[];
}

export interface PokeApiLocationArea {
  id: number;
  name: string;
  names: PokeApiName[];
}

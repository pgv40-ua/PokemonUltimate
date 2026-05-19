import 'server-only';
import type {
  Ability,
  EncounterByGame,
  EvolutionChain,
  EvolutionChainRich,
  EvolutionMethod,
  EvolutionStage,
  EvolutionStageRich,
  EvolutionTrigger,
  Generation,
  MoveCategory,
  MoveDetail,
  MoveLearnMethod,
  Pokemon,
  PokemonCore,
  PokemonType,
  StatBlock,
} from '@/lib/types/pokemon';
import type {
  PokeApiAbility,
  PokeApiEncounter,
  PokeApiEvoDetail,
  PokeApiEvoNode,
  PokeApiEvolutionChain,
  PokeApiLocationArea,
  PokeApiMove,
  PokeApiName,
  PokeApiNamedRef,
  PokeApiPokemon,
  PokeApiSpecies,
} from '@/lib/types/pokeapi';
import { pokemonMock } from '@/lib/mock/pokemon';
import { typeHexMap } from '@/lib/utils/typeColors';
import { calcWeaknesses } from './derivations';
import {
  ABILITY_URL,
  ENCOUNTERS_URL,
  EVOLUTION_CHAIN_URL,
  GEN_3_MAX_ID,
  LOCATION_AREA_URL,
  MOVE_URL,
  POKEMON_URL,
  REVALIDATE_SECONDS,
  SPECIES_URL,
  SPRITE_HOME,
  SPRITE_OFFICIAL_ARTWORK,
  extractIdFromUrl,
} from './endpoints';

class PokeApiError extends Error {
  constructor(url: string, status: number) {
    super(`PokéAPI ${status} at ${url}`);
    this.name = 'PokeApiError';
  }
}

async function fetchJson<T>(url: string, tag: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ['pokeapi', tag] },
  });
  if (!res.ok) throw new PokeApiError(url, res.status);
  return res.json() as Promise<T>;
}

function pickEs<T extends { language: { name: string } }>(
  entries: T[],
  fallback?: T,
): T | undefined {
  return entries.find((e) => e.language.name === 'es') ?? fallback ?? entries[0];
}

function pickEsName(entries: PokeApiName[], fallback: string): string {
  const es = entries.find((e) => e.language.name === 'es');
  return es?.name ?? fallback;
}

function cleanFlavor(text: string): string {
  return text.replace(/[\f\n\r­]/g, ' ').replace(/\s+/g, ' ').trim();
}

const STAT_NAME_MAP: Record<string, keyof StatBlock> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'spAttack',
  'special-defense': 'spDefense',
  speed: 'speed',
};

const GEN_MAP: Record<string, Generation> = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8,
  'generation-ix': 9,
};

const VERSION_LABEL_ES: Record<string, string> = {
  red: 'Rojo',
  blue: 'Azul',
  yellow: 'Amarillo',
  gold: 'Oro',
  silver: 'Plata',
  crystal: 'Cristal',
  ruby: 'Rubí',
  sapphire: 'Zafiro',
  emerald: 'Esmeralda',
  firered: 'Rojo Fuego',
  leafgreen: 'Verde Hoja',
  diamond: 'Diamante',
  pearl: 'Perla',
  platinum: 'Platino',
  heartgold: 'Oro HeartGold',
  soulsilver: 'Plata SoulSilver',
  black: 'Negro',
  white: 'Blanco',
  'black-2': 'Negro 2',
  'white-2': 'Blanco 2',
  x: 'X',
  y: 'Y',
  'omega-ruby': 'Rubí Omega',
  'alpha-sapphire': 'Zafiro Alfa',
  sun: 'Sol',
  moon: 'Luna',
  'ultra-sun': 'Ultrasol',
  'ultra-moon': 'Ultraluna',
  'lets-go-pikachu': "Let's Go Pikachu",
  'lets-go-eevee': "Let's Go Eevee",
  sword: 'Espada',
  shield: 'Escudo',
  'brilliant-diamond': 'Diamante Brillante',
  'shining-pearl': 'Perla Reluciente',
  'legends-arceus': 'Leyendas Arceus',
  scarlet: 'Escarlata',
  violet: 'Púrpura',
};

const VERSION_GROUP_PRIORITY: string[] = [
  'scarlet-violet',
  'sword-shield',
  'sun-moon',
  'ultra-sun-ultra-moon',
  'x-y',
  'omega-ruby-alpha-sapphire',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
  'firered-leafgreen',
  'emerald',
  'ruby-sapphire',
  'crystal',
  'gold-silver',
  'yellow',
  'red-blue',
];

function mapStats(raw: PokeApiPokemon['stats']): StatBlock {
  const out: StatBlock = {
    hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0,
  };
  for (const s of raw) {
    const key = STAT_NAME_MAP[s.stat.name];
    if (key) out[key] = s.base_stat;
  }
  return out;
}

function mapTypes(raw: PokeApiPokemon['types']): [PokemonType] | [PokemonType, PokemonType] {
  const sorted = [...raw].sort((a, b) => a.slot - b.slot);
  const types = sorted.map((t) => t.type.name as PokemonType);
  return types.length === 2 ? [types[0], types[1]] : [types[0]];
}

async function fetchAbilityFull(slug: string): Promise<Pick<Ability, 'nameEs' | 'nameEn' | 'description'>> {
  const a = await fetchJson<PokeApiAbility>(ABILITY_URL(slug), `ability:${slug}`);
  const nameEs = pickEsName(a.names, a.name);
  const nameEn = a.names.find((n) => n.language.name === 'en')?.name ?? a.name;
  const effectEs = a.effect_entries.find((e) => e.language.name === 'es');
  const effectEn = a.effect_entries.find((e) => e.language.name === 'en');
  const flavorEs = a.flavor_text_entries.find((f) => f.language.name === 'es');
  const description = cleanFlavor(
    effectEs?.short_effect ?? effectEs?.effect ?? flavorEs?.flavor_text ?? effectEn?.short_effect ?? '',
  );
  return { nameEs, nameEn, description };
}

async function mapAbilities(raw: PokeApiPokemon['abilities']): Promise<Ability[]> {
  return Promise.all(
    raw.map(async (a) => {
      const slug = a.ability.name;
      const meta = await fetchAbilityFull(slug);
      return {
        slug,
        nameEn: meta.nameEn,
        nameEs: meta.nameEs,
        description: meta.description || 'Sin descripción disponible.',
        hidden: a.is_hidden,
        slot: a.slot,
      };
    }),
  );
}

function deriveTypeColor(primary: PokemonType): string {
  return typeHexMap[primary];
}

function deriveGeneration(species: PokeApiSpecies): Generation {
  return GEN_MAP[species.generation.name] ?? 1;
}

function applyMockOverrides(p: Pokemon): Pokemon {
  const override = pokemonMock.find((m) => m.id === p.id);
  if (!override) return p;
  return {
    ...p,
    name: { ...p.name, es: override.name.es },
    description: override.description,
    category: override.category,
    abilities: p.abilities.map((a) => {
      const ov = override.abilities.find((mo) => mo.slug === a.slug);
      return ov ? { ...a, nameEs: ov.nameEs, description: ov.description } : a;
    }),
  };
}

export async function getPokemonBasic(id: number): Promise<Pokemon> {
  const [poke, species] = await Promise.all([
    fetchJson<PokeApiPokemon>(POKEMON_URL(id), `pokemon:${id}`),
    fetchJson<PokeApiSpecies>(SPECIES_URL(id), `species:${id}`),
  ]);

  const types = mapTypes(poke.types);
  const primaryType = types[0];
  const stats = mapStats(poke.stats);
  const abilities = await mapAbilities(poke.abilities);

  const nameEs = pickEsName(species.names, poke.name);
  const nameEn = species.names.find((n) => n.language.name === 'en')?.name ?? poke.name;
  const flavorEs = species.flavor_text_entries.find((f) => f.language.name === 'es');
  const flavorEn = species.flavor_text_entries.find((f) => f.language.name === 'en');
  const description = cleanFlavor(flavorEs?.flavor_text ?? flavorEn?.flavor_text ?? '');
  const genusEs = species.genera.find((g) => g.language.name === 'es')?.genus;
  const genusEn = species.genera.find((g) => g.language.name === 'en')?.genus ?? 'Pokémon';

  const base: Pokemon = {
    id: poke.id,
    slug: poke.name,
    name: { en: nameEn, es: nameEs },
    types,
    primaryType,
    typeColor: deriveTypeColor(primaryType),
    stats,
    abilities,
    generation: deriveGeneration(species),
    category: genusEs ?? genusEn,
    description: description || 'Sin descripción disponible.',
    heightM: poke.height / 10,
    weightKg: poke.weight / 10,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    evolutionChainId: species.evolution_chain?.url
      ? extractIdFromUrl(species.evolution_chain.url)
      : null,
    imageUrl: poke.sprites.other?.home?.front_default
      ?? poke.sprites.front_default
      ?? SPRITE_HOME(poke.id),
  };

  return applyMockOverrides(base);
}

export async function getPokemonList(
  limit: number = GEN_3_MAX_ID,
  offset: number = 0,
): Promise<Pokemon[]> {
  const ids = Array.from({ length: limit }, (_, i) => i + 1 + offset);
  const chunkSize = 20;
  const out: Pokemon[] = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map((id) =>
        getPokemonBasic(id).catch((err) => {
          console.warn(`[pokeapi] skip id=${id}`, err);
          return null;
        }),
      ),
    );
    for (const r of results) if (r) out.push(r);
  }
  return out;
}

function mapEvoMethod(details: PokeApiEvoDetail[]): EvolutionMethod | null {
  if (!details || details.length === 0) return null;
  const d = details[0] as PokeApiEvoDetail & {
    known_move_type?: PokeApiNamedRef | null;
    min_affection?: number | null;
  };
  const triggerName = d.trigger.name;
  let trigger: EvolutionTrigger = 'other';
  if (triggerName === 'level-up') trigger = d.min_happiness != null ? 'friendship' : 'level-up';
  else if (triggerName === 'use-item') trigger = 'use-item';
  else if (triggerName === 'trade') trigger = 'trade';

  const timeOfDay = (d.time_of_day || '') as '' | 'day' | 'night';

  return {
    trigger,
    minLevel: d.min_level ?? undefined,
    item: d.item?.name,
    location: d.location?.name ?? undefined,
    timeOfDay,
    knownMoveType: d.known_move_type?.name as PokemonType | undefined,
    minAffection: d.min_affection ?? undefined,
    condition: d.known_move?.name ?? undefined,
  };
}

function flattenChain(node: PokeApiEvoNode, stage: 0 | 1 | 2, acc: EvolutionStage[]) {
  const pokemonId = extractIdFromUrl(node.species.url);
  acc.push({
    pokemonId,
    stage,
    method: mapEvoMethod(node.evolution_details),
  });
  const nextStage = (stage + 1) as 0 | 1 | 2;
  for (const child of node.evolves_to) {
    flattenChain(child, nextStage > 2 ? 2 : nextStage, acc);
  }
}

async function getEvolutionChain(chainId: number): Promise<EvolutionChain> {
  const raw = await fetchJson<PokeApiEvolutionChain>(
    EVOLUTION_CHAIN_URL(chainId),
    `evo:${chainId}`,
  );
  const stages: EvolutionStage[] = [];
  flattenChain(raw.chain, 0, stages);
  return { id: raw.id, stages };
}

async function enrichEvolutionStage(stage: EvolutionStage): Promise<EvolutionStageRich> {
  try {
    const [poke, species] = await Promise.all([
      fetchJson<PokeApiPokemon>(POKEMON_URL(stage.pokemonId), `pokemon:${stage.pokemonId}`),
      fetchJson<PokeApiSpecies>(SPECIES_URL(stage.pokemonId), `species:${stage.pokemonId}`),
    ]);
    const types = mapTypes(poke.types);
    const nameEs = pickEsName(species.names, poke.name);
    const sprite =
      poke.sprites.other?.['official-artwork']?.front_default ??
      SPRITE_OFFICIAL_ARTWORK(stage.pokemonId);
    const homeSprite =
      poke.sprites.other?.home?.front_default ??
      poke.sprites.front_default ??
      sprite;
    return {
      ...stage,
      nameEs,
      types,
      primaryType: types[0],
      spriteUrl: homeSprite,
    };
  } catch {
    return {
      ...stage,
      nameEs: `Pokémon #${stage.pokemonId}`,
      types: ['normal'],
      primaryType: 'normal',
      spriteUrl: SPRITE_OFFICIAL_ARTWORK(stage.pokemonId),
    };
  }
}

async function enrichEvolutionChain(chain: EvolutionChain): Promise<EvolutionChainRich> {
  const stages = await Promise.all(chain.stages.map(enrichEvolutionStage));
  return { id: chain.id, stages };
}

function pickPokemonVersionGroup(entries: PokeApiPokemon['moves']): string | null {
  const groups = new Set<string>();
  for (const m of entries) {
    for (const v of m.version_group_details) {
      groups.add(v.version_group.name);
    }
  }
  for (const candidate of VERSION_GROUP_PRIORITY) {
    if (groups.has(candidate)) return candidate;
  }
  return null;
}

const DAMAGE_CLASS_MAP: Record<string, MoveCategory> = {
  physical: 'physical',
  special: 'special',
  status: 'status',
};

const LEARN_METHOD_MAP: Record<string, MoveLearnMethod> = {
  'level-up': 'level-up',
  machine: 'machine',
  egg: 'egg',
  tutor: 'tutor',
};

async function fetchMoveFull(slug: string): Promise<Omit<MoveDetail, 'learnMethod' | 'learnLevel'>> {
  const m = await fetchJson<PokeApiMove>(MOVE_URL(slug), `move:${slug}`);
  const nameEs = pickEsName(m.names, m.name);
  const nameEn = m.names.find((n) => n.language.name === 'en')?.name ?? m.name;
  return {
    slug,
    nameEs,
    nameEn,
    type: m.type.name as PokemonType,
    category: DAMAGE_CLASS_MAP[m.damage_class.name] ?? 'status',
    power: m.power,
    accuracy: m.accuracy,
    pp: m.pp,
  };
}

async function mapMoves(
  raw: PokeApiPokemon['moves'],
  versionGroup: string | null,
): Promise<MoveDetail[]> {
  if (!versionGroup) return [];

  const selected: { slug: string; learnMethod: MoveLearnMethod; learnLevel?: number }[] = [];
  for (const entry of raw) {
    const detail = entry.version_group_details.find(
      (v) => v.version_group.name === versionGroup,
    );
    if (!detail) continue;
    const methodName = detail.move_learn_method.name;
    const learnMethod = LEARN_METHOD_MAP[methodName];
    if (!learnMethod) continue;
    selected.push({
      slug: entry.move.name,
      learnMethod,
      learnLevel: learnMethod === 'level-up' ? detail.level_learned_at : undefined,
    });
  }

  const chunkSize = 12;
  const out: MoveDetail[] = [];
  for (let i = 0; i < selected.length; i += chunkSize) {
    const chunk = selected.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(async (s) => {
        try {
          const meta = await fetchMoveFull(s.slug);
          return { ...meta, learnMethod: s.learnMethod, learnLevel: s.learnLevel };
        } catch (err) {
          console.warn(`[pokeapi] skip move=${s.slug}`, err);
          return null;
        }
      }),
    );
    for (const r of results) if (r) out.push(r);
  }

  return out;
}

async function fetchLocationName(slug: string): Promise<string> {
  try {
    const loc = await fetchJson<PokeApiLocationArea>(
      LOCATION_AREA_URL(slug),
      `location:${slug}`,
    );
    return pickEsName(loc.names, slug.replace(/-/g, ' '));
  } catch {
    return slug.replace(/-/g, ' ');
  }
}

async function getEncounters(id: number): Promise<EncounterByGame[]> {
  let raw: PokeApiEncounter[];
  try {
    raw = await fetchJson<PokeApiEncounter[]>(ENCOUNTERS_URL(id), `encounters:${id}`);
  } catch {
    return [];
  }
  if (raw.length === 0) return [];

  const grouped = new Map<string, Set<string>>();
  for (const encounter of raw) {
    const locSlug = encounter.location_area.name;
    for (const v of encounter.version_details) {
      const versionLabel = VERSION_LABEL_ES[v.version.name] ?? v.version.name;
      if (!grouped.has(versionLabel)) grouped.set(versionLabel, new Set());
      grouped.get(versionLabel)!.add(locSlug);
    }
  }

  const result: EncounterByGame[] = [];
  for (const [game, slugs] of grouped) {
    const locationsEs = await Promise.all(Array.from(slugs).map(fetchLocationName));
    result.push({ game, locationsEs: Array.from(new Set(locationsEs)).sort() });
  }
  return result.sort((a, b) => a.game.localeCompare(b.game));
}

export async function getPokemonCore(id: number): Promise<PokemonCore> {
  const basic = await getPokemonBasic(id);
  const poke = await fetchJson<PokeApiPokemon>(POKEMON_URL(id), `pokemon:${id}`);

  const rawChain = basic.evolutionChainId
    ? await getEvolutionChain(basic.evolutionChainId)
    : { id: 0, stages: [] };
  const evolutionChain = await enrichEvolutionChain(rawChain);

  const artworkUrl =
    poke.sprites.other?.['official-artwork']?.front_default ??
    SPRITE_OFFICIAL_ARTWORK(id);

  return {
    ...basic,
    artworkUrl,
    weaknesses: calcWeaknesses(basic.types),
    evolutionChain,
  };
}

export async function getPokemonMoves(id: number): Promise<MoveDetail[]> {
  const poke = await fetchJson<PokeApiPokemon>(POKEMON_URL(id), `pokemon:${id}`);
  const versionGroup = pickPokemonVersionGroup(poke.moves);
  return mapMoves(poke.moves, versionGroup);
}

export async function getPokemonEncounters(id: number): Promise<EncounterByGame[]> {
  return getEncounters(id);
}

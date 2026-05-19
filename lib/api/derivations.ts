import type {
  Ability,
  BestNaturePick,
  Effectiveness,
  MoveDetail,
  Nature,
  PokemonType,
  StatBlock,
} from '@/lib/types/pokemon';
import { typeChart } from '@/lib/mock/type-chart';
import { naturesMock } from '@/lib/mock/natures';

const ALL_TYPES: PokemonType[] = [
  'normal','fire','water','electric','grass','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy',
];

export function calcWeaknesses(
  defenders: [PokemonType] | [PokemonType, PokemonType],
): Record<PokemonType, Effectiveness> {
  const out = {} as Record<PokemonType, Effectiveness>;
  for (const attacker of ALL_TYPES) {
    const a = typeChart[attacker][defenders[0]];
    const b = defenders.length === 2 ? typeChart[attacker][defenders[1]] : 1;
    out[attacker] = (a * b) as Effectiveness;
  }
  return out;
}

const STRONG_HIDDEN_ABILITIES = new Set<string>([
  'levitate', 'speed-boost', 'drought', 'drizzle', 'wonder-guard',
  'huge-power', 'pure-power', 'sand-stream', 'snow-warning',
  'protean', 'libero', 'multiscale', 'magic-bounce', 'regenerator',
  'unaware', 'tough-claws', 'sheer-force', 'adaptability', 'technician',
  'mold-breaker', 'no-guard', 'simple', 'water-veil', 'thick-fat',
  'intimidate', 'serene-grace', 'guts', 'flash-fire', 'storm-drain',
  'lightning-rod', 'water-absorb', 'volt-absorb', 'sap-sipper',
]);

export function pickBestAbility(abilities: Ability[]): Ability {
  if (abilities.length === 0) {
    throw new Error('pickBestAbility: empty list');
  }
  const hidden = abilities.find((a) => a.hidden);
  if (hidden && STRONG_HIDDEN_ABILITIES.has(hidden.slug)) {
    return hidden;
  }
  const slot1 = abilities.find((a) => a.slot === 1 && !a.hidden);
  return slot1 ?? abilities[0];
}

const STAT_LABEL_ES: Record<keyof StatBlock, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  spAttack: 'Ataque Especial',
  spDefense: 'Defensa Especial',
  speed: 'Velocidad',
};

function findNature(raised: keyof StatBlock, lowered: keyof StatBlock): Nature | undefined {
  return naturesMock.find(
    (n) => n.raisedStat === raised && n.loweredStat === lowered && !n.neutral,
  );
}

export function pickBestNature(stats: StatBlock): BestNaturePick {
  const physical = stats.attack;
  const special = stats.spAttack;
  const speed = stats.speed;
  const bulk = stats.hp + stats.defense + stats.spDefense;
  const isPhysical = physical > special;
  const isFast = speed >= 80;
  const isBulky = bulk >= 280;

  let raised: keyof StatBlock;
  let lowered: keyof StatBlock;
  let reason: string;

  if (isPhysical && isFast) {
    raised = 'speed';
    lowered = 'spAttack';
    reason = `Aprovecha su Velocidad base ${speed} sin sacrificar su Ataque físico.`;
  } else if (isPhysical && !isFast) {
    raised = 'attack';
    lowered = 'spAttack';
    reason = `Maximiza su poder físico (Ataque base ${physical}) sin tocar su pobre Velocidad.`;
  } else if (!isPhysical && isFast) {
    raised = 'speed';
    lowered = 'attack';
    reason = `Velocidad base ${speed} le permite golpear primero con su Ataque Especial intacto.`;
  } else if (!isPhysical && !isFast && isBulky) {
    raised = 'spDefense';
    lowered = 'attack';
    reason = `Su masa defensiva (${bulk} pts) brilla con resistencia especial reforzada.`;
  } else {
    raised = 'spAttack';
    lowered = 'attack';
    reason = `Su Ataque Especial base ${special} es su mejor herramienta ofensiva.`;
  }

  const nature =
    findNature(raised, lowered) ?? naturesMock.find((n) => n.neutral) ?? naturesMock[0];

  return { nature, reason };
}

export function describeNatureBoost(nature: Nature): {
  raisedLabel: string | null;
  loweredLabel: string | null;
} {
  if (nature.neutral || !nature.raisedStat || !nature.loweredStat) {
    return { raisedLabel: null, loweredLabel: null };
  }
  return {
    raisedLabel: STAT_LABEL_ES[nature.raisedStat],
    loweredLabel: STAT_LABEL_ES[nature.loweredStat],
  };
}

export function pickTopMoves(
  moves: MoveDetail[],
  types: [PokemonType] | [PokemonType, PokemonType],
  limit = 4,
): MoveDetail[] {
  const typeSet = new Set<PokemonType>(types);
  const scored = moves
    .filter((m) => m.category !== 'status' && (m.power ?? 0) > 0)
    .map((m) => {
      const stab = typeSet.has(m.type) ? 1.5 : 1;
      const accuracy = (m.accuracy ?? 100) / 100;
      const score = (m.power ?? 0) * stab * accuracy;
      return { move: m, score };
    })
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const out: MoveDetail[] = [];
  for (const { move } of scored) {
    if (seen.has(move.slug)) continue;
    seen.add(move.slug);
    out.push(move);
    if (out.length >= limit) break;
  }
  return out;
}

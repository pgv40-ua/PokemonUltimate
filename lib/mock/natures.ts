import type { Nature } from '@/lib/types/pokemon';

// 25 natures in canonical 5×5 order (rows by raised stat, columns by lowered stat)
// Neutral natures: raised === lowered stat (no net change)
export const naturesMock: Nature[] = [
  // ── Neutral row (Attack) ─────────────────────────────────────────
  { nameEn: 'Hardy',   nameEs: 'Fuerte',    raisedStat: 'attack',    loweredStat: 'attack',    neutral: true  },
  { nameEn: 'Lonely',  nameEs: 'Huraña',    raisedStat: 'attack',    loweredStat: 'defense',   neutral: false },
  { nameEn: 'Brave',   nameEs: 'Audaz',     raisedStat: 'attack',    loweredStat: 'speed',     neutral: false },
  { nameEn: 'Adamant', nameEs: 'Firme',     raisedStat: 'attack',    loweredStat: 'spAttack',  neutral: false },
  { nameEn: 'Naughty', nameEs: 'Pícara',    raisedStat: 'attack',    loweredStat: 'spDefense', neutral: false },

  // ── Neutral row (Defense) ────────────────────────────────────────
  { nameEn: 'Bold',    nameEs: 'Osada',     raisedStat: 'defense',   loweredStat: 'attack',    neutral: false },
  { nameEn: 'Docile',  nameEs: 'Dócil',     raisedStat: 'defense',   loweredStat: 'defense',   neutral: true  },
  { nameEn: 'Relaxed', nameEs: 'Plácida',   raisedStat: 'defense',   loweredStat: 'speed',     neutral: false },
  { nameEn: 'Impish',  nameEs: 'Agitada',   raisedStat: 'defense',   loweredStat: 'spAttack',  neutral: false },
  { nameEn: 'Lax',     nameEs: 'Floja',     raisedStat: 'defense',   loweredStat: 'spDefense', neutral: false },

  // ── Neutral row (Speed) ──────────────────────────────────────────
  { nameEn: 'Timid',   nameEs: 'Miedosa',   raisedStat: 'speed',     loweredStat: 'attack',    neutral: false },
  { nameEn: 'Hasty',   nameEs: 'Activa',    raisedStat: 'speed',     loweredStat: 'defense',   neutral: false },
  { nameEn: 'Serious', nameEs: 'Seria',     raisedStat: 'speed',     loweredStat: 'speed',     neutral: true  },
  { nameEn: 'Jolly',   nameEs: 'Alegre',    raisedStat: 'speed',     loweredStat: 'spAttack',  neutral: false },
  { nameEn: 'Naive',   nameEs: 'Ingenua',   raisedStat: 'speed',     loweredStat: 'spDefense', neutral: false },

  // ── Neutral row (Sp. Attack) ─────────────────────────────────────
  { nameEn: 'Modest',  nameEs: 'Modesta',   raisedStat: 'spAttack',  loweredStat: 'attack',    neutral: false },
  { nameEn: 'Mild',    nameEs: 'Afable',    raisedStat: 'spAttack',  loweredStat: 'defense',   neutral: false },
  { nameEn: 'Quiet',   nameEs: 'Tranquila', raisedStat: 'spAttack',  loweredStat: 'speed',     neutral: false },
  { nameEn: 'Bashful', nameEs: 'Tímida',    raisedStat: 'spAttack',  loweredStat: 'spAttack',  neutral: true  },
  { nameEn: 'Rash',    nameEs: 'Alocada',   raisedStat: 'spAttack',  loweredStat: 'spDefense', neutral: false },

  // ── Neutral row (Sp. Defense) ────────────────────────────────────
  { nameEn: 'Calm',    nameEs: 'Serena',    raisedStat: 'spDefense', loweredStat: 'attack',    neutral: false },
  { nameEn: 'Gentle',  nameEs: 'Amable',    raisedStat: 'spDefense', loweredStat: 'defense',   neutral: false },
  { nameEn: 'Sassy',   nameEs: 'Grosera',   raisedStat: 'spDefense', loweredStat: 'speed',     neutral: false },
  { nameEn: 'Careful', nameEs: 'Cauta',     raisedStat: 'spDefense', loweredStat: 'spAttack',  neutral: false },
  { nameEn: 'Quirky',  nameEs: 'Rara',      raisedStat: 'spDefense', loweredStat: 'spDefense', neutral: true  },
];

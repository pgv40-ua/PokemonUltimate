import type { EvolutionChain } from '@/lib/types/pokemon';

export const evolutionChainsMock: EvolutionChain[] = [
  {
    id: 1,
    stages: [
      {
        pokemonId: 1,
        stage: 0,
        method: null,
      },
      {
        pokemonId: 2,
        stage: 1,
        method: { trigger: 'level-up', minLevel: 16 },
      },
      {
        pokemonId: 3,
        stage: 2,
        method: { trigger: 'level-up', minLevel: 32 },
      },
    ],
  },
  {
    id: 2,
    stages: [
      {
        pokemonId: 4,
        stage: 0,
        method: null,
      },
      {
        pokemonId: 5,
        stage: 1,
        method: { trigger: 'level-up', minLevel: 16 },
      },
      {
        pokemonId: 6,
        stage: 2,
        method: { trigger: 'level-up', minLevel: 36 },
      },
    ],
  },
  {
    id: 3,
    stages: [
      {
        pokemonId: 92,
        stage: 0,
        method: null,
      },
      {
        pokemonId: 93,
        stage: 1,
        method: { trigger: 'level-up', minLevel: 25 },
      },
      {
        pokemonId: 94,
        stage: 2,
        method: { trigger: 'trade' },
      },
    ],
  },
];

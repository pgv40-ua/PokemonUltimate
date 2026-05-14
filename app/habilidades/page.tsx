import type { Metadata } from 'next';

import { HabilidadesClient } from './HabilidadesClient';

export const metadata: Metadata = {
  title: 'Habilidades y Naturalezas — PokéDex Ultimate',
  description:
    'Guía completa de habilidades Pokémon del meta competitivo y tabla exhaustiva de las 25 naturalezas.',
};

export default function HabilidadesPage() {
  return <HabilidadesClient />;
}

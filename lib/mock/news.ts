import type { NewsItem } from '@/lib/types/pokemon';

export const newsMock: NewsItem[] = [
  {
    slug: 'pokemon-legends-za-todo-lo-que-sabemos',
    title: 'Pokémon Legends Z-A — Todo lo que sabemos',
    category: 'Juego',
    date: '2026-05-10',
    excerpt: 'El regreso a Kalos promete rediseñar Lumiose City con mecánicas Mega Evolution renovadas. Repasamos todos los detalles revelados hasta ahora.',
    featured: true,
    gradientFrom: '#E3350D',
    gradientTo: '#8B0000',
  },
  {
    slug: 'campeonato-mundial-2025-equipos-mas-usados',
    title: 'Campeonato Mundial 2025 — Equipos más usados',
    category: 'Torneo',
    date: '2026-05-07',
    excerpt: 'Gholdengo, Garchomp y Flutter Mane dominaron el top 8. Analizamos las estrategias que llevaron a los mejores entrenadores a la cima.',
    featured: false,
    gradientFrom: '#FFD700',
    gradientTo: '#FFA500',
  },
  {
    slug: 'nueva-temporada-anime-pokehorizons',
    title: 'Nueva temporada del anime: PokéHorizons',
    category: 'Anime',
    date: '2026-05-03',
    excerpt: 'Liko y Roy continúan su aventura con nuevos compañeros Pokémon. La serie sigue sorprendiendo con su animación y profundidad narrativa.',
    featured: false,
    gradientFrom: '#7B2FBE',
    gradientTo: '#4B0082',
  },
  {
    slug: 'tier-list-competitiva-mayo-2026',
    title: 'Tier list competitiva de mayo',
    category: 'Competitivo',
    date: '2026-05-01',
    excerpt: 'Actualización del meta SV OU: Gholdengo sube al S-tier, Roaring Moon cae a UU tras el último ban. Todos los cambios explicados.',
    featured: false,
    gradientFrom: '#00BFFF',
    gradientTo: '#0050A0',
  },
];

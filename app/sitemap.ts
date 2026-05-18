import type { MetadataRoute } from 'next';

const BASE_URL = 'https://pokemon-ultimate.vercel.app';

const NEWS_SLUGS = [
  'legends-za-nuevos-pokemon-confirmados',
  'pokemon-legends-za-todo-lo-que-sabemos',
  'campeonato-mundial-2025-equipos-mas-usados',
  'nueva-temporada-anime-pokehorizons',
  'tier-list-competitiva-mayo-2026',
  'regionals-madrid-top-8-abril',
  'pokehorizons-season2-trailer',
  'smogon-ban-palafin-hero',
  'pokemon-go-mes-legendarios-abril',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/pokedex`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/novedades`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/evoluciones`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tipos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/habilidades`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = NEWS_SLUGS.map((slug) => ({
    url: `${BASE_URL}/novedades/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}

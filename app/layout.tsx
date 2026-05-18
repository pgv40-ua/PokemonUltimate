import type { Metadata, Viewport } from 'next';
import { Exo_2, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { CursorProvider } from '@/components/providers/CursorProvider';
import { cn } from '@/lib/utils/cn';
import './globals.css';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pokemonultimate.vercel.app'),
  title: 'PokéDex Ultimate — La enciclopedia Pokémon definitiva',
  description:
    'Stats, evoluciones, habilidades, naturalezas, novedades y meta competitivo. La referencia Pokémon más completa, en un solo lugar.',
  keywords: ['pokédex', 'pokémon', 'stats', 'evoluciones', 'habilidades', 'meta competitivo', 'tipos', 'naturalezas'],
  openGraph: {
    title: 'PokéDex Ultimate',
    description:
      'La enciclopedia Pokémon más completa del mundo — stats, evoluciones, habilidades y meta competitivo.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://pokemonultimate.vercel.app',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'PokéDex Ultimate — La enciclopedia Pokémon definitiva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PokéDex Ultimate',
    description: 'La enciclopedia Pokémon más completa del mundo — stats, evoluciones, habilidades y meta competitivo.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={cn(exo2.variable, dmSans.variable, jetbrains.variable)}
    >
      <body className="font-body bg-bg text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9998] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-yellow focus:text-black focus:font-display focus:font-bold focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        <LenisProvider>
          <CursorProvider>{children}</CursorProvider>
        </LenisProvider>
      </body>
    </html>
  );
}

'use client';

import type { NewsItem, NewsCategory } from '@/lib/types/pokemon';
import { newsMock } from '@/lib/mock/news';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const categoryColor: Record<NewsCategory, 'red' | 'yellow' | 'purple' | 'blue'> = {
  Juego: 'red',
  Torneo: 'yellow',
  Anime: 'purple',
  Competitivo: 'blue',
};

function formatDate(iso: string): string {
  // e.g. "2026-05-10" → "10 may. 2026"
  const [year, month, day] = iso.split('-');
  const monthNames = [
    'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.',
    'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.',
  ];
  return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CardImageProps {
  gradientFrom: string;
  gradientTo: string;
  heightClass: string;
}

function CardImage({ gradientFrom, gradientTo, heightClass }: CardImageProps) {
  return (
    <div className={`w-full overflow-hidden rounded-t-card ${heightClass}`}>
      <div
        className="w-full h-full"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        aria-hidden="true"
      />
    </div>
  );
}

interface CardMetaProps {
  category: NewsCategory;
  date: string;
}

function CardMeta({ category, date }: CardMetaProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <Badge color={categoryColor[category]} size="sm">
        {category}
      </Badge>
      <time
        dateTime={date}
        className="font-mono text-xs text-text-muted tabular-nums"
      >
        {formatDate(date)}
      </time>
    </div>
  );
}

// ─── Featured card (col-span-2 row-span-3) ───────────────────────────────────

interface FeaturedCardProps {
  item: NewsItem;
}

function FeaturedCard({ item }: FeaturedCardProps) {
  const headingId = `news-heading-${item.slug}`;

  return (
    <Card
      as="article"
      glowColor={item.gradientFrom}
      aria-labelledby={headingId}
      className="flex flex-col overflow-hidden h-full transition-transform duration-base ease-smooth hover:scale-[1.02]"
    >
      <CardImage
        gradientFrom={item.gradientFrom}
        gradientTo={item.gradientTo}
        heightClass="h-64 lg:h-96 flex-shrink-0"
      />

      <div className="flex flex-col flex-1 p-6 lg:p-8 gap-4">
        <CardMeta category={item.category} date={item.date} />

        <h3
          id={headingId}
          className="font-display font-bold text-2xl lg:text-3xl text-text-primary leading-tight"
        >
          {item.title}
        </h3>

        <p className="font-body text-text-secondary text-sm lg:text-base leading-relaxed line-clamp-3">
          {item.excerpt}
        </p>

        <a
          href={`/novedades/${item.slug}`}
          aria-label={`Leer más sobre ${item.title}`}
          className="inline-flex items-center gap-1 text-sm font-body font-medium text-accent-yellow
                     hover:text-accent-yellow/80 transition-colors duration-base ease-smooth
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow
                     focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
        >
          Leer más
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </Card>
  );
}

// ─── Small card (col-span-1 row-span-1) ──────────────────────────────────────

interface SmallCardProps {
  item: NewsItem;
}

function SmallCard({ item }: SmallCardProps) {
  const headingId = `news-heading-${item.slug}`;

  return (
    <Card
      as="article"
      glowColor={item.gradientFrom}
      aria-labelledby={headingId}
      className="flex flex-col overflow-hidden h-full transition-transform duration-base ease-smooth hover:scale-[1.02]"
    >
      <CardImage
        gradientFrom={item.gradientFrom}
        gradientTo={item.gradientTo}
        heightClass="h-36 lg:h-40 flex-shrink-0"
      />

      <div className="flex flex-col flex-1 p-4 lg:p-5 gap-3">
        <CardMeta category={item.category} date={item.date} />

        <h3
          id={headingId}
          className="font-display font-bold text-base lg:text-lg text-text-primary leading-snug"
        >
          {item.title}
        </h3>

        <p className="font-body text-text-secondary text-xs lg:text-sm leading-relaxed line-clamp-2 flex-1">
          {item.excerpt}
        </p>

        <a
          href={`/novedades/${item.slug}`}
          aria-label={`Leer más sobre ${item.title}`}
          className="inline-flex items-center gap-1 text-xs font-body font-medium text-accent-yellow
                     hover:text-accent-yellow/80 transition-colors duration-base ease-smooth
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow
                     focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
        >
          Leer más
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </Card>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function Novedades() {
  // Top 6 for the landing: 1 featured + 2 stacked right + 3 bottom row
  const topSix = [...newsMock]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  const featured = topSix.find((item) => item.featured) ?? topSix[0];
  const secondary = topSix.filter((item) => item.slug !== featured.slug);

  return (
    <section
      id="novedades"
      aria-label="Novedades del mundo Pokémon"
      className="relative py-24 lg:py-32 scroll-snap-start"
    >
      <div className="container-app">
        {/* ── Section header ── */}
        <div className="relative mb-12 lg:mb-16">
          <span
            aria-hidden="true"
            className="absolute -top-6 left-0 font-display font-black
                       leading-none opacity-[0.04] blur-sm select-none pointer-events-none
                       text-text-primary"
            style={{ fontSize: 'clamp(80px, 16vw, 160px)' }}
          >
            01
          </span>

          <Reveal stagger={0.08}>
            <p className="eyebrow mb-4 relative z-10">Novedades · Mundo Pokémon</p>

            <h2
              className="relative z-10 font-display font-black uppercase
                         text-4xl lg:text-5xl xl:text-6xl leading-none tracking-tight text-text-primary"
            >
              Lo último del mundo Pokémon
            </h2>
          </Reveal>
        </div>

        {/* ── Row 1: Featured left (2/3) + 2 stacked cards right (1/3) ──
            Reveal.Item explicit so the grid sees `lg:col-span-2` on the
            actual grid item — without it the auto-wrapper swallows the
            col-span and column 3 stays empty. */}
        <Reveal
          stagger={0.08}
          margin="-80px"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 lg:items-stretch"
        >
          <Reveal.Item className="lg:col-span-2 lg:h-full">
            <FeaturedCard item={featured} />
          </Reveal.Item>

          <Reveal.Item className="flex flex-col gap-6 lg:h-full">
            <div className="flex-1 min-h-0">
              <SmallCard item={secondary[0]} />
            </div>
            <div className="flex-1 min-h-0">
              <SmallCard item={secondary[1]} />
            </div>
          </Reveal.Item>
        </Reveal>

        {/* ── Row 2: 3 equal cards — 3 columns, zero empty cells ── */}
        <Reveal
          stagger={0.08}
          margin="-40px"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {secondary.slice(2).map((item) => (
            <SmallCard key={item.slug} item={item} />
          ))}
        </Reveal>

        {/* ── CTA to full novedades page ── */}
        <div className="mt-10 flex justify-center">
          <a
            href="/novedades"
            className="inline-flex items-center gap-2 border border-white/20 text-text-secondary
                       px-6 py-3 rounded-full font-body font-medium text-sm
                       hover:border-white/40 hover:text-white
                       transition-colors duration-base ease-smooth
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
          >
            Ver todas las novedades
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

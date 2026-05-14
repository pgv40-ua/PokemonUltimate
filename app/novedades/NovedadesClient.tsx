'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { newsMock } from '@/lib/mock/news';
import type { NewsCategory, NewsItem } from '@/lib/types/pokemon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Array<'Todas' | NewsCategory> = [
  'Todas',
  'Juego',
  'Torneo',
  'Anime',
  'Competitivo',
];

const categoryColor: Record<NewsCategory, 'red' | 'yellow' | 'purple' | 'blue'> = {
  Juego: 'red',
  Torneo: 'yellow',
  Anime: 'purple',
  Competitivo: 'blue',
};

// ─── Animation tokens ────────────────────────────────────────────────────────

const easing = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const containerVariantsReduced = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing },
  },
};

const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthNames = [
    'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.',
    'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.',
  ];
  return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

// ─── NewsCard ─────────────────────────────────────────────────────────────────

interface NewsCardProps {
  item: NewsItem;
}

function NewsCard({ item }: NewsCardProps) {
  const headingId = `news-heading-${item.slug}`;

  return (
    <Card
      as="article"
      glowColor={item.gradientFrom}
      aria-labelledby={headingId}
      className="flex flex-col overflow-hidden h-full"
    >
      {/* Gradient image placeholder */}
      <div
        className="h-44 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
        }}
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 lg:p-6 gap-3">
        {/* Meta row: badge + date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge color={categoryColor[item.category]} size="sm">
            {item.category}
          </Badge>
          <time
            dateTime={item.date}
            className="font-mono text-xs text-text-muted tabular-nums"
          >
            {formatDate(item.date)}
          </time>
        </div>

        {/* Title */}
        <h2
          id={headingId}
          className="font-display font-bold text-lg text-text-primary leading-snug"
        >
          {item.title}
        </h2>

        {/* Excerpt */}
        <p className="font-body text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
          {item.excerpt}
        </p>

        {/* CTA link */}
        <Link
          href={`/novedades/${item.slug}`}
          aria-label={`Leer más sobre ${item.title}`}
          className="
            inline-flex items-center gap-1 mt-1
            text-sm font-body font-medium text-accent-yellow
            hover:text-accent-yellow/80
            transition-colors duration-base ease-smooth
            focus-visible:outline-none
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#FFD700]
            rounded-sm
          "
        >
          Leer más
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </Card>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

interface FilterPillProps {
  label: 'Todas' | NewsCategory;
  isActive: boolean;
  onClick: () => void;
}

function FilterPill({ label, isActive, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        px-4 py-2 rounded-full text-sm font-body font-medium
        transition-colors duration-base ease-smooth
        focus-visible:outline-none
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#FFD700]
        ${
          isActive
            ? 'bg-accent-yellow text-black font-bold'
            : 'border border-white/20 text-text-secondary hover:border-white/40 hover:text-white'
        }
      `}
    >
      {label}
    </button>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export function NovedadesClient() {
  const [activeCategory, setActiveCategory] = useState<'Todas' | NewsCategory>('Todas');
  const shouldReduceMotion = useReducedMotion();

  const filtered = (
    activeCategory === 'Todas'
      ? newsMock
      : newsMock.filter((n) => n.category === activeCategory)
  ).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const resolvedContainerVariants = shouldReduceMotion
    ? containerVariantsReduced
    : containerVariants;
  const resolvedCardVariants = shouldReduceMotion ? cardVariantsReduced : cardVariants;

  return (
    <section
      id="novedades-page"
      aria-label="Página de novedades"
      className="relative py-24 lg:py-32"
    >
      <div className="container-app">

        {/* ── Section header ── */}
        <div className="relative mb-12 lg:mb-16">
          {/* Decorative number behind H1 */}
          <span
            aria-hidden="true"
            className="
              absolute -top-4 left-0
              font-display font-black leading-none select-none pointer-events-none
              text-text-primary opacity-[0.04] blur-sm
              text-[120px] lg:text-[200px]
            "
          >
            04
          </span>

          <p className="eyebrow mb-4 relative z-10">
            Novedades · Mundo Pokémon
          </p>

          <h1
            className="
              relative z-10
              font-display font-black uppercase
              text-5xl lg:text-7xl
              leading-none tracking-tight
              text-text-primary
            "
          >
            Últimas noticias
          </h1>
        </div>

        {/* ── Category filter pills ── */}
        <nav
          aria-label="Filtrar noticias por categoría"
          className="flex flex-wrap gap-3 mb-10 lg:mb-14"
        >
          {CATEGORIES.map((cat) => (
            <FilterPill
              key={cat}
              label={cat}
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </nav>

        {/* ── News grid ── */}
        <div
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeCategory}
                variants={resolvedContainerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((item) => (
                  <motion.div
                    key={item.slug}
                    variants={resolvedCardVariants}
                  >
                    <NewsCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center font-body text-text-muted py-16"
              >
                No hay noticias en esta categoría por el momento.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

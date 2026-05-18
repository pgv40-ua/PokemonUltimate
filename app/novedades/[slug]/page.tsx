import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { newsMock } from '@/lib/mock/news';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Badge } from '@/components/ui/Badge';
import type { NewsCategory } from '@/lib/types/pokemon';

const categoryColor: Record<NewsCategory, 'red' | 'yellow' | 'purple' | 'blue'> = {
  Juego: 'red',
  Torneo: 'yellow',
  Anime: 'purple',
  Competitivo: 'blue',
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return `${parseInt(day, 10)} de ${monthNames[parseInt(month, 10) - 1]} de ${year}`;
}

export async function generateStaticParams() {
  return newsMock.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const item = newsMock.find((n) => n.slug === params.slug);
  if (!item) return { title: 'Noticia no encontrada — PokéDex Ultimate' };
  return {
    title: `${item.title} — PokéDex Ultimate`,
    description: item.excerpt,
  };
}

export default function NovedadSlugPage({ params }: { params: { slug: string } }) {
  const item = newsMock.find((n) => n.slug === params.slug);
  if (!item) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        <article aria-labelledby="article-heading">

          {/* ── Hero gradient ── */}
          <div
            className="w-full h-56 sm:h-72 lg:h-96"
            style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}
            aria-hidden="true"
          />

          <div className="container-app py-12 lg:py-20 max-w-3xl">

            {/* ── Breadcrumb ── */}
            <nav aria-label="Miga de pan" className="flex items-center gap-2 text-sm font-body text-text-muted mb-8">
              <Link
                href="/novedades"
                className="hover:text-white transition-colors duration-base ease-smooth
                           focus-visible:outline-none focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] rounded-sm"
              >
                Novedades
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-text-secondary truncate">{item.title}</span>
            </nav>

            {/* ── Meta: badge + date ── */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
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

            {/* ── Title ── */}
            <h1
              id="article-heading"
              className="font-display font-black uppercase
                         text-3xl sm:text-4xl lg:text-5xl
                         leading-none tracking-tight text-text-primary mb-6"
            >
              {item.title}
            </h1>

            {/* ── Excerpt / lead ── */}
            <p className="font-body text-text-secondary text-lg leading-relaxed mb-12 border-l-2 border-accent-yellow/60 pl-5">
              {item.excerpt}
            </p>

            {/* ── Placeholder body ── */}
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 lg:p-12
                         flex flex-col items-center gap-4 text-center"
            >
              <span className="font-display font-black text-6xl opacity-20" aria-hidden="true">
                ✍️
              </span>
              <p className="font-display font-bold text-xl text-text-primary">
                Artículo completo próximamente
              </p>
              <p className="font-body text-sm text-text-muted max-w-sm">
                Estamos trabajando en el contenido extendido. Vuelve pronto para leer el análisis completo.
              </p>
              <Link
                href="/novedades"
                className="mt-2 inline-flex items-center gap-2 border border-white/20 text-text-secondary
                           px-5 py-2.5 rounded-full font-body font-medium text-sm
                           hover:border-white/40 hover:text-white
                           transition-colors duration-base ease-smooth
                           focus-visible:outline-none focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
              >
                ← Volver a Novedades
              </Link>
            </div>

          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

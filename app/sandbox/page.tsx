import type { Metadata } from 'next';
import Link from 'next/link';

import {
  Badge,
  Button,
  Card,
  Input,
  PokemonCard,
  StatBar,
  TypeBadge,
  TypeIcon,
} from '@/components/ui';

import {
  abilitiesMock,
  evolutionChainsMock,
  featuredPokemonMock,
  getDualEffectiveness,
  getEffectiveness,
  hallOfFameMock,
  naturesMock,
  newsMock,
  pokemonMock,
  typeChart,
} from '@/lib/mock';

import { typeHexMap, typeNamesES } from '@/lib/utils/typeColors';

import type {
  EvolutionMethod,
  Pokemon,
  PokemonCardData,
  PokemonType,
} from '@/lib/types/pokemon';

export const metadata: Metadata = {
  title: 'Sandbox · PokéDex Ultimate',
  description: 'Playground interno de primitives y data layer de Fase 1.',
  robots: { index: false, follow: false },
};

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const STAT_LABELS = ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'] as const;

function toCardData(p: Pokemon, opts: { withStats?: boolean; usagePercent?: number } = {}): PokemonCardData {
  return {
    id: p.id,
    name: p.name.es,
    types: p.types,
    sprite: p.imageUrl,
    stats: opts.withStats ? p.stats : undefined,
    usagePercent: opts.usagePercent,
  };
}

function effectivenessClasses(eff: number): string {
  if (eff === 0) return 'bg-red-950 text-red-300';
  if (eff === 0.5) return 'bg-orange-900/60 text-orange-200';
  if (eff === 2) return 'bg-green-700/70 text-green-50 font-semibold';
  if (eff === 4) return 'bg-emerald-500 text-emerald-950 font-bold';
  return 'bg-surface text-text-muted';
}

function methodLabel(m: EvolutionMethod | null): string {
  if (!m) return '— base —';
  if (m.trigger === 'level-up' && m.minLevel != null) return `Nivel ${m.minLevel}`;
  if (m.trigger === 'use-item' && m.item) return `Usar ${m.item}`;
  if (m.trigger === 'trade') return 'Intercambio';
  if (m.trigger === 'friendship') return 'Alta amistad';
  return m.condition ?? m.trigger;
}

function statKeyLabel(key: string | null): string {
  if (!key) return '—';
  const map: Record<string, string> = {
    hp: 'PS', attack: 'Ata', defense: 'Def',
    spAttack: 'AtE', spDefense: 'DfE', speed: 'Vel',
  };
  return map[key] ?? key;
}

const SECTIONS = [
  { id: 'tokens', label: '01 · Tokens & TypeBadges' },
  { id: 'typeicon', label: '02 · TypeIcon (18 SVGs)' },
  { id: 'buttons', label: '03 · Button (variants + magnetic)' },
  { id: 'badges', label: '04 · Badge' },
  { id: 'inputs', label: '05 · Input' },
  { id: 'cards', label: '06 · Card + slots' },
  { id: 'statbars', label: '07 · StatBar' },
  { id: 'pokemoncards', label: '08 · PokemonCard (3 variants)' },
  { id: 'pokedex', label: '09 · Mock — 29 Pokémon' },
  { id: 'featured', label: '10 · Mock — Destacados' },
  { id: 'hof', label: '11 · Mock — Hall of Fame' },
  { id: 'evolutions', label: '12 · Mock — Cadenas evolutivas' },
  { id: 'news', label: '13 · Mock — Novedades' },
  { id: 'abilities', label: '14 · Mock — Habilidades' },
  { id: 'natures', label: '15 · Mock — Naturalezas 5×5' },
  { id: 'typechart', label: '16 · Mock — Matriz 18×18' },
  { id: 'helpers', label: '17 · Helpers — getEffectiveness' },
];

export default function SandboxPage() {
  return (
    <main className="container-app py-16 lg:py-24 space-y-24">
      {/* ─── Header ───────────────────────────────────────────────── */}
      <header className="space-y-6">
        <p className="eyebrow">Internal · Phase 1 playground</p>
        <h1 className="font-display font-black text-4xl lg:text-6xl leading-tight">
          Sandbox de primitives y data layer.
        </h1>
        <p className="text-text-secondary max-w-2xl">
          Showcase de los 8 UI primitives y los 9 archivos de mock implementados en Fase 1.
          No indexable. <Link href="/" className="text-accent-yellow underline">← Volver a la landing</Link>
        </p>
        <nav aria-label="Índice de sandbox" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-4">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-text-secondary hover:text-accent-yellow transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      {/* ─── 01 · Tokens & TypeBadges ─────────────────────────────── */}
      <section id="tokens" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">01 · Tokens & TypeBadges</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Los 18 tipos canónicos</h2>

        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3">
          {ALL_TYPES.map((t) => (
            <div key={t} className="space-y-1.5">
              <div
                className="h-16 rounded-card border border-border-soft"
                style={{ backgroundColor: typeHexMap[t] }}
                aria-label={`Swatch ${typeNamesES[t]}`}
              />
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider text-center">
                {typeHexMap[t]}
              </p>
            </div>
          ))}
        </div>

        <h3 className="font-display font-bold text-xl mt-8">TypeBadge sizes</h3>
        <div className="space-y-3">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-xs text-text-muted w-8">{size}</span>
              {ALL_TYPES.map((t) => (
                <TypeBadge key={`${size}-${t}`} type={t} size={size} />
              ))}
            </div>
          ))}
        </div>

        <h3 className="font-display font-bold text-xl mt-8">TypeBadge con icono</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => (
            <TypeBadge key={`icon-${t}`} type={t} size="md" withIcon />
          ))}
        </div>
      </section>

      {/* ─── 02 · TypeIcon ─────────────────────────────────────────── */}
      <section id="typeicon" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">02 · TypeIcon (18 SVGs)</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">SVGs por tipo</h2>
        <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-18 gap-4">
          {ALL_TYPES.map((t) => (
            <div key={t} className="flex flex-col items-center gap-1.5">
              <div style={{ color: typeHexMap[t] }}>
                <TypeIcon type={t} size={28} />
              </div>
              <span className="font-mono text-[10px] text-text-muted">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 03 · Button ──────────────────────────────────────────── */}
      <section id="buttons" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">03 · Button</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Variants, sizes, estados</h2>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-xs text-text-muted mb-2">PRIMARY · SECONDARY · GHOST</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-text-muted mb-2">SIZES — sm · md · lg</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-text-muted mb-2">MAGNETIC — pasa el ratón cerca</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary" magnetic>Magnético 0.05 (default)</Button>
              <Button variant="primary" size="lg" magnetic>Magnético large</Button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-text-muted mb-2">LOADING · DISABLED</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary" loading>Cargando</Button>
              <Button variant="secondary" loading>Cargando</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-text-muted mb-2">asChild (wraps Next/Link)</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="secondary" asChild>
                <Link href="/">← Vuelve a /</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 04 · Badge ──────────────────────────────────────────── */}
      <section id="badges" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">04 · Badge</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Colores + estado seleccionado</h2>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge color="neutral">Neutral</Badge>
            <Badge color="red">Juego</Badge>
            <Badge color="yellow">Torneo</Badge>
            <Badge color="purple">Anime</Badge>
            <Badge color="blue">Competitivo</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge color="neutral" size="sm">sm</Badge>
            <Badge color="yellow" size="md">md</Badge>
          </div>

          <div>
            <p className="font-mono text-xs text-text-muted mb-2">SELECTED (filtros)</p>
            <div className="flex flex-wrap gap-2">
              <Badge color="neutral">Gen I</Badge>
              <Badge color="yellow" selected>Gen II (selected)</Badge>
              <Badge color="neutral">Gen III</Badge>
              <Badge color="neutral">Gen IV</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 05 · Input ────────────────────────────────────────── */}
      <section id="inputs" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">05 · Input</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Buscador glassmorphism</h2>

        <div className="space-y-4 max-w-2xl">
          <Input
            placeholder="Busca un Pokémon por nombre, número o tipo..."
            aria-label="Búsqueda de Pokémon"
          />
          <Input
            placeholder="Con icono izquierdo"
            aria-label="Búsqueda con icono"
            iconLeft={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            }
          />
          <Input
            placeholder="Disabled"
            aria-label="Input disabled"
            disabled
          />
        </div>
      </section>

      {/* ─── 06 · Card ────────────────────────────────────────── */}
      <section id="cards" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">06 · Card + slots</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Glass card con Header/Body/Footer</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Card.Header>
              <h3 className="font-display font-bold text-lg">Card simple</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-text-secondary text-sm">
                Glass card sin glow custom. Hereda hover de <code className="font-mono text-xs">.glass-card</code> en globals.css.
              </p>
            </Card.Body>
          </Card>

          <Card glowColor="rgba(112,56,248,0.45)">
            <Card.Header>
              <h3 className="font-display font-bold text-lg">Glow Dragón</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-text-secondary text-sm">Hover para ver glow morado custom.</p>
            </Card.Body>
            <Card.Footer>
              <TypeBadge type="dragon" />
            </Card.Footer>
          </Card>

          <Card glowColor="rgba(255,215,0,0.45)" as="article">
            <Card.Header>
              <h3 className="font-display font-bold text-lg">Glow Eléctrico</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-text-secondary text-sm">Aquí Card renderiza como &lt;article&gt;.</p>
            </Card.Body>
            <Card.Footer>
              <TypeBadge type="electric" withIcon />
            </Card.Footer>
          </Card>
        </div>
      </section>

      {/* ─── 07 · StatBar ──────────────────────────────────────── */}
      <section id="statbars" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">07 · StatBar</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Las 6 stats con animación reveal</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <Card>
            <Card.Header>
              <h3 className="font-display font-bold">Animado (default)</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <StatBar label="HP" value={108} />
                <StatBar label="ATK" value={130} />
                <StatBar label="DEF" value={95} />
                <StatBar label="SPA" value={80} />
                <StatBar label="SPD" value={85} />
                <StatBar label="SPE" value={102} />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-display font-bold">animate=false (estático)</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <StatBar label="HP" value={108} animate={false} />
                <StatBar label="ATK" value={130} animate={false} />
                <StatBar label="DEF" value={95} animate={false} />
                <StatBar label="SPA" value={80} animate={false} />
                <StatBar label="SPD" value={85} animate={false} />
                <StatBar label="SPE" value={102} animate={false} />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-display font-bold">Uso competitivo (max=100)</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <StatBar label="Uso" value={32} max={100} color="bg-accent-yellow" />
                <StatBar label="Uso" value={18} max={100} color="bg-accent-yellow" />
                <StatBar label="Uso" value={67} max={100} color="bg-accent-yellow" />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-display font-bold">Color custom override</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <StatBar label="DRG" value={150} color="bg-purple-500" />
                <StatBar label="GHO" value={130} color="bg-fuchsia-500" />
                <StatBar label="FAI" value={70} color="bg-pink-300" />
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* ─── 08 · PokemonCard ──────────────────────────────────── */}
      <section id="pokemoncards" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">08 · PokemonCard (3 variants)</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Compact · Full · Featured</h2>

        <div className="space-y-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-3">variant=&quot;compact&quot;</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pokemonMock.slice(0, 6).map((p) => (
                <PokemonCard key={p.id} pokemon={toCardData(p)} variant="compact" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-xl mb-3">variant=&quot;full&quot; con showStats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pokemonMock.slice(0, 3).map((p) => (
                <PokemonCard
                  key={p.id}
                  pokemon={toCardData(p, { withStats: true })}
                  variant="full"
                  showStats
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-xl mb-3">variant=&quot;featured&quot; con stats + uso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPokemonMock.slice(0, 3).map((p) => (
                <PokemonCard
                  key={p.id}
                  pokemon={{
                    id: p.id,
                    name: p.name.es,
                    types: p.types,
                    sprite: p.imageUrl,
                    stats: p.stats,
                    usagePercent: p.usageRate,
                  }}
                  variant="featured"
                  showStats
                  showUsage
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 09 · Mock — Pokémon completo (29) ─────────────────── */}
      <section id="pokedex" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">09 · Mock · 29 Pokémon</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">
          Pokédex completa · cobertura 18 tipos
        </h2>
        <p className="text-text-secondary text-sm">
          Total: {pokemonMock.length} Pokémon. Ordenados por número Nacional.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pokemonMock.map((p) => (
            <PokemonCard key={p.id} pokemon={toCardData(p)} variant="compact" />
          ))}
        </div>
      </section>

      {/* ─── 10 · Mock — Destacados ───────────────────────────── */}
      <section id="featured" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">10 · Mock · Destacados</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Meta competitivo · 6 Pokémon</h2>
        <p className="text-text-secondary text-sm">
          {featuredPokemonMock.length} entradas con <code className="font-mono text-xs">usageRate</code>, <code className="font-mono text-xs">tier</code> y <code className="font-mono text-xs">role</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPokemonMock.map((p) => (
            <div key={p.id} className="space-y-2">
              <PokemonCard
                pokemon={{
                  id: p.id,
                  name: p.name.es,
                  types: p.types,
                  sprite: p.imageUrl,
                  stats: p.stats,
                  usagePercent: p.usageRate,
                }}
                variant="featured"
                showStats
                showUsage
              />
              <p className="font-mono text-xs text-text-muted text-center">
                {p.tier} · {p.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 11 · Mock — Hall of Fame ─────────────────────────── */}
      <section id="hof" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">11 · Mock · Hall of Fame</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">10 leyendas inmortales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {hallOfFameMock.map((p) => (
            <Card key={p.id} glowColor={`${typeHexMap[p.primaryType]}66`}>
              <Card.Header>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display font-bold text-lg">{p.name.es}</h3>
                  <span className="font-mono text-xs text-accent-yellow">#{p.hofRank}</span>
                </div>
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mt-1">
                  Gen {p.generation}
                </p>
              </Card.Header>
              <Card.Body>
                <p className="text-text-secondary text-sm italic leading-snug">
                  &laquo;{p.epicQuote}&raquo;
                </p>
              </Card.Body>
              <Card.Footer>
                <div className="flex flex-wrap gap-1.5">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 12 · Mock — Cadenas evolutivas ───────────────────── */}
      <section id="evolutions" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">12 · Mock · Cadenas evolutivas</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">3 cadenas lineales</h2>

        <div className="space-y-8">
          {evolutionChainsMock.map((chain) => (
            <div key={chain.id} className="flex flex-col lg:flex-row items-center gap-4">
              {chain.stages.map((stage, idx) => {
                const pkmn = pokemonMock.find((p) => p.id === stage.pokemonId);
                if (!pkmn) return null;
                return (
                  <div key={stage.pokemonId} className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="w-full lg:w-48">
                      <PokemonCard pokemon={toCardData(pkmn)} variant="compact" />
                    </div>
                    {idx < chain.stages.length - 1 && (
                      <div className="flex flex-col items-center gap-1 text-text-muted shrink-0">
                        <span className="text-2xl leading-none" aria-hidden="true">→</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider">
                          {methodLabel(chain.stages[idx + 1].method)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 13 · Mock — Novedades ────────────────────────────── */}
      <section id="news" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">13 · Mock · Novedades</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">4 artículos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsMock.map((n) => {
            const badgeColor =
              n.category === 'Juego' ? 'red'
              : n.category === 'Torneo' ? 'yellow'
              : n.category === 'Anime' ? 'purple'
              : 'blue';
            return (
              <Card key={n.slug}>
                <div
                  className="h-32 rounded-t-card"
                  style={{ background: `linear-gradient(135deg, ${n.gradientFrom} 0%, ${n.gradientTo} 100%)` }}
                  aria-hidden="true"
                />
                <Card.Body>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge color={badgeColor} size="sm">{n.category}</Badge>
                    {n.featured && <Badge color="yellow" size="sm" selected>Featured</Badge>}
                    <span className="font-mono text-xs text-text-muted ml-auto">{n.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{n.title}</h3>
                  <p className="text-text-secondary text-sm">{n.excerpt}</p>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─── 14 · Mock — Habilidades ──────────────────────────── */}
      <section id="abilities" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">14 · Mock · Habilidades</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">8 habilidades destacadas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {abilitiesMock.map((a) => (
            <Card key={a.slug}>
              <Card.Body>
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold">{a.nameEs}</h3>
                  {a.hidden && <Badge color="purple" size="sm">Oculta</Badge>}
                </div>
                <p className="text-text-secondary text-sm leading-snug">{a.description}</p>
                <p className="font-mono text-[10px] text-text-muted mt-2 uppercase tracking-wider">
                  {a.nameEn} · slot {a.slot}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 15 · Mock — Naturalezas 5×5 ─────────────────────── */}
      <section id="natures" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">15 · Mock · Naturalezas</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">25 naturalezas (5×5)</h2>
        <p className="text-text-secondary text-sm">
          Filas: stat que sube · Columnas: stat que baja · Diagonal: neutras.
        </p>

        <div className="grid grid-cols-5 gap-2 max-w-3xl">
          {naturesMock.map((n) => (
            <div
              key={n.nameEn}
              className={`glass-card !rounded-lg p-3 text-center ${n.neutral ? 'opacity-60' : ''}`}
            >
              <p className="font-display font-bold text-sm">{n.nameEs}</p>
              <p className="font-mono text-[10px] mt-1">
                {n.neutral ? (
                  <span className="text-text-muted">neutra</span>
                ) : (
                  <>
                    <span className="text-green-400">+{statKeyLabel(n.raisedStat)}</span>
                    <span className="text-text-muted"> / </span>
                    <span className="text-red-400">-{statKeyLabel(n.loweredStat)}</span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 16 · Mock — Matriz 18×18 ─────────────────────────── */}
      <section id="typechart" className="space-y-6 scroll-mt-12">
        <p className="eyebrow">16 · Mock · Matriz 18×18</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">Tabla de efectividades</h2>
        <p className="text-text-secondary text-sm">
          Filas: tipo atacante · Columnas: tipo defensor. Verde=×2, gris=×1, naranja=×0.5, rojo=×0.
        </p>

        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-0.5 text-[10px] font-mono">
            <thead>
              <tr>
                <th className="p-1 text-text-muted">atk\def</th>
                {ALL_TYPES.map((t) => (
                  <th key={t} className="p-1">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ backgroundColor: typeHexMap[t] }}
                      title={typeNamesES[t]}
                    >
                      <TypeIcon type={t} size={14} className="text-white" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_TYPES.map((atk) => (
                <tr key={atk}>
                  <th className="p-1">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ backgroundColor: typeHexMap[atk] }}
                      title={typeNamesES[atk]}
                    >
                      <TypeIcon type={atk} size={14} className="text-white" />
                    </div>
                  </th>
                  {ALL_TYPES.map((def) => {
                    const eff = typeChart[atk][def];
                    return (
                      <td
                        key={def}
                        className={`w-7 h-7 rounded text-center tabular-nums ${effectivenessClasses(eff)}`}
                        title={`${typeNamesES[atk]} → ${typeNamesES[def]}: ×${eff}`}
                      >
                        {eff === 1 ? '' : eff === 0.5 ? '½' : eff}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 17 · Helpers ─────────────────────────────────────── */}
      <section id="helpers" className="space-y-6 scroll-mt-12 pb-24">
        <p className="eyebrow">17 · Helpers · getEffectiveness</p>
        <h2 className="font-display font-black text-3xl lg:text-4xl">getDualEffectiveness en acción</h2>
        <p className="text-text-secondary text-sm">
          Test invariants — son los mismos casos del plan §verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl font-mono text-sm">
          {[
            { call: `getEffectiveness('fire', 'grass')`, value: getEffectiveness('fire', 'grass'), expected: 2 },
            { call: `getEffectiveness('water', 'fire')`, value: getEffectiveness('water', 'fire'), expected: 2 },
            { call: `getEffectiveness('electric', 'ground')`, value: getEffectiveness('electric', 'ground'), expected: 0 },
            { call: `getEffectiveness('normal', 'ghost')`, value: getEffectiveness('normal', 'ghost'), expected: 0 },
            { call: `getDualEffectiveness('fire', ['grass','ice'])`, value: getDualEffectiveness('fire', ['grass', 'ice']), expected: 4 },
            { call: `getDualEffectiveness('water', ['fire','ground'])`, value: getDualEffectiveness('water', ['fire', 'ground']), expected: 4 },
            { call: `getDualEffectiveness('normal', ['ghost'])`, value: getDualEffectiveness('normal', ['ghost']), expected: 0 },
            { call: `getDualEffectiveness('rock', ['fire','flying'])`, value: getDualEffectiveness('rock', ['fire', 'flying']), expected: 4 },
            { call: `getDualEffectiveness('grass', ['water','ground'])`, value: getDualEffectiveness('grass', ['water', 'ground']), expected: 4 },
            { call: `getDualEffectiveness('dragon', ['dragon','fairy'])`, value: getDualEffectiveness('dragon', ['dragon', 'fairy']), expected: 0 },
          ].map((row) => {
            const ok = row.value === row.expected;
            return (
              <div
                key={row.call}
                className={`glass-card p-3 text-xs leading-snug ${ok ? 'border-green-500/40' : 'border-red-500/60'}`}
              >
                <div className="text-text-secondary truncate">{row.call}</div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className={ok ? 'text-green-400' : 'text-red-400'}>
                    → ×{row.value}
                  </span>
                  <span className="text-text-muted">expected ×{row.expected}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

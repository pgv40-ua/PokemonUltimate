import Image from 'next/image';
import Link from 'next/link';
import type {
  EvolutionChainRich,
  EvolutionMethod,
  EvolutionStageRich,
} from '@/lib/types/pokemon';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { typeHexMap } from '@/lib/utils/typeColors';
import { cn } from '@/lib/utils/cn';

interface EvolutionTimelineProps {
  chain: EvolutionChainRich;
  currentId: number;
}

const ITEM_LABEL_ES: Record<string, string> = {
  'fire-stone': 'Piedra Fuego',
  'water-stone': 'Piedra Agua',
  'thunder-stone': 'Piedra Trueno',
  'leaf-stone': 'Piedra Hoja',
  'moon-stone': 'Piedra Lunar',
  'sun-stone': 'Piedra Solar',
  'shiny-stone': 'Piedra Día',
  'dusk-stone': 'Piedra Noche',
  'dawn-stone': 'Piedra Alba',
  'ice-stone': 'Piedra Hielo',
  'oval-stone': 'Piedra Oval',
  'kings-rock': 'Roca del Rey',
  'metal-coat': 'Capa Metálica',
  'dragon-scale': 'Escama Dragón',
  'upgrade': 'Mejora',
  'dubious-disc': 'Disco Extraño',
  'reaper-cloth': 'Tela Terrible',
  'electirizer': 'Electrizador',
  'magmarizer': 'Magmatizador',
  'protector': 'Protector',
  'razor-claw': 'Garra Afilada',
  'razor-fang': 'Colmillo Afilado',
  'deepseatooth': 'Diente Marino',
  'deepseascale': 'Escama Marina',
  'soothe-bell': 'Campana Alivio',
};

function translateItem(slug: string): string {
  return (
    ITEM_LABEL_ES[slug] ??
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

const TYPE_NAME_ES: Partial<Record<string, string>> = {
  fire: 'Fuego', water: 'Agua', electric: 'Eléctrico', grass: 'Planta',
  ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra',
  flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca',
  ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro', steel: 'Acero',
  fairy: 'Hada', normal: 'Normal',
};

const LOCATION_LABEL_ES: Record<string, string> = {
  'eterna-forest': 'Cerca de Roca Musgosa (Bosque Vetusta)',
  'sinnoh-route-217': 'Cerca de Roca Helada (Ruta 217)',
};

function methodLabel(method: EvolutionMethod | null): string {
  if (!method) return '';
  if (method.trigger === 'use-item' && method.item) return translateItem(method.item);
  if (method.trigger === 'trade') return 'Intercambio';
  if (method.trigger === 'friendship') {
    if (method.timeOfDay === 'day') return 'Amistad (día)';
    if (method.timeOfDay === 'night') return 'Amistad (noche)';
    return 'Por amistad';
  }
  if (method.trigger === 'level-up') {
    if (method.minLevel) return `Nivel ${method.minLevel}`;
    if (method.knownMoveType) {
      const name = TYPE_NAME_ES[method.knownMoveType] ?? method.knownMoveType;
      return `Mov. tipo ${name} + afecto`;
    }
    if (method.location) {
      return LOCATION_LABEL_ES[method.location] ?? `En ${method.location.replace(/-/g, ' ')}`;
    }
    if (method.minAffection) return 'Con afecto alto';
  }
  return 'Especial';
}

function methodIcon(method: EvolutionMethod | null): string {
  if (!method) return '→';
  if (method.trigger === 'use-item') return '💎';
  if (method.trigger === 'trade') return '🔄';
  if (method.trigger === 'friendship') return '❤';
  if (method.trigger === 'level-up' && method.location) return '📍';
  if (method.trigger === 'level-up' && method.knownMoveType) return '✦';
  return '⤴';
}

export function EvolutionTimeline({ chain, currentId }: EvolutionTimelineProps) {
  if (!chain || chain.stages.length === 0) return null;

  if (chain.stages.length === 1) {
    return (
      <section className="relative py-16 lg:py-20" aria-labelledby="evolution-heading">
        <div className="container-app">
          <div className="mb-6">
            <p className="eyebrow mb-2">Cadena evolutiva</p>
            <h2
              id="evolution-heading"
              className="font-display font-black uppercase text-text-primary"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
            >
              Evoluciones
            </h2>
          </div>
          <p className="font-body text-text-secondary italic">
            No tiene evoluciones conocidas.
          </p>
        </div>
      </section>
    );
  }

  const byStage = new Map<number, EvolutionStageRich[]>();
  for (const s of chain.stages) {
    const arr = byStage.get(s.stage) ?? [];
    arr.push(s);
    byStage.set(s.stage, arr);
  }
  const stageKeys = Array.from(byStage.keys()).sort((a, b) => a - b);

  return (
    <section className="relative py-16 lg:py-20" aria-labelledby="evolution-heading">
      <div className="container-app">
        <div className="mb-8">
          <p className="eyebrow mb-2">Cadena evolutiva</p>
          <h2
            id="evolution-heading"
            className="font-display font-black uppercase text-text-primary"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Línea de evolución
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          {stageKeys.map((stageIdx, columnIndex) => {
            const items = byStage.get(stageIdx)!;
            const isBranched = items.length > 1;
            return (
              <div
                key={stageIdx}
                className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4 w-full lg:w-auto"
              >
                {columnIndex > 0 && (
                  <StageArrow />
                )}
                <div
                  className={cn(
                    'w-full lg:w-auto',
                    isBranched
                      ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-3'
                      : 'flex',
                  )}
                >
                  {items.map((stage) => (
                    <StageCard
                      key={stage.pokemonId}
                      stage={stage}
                      isCurrent={stage.pokemonId === currentId}
                      method={columnIndex > 0 ? stage.method : null}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function methodAccent(method: EvolutionMethod | null): { bg: string; border: string; text: string } {
  if (!method) return { bg: 'bg-white/5', border: 'border-white/10', text: 'text-text-secondary' };
  if (method.trigger === 'use-item') {
    return {
      bg: 'bg-accent-yellow/20',
      border: 'border-accent-yellow/50',
      text: 'text-accent-yellow',
    };
  }
  if (method.trigger === 'friendship') {
    return {
      bg: 'bg-pink-500/20',
      border: 'border-pink-500/50',
      text: 'text-pink-300',
    };
  }
  if (method.trigger === 'trade') {
    return {
      bg: 'bg-accent-blue/20',
      border: 'border-accent-blue/50',
      text: 'text-accent-blue',
    };
  }
  if (method.trigger === 'level-up' && (method.location || method.knownMoveType)) {
    return {
      bg: 'bg-accent-purple/20',
      border: 'border-accent-purple/50',
      text: 'text-accent-purple',
    };
  }
  return {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-300',
  };
}

function StageCard({
  stage,
  isCurrent,
  method,
}: {
  stage: EvolutionStageRich;
  isCurrent: boolean;
  method: EvolutionMethod | null;
}) {
  const hex = typeHexMap[stage.primaryType];
  const label = method ? methodLabel(method) : null;
  const icon = method ? methodIcon(method) : null;
  const accent = methodAccent(method);

  return (
    <div className="flex flex-col items-stretch gap-0 w-full">
      {label && (
        <div
          className={cn(
            'flex flex-col items-center gap-1 px-3 py-3 rounded-t-card border-x border-t',
            accent.bg,
            accent.border,
            accent.text,
          )}
          role="note"
          aria-label={`Requisito para evolucionar: ${label}`}
        >
          <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">
            Requisito
          </span>
          <span className="inline-flex items-center gap-1.5 font-display font-bold text-sm leading-tight text-center">
            <span aria-hidden="true" className="text-base">
              {icon}
            </span>
            {label}
          </span>
        </div>
      )}
      <Link
        href={`/pokemon/${stage.pokemonId}`}
        className={cn(
          'group glass-card flex flex-col items-center text-center w-full lg:w-44 p-4 gap-2 transition-all',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow',
          label && 'rounded-t-none border-t-0',
          isCurrent && 'ring-2 ring-accent-yellow/60 shadow-glow-yellow',
        )}
        style={
          isCurrent
            ? ({ '--glow-color': `${hex}55` } as React.CSSProperties)
            : undefined
        }
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={`Ver ficha de ${stage.nameEs}`}
      >
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${hex}33 0%, transparent 70%)`,
          }}
        >
          <Image
            src={stage.spriteUrl}
            alt={stage.nameEs}
            fill
            sizes="96px"
            className="object-contain transition-transform group-hover:scale-110"
          />
        </div>
        <p className="font-mono text-[10px] text-text-muted">
          #{stage.pokemonId.toString().padStart(4, '0')}
        </p>
        <h3 className="font-display font-bold text-text-primary text-sm leading-tight">
          {stage.nameEs}
        </h3>
        <div className="flex flex-wrap justify-center gap-1">
          {stage.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </Link>
    </div>
  );
}

function StageArrow() {
  return (
    <div
      className="flex items-center justify-center shrink-0 py-2 lg:py-0 lg:px-2 text-text-muted"
      aria-hidden="true"
    >
      <svg
        className="w-8 h-8 hidden lg:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      <svg
        className="w-8 h-8 lg:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  );
}

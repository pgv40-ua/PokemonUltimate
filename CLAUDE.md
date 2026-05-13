# PokéDex Ultimate

> La enciclopedia Pokémon más completa del mundo — stats, evoluciones, habilidades, naturalezas, novedades y meta competitivo, todo en un solo lugar.

## Project Overview

- **Qué es:** landing page + (a futuro) pokédex interactiva como referencia definitiva para fans de Pokémon.
- **Audiencia:** fans de Pokémon de todas las edades — casuales, competitivos, fans de random battles. Conocen la franquicia, esperan información rápida y una experiencia épica.
- **Tono:** épico y hype. Headlines de "Liga Pokémon". Energía de entrenador que reta al Alto Mando.
- **Objetivo de la landing:** captar al fan desde el primer segundo, transmitir que esta es LA referencia, e invitarle a explorar Pokédex, novedades y destacados.

## Tech Stack

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | **Next.js 14+** (App Router) | Server Components por defecto |
| Lenguaje | **TypeScript** | strict mode |
| Estilos | **Tailwind CSS v3** + CSS custom | tokens en `tailwind.config.ts` |
| Animaciones | **Framer Motion** | scroll, viewport, parallax, stagger |
| Smooth scroll | **Lenis** (`@studio-freight/lenis`) | global, montado en `layout.tsx` |
| Partículas | **tsParticles** o canvas nativo | hero eléctrico, Hall of Fame |
| Fuentes | `next/font/google` | Exo 2 · DM Sans · JetBrains Mono |
| Datos | **Mock local** → [PokéAPI](https://pokeapi.co/) | mock en `lib/mock/`, REST gratuita |

**Reglas de stack:** no añadir librerías nuevas sin justificación. Si una nueva dep parece necesaria, primero verifica que el stack actual no lo cubre.

## Estructura de carpetas

```
/app
  layout.tsx               ← fuentes, Lenis, metadata global
  page.tsx                 ← landing (importa todas las secciones)
  pokedex/page.tsx         ← [FUTURO] pokédex completa
  pokemon/[id]/page.tsx    ← [FUTURO] ficha individual
  novedades/page.tsx       ← [FUTURO] blog
/components
  /ui                      ← Button, Card, Badge, TypeBadge, PokemonCard, StatBar...
  /sections                ← Hero, TypeTicker, Novedades, Destacados, Pokedex, Evolutions, Types, Abilities, HallOfFame, FinalCTA, Footer, Navbar
  /pokemon                 ← componentes con dominio Pokémon específico
/lib
  /mock                    ← datos mock de Pokémon, novedades, etc.
  /api                     ← [FUTURO] cliente PokéAPI
  /hooks                   ← hooks custom (useMagneticButton, useReducedMotion...)
  /utils                   ← helpers
/public
  /assets                  ← vídeos/imágenes generadas por IA
/docs                      ← especificaciones detalladas (ver más abajo)
/.claude/agents            ← agentes especializados del proyecto
```

## Design Tokens (resumen)

```css
--color-bg: #0a0a0f;
--color-surface: rgba(255, 255, 255, 0.05);
--color-border: rgba(255, 255, 255, 0.12);
--color-accent-yellow: #FFD700;
--color-accent-red: #E3350D;
--color-accent-blue: #00BFFF;
--color-accent-purple: #7B2FBE;
--color-text-primary: #FFFFFF;
--color-text-secondary: rgba(255, 255, 255, 0.65);
```

- **Tipografías:** Exo 2 (display, 700/900) · DM Sans (body, 400/500) · JetBrains Mono (stats)
- **Easing global:** `cubic-bezier(0.22, 1, 0.36, 1)`, duración 400-600ms
- **Border radius cards:** 16px · **Border:** `1px solid rgba(255,255,255,0.1)`
- **Padding vertical secciones:** `py-24 lg:py-32` mínimo

→ Tokens completos, 18 colores oficiales de tipo, spacing y reglas de glassmorphism: [docs/design-system.md](docs/design-system.md)

## Convenciones de código

- **Mobile-first.** Breakpoints Tailwind: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- **Server Components por defecto.** Marca `"use client"` solo cuando haya interactividad, hooks, animación o eventos.
- **Imágenes:** `next/image` para todo lo no decorativo. `loading="lazy"` en grids below-the-fold.
- **Fonts:** `next/font/google` con `display: 'swap'`.
- **Datos:** mock en `lib/mock/` hasta integrar PokéAPI. Tipos TypeScript compartidos en `lib/types/`.
- **Placeholders visuales:** NUNCA URLs externas. Fallback = `<div>` con gradiente del tipo del Pokémon + nombre centrado.
- **Accesibilidad (obligatorio):**
  - Contraste AA mínimo.
  - `focus-visible` con estilo propio en todo elemento interactivo.
  - `alt` descriptivo en imágenes; `alt=""` solo si es 100% decorativa.
  - `aria-label` en botones de icono.
  - Todas las animaciones respetan `prefers-reduced-motion`.
- **Animaciones:** easing global, duración 400-600ms. Stagger de 80ms entre items de un grid.
- **Comentarios:** por defecto ninguno. Solo cuando el "porqué" no sea obvio.

## Catálogo de secciones (12)

1. **Navbar fija** — glassmorphism, logo, links, CTA pill
2. **Hero — Zekrom** — 100vh, vídeo de fondo, H1 Exo 2 enorme, partículas eléctricas
3. **Ticker de tipos** — marquee infinito de los 18 tipos
4. **Novedades** — grid asimétrico 1+3, glassmorphism, hover glow
5. **Destacados** — bento 2+4 con barras de stats y % de uso competitivo
6. **Pokédex Explorer (preview)** — buscador + filtros + 12 cards icónicas
7. **Cadenas de Evolución** — 3 cadenas con flechas y método de evolución
8. **Tipos y Matchups** — tabla 18×18 interactiva
9. **Habilidades y Naturalezas** — dos columnas, guía competitiva
10. **Hall of Fame** — carrusel 3D con spotlight central
11. **CTA Final** — gradiente amarillo→rojo, H2 épico
12. **Footer** — 4 columnas + disclaimer Nintendo

→ Spec extendido de cada sección (copy, layout, animaciones, edge cases): [docs/sections-catalog.md](docs/sections-catalog.md)

## Asset pipeline

Los assets visuales (vídeos hero, fondos abstractos animados, destellos de evolución, partículas Hall of Fame) se generan con IA (Midjourney + Runway/Kling) y se colocan en `public/assets/`.

Archivos esperados:

| Asset | Sección | Loop | Duración |
|-------|---------|------|----------|
| `hero-zekrom.mp4` | Hero | sí | 6s |
| `featured-bg.mp4` | Destacados | sí | 5s |
| `evolution-flash.mp4` | Evoluciones | no | 4s |
| `halloffame-particles.mp4` | Hall of Fame | sí | 6s |

**Fallback si falta el asset:** mostrar un `<div>` con gradiente coherente (ej. radial gradient azul→negro en el hero) + el contenido HTML encima. NUNCA dejar un `<video>` roto ni una imagen rota.

→ Prompts completos (Midjourney + Kling 2.0 + Runway Gen-3) para cada asset: [docs/asset-prompts.md](docs/asset-prompts.md)

## Skills disponibles (instaladas globalmente)

Estas skills están en `~/.claude/skills/` y se activan automáticamente cuando Claude detecta el contexto adecuado. No hay que invocarlas manualmente:

| Skill | Cuándo se activa | Útil para |
|-------|------------------|-----------|
| `vercel-react-best-practices` | escribir/refactorizar React o Next.js | patrones de rendimiento Vercel |
| `next-best-practices` | trabajar con App Router, RSC, route handlers, metadata | convenciones Next.js |
| `web-design-guidelines` | "revisa la UI", "auditar diseño" | guidelines Vercel de UI/UX |
| `shadcn` | añadir componentes shadcn, `components.json` | primitives accesibles tipo Radix |
| `core-web-vitals` | "mejora LCP", "fix CLS", "optimizar INP" | rendimiento medible |
| `accessibility-a11y` | trabajar con UI accesible | WCAG, semántica, ARIA |
| `framer-motion-animator` | "anima X", scroll, transitions | patrones Framer Motion |
| `frontend-design` | construir UI de cero | dirección visual no-genérica |

## Cómo usar los agentes

Hay 6 agentes en [.claude/agents/](.claude/agents/). Cuándo delegar:

| Necesidad | Agente |
|-----------|--------|
| Estructura de datos Pokémon, PokéAPI, mocks, tipos TS | `pokemon-data-specialist` |
| Implementar/refactorizar una sección entera de la landing | `section-builder` |
| Cualquier animación: scroll, parallax, partículas, stagger | `animation-engineer` |
| Componentes base de UI (`/components/ui/`), tailwind config | `glass-ui-designer` |
| Auditar rendimiento Next.js, Core Web Vitals, peso de assets | `perf-auditor` |
| Redactar prompts AI para nuevos vídeos/imágenes | `asset-prompt-writer` |

**Regla de oro:** una tarea grande se descompone delegando a 2-3 agentes en paralelo cuando son independientes. Si un agente necesita el output de otro (ej. `section-builder` necesita primitives de `glass-ui-designer`), se ejecutan secuencialmente.

## What this is NOT

- ❌ **No afiliado** con Nintendo, Game Freak ni The Pokémon Company. Sitio informativo de fans.
- ❌ No es un juego, un emulador ni un simulador de combate.
- ❌ No es SaaS — gratis, para siempre, sin login obligatorio.
- ❌ No vende ni redistribuye assets oficiales. Todos los visuales son generados o decorativos.

## Roadmap futuro

- `/pokedex` — pokédex completa con +1000 Pokémon, filtros, búsqueda fuzzy
- `/pokemon/[id]` — ficha individual: stats, evoluciones, movimientos, dónde encontrarlo
- `/novedades` — blog de actualizaciones del mundo Pokémon
- Integración real con [PokéAPI v2](https://pokeapi.co/docs/v2)
- Modo competitivo: builds, sets EV/IV, counters
- PWA + caché offline de la pokédex

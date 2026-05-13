<div align="center">

# PokéDex Ultimate

**La enciclopedia Pokémon más completa del mundo** — stats, evoluciones, habilidades, naturalezas, novedades y meta competitivo, todo en un solo lugar.

![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38BDF8?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0080?logo=framer&logoColor=white)
![Status](https://img.shields.io/badge/status-en%20desarrollo-FFD700)

</div>

---

## Sobre el proyecto

PokéDex Ultimate es una landing page + (a futuro) pokédex interactiva pensada como **la referencia definitiva** para fans de Pokémon. El objetivo: captar al fan desde el primer segundo, transmitir que esta es LA enciclopedia, e invitarle a explorar Pokédex, novedades, evoluciones, habilidades, naturalezas y el meta competitivo.

- **Audiencia:** fans de Pokémon de todas las edades — casuales, competitivos, fans de random battles.
- **Tono:** épico y hype, headlines de "Liga Pokémon", energía de entrenador que reta al Alto Mando.
- **Filosofía:** gratis, sin login obligatorio, sin SaaS. Solo conocimiento Pokémon bien presentado.

---

## Tech Stack

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | **Next.js 14** (App Router) | Server Components por defecto |
| Lenguaje | **TypeScript** | `strict: true` |
| Estilos | **Tailwind CSS v3** + CSS variables | Tokens en `tailwind.config.ts` y `app/globals.css` |
| Animaciones | **Framer Motion** | Scroll reveals, viewport, parallax, stagger |
| Smooth scroll | **Lenis** (`@studio-freight/lenis`) | Global, montado en `layout.tsx`, respeta `prefers-reduced-motion` |
| Partículas | **tsParticles** | Hero eléctrico, Hall of Fame |
| Fuentes | `next/font/google` | Exo 2 · DM Sans · JetBrains Mono |
| Datos | Mock local → **PokéAPI** (futuro) | Mock en `lib/mock/`, REST gratuita |

---

## Quick start

### Requisitos

- Node.js **18.17+** o **20.x**
- npm 9+

### Instalación

```bash
git clone https://github.com/pgv40-ua/PokemonUltimate.git
cd PokemonUltimate
npm install
```

### Scripts

```bash
npm run dev      # arranca el dev server en http://localhost:3000
npm run build    # build de producción + type-check + lint
npm run start    # sirve el build de producción
npm run lint     # ESLint
```

---

## Estructura del proyecto

```
/app
  layout.tsx               ← fuentes, Lenis, metadata global
  page.tsx                 ← landing (importa las 12 secciones)
  globals.css              ← CSS variables + .glass-card + tokens
  icon.svg                 ← favicon pokeball
/components
  /ui                      ← Button, Card, Badge, TypeBadge, PokemonCard, StatBar... (en construcción)
  /sections                ← Las 12 secciones de la landing
  /pokemon                 ← Componentes con dominio Pokémon específico (futuro)
  /providers
    LenisProvider.tsx      ← Smooth scroll cliente
/lib
  /mock                    ← Datos mock de Pokémon, novedades (en construcción)
  /api                     ← Cliente PokéAPI (futuro)
  /hooks                   ← Hooks custom (useMagneticButton, etc.) (futuro)
  /utils
    cn.ts                  ← className merging (clsx + tailwind-merge)
    motion.ts              ← Tokens de animación (easing, duration, stagger, viewport)
  /types
    pokemon.ts             ← Tipos TS de entidades Pokémon (en construcción)
/public
  /assets                  ← Vídeos/imágenes generadas por IA
/docs
  design-system.md         ← Tokens completos, 18 colores de tipo, glassmorphism
  sections-catalog.md      ← Spec extendido de cada una de las 12 secciones
  asset-prompts.md         ← Prompts AI (Midjourney + Kling + Runway) para vídeos
/.claude
  /agents                  ← 6 agentes especializados del proyecto
```

---

## Catálogo de secciones

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Navbar** | Glassmorphism fija, logo, links, CTA pill |
| 2 | **Hero — Zekrom** | 100vh, vídeo de fondo, H1 enorme Exo 2, partículas eléctricas |
| 3 | **Ticker de tipos** | Marquee infinito CSS de los 18 tipos |
| 4 | **Novedades** | Grid asimétrico 1+3 con glassmorphism |
| 5 | **Destacados** | Bento 2+4 con barras de stats y % de uso competitivo |
| 6 | **Pokédex Explorer** | Buscador + filtros + 12 cards icónicas (preview) |
| 7 | **Cadenas de Evolución** | 3 cadenas con flechas y método de evolución |
| 8 | **Tipos y Matchups** | Tabla 18×18 interactiva |
| 9 | **Habilidades y Naturalezas** | Dos columnas, guía competitiva |
| 10 | **Hall of Fame** | Carrusel 3D con spotlight central |
| 11 | **CTA Final** | Gradiente amarillo→rojo, H2 épico |
| 12 | **Footer** | 4 columnas + disclaimer Nintendo |

Spec extendido (copy, layout, animaciones, edge cases) → [`docs/sections-catalog.md`](docs/sections-catalog.md).

---

## Design system (resumen)

```css
--color-bg:            #0a0a0f;
--color-accent-yellow: #FFD700;
--color-accent-red:    #E3350D;
--color-accent-blue:   #00BFFF;
--color-accent-purple: #7B2FBE;
```

- **Tipografías:** Exo 2 (display, 700/900) · DM Sans (body, 400/500) · JetBrains Mono (stats)
- **Easing global:** `cubic-bezier(0.22, 1, 0.36, 1)` · duración 400-600ms
- **Border radius cards:** 16px · **Border:** `1px solid rgba(255,255,255,0.1)`
- **18 colores oficiales de tipo** disponibles como `bg-type-fire`, `bg-type-water`...

Tokens completos, spacing y reglas de glassmorphism → [`docs/design-system.md`](docs/design-system.md).

---

## Asset pipeline

Los vídeos hero, fondos abstractos animados y partículas se generan con IA (Midjourney + Runway/Kling) y se colocan en `public/assets/`:

| Asset | Sección | Loop | Duración |
|-------|---------|------|----------|
| `hero-zekrom.mp4` | Hero | sí | 6s |
| `featured-bg.mp4` | Destacados | sí | 5s |
| `evolution-flash.mp4` | Evoluciones | no | 4s |
| `halloffame-particles.mp4` | Hall of Fame | sí | 6s |

**Fallback automático** si falta un asset: gradiente coherente del tipo + contenido HTML encima. Nunca `<video>` rotos ni imágenes rotas.

Prompts completos → [`docs/asset-prompts.md`](docs/asset-prompts.md).

---

## Roadmap

- [x] **Fase 0 — Scaffolding** · Next.js 14, Tailwind, design tokens, Lenis, 12 placeholders
- [ ] **Fase 1 — Cimientos** · Tipos TS + mock data + componentes UI base (Button, TypeBadge, PokemonCard, StatBar...)
- [ ] **Fase 2 — Secciones** · Implementación de las 12 secciones, una a una
- [ ] **Fase 3 — Animaciones** · Parallax hero, partículas tsParticles, carrusel 3D Hall of Fame, scroll reveals
- [ ] **Fase 4 — Assets** · Generación con Midjourney/Kling, optimización con ffmpeg
- [ ] **Fase 5 — Polish & a11y** · Lighthouse ≥ 95, Core Web Vitals verdes, WCAG AA
- [ ] **Fase 6 — Deploy** · Vercel + dominio + analytics
- [ ] **Futuro** · `/pokedex` completa (+1000 Pokémon), `/pokemon/[id]` ficha individual, `/novedades` blog, integración PokéAPI real

---

## Workflow con agentes especializados

El directorio [`.claude/agents/`](.claude/agents/) contiene **6 agentes** especializados que se delegan automáticamente según la tarea:

| Agente | Especialidad |
|--------|--------------|
| `pokemon-data-specialist` | Tipos TS, mocks, PokéAPI, matriz de efectividad |
| `section-builder` | Implementa/refactoriza secciones completas |
| `animation-engineer` | Scroll, parallax, partículas, stagger, carrusel 3D |
| `glass-ui-designer` | Primitives UI base, tailwind config, glassmorphism |
| `perf-auditor` | Core Web Vitals, peso de bundle, optimizaciones Next |
| `asset-prompt-writer` | Prompts para generación de vídeos/imágenes con IA |

---

## Convenciones

- **Mobile-first.** Breakpoints Tailwind: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- **Server Components por defecto.** `"use client"` solo cuando haya interactividad, hooks, animación o eventos.
- **Imágenes:** `next/image` para todo lo no decorativo. `loading="lazy"` en grids below-the-fold.
- **Fonts:** `next/font/google` con `display: 'swap'`.
- **Accesibilidad obligatoria:** contraste AA mínimo, `focus-visible` propio, `alt` descriptivo, `aria-label` en iconos, `prefers-reduced-motion` respetado en TODA animación.
- **Animaciones:** easing global, duración 400-600ms, stagger de 80ms entre items.
- **Placeholders visuales:** nunca URLs externas — siempre `<div>` con gradiente del tipo del Pokémon.

Detalle completo → [`CLAUDE.md`](CLAUDE.md).

---

## Disclaimer

Este proyecto **NO está afiliado** con Nintendo, Game Freak ni The Pokémon Company. Es un sitio informativo creado por fans, sin ánimo de lucro. Todos los nombres, marcas y referencias a Pokémon son propiedad de sus respectivos dueños. No se redistribuye ni se vende ningún asset oficial — todos los visuales son generados o decorativos.

---

## Licencia

Código fuente bajo licencia [MIT](LICENSE) (a definir). El contenido informativo sobre Pokémon es de dominio público en cuanto a datos factuales; las marcas y propiedad intelectual asociadas pertenecen a Nintendo / Game Freak / The Pokémon Company.

---

<div align="center">

**¿Eres entrenador o eres leyenda?**

Construido con Next.js 14 · Tailwind · Framer Motion · Lenis

</div>

# Phase Handoff — PokéDex Ultimate

> Documento vivo del estado del proyecto al final de cada fase. Define **qué está cerrado, qué se puede tocar en la siguiente fase y qué no**. Si vas a empezar una fase nueva, este es el contrato.

---

## Estado al cierre de Fase 3 (2026-05-15)

### Fases cerradas

| Fase | Estado | Mergeada a `main` | Resumen |
|------|--------|-------------------|---------|
| 0 — Scaffolding | ✅ Cerrada 2026-05-13 | sí | Next.js 14 App Router · TS strict · Tailwind v3 · 12 placeholders de sección |
| 1 — Cimientos | ✅ Cerrada 2026-05-13 | sí | Data layer (`lib/mock/`, `lib/types/`) · 8 primitives UI base · tokens |
| 2 — Secciones | ✅ Cerrada 2026-05-15 | sí | 12 secciones funcionales · 5 páginas interiores · auditoría perf |
| 3 — Animaciones | ✅ Cerrada 2026-05-15 | sí | Parallax multicapa · cursor pokeball · flash evolución · magnético · `<Reveal>` wrapper · responsive mobile/tablet · landing curada |

### Lo que existe y NO se debe tocar en fases siguientes

Las fases 4, 5 y 6 **deben respetar** lo construido. Cambios en estos archivos solo si son estrictamente necesarios para su scope, justificados, y mínimos.

**Estructura intocable:**
- `app/layout.tsx` — providers (Lenis, Cursor) y fuentes ya cableados
- `app/page.tsx` — landing curada con 5 secciones (Hero · TypeTicker · Novedades · Destacados · HallOfFame · FinalCTA · Footer). **NO añadir secciones** sin pedirlo al usuario.
- `app/{pokedex,evoluciones,tipos,habilidades,novedades}/page.tsx` — páginas interiores con sus secciones dedicadas
- `app/globals.css` — design tokens, `.glass-card`, `.container-app`, `.eyebrow`, cursor + navbar shells, mobile menu, safe areas

**Componentes intocables (estructura y API):**
- `components/sections/*` — las 12 secciones (mantener nombres, props y exports)
- `components/ui/*` — primitives (Button, Card, Badge, TypeBadge, PokemonCard, StatBar, Input, TypeIcon, Reveal, MagneticLink)
- `components/pokemon/EvolutionArrow.tsx`
- `components/providers/{Lenis,Cursor}Provider.tsx`

**Lógica intocable:**
- `lib/hooks/{useMagneticButton,useMotionSafe,useParallaxLayer}.ts`
- `lib/motion/tokens.ts` — easing, duration, stagger, viewport, parallax, revealVariants
- `lib/utils/{cn,motion,typeColors}.ts`
- `lib/types/pokemon.ts`
- `lib/mock/*`

**Convenciones congeladas (no replantear):**
- Tailwind v3 (no v4)
- `@studio-freight/lenis` (no el paquete `lenis` moderno)
- Server Components por defecto, `'use client'` solo cuando hay interactividad/hooks
- Carpetas a nivel raíz (no `/src/`)
- Alias `@/*` → raíz del proyecto
- Fuentes vía `next/font/google` con `variable` (Exo 2, DM Sans, JetBrains Mono)
- `framer-motion`: usar `motion.create(Tag)` (no `motion(Tag)`, deprecado)
- Mobile-first con breakpoints Tailwind `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`
- Easing global: `cubic-bezier(0.22, 1, 0.36, 1)`, duración 400-600ms
- Stagger entre items de grid: 80 ms
- `prefers-reduced-motion`: respetar SIEMPRE
- Identidad git: `pgv40-ua <esorpius12@gmail.com>`
- Una rama por fase: `feature/fase-X-nombre`
- PR a `main` al cerrar cada fase con conventional commit y cuerpo detallado

---

## Fase 4 — Assets IA (próxima)

### Scope exclusivo

Generar e integrar los assets visuales que aún son placeholders (gradientes o vídeo ausente). Toda la lógica de fallback ya está implementada — basta con dejar los archivos en `public/assets/`.

### Qué puede tocar

- `public/assets/` — **crear** los siguientes archivos:
  - `hero-zekrom.mp4` — vídeo loop 6 s (hero — actualmente fallback con radial gradient azul-negro)
  - `featured-bg.mp4` — vídeo loop 5 s (sección Destacados — actualmente fallback con linear+radial gradients morado/azul)
  - `halloffame-particles.mp4` — vídeo loop 6 s (Hall of Fame — actualmente fallback con radial spotlight)
  - `evolution-flash.mp4` ✅ ya existe, no tocar
- `docs/asset-prompts.md` — actualizar prompts si surgen variantes o se cambia el modelo IA usado
- `components/sections/Hero.tsx` — única excepción: añadir el `<video>` real cuando exista `hero-zekrom.mp4` (a día de hoy se usa solo el radial gradient). El cambio es localizado, no rompe parallax ni partículas.
- `components/sections/Destacados.tsx` — única excepción: integrar `featured-bg.mp4` como fondo si se quiere, manteniendo el fallback actual.
- `components/sections/HallOfFame.tsx` — única excepción: integrar `halloffame-particles.mp4` como capa decorativa, manteniendo el carrusel intacto.

### Qué NO puede tocar

- Cualquier otra sección, primitive, hook, util, mock, página interior, layout, global CSS, providers.
- La estructura del Hero/Destacados/HallOfFame: solo añadir el elemento `<video>` con `poster` (frame estático extraído del MP4), `autoplay muted loop playsInline`, `aria-hidden`, `preload="metadata"`. Wrap con check de `prefers-reduced-motion` para mostrar solo el poster en ese caso.
- Las animaciones de Fase 3 (parallax, magnético, cursor, flash, reveals).

### Reglas de los assets

- **Peso máximo por vídeo**: 1.8 MB (H.264, CRF ~28, sin audio). Si el MP4 supera 2 MB, comprimir.
- **Resolución**: 1920×1080 max para fondos, 1280×720 para detalles.
- **Loop seamless**: el primer y último frame deben empatar para que el `loop` no se note.
- **Sin texto** en los vídeos (todo el copy es HTML).
- **Poster estático**: extraer el primer frame y dejarlo junto al vídeo (`hero-zekrom.jpg`, etc.) para evitar bandera negra en la carga.
- **Fallback obligatorio**: el `<video>` debe coexistir con el actual gradiente; si el navegador no soporta MP4 o falla la red, el fondo CSS sigue siendo visible.
- **Prompts**: usar exactamente los del `docs/asset-prompts.md` o variantes documentadas allí.

### Verificación al cerrar Fase 4

- `npm run build` ok, sin warnings.
- Home `First Load JS` no debe subir más de +5 kB.
- Lighthouse Performance ≥ 90 en home (sin perder respecto a Fase 3).
- Vídeos visibles en desktop, fallback en mobile (o `prefers-reduced-motion`).
- `app/page.tsx` intacto.

---

## Fase 5 — Polish & a11y

### Scope exclusivo

Auditoría final: Lighthouse ≥ 95 en todas las categorías, WCAG AA verificado, Core Web Vitals verdes.

### Qué puede tocar

- Atributos `aria-*`, `role`, `alt`, `tabindex` en cualquier componente — siempre añadir, no romper estructura.
- `next/image` donde aún se use `<img>` o `<div>` con gradiente decorativo.
- `loading="lazy"` y `decoding="async"` en imágenes below-the-fold.
- Skip-link al `<main>` desde el `<body>` (añadir en `layout.tsx`).
- Meta tags Open Graph y Twitter Card en `app/layout.tsx` (`metadata.openGraph.images`, `twitter.images`).
- Sitemap (`app/sitemap.ts`) y robots (`app/robots.ts`).
- Performance: revisar `next/dynamic` boundaries, `Suspense`, `loading.tsx` por ruta.
- Consolidar `lib/utils/motion.ts` (legacy) y `lib/motion/tokens.ts` (canónico) en uno solo, sin cambiar API pública.
- Resolver el TODO de `lib/motion/tokens.ts` si queda alguno.

### Qué NO puede tocar

- Animaciones, layouts, palette, fuentes, providers, mocks.
- `app/page.tsx` (no añadir/quitar secciones).
- Comportamiento visual: solo refinamientos invisibles o accesibilidad.

### Verificación al cerrar Fase 5

- Lighthouse: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- axe-core: 0 violaciones críticas o serias.
- CLS < 0.1, LCP < 2.5 s, INP < 200 ms.
- Navegación completa con teclado en cada página.
- Test con lector de pantalla (VoiceOver / NVDA) en hero y mobile menu.

---

## Fase 6 — Deploy

### Scope exclusivo

Llevar el proyecto a producción en Vercel con dominio, analytics y monitorización.

### Qué puede tocar

- `vercel.json` (si hace falta — Next.js no suele necesitar config explícita).
- `next.config.js` — solo flags de producción (`compress`, `productionBrowserSourceMaps`, headers de seguridad).
- `.env.example` con variables de entorno necesarias.
- `app/layout.tsx` — añadir `<Analytics />` de Vercel y `<SpeedInsights />` si se decide.
- `app/error.tsx` y `app/global-error.tsx` — error boundaries para Sentry.
- `instrumentation.ts` si se integra Sentry.
- README — sección de deploy, scripts, env vars.

### Qué NO puede tocar

- Nada del código de producto: secciones, componentes, hooks, mocks, tipos, motion, estilos.
- Solo infraestructura.

### Verificación al cerrar Fase 6

- Deploy verde en Vercel desde `main`.
- Dominio custom apuntando con HTTPS automático.
- Analytics recibiendo eventos.
- Sentry capturando errores de prueba.
- Headers de seguridad (CSP, X-Content-Type-Options, Referrer-Policy) verificados con `securityheaders.com`.

---

## Fase ∞ — Futuro (post-deploy)

Posibles iniciativas, cada una su rama y su PR. **No se planifica el orden — el usuario decide cuándo.**

| Iniciativa | Toca |
|------------|------|
| `/pokedex` completa con +1000 Pokémon, búsqueda fuzzy, paginación | nuevas rutas, nuevos componentes en `components/pokedex/`, mantener `PokedexExplorer` intacto |
| `/pokemon/[id]` ficha individual | nueva ruta dinámica, nuevos componentes en `components/pokemon/`, integración con PokéAPI |
| Integración PokéAPI v2 real | `lib/api/` nuevo (no existe aún), conservar `lib/mock/` como fallback |
| Modo competitivo (sets EV/IV, counters) | nueva sección bajo `/competitivo` o subsección de ficha |
| PWA + caché offline | `manifest.json`, `service-worker.js`, headers, install prompt |

---

## Convenciones de cambios (todas las fases)

1. **Una sola rama por fase**: `feature/fase-N-nombre-corto`.
2. **Commits**: conventional commits en español (`feat:`, `fix:`, `chore:`, `docs:`, `perf:`, `style:`, `refactor:`, `test:`).
3. **PR a main** al cerrar la fase, con cuerpo detallando:
   - Qué se entregó
   - Métricas (build size, Lighthouse)
   - Decisiones de diseño que merecen explicación
   - Lista de archivos creados / modificados / eliminados
4. **No fast-forward merge** — siempre crear merge commit para preservar el historial por fase.
5. **No tocar Fase N-1 o anteriores** salvo bug crítico reportado por el usuario.
6. **Memoria del agente** (`~/.claude/projects/.../memory/project_pokedex_ultimate.md`) actualizada al cerrar cada fase.

---

## Cómo ejecutar el dev/build sin romper nada

```bash
# Desarrollo (hot reload)
npm run dev                # http://localhost:3000

# Verificación rápida
npx tsc --noEmit           # typecheck sin escribir

# Build de producción
# ⚠ NO ejecutar con `npm run dev` corriendo en paralelo: machaca el .next
# y el dev server sirve 404 hasta reiniciarlo
npm run build

# Si rompes el .next por accidente:
Remove-Item -Recurse -Force .next
npm run dev
```

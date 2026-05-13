# Sections Catalog — PokéDex Ultimate

> Especificación funcional de las 12 secciones de la landing. Cada sección documenta: ID, archivo, layout, copy, animaciones, datos requeridos, edge cases. Antes de implementar/refactorizar una sección, leer **esta entrada completa**.

Convenciones:
- `client?` = ¿requiere `"use client"`?
- `scroll-snap?` = ¿está en el scroll-snap container?
- Todos los tokens visuales: ver [design-system.md](design-system.md).

---

## 1. Navbar — `components/sections/Navbar.tsx`

- **client?** sí (scroll listener + menú móvil)
- **Posición:** `fixed top-0 inset-x-0 z-50`
- **Layout:** logo izquierda · links centro · CTA + hamburger derecha
- **Logo:** "Poké**Dex Ultimate**" — "Poké" en `--color-accent-yellow`, resto blanco. Exo 2 700.
- **Links:** Pokédex · Novedades · Destacados · Evoluciones · Tipos · Competitivo · Hall of Fame
- **CTA:** botón outline pequeño "Explorar Pokédex →" amarillo
- **Comportamiento:** background pasa de `transparent` a `rgba(10,10,15,0.85)` + `backdrop-blur-xl` cuando `scrollY > 40`. Usar `useScroll` de Framer Motion.
- **Móvil:** hamburger → menú desplegable full-height con stagger de links.

---

## 2. Hero — Zekrom — `components/sections/Hero.tsx`

- **client?** sí
- **scroll-snap?** sí (`scroll-snap-align: start`)
- **Altura:** `min-h-screen` (`100vh`)
- **Fondo:**
  - `<video autoplay muted loop playsinline>` con `src="/assets/hero-zekrom.mp4"`
  - Fallback `<img src="/assets/hero-zekrom-frame1.webp">` si el navegador no soporta autoplay
  - Fallback final: gradiente radial azul oscuro → negro
  - Encima: overlay `rgba(10,10,15,0.4)` para contraste de texto
- **Partículas eléctricas:** canvas o tsParticles encima del vídeo, debajo del texto. Puntos amarillos/azules pequeños que flotan y se conectan con líneas tenues. `z-index: 10`.
- **Rayos SVG:** SVG animado en esquinas con `stroke-dashoffset` keyframe para simular rayos.
- **Parallax:** Zekrom (`<video>`) se mueve a `0.3x` la velocidad del scroll usando `useScroll` + `useTransform`.

### Contenido
- **Eyebrow:** `↯ LA ENCICLOPEDIA DEFINITIVA ↯` (uppercase, tracking enorme, color azul eléctrico)
- **H1:** `El poder de todos los Pokémon,` + br + `en tus manos.` (Exo 2 900, clamp 56-130px, blanco con `text-shadow: 0 0 32px var(--color-glow-blue)`)
- **Subheadline:** `Más de 1000 Pokémon. Stats completos. Evoluciones, habilidades ocultas, naturalezas y el meta competitivo más actualizado.` (DM Sans 18-20px, secundario)
- **CTA primario:** `Explorar la Pokédex` (amarillo, magnético, glow al hover)
- **CTA secundario:** `Ver novedades →` (outline blanco)
- **Badge flotante:** `#001 · ZEKROM · Dragón / Eléctrico` glassmorphism, esquina inferior-izquierda
- **Scroll indicator:** chevron pulsante abajo-centro, anima `translateY(0 ↔ 8px)`

### Edge cases
- Móvil: H1 baja a `clamp(40px, 12vw, 60px)`. Partículas reducidas a la mitad.
- `prefers-reduced-motion`: vídeo se reemplaza por imagen estática (frame1), sin parallax, sin partículas.

---

## 3. TypeTicker — `components/sections/TypeTicker.tsx`

- **client?** no (CSS puro)
- **scroll-snap?** no
- **Layout:** banda full-width, `py-8`, fondo `--color-bg-elevated`
- **Contenido:** los 18 tipos con su icono SVG + nombre, en un track horizontal
- **Animación:** `@keyframes marquee` — `transform: translateX(0 → -50%)` en bucle, duración 40s, lineal
- **Trick:** duplicar el contenido para loop sin saltos. Aplicar `animation-play-state: paused` en hover (opcional).
- **Móvil:** velocidad un 30% más rápida (`duration: 28s`) para mantener percepción de movimiento.

---

## 4. Novedades — `components/sections/Novedades.tsx`

- **client?** sí (reveal animations)
- **scroll-snap?** sí
- **Numeración decorativa:** "01" enorme Exo 2 900, opacity 0.04, blur 8px, detrás del H2
- **H2:** `LO ÚLTIMO DEL MUNDO POKÉMON`
- **Layout:** grid asimétrico
  - `lg:grid-cols-3 grid-rows-3`
  - 1 card featured (`col-span-2 row-span-3`, ratio 4:3) + 3 cards pequeñas (`col-span-1 row-span-1`)
  - Móvil: stack 1 columna, featured arriba
- **Card:**
  - Glassmorphism, padding 0 con imagen full bleed arriba + contenido abajo
  - Tag de categoría (top-left): pill colorizada por tipo de novedad — "Juego" (rojo), "Torneo" (amarillo), "Anime" (morado)
  - H3 del artículo, fecha en JetBrains Mono, botón "Leer más →"
- **Hover:** borde con gradiente animado + `scale(1.02)`
- **Stagger:** entrada con 80ms de delay entre cards
- **Datos mock:** `lib/mock/news.ts` — 4 entradas con título, categoría, fecha, slug, placeholder image gradient

### Copy de ejemplo (mock)
- "Pokémon Legends Z-A — Todo lo que sabemos" · Juego
- "Campeonato Mundial 2025 — Equipos más usados" · Torneo
- "Nueva temporada del anime: PokéHorizons" · Anime
- "Tier list competitiva de mayo" · Competitivo

---

## 5. Destacados — `components/sections/Destacados.tsx`

- **client?** sí
- **scroll-snap?** sí
- **Numeración:** "02"
- **H2:** `LOS MÁS PODEROSOS DEL MOMENTO`
- **Sub:** "Meta competitivo · Temporada actual" (eyebrow style)
- **Fondo:** `<video src="/assets/featured-bg.mp4">` en loop, opacity 0.6 sobre el bg
- **Layout (bento):**
  - 2 cards grandes (`col-span-2`) + 4 cards pequeñas
  - Móvil: 1 columna
- **Card de Pokémon destacado:**
  - Visual: placeholder con gradient del tipo principal (ver design-system §2)
  - Nombre Exo 2 + `#NÚMERO` JetBrains Mono al lado
  - Badges de tipo (`<TypeBadge>` cada uno)
  - **Barra de uso competitivo:** bar horizontal animada `scaleX(0→1)` cuando entra en viewport, con `%` en mono
  - Mini stats: ATK, DEF, VEL en 3 mini-barras
  - Botón "Ver ficha completa →"
- **Hover:** glow del color del tipo principal
- **Datos mock:** `lib/mock/featured.ts` — 6 Pokémon: Garchomp, Iron Valiant, Gholdengo, Kingambit, Dragonite, Landorus-T

---

## 6. Pokédex Explorer (preview) — `components/sections/PokedexExplorer.tsx`

- **client?** sí
- **H2:** `EXPLORA LA POKÉDEX COMPLETA`
- **Buscador:**
  - Input grande centrado, max-w-2xl
  - Icono lupa a la izquierda
  - Placeholder: `Busca por nombre, número o tipo...`
  - Glassmorphism, focus ring amarillo
- **Filtros visuales:**
  - Pills por tipo (18 pills, colores oficiales)
  - Pills por generación (Gen I → IX)
  - Pills por habilidad (top 5 habilidades)
  - Estado seleccionado: borde brillante + glow
- **Grid de preview:**
  - 12 Pokémon en cards pequeñas (4 cols lg, 3 md, 2 sm)
  - Pokémon: Pikachu, Charizard, Mewtwo, Gengar, Eevee, Lucario, Greninja, Rayquaza, Umbreon, Gardevoir, Tyranitar, Snorlax
- **CTA grande:** `Ver los +1000 Pokémon →` botón amarillo centrado
- **Datos mock:** `lib/mock/pokemon-iconic.ts`

---

## 7. Evoluciones — `components/sections/Evolutions.tsx`

- **client?** sí
- **H2:** `EL CAMINO DE LA EVOLUCIÓN`
- **Visual decorativo:** `<video src="/assets/evolution-flash.mp4">` se reproduce al hover sobre una flecha (no loop, una vez)
- **Cadenas:**
  1. Bulbasaur → Ivysaur → Venusaur (planta/veneno)
  2. Charmander → Charmeleon → Charizard (fuego/volador)
  3. Gastly → Haunter → Gengar (fantasma/veneno)
- **Layout cadena:**
  - Horizontal en lg, vertical en móvil
  - Cards Pokémon glassmorphism con tipo coloreado
  - Entre cards: flecha animada (`→`) con método de evolución abajo (texto pequeño): "Nivel 16", "Piedra Lunar", "Comerciar"
- **Animación:** al entrar en viewport, las cadenas se revelan de izquierda a derecha (stagger 200ms)
- **CTA:** `Explorar todas las cadenas de evolución →`

---

## 8. Tipos y Matchups — `components/sections/TypesMatchup.tsx`

- **client?** sí
- **H2:** `DOMINA LOS TIPOS`
- **Tabla 18×18:** filas = tipo atacante, columnas = tipo defensor
- **Celdas:** colores según efectividad
  - Super efectivo (×2): verde brillante `#00FF88`
  - Normal (×1): gris transparente
  - Poco efectivo (×0.5): naranja `#FF8C00`
  - Inmune (×0): rojo oscuro `#8B0000`
- **Interacción hover:** resalta fila + columna del cursor; tooltip muestra valor exacto
- **Móvil:** tabla 18×18 no cabe. Solución: selector dropdown de tipo → muestra solo la fila/columna del tipo seleccionado.
- **Datos:** `lib/mock/type-effectiveness.ts` — matriz hardcoded de 18×18

---

## 9. Habilidades y Naturalezas — `components/sections/AbilitiesNatures.tsx`

- **client?** no (estático)
- **H2:** `CONSTRUYE TU EQUIPO PERFECTO`
- **Layout:** 2 columnas en lg, stack en móvil
### Columna 1 — Habilidades ocultas
- Lista de las más relevantes (top 8-10): Velo Misterio, Multiescamas, Intimidación, Levitación, Velocextrema, Cuerpo Maldito, Magnetismo, Galvanismo
- Cada item: nombre (Exo 2), descripción corta (DM Sans)
- Glassmorphism por bloque

### Columna 2 — Naturalezas
- Tabla visual de las 25 naturalezas (5×5)
- Cada celda: nombre + stat que sube (verde) + stat que baja (rojo)
- Naturalezas neutras (mismo stat o "sin cambio") en gris
- Diseño tipo guía competitiva

**Datos:** `lib/mock/abilities.ts`, `lib/mock/natures.ts`

---

## 10. Hall of Fame — `components/sections/HallOfFame.tsx`

- **client?** sí
- **H2:** `LEYENDAS INMORTALES`
- **Fondo:** `<video src="/assets/halloffame-particles.mp4">` partículas doradas en loop, opacity 0.5
- **Layout:** carrusel horizontal 3D
  - Card central: scale 1, full opacity, glow dorado
  - Cards laterales: scale 0.85, opacity 0.5
  - Perspective CSS: `perspective: 1200px; transform: rotateY(-15deg)` en laterales
- **Card:**
  - Imagen del Pokémon (placeholder gradient)
  - Nombre Exo 2 grande
  - Generación (mono): "Gen I", "Gen V", etc.
  - Frase épica:
    - Mewtwo: "El más poderoso jamás creado"
    - Pikachu: "El símbolo de toda una generación"
    - Charizard: "La furia hecha leyenda"
    - Rayquaza: "Guardián de los cielos"
    - Arceus: "El que dio forma al universo"
    - Gengar: "Sombra de la travesura eterna"
    - Eevee: "Mil caminos, un solo corazón"
    - Lucario: "Aura, instinto, fidelidad"
    - Greninja: "El ninja del agua"
    - Zekrom: "El relámpago de la verdad"
- **Navegación:** flechas custom a izq/dcha + dots abajo
- **Datos:** `lib/mock/hall-of-fame.ts`

---

## 11. CTA Final — `components/sections/FinalCTA.tsx`

- **client?** no
- **Altura:** `py-32 lg:py-40`
- **Fondo:** gradiente diagonal `from-[#FFD700] via-[#FFA500] to-[#E3350D]`
- **H2:** `¿Listo para convertirte en el mejor Maestro Pokémon?` (Exo 2 900, color negro, clamp 40-72px)
- **Sub:** `Accede a la Pokédex más completa. Gratis. Para siempre.` (DM Sans, color negro 80%)
- **Botón:** enorme `Empezar ahora →` — negro sobre amarillo (hover invertido)
- **Decoración:** silueta de PokéBall gigante semitransparente en una esquina

---

## 12. Footer — `components/sections/Footer.tsx`

- **client?** no
- **Background:** `--color-bg-elevated`
- **Layout:** 4 columnas en lg, stack en móvil
  - **Explorar:** Pokédex · Tipos · Habilidades · Naturalezas
  - **Recursos:** Novedades · Guías · Glosario · FAQ
  - **Comunidad:** Discord · Twitter · YouTube · GitHub
  - **Legal:** Privacidad · Términos · Disclaimer · Contacto
- **Logo + tagline** arriba del grid
- **Disclaimer destacado:** `PokéDex Ultimate no está afiliado con Nintendo, Game Freak ni The Pokémon Company. Todos los derechos de Pokémon pertenecen a sus respectivos propietarios.`
- **Copyright:** `© 2025 PokéDex Ultimate. Sitio creado por fans, para fans.`
- **Redes sociales:** iconos al lado del copyright

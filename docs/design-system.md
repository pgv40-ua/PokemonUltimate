# Design System — PokéDex Ultimate

> Fuente única de tokens visuales. Cualquier color, espaciado, easing o sombra usado en la app debe venir de aquí. Si necesitas un valor que no está, **añádelo aquí primero** y luego úsalo.

---

## 1. Paleta principal (variables CSS)

```css
:root {
  /* Fondos */
  --color-bg: #0a0a0f;
  --color-bg-elevated: #12121a;
  --color-surface: rgba(255, 255, 255, 0.05);
  --color-surface-hover: rgba(255, 255, 255, 0.08);
  --color-border: rgba(255, 255, 255, 0.12);
  --color-border-strong: rgba(255, 255, 255, 0.2);

  /* Acentos de marca */
  --color-accent-yellow: #FFD700;    /* Pikachu */
  --color-accent-red: #E3350D;       /* PokéBall */
  --color-accent-blue: #00BFFF;      /* eléctrico */
  --color-accent-purple: #7B2FBE;    /* legendario */
  --color-accent-electric: #F4D03F;  /* rayos */

  /* Texto */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-text-muted: rgba(255, 255, 255, 0.4);
  --color-text-inverse: #0a0a0f;     /* sobre fondos claros (CTA amarillo) */

  /* Glows (sombras de color) */
  --color-glow-yellow: rgba(255, 215, 0, 0.3);
  --color-glow-blue: rgba(0, 191, 255, 0.25);
  --color-glow-red: rgba(227, 53, 13, 0.25);
  --color-glow-purple: rgba(123, 47, 190, 0.25);
}
```

## 2. Colores oficiales de tipos Pokémon

Los 18 tipos con su color oficial. Estos valores son **canónicos** — no improvisar otros.

| Tipo | Hex | Uso recomendado |
|------|-----|-----------------|
| Normal | `#A8A878` | badge, glow sutil |
| Fuego | `#F08030` | badge, hover glow Charizard |
| Agua | `#6890F0` | badge, hover glow Greninja |
| Eléctrico | `#F8D030` | badge, hover Pikachu, partículas |
| Planta | `#78C850` | badge, hover Bulbasaur |
| Hielo | `#98D8D8` | badge |
| Lucha | `#C03028` | badge |
| Veneno | `#A040A0` | badge, Gengar partial |
| Tierra | `#E0C068` | badge, Garchomp partial |
| Volador | `#A890F0` | badge, Dragonite partial |
| Psíquico | `#F85888` | badge, Mewtwo |
| Bicho | `#A8B820` | badge |
| Roca | `#B8A038` | badge |
| Fantasma | `#705898` | badge, hover Gengar |
| Dragón | `#7038F8` | badge, Zekrom, Garchomp, Rayquaza |
| Siniestro | `#705848` | badge, Umbreon |
| Acero | `#B8B8D0` | badge, Kingambit, Gholdengo partial |
| Hada | `#EE99AC` | badge, Gardevoir partial |

### Helper: gradient por tipo
Para placeholders de Pokémon sin imagen:
```css
background: linear-gradient(135deg, var(--type-color) 0%, rgba(10,10,15,0.9) 100%);
```

## 3. Tipografías

```ts
// app/layout.tsx — import via next/font
import { Exo_2, DM_Sans, JetBrains_Mono } from 'next/font/google';

const exo2 = Exo_2({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-display' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
```

### Escala tipográfica

| Uso | Font | Size | Weight | Line-height |
|-----|------|------|--------|-------------|
| H1 hero | Exo 2 | `clamp(56px, 9vw, 130px)` | 900 | 0.95 |
| H2 sección | Exo 2 | `clamp(40px, 5vw, 72px)` | 900 | 1 |
| H3 card | Exo 2 | `clamp(20px, 2vw, 28px)` | 700 | 1.15 |
| Eyebrow | DM Sans | 12-13px (`uppercase tracking-[0.3em]`) | 500 | 1 |
| Body | DM Sans | 16-18px | 400 | 1.6 |
| Subheadline hero | DM Sans | 18-20px | 400 | 1.5 |
| Stats / IDs | JetBrains Mono | 14-16px | 500 | 1 |
| Caption | DM Sans | 13-14px | 400 | 1.4 |

## 4. Espaciado

- **Padding vertical de secciones:** `py-24 lg:py-32` (mínimo)
- **Container max-width:** `max-w-7xl` con `px-6 lg:px-12`
- **Gap entre cards en grid:** `gap-6 lg:gap-8`
- **Padding interno de card:** `p-6 lg:p-8`
- **Margin entre eyebrow y H2:** `mb-4`
- **Margin entre H2 y contenido:** `mb-12 lg:mb-16`

## 5. Glassmorphism (cards)

```css
.glass-card {
  background: var(--color-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.glass-card:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
  transform: translateY(-2px) scale(1.02);
  /* sombra con color del tipo principal del Pokémon */
  box-shadow: 0 12px 40px rgba(var(--type-rgb), 0.25);
}
```

**Regla:** las sombras de hover en cards de Pokémon llevan el color del tipo principal del Pokémon (no un color genérico).

## 6. Botones

### Primary (CTA principal)
- Background: `var(--color-accent-yellow)`
- Texto: `var(--color-text-inverse)` (negro)
- Border-radius: full (pill)
- Padding: `px-8 py-4` (size lg), `px-6 py-3` (size md)
- Hover: `scale(1.05)` + `box-shadow: 0 0 32px var(--color-glow-yellow)`

### Secondary (outline)
- Background: `transparent`
- Border: `1px solid rgba(255,255,255,0.3)`
- Texto: blanco
- Hover: `background: rgba(255,255,255,0.1)` + border opaco

### Magnético
Implementación en hook `useMagneticButton(strength = 0.3)` → en `lib/hooks/`. Activable en todos los CTA primarios. Listener `mousemove` calcula offset desde el centro, aplica `transform: translate()` con `lerp` suave. Se desactiva si `prefers-reduced-motion: reduce`.

## 7. Animación — tokens

```ts
export const easing = [0.22, 1, 0.36, 1] as const;   // cubic-bezier global
export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  page: 0.8,
} as const;

export const stagger = {
  cards: 0.08,    // 80ms entre cards de un grid
  letters: 0.03,  // texto letra a letra (uso reservado)
};

export const viewport = {
  once: true,
  margin: '-100px',
} as const;
```

### Reveal por defecto
```ts
const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, ease: easing },
  viewport,
};
```

### prefers-reduced-motion
- Hook `useReducedMotion` (de Framer Motion) en cualquier componente con animación.
- Si reducido: animaciones se sustituyen por fade simple (`opacity 0→1`, sin `y`), o se omiten completamente para parallax/partículas.

## 8. Z-index

```ts
export const z = {
  base: 0,
  decorative: 10,    // pokéballs gigantes de fondo, partículas
  content: 20,
  navbar: 50,
  modal: 100,
  cursor: 9999,      // cursor custom (pokéball)
};
```

## 9. Iconografía

- **Tipos Pokémon:** SVGs inline en `components/ui/TypeIcon.tsx`, 18 iconos, colores por defecto del tipo.
- **UI:** [lucide-react](https://lucide.dev/) si hace falta (lupa, flecha, chevron). Solo si una librería de iconos es realmente necesaria — preferir SVG inline para los pocos iconos del proyecto.

## 10. Responsive — breakpoints (Tailwind)

```
sm: 640px   md: 768px   lg: 1024px   xl: 1280px   2xl: 1536px
```

Decisiones por breakpoint clave:
- **<sm (móvil):** hero H1 cae a `clamp(40px, 12vw, 60px)`. Grids pasan a 1 columna. Navbar → hamburger.
- **md-lg:** grids 2 columnas. Carrusel Hall of Fame muestra 3 cards.
- **lg+:** layout final completo. Carrusel muestra 5 cards.

## 11. Cursor custom

```css
body { cursor: url('/assets/cursor-pokeball.png') 16 16, auto; }
a, button, [role="button"] {
  cursor: url('/assets/cursor-pokeball-active.png') 16 16, pointer;
}
```

Se desactiva en `prefers-reduced-motion` y en pantallas táctiles (`@media (hover: none)`).

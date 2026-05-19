# Fase 9 — Dataset Gen 1-9 + Búsqueda Fuzzy Global + Filtros Avanzados

## Contexto

La Fase 8 cerró la integración con PokéAPI para Gen 1-3 (386 Pokémon). El producto ahora necesita ser la enciclopedia más completa, lo que exige:

1. **Dataset completo Gen 1-9** (1..1025) — cubrir Pokémon hasta Scarlet/Violet.
2. **Búsqueda fuzzy global** accesible desde el Navbar (paleta de comandos Cmd+K) y desde la Pokédex.
3. **Filtros avanzados en la Pokédex** — generación, rango de estadísticas, tipo multi-selección, legendarios/míticos, ordenación.

> **Fase 10 (próxima):** `/novedades` como blog real. No tocar en esta fase.

---

## Decisiones técnicas acordadas

| Decisión | Elección | Razón |
|----------|----------|-------|
| Dataset | Gen 1-9 (1..1025) | Cubrir toda la franquicia hasta Scarlet/Violet |
| Fuzzy search | **Fuse.js** | 6 KB gzipped; maneja typos, acentos, abreviaturas. `String.includes()` no cubre eso |
| Search UI | Paleta de comandos (overlay modal) | Patrón estándar para search global; accesible con Cmd/Ctrl+K desde cualquier página |
| Filtros | Client-side sobre datos ya cargados | 1025 Pokémon × ~200 B = ~200 KB JSON, tratable en memoria |
| Build Pokédex | ISR 24h, chunks de 10 (antes 20) | Reducir timeouts con el doble de peticiones |
| Ficha individual | `dynamicParams = true`, sin `generateStaticParams` | Pre-generar 1025 en build sería lento; ISR on-demand es mejor |

---

## Arquitectura de cambios

```
lib/
  api/
    endpoints.ts          ← MODIFICAR: GEN_9_MAX_ID = 1025 (reemplaza GEN_3_MAX_ID)
    pokeapi.ts            ← MODIFICAR: chunks de 10, sin cambios de interfaz
  search/
    fuse-index.ts         ← NUEVO: tipo FuseResult, helper buildIndex(pokemon[])

components/
  ui/
    SearchCommand.tsx     ← NUEVO: overlay paleta de comandos (Cmd+K)
    CommandItem.tsx       ← NUEVO: fila de resultado (sprite mini + nombre + tipos)
  sections/
    Navbar.tsx            ← MODIFICAR: añadir botón/icono de búsqueda + escuchar Cmd+K
    PokedexExplorer.tsx   ← MODIFICAR: integrar fuzzy search + filtros avanzados

app/
  pokedex/page.tsx        ← MODIFICAR: revalidate sigue igual, pasar 1025 Pokémon
```

---

## Bloque 1 — Dataset Gen 1-9

### Archivos a modificar

**`lib/api/endpoints.ts`:**
```ts
// Cambiar:
export const GEN_3_MAX_ID = 386;
// Por:
export const GEN_9_MAX_ID = 1025;
// Conservar GEN_3_MAX_ID como alias por si algún componente lo usa
export const GEN_3_MAX_ID = 386; // deprecated, usar GEN_9_MAX_ID
```

**`lib/api/pokeapi.ts`** — función `getPokemonList`:
```ts
// Cambiar chunk size de 20 a 10 para evitar timeouts con 1025 peticiones
const CHUNK_SIZE = 10; // era 20
```

**`app/pokedex/page.tsx`:**
```ts
// Cambiar:
const pokemon = await getPokemonList(386, 0);
// Por:
const pokemon = await getPokemonList(GEN_9_MAX_ID, 0);
// Importar GEN_9_MAX_ID en vez de GEN_3_MAX_ID
```

**`app/pokemon/[id]/page.tsx`:**
```ts
// Cambiar validación:
if (!Number.isInteger(n) || n < 1 || n > GEN_9_MAX_ID) return null;
// Quitar generateStaticParams o dejarlo vacío — ISR on-demand cubre todo
export function generateStaticParams() { return []; }
```

### Verificación Bloque 1
- `npm run build` completa sin timeouts (puede tardar 3-5 min — normal con 1025 Pokémon)
- `/pokedex` muestra 1025 Pokémon
- `/pokemon/900` (Lechonk) carga correctamente

---

## Bloque 2 — Búsqueda fuzzy: índice + helper

### `lib/search/fuse-index.ts` (nuevo)

```ts
import Fuse from 'fuse.js';
import type { Pokemon } from '@/lib/types/pokemon';

export type FuseResult = {
  id: number;
  nameEs: string;
  nameEn: string;
  types: Pokemon['types'];
  sprite?: string;
};

export function buildFuseIndex(pokemon: Pokemon[]): Fuse<FuseResult> {
  const items: FuseResult[] = pokemon.map((p) => ({
    id: p.id,
    nameEs: p.name.es,
    nameEn: p.name.en,
    types: p.types,
    sprite: p.imageUrl,
  }));
  return new Fuse(items, {
    keys: [
      { name: 'nameEs', weight: 2 },
      { name: 'nameEn', weight: 1.5 },
      { name: 'id', weight: 1 },
    ],
    threshold: 0.35,        // tolera ~1-2 typos
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });
}
```

### Instalar Fuse.js

```bash
npm install fuse.js
```

Justificación en PR: String.includes() no maneja "pikchu", "bulbasaur" (sin acento), "char" buscando "Charizard". Fuse.js = 6 KB gzipped, sin dependencias transitivas.

---

## Bloque 3 — SearchCommand: paleta global (Navbar)

### `components/ui/SearchCommand.tsx` (nuevo, `'use client'`)

Comportamiento:
- Overlay modal fullscreen con backdrop blur
- Input con icono de búsqueda enfocado al abrir
- Resultados: top 8, cada uno con sprite 32px + nombre ES + número + tipos
- Click en resultado → `router.push('/pokemon/{id}')` + cerrar
- "Ver todos en Pokédex" → `/pokedex?q={query}`
- Tecla Escape → cerrar
- Cmd/Ctrl+K → abrir desde cualquier página
- `role="dialog"`, `aria-modal="true"`, foco atrapado dentro

Props:
```ts
interface SearchCommandProps {
  pokemon: FuseResult[]; // lista ligera, sin stats completas
  isOpen: boolean;
  onClose: () => void;
}
```

El overlay recibe `FuseResult[]` (solo id, nombres, tipos, sprite) — NO `Pokemon[]` completo para no serializar 1025 fichas al cliente.

### `components/ui/CommandItem.tsx` (nuevo)

Fila de resultado:
```tsx
<li role="option" aria-selected={isActive}>
  <Image src={sprite} ... width={32} height={32} />
  <span className="font-mono text-xs text-text-muted">#{id}</span>
  <span className="font-display font-bold">{nameEs}</span>
  <div className="flex gap-1">{types.map(t => <TypeBadge key={t} type={t} size="sm"/>)}</div>
</li>
```

### Modificar `components/sections/Navbar.tsx`

1. Añadir botón de lupa (icono) en la barra de navegación (derecha, antes del CTA).
2. `useState` para `isSearchOpen`.
3. `useEffect` para escuchar `keydown` → `(e.metaKey || e.ctrlKey) && e.key === 'k'` → `setIsSearchOpen(true)`.
4. Render `<SearchCommand pokemon={fuseItems} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />`.
5. El `fuseItems` debe venir como prop desde `app/layout.tsx` o desde una llamada ligera.

**Estrategia de datos para el Navbar:**
- `app/layout.tsx` es Server Component → puede llamar `getPokemonList(GEN_9_MAX_ID, 0)` y pasar solo los campos ligeros (`id, name, types, imageUrl`) a un Client Component wrapper.
- Alternativamente, crear `getPokemonSearchIndex()` en `pokeapi.ts` que devuelva solo esos 4 campos para los 1025 → payload ~80 KB.
- El Navbar actual es Server Component. Convertir solo el wrapper de búsqueda a Client Component.

**Arquitectura recomendada:**
```
app/layout.tsx (Server)
  → llama getPokemonSearchIndex() → pasa fuseItems[] a NavbarClient
  → NavbarClient (Client) → maneja isSearchOpen + renderiza SearchCommand
  → Navbar (Server, sigue igual para links/logo)
```

---

## Bloque 4 — Filtros avanzados en PokedexExplorer

### Nuevos filtros a añadir en `PokedexExplorer.tsx`

1. **Generación** (1-9): chips o dropdown multi-selección.
   - Mapear `p.generation` → `selectedGenerations: Set<Generation>`.
   - Si Set vacío → mostrar todos.

2. **Estadística total (BST)**: slider de rango `[minBST, maxBST]`.
   - Calcular `bst = sum(Object.values(p.stats))`.
   - Rango: 0-780 (Arceus, Mewtwo).
   - Usar dos `<input type="range">` nativos — sin librería de slider.

3. **Legendary / Mythical**: toggle `isLegendary`, `isMythical`.
   - Requiere añadir ambos campos al tipo `Pokemon` (ya existen en `lib/types/pokemon.ts`).
   - Verificar que `getPokemonBasic` mapee `species.is_legendary` y `species.is_mythical`.

4. **Ordenación**:
   - `sortBy: 'id' | 'nameEs' | 'bst'`
   - Orden: `asc` por defecto, toggle `desc`.

5. **Tipo multi-selección**: el filtro actual es single-select. Cambiar a multi-select — varios tipos a la vez (AND o OR, preferir OR para que sea más usable).

### UI de filtros avanzados

- Panel colapsable "Filtros avanzados" debajo de los chips de tipo actuales.
- Botón toggle con contador de filtros activos: "Filtros (3)".
- Animado con Framer Motion (height: 0 → auto).
- Limpiar filtros: el botón existente también limpia los nuevos filtros.

### Integrar fuzzy en PokedexExplorer

- `buildFuseIndex(pokemon)` en `useMemo` (solo se reconstruye si cambia el array).
- Reemplazar el `query.trim().toLowerCase()` + `p.name.es.toLowerCase().includes(q)` por `fuse.search(q).map(r => r.item)`.
- Si `q === ''`, skip Fuse y usar lista completa (evitar overhead).

### URL state (opcional pero recomendado)

Sincronizar filtros con URL params para que las búsquedas sean compartibles:
- `/pokedex?q=char&gen=1,3&sort=bst`
- Usar `useSearchParams` + `useRouter` de Next.js.
- Si `SearchCommand` navega a `/pokedex?q=xyz`, PokedexExplorer lee ese param al montar.

---

## Bloque 5 — Ajustes de rendimiento y accesibilidad

- **Pokédex con 1025 Pokémon**: la paginación actual (48+48) ya evita renders masivos. Verificar que `visibleCount` y `filtered.length` muestran bien con 1025.
- **Virtual scroll (opcional)**: si el rendimiento scroll es malo con 1025 renders DOM, considerar `@tanstack/react-virtual`. Probarlo primero sin él.
- **SearchCommand**: `<dialog>` nativo o div con `aria-modal`, foco atrapado, scroll lock en body mientras está abierto.
- **Filtros**: labels asociados a todos los inputs de rango, `aria-valuemin`/`aria-valuemax`/`aria-valuenow` en sliders.
- **Keyboard**: navegación con flechas en SearchCommand (↑↓ para mover el item activo, Enter para seleccionar).
- **Lighthouse**: auditar `/pokedex` después de los cambios — el payload aumenta de ~80 KB a ~200 KB.

---

## Agentes recomendados para esta fase

| Bloque | Agente | Qué delegar |
|--------|--------|-------------|
| 1 Dataset | `pokemon-data-specialist` | Verificar que el mapping de Gen 4-9 es correcto, que `getPokemonBasic` sigue funcionando para Pokémon con mechanics nuevas (formas alternativas, etc.) |
| 2 Fuse index | `pokemon-data-specialist` | Diseño del índice Fuse, campos óptimos para búsqueda |
| 3 SearchCommand | `glass-ui-designer` | Crear el overlay modal (SearchCommand + CommandItem) respetando el design system |
| 3 Animaciones | `animation-engineer` | Animación de entrada/salida del overlay, highlight de resultados activos |
| 3 Navbar | `section-builder` | Modificar Navbar para integrar búsqueda, arquitectura Server/Client wrapper |
| 4 Filtros avanzados | `section-builder` | PokedexExplorer con los nuevos filtros, panel colapsable, URL state |
| 5 Perf | `perf-auditor` | Auditar antes de PR — payload 1025 Pokémon, CLS filtros, bundle Fuse.js |

### Paralelización sugerida

**Ronda 1 (paralelo):**
- `pokemon-data-specialist` → Bloque 1 dataset + verificar Gen 4-9
- `glass-ui-designer` → SearchCommand + CommandItem (UI pura, sin datos)

**Ronda 2 (paralelo, depende de Ronda 1):**
- `section-builder` → Navbar wrapper + integración SearchCommand con datos reales
- `section-builder` → PokedexExplorer filtros avanzados + fuzzy

**Ronda 3:**
- `animation-engineer` → animaciones SearchCommand + filtros
- `perf-auditor` → auditoría final antes de PR

---

## Verificación end-to-end

1. `/pokedex` muestra 1025 Pokémon, contador correcto.
2. Buscar "pikachu" → aparece Pikachu. Buscar "pikchu" (typo) → sigue apareciendo.
3. Buscar "char" → Charmeleon, Charizard, Charmander.
4. Filtrar Gen 4 → solo #387-493.
5. Filtrar BST > 600 → solo pseudo-legendarios y legendarios.
6. Toggle Legendary → solo legendarios de todas las generaciones.
7. Multi-tipo: Fuego + Volador → Charizard, Ho-Oh, Moltres, etc.
8. Cmd+K desde cualquier página → abre SearchCommand.
9. Escribir "Snorlax" → aparece Snorlax en resultados. Click → navega a `/pokemon/143`.
10. Escape → cierra. Focus vuelve al trigger.
11. `/pokedex?q=drago` → PokedexExplorer carga con query pre-rellenada.
12. Lighthouse `/pokedex` → Perf ≥ 85 (payload mayor, aceptable), A11y 100.

---

## Archivos críticos

**Modificar:**
- `lib/api/endpoints.ts` — GEN_9_MAX_ID = 1025
- `lib/api/pokeapi.ts` — CHUNK_SIZE = 10
- `app/pokedex/page.tsx` — usar GEN_9_MAX_ID
- `app/pokemon/[id]/page.tsx` — validar contra GEN_9_MAX_ID
- `components/sections/Navbar.tsx` — integrar búsqueda global
- `components/sections/PokedexExplorer.tsx` — fuzzy + filtros avanzados

**Crear:**
- `lib/search/fuse-index.ts` — índice Fuse y helper buildFuseIndex
- `components/ui/SearchCommand.tsx` — overlay modal de búsqueda
- `components/ui/CommandItem.tsx` — fila de resultado

**Instalar:**
- `fuse.js` (`npm install fuse.js`) — 6 KB gzipped, sin deps

---

## Git workflow

- Branch: `feature/fase-9-pokedex-plus` (ya creada)
- Commits por bloque (5 commits)
- PR a main al cerrar con cuerpo detallado
- Actualizar memory `project_pokedex_ultimate.md` al cerrar

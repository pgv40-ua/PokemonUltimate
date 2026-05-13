# Asset Prompts — PokéDex Ultimate

> Prompts para generar los assets visuales con IA. Cada asset tiene Frame 1 (imagen), Frame 2 (variación para loop) y prompt de vídeo optimizado para Kling 2.0 y Runway Gen-3.

## Reglas globales

Estas reglas se aplican a **todos** los assets sin excepción:

- **Fondo:** oscuro profundo `#0a0a0f` o variaciones cercanas
- **Paleta:** amarillo `#FFD700`, rojo `#E3350D`, azul eléctrico `#00BFFF`, morado `#7B2FBE`, dorado `#D4AF37`
- **Sin texto** dentro del visual (el texto va en HTML sobre el vídeo)
- **Sin caras humanas** — solo Pokémon, luz y abstracción
- **Loop-friendly** excepto el destello de evolución (one-shot)
- **Aspect ratio:** 16:9 para hero y fondos · 1:1 para variaciones de cards
- **Coherencia de marca** entre todos los assets — mismo tono cinematográfico, misma calidad

---

## Asset 1 — Hero: Zekrom emergiendo

**Archivo:** `public/assets/hero-zekrom.mp4` (+ `hero-zekrom-frame1.webp` fallback)
**Sección:** Hero
**Duración:** 6s · **Loop:** sí · **Estética:** cinematográfica oscura, épica, eléctrica

### Prompt — Frame 1 (Midjourney / SDXL)

```
Zekrom, the legendary black dragon Pokémon from Pokémon Black and White, emerging from the bottom of the frame, colossal and imposing against a near-black stormy sky. Its body is dark grey-black with a glowing blue electric core on its chest and tail. The scene is dramatically lit: electric blue light radiates from below and from its tail turbine, casting sharp volumetric light rays upward. The background shows storm clouds with subtle purple and deep blue hues, with thin lightning veins flickering at the edges. Extreme low-angle shot, looking up at Zekrom. Cinematic photography, anamorphic lens, shallow depth of field on background, photorealistic render quality. No text, no UI, no humans. 16:9 aspect ratio. --ar 16:9 --style raw --v 6
```

### Prompt — Frame 2 (loop end)

```
Same scene as Frame 1: Zekrom emerging from below against a dark storm sky, same low-angle shot. Subtle changes: the electric blue glow from its chest and tail is slightly brighter and pulses outward by 15%, two additional thin lightning bolts strike downward from the clouds in the upper corners of the frame, the volumetric light rays are slightly more intense. Everything else identical — same composition, same colors, same cinematic tone. --ar 16:9 --style raw --v 6
```

### Prompt — Vídeo (Frame 1 → Frame 2)

**Kling 2.0:**
```
Zekrom legendary Pokémon slowly rising from below, electric blue core glowing and pulsing, storm clouds with lightning in background, low angle cinematic shot, slow upward drift, dark epic atmosphere, loop animation, 6 seconds, no text
```

**Runway Gen-3:**
```
Low angle slow dolly up on Zekrom rising from bottom frame. Electric blue bioluminescent glow intensifying on chest core and tail turbine. Storm atmosphere, volumetric rays, lightning strikes upper corners. Cinematic color grade, anamorphic. Duration 6s, smooth loop
```

**Parámetros:** Duración 6s · Motion intensity 6/10 · Seed consistente con Frame 1

---

## Asset 2 — Destacados: fondo abstracto animado

**Archivo:** `public/assets/featured-bg.mp4`
**Sección:** Destacados
**Duración:** 5s · **Loop:** sí · **Estética:** 3D abstracto, partículas de energía, colores de marca

### Prompt — Frame 1

```
Abstract dark background with floating energy particles and geometric light trails. Colors: electric yellow (#FFD700), deep blue (#00BFFF), vibrant red (#E3350D) and purple (#7B2FBE). Small glowing orbs of different sizes drift slowly across the frame. Thin light trails connect some orbs. Background is near-black (#0a0a0f). The composition feels like the inside of a Poké Ball energy field or a digital particle system. No characters, no text, no recognizable shapes. Purely abstract. 16:9. High quality 3D render, Octane style. --ar 16:9 --v 6 --style raw
```

### Prompt — Frame 2

```
Same abstract particle field as Frame 1. Subtle variation: the orbs have drifted slightly to new positions (approximately 8-12% of frame width), the light trails form slightly different connections, the glow intensity of some particles has shifted (some brighter, some dimmer). Same color palette, same near-black background, same overall composition density. Seamless loop-compatible with Frame 1. --ar 16:9 --v 6 --style raw
```

### Prompt — Vídeo

**Kling 2.0:**
```
Abstract energy particle field, dark background, glowing orbs in yellow blue red purple drifting slowly, light trails, atmospheric loop, 5 seconds, no text no characters
```

**Runway Gen-3:**
```
Macro particle system, bioluminescent orbs floating in deep space-like dark void, color palette yellow electric, deep blue, crimson, purple. Slow drift animation, connecting light filaments. Seamless loop. 5s
```

**Parámetros:** Duración 5s · Motion intensity 3/10 (sutil) · Loop enabled

---

## Asset 3 — Evoluciones: destello de evolución

**Archivo:** `public/assets/evolution-flash.mp4`
**Sección:** Evoluciones
**Duración:** 4s · **Loop:** NO (one-shot, se reproduce al hover) · **Estética:** flash blanco + energía dorada, transición épica

### Prompt — Frame 1

```
A bright, intense white light flash explosion centered in the frame, with energy rings radiating outward. The light is pure white at the center, transitioning to golden yellow and then to the deep darkness of the background at the edges. The effect resembles a Pokémon evolution sequence — a moment of transformation frozen in time. Abstract energy tendrils spiral outward from the center. No Pokémon visible yet — only the light. Dark background, dramatic contrast. 16:9. --ar 16:9 --style raw --v 6
```

### Prompt — Frame 2 (fade)

```
Same evolution flash light effect as Frame 1 but at slightly lower intensity — the central white glow has dimmed by 20%, the energy rings have expanded further outward to the edges, the golden tendrils are more diffuse. Still dramatic but transitioning from peak flash to fade. Same composition, same dark background. --ar 16:9 --style raw --v 6
```

### Prompt — Vídeo

**Kling 2.0:**
```
Pokémon evolution light burst animation, white flash from center, golden energy rings expanding outward, spiral tendrils, dramatic fade, 4 seconds, no characters, loop
```

**Runway Gen-3:**
```
Central white light explosion with radiating golden energy rings and spiral tendrils, evolution flash effect, dark background, dramatic bloom, 4s, seamless transition animation
```

**Parámetros:** Duración 4s · Motion intensity 8/10 (rápido y dramático) · Sin loop

---

## Asset 4 — Hall of Fame: partículas doradas

**Archivo:** `public/assets/halloffame-particles.mp4`
**Sección:** Hall of Fame
**Duración:** 6s · **Loop:** sí · **Estética:** luxury, dorado, épico, premio

### Prompt — Frame 1

```
Elegant dark background (#0a0a0f) with slowly floating golden particles of varying sizes. Some particles are sharp bright gold points, others are larger soft glowing golden orbs. A few thin golden light streaks drift diagonally. The overall effect is luxurious and prestigious, like a hall of fame or trophy room lit with ambient golden light. Very atmospheric, no characters, no text. Subtle bokeh effect on background particles. 16:9. --ar 16:9 --style raw --v 6
```

### Prompt — Frame 2

```
Same golden particle field as Frame 1. Particles have drifted slightly upward and sideways (approximately 10% displacement). New particles have appeared at the bottom to replace those that drifted up. The glow intensities have subtly shifted. Seamlessly loopable with Frame 1. Same prestigious, luxurious atmosphere. Same dark background, same golden palette. --ar 16:9 --style raw --v 6
```

### Prompt — Vídeo

**Kling 2.0:**
```
Golden particle field floating upward, luxury dark background, gold sparkles and glowing orbs drifting slowly, prestigious atmosphere, elegant motion, seamless loop, 6 seconds
```

**Runway Gen-3:**
```
Slow upward drift of golden bioluminescent particles, sharp gold points and soft bokeh orbs, near-black background, luxury atmosphere, diagonal light streaks, seamless loop, 6s cinematic
```

**Parámetros:** Duración 6s · Motion intensity 2/10 (muy lento y elegante) · Loop enabled

---

## Pipeline de generación recomendado

1. **Frame 1** en Midjourney v6 / SDXL → seleccionar el mejor render → guardar la seed.
2. **Frame 2** con la misma seed + variaciones del prompt.
3. **Vídeo**: subir Frame 1 como imagen inicial y Frame 2 como imagen final (image-to-video) en Runway Gen-3 o Kling 2.0, aplicar prompt de movimiento.
4. **Postproducción** opcional en DaVinci/Premiere:
   - Asegurar transición sin corte (cross-fade de 0.3s entre último y primer frame si hace falta)
   - Color grading consistente entre todos los assets
   - Export H.264, 1920×1080, bitrate ~5 Mbps, sin audio
5. **Comprimir** con HandBrake o ffmpeg → objetivo <2MB por asset para web.
6. **Colocar** en `public/assets/` con el nombre exacto indicado arriba.

## Si necesitas un asset nuevo

Cuando aparezca la necesidad de un visual no listado aquí, **delegar a `asset-prompt-writer`** indicándole:
- Sección donde irá
- Duración deseada y si es loop
- Estética (consultar reglas globales arriba)
- Si hay un Pokémon protagonista o es puramente abstracto

El agente añadirá la nueva entrada a este documento y respetará las reglas globales.

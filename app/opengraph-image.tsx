import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'PokéDex Ultimate — La enciclopedia Pokémon definitiva';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #001B4D 55%, #0a0a0f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Yellow radial glow centered */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 55% at 50% 52%, rgba(255,215,0,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Decorative ring — top right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,215,0,0.12)',
          }}
        />

        {/* Decorative ring — bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -160,
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: '1.5px solid rgba(0,191,255,0.10)',
          }}
        />

        {/* Eyebrow label */}
        <div
          style={{
            fontSize: 16,
            letterSpacing: '0.35em',
            textTransform: 'uppercase' as const,
            color: 'rgba(255,215,0,0.75)',
            marginBottom: 28,
            display: 'flex',
          }}
        >
          ENCICLOPEDIA POKÉMON DEFINITIVA
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            lineHeight: 0.88,
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 104,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            PokéDex
          </span>
          <span
            style={{
              fontSize: 104,
              fontWeight: 900,
              color: '#FFD700',
              letterSpacing: '-0.02em',
            }}
          >
            Ultimate
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.60)',
            marginTop: 36,
            textAlign: 'center' as const,
            maxWidth: 560,
            lineHeight: 1.5,
            display: 'flex',
          }}
        >
          Stats · Evoluciones · Habilidades · Meta competitivo
        </div>

        {/* Bottom gradient bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 5,
            background: 'linear-gradient(90deg, #FFD700 0%, #E3350D 50%, #00BFFF 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}

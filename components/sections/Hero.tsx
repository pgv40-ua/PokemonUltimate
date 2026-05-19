'use client';

import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import {
  easing,
  duration,
  heroContent,
  heroItem,
  heroContentReduced,
  heroItemReduced,
} from '@/lib/motion/tokens';
import { useParallaxLayer } from '@/lib/hooks/useParallaxLayer';
import { MagneticLink } from '@/components/ui/MagneticLink';

// Module-level guard prevents double-initialization on React 18 Strict Mode double-mount.
let particlesEngineReady = false;

// Electric particle config — yellow/blue dots with faint connecting lines.
// Density is intentionally low to stay GPU-friendly on mid-range devices.
const particlesOptions: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 20, density: { enable: true, width: 900, height: 900 } },
    color: { value: ['#FFD700', '#00BFFF', '#F4D03F'] },
    opacity: {
      value: { min: 0.2, max: 0.6 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: { value: { min: 1, max: 3 } },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none',
      random: true,
      outModes: { default: 'bounce' },
    },
    links: {
      enable: true,
      distance: 120,
      color: '#00BFFF',
      opacity: 0.08,
      width: 0.5,
    },
  },
  detectRetina: true,
};

// Lightning path animation — repeated with a long pause between cycles
// so it reads as an occasional electric arc rather than a constant loop.
const lightningTransition = (delay: number) => ({
  duration: 1.5,
  ease: 'easeInOut' as const,
  delay,
  repeat: Infinity,
  repeatDelay: 3.5,
  repeatType: 'loop' as const,
});

export const Hero: FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Tie parallax to the hero's own scroll progress: 0 when its top hits the
  // viewport top, 1 when its bottom exits. Each layer drifts at a distinct
  // speed for cinematic depth (deep < mid < near < foreground).
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgLayer = useParallaxLayer(scrollYProgress, 'mid', {
    scale: [1, 1.05],
  });
  const overlayLayer = useParallaxLayer(scrollYProgress, 'near', {
    opacity: [0.35, 0.65],
  });
  const particlesLayer = useParallaxLayer(scrollYProgress, 'deep', {
    opacity: [1, 0.4],
  });
  const lightningLayer = useParallaxLayer(scrollYProgress, 'foreground', {
    opacity: [1, 0.2],
  });

  // Particles are hidden on reduced-motion AND on mobile (width < 768).
  // We evaluate window.innerWidth only on the client to avoid SSR mismatch.
  const [showParticles, setShowParticles] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!shouldReduceMotion && !isMobile) {
      setShowParticles(true);
    }

    // Pause particles when tab is hidden to save GPU resources.
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setShowParticles(false);
      } else if (!shouldReduceMotion && window.innerWidth >= 768) {
        setShowParticles(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (particlesEngineReady) return;
    particlesEngineReady = true;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  // Choose variant sets based on reduced-motion preference.
  const containerVariants = shouldReduceMotion ? heroContentReduced : heroContent;
  const itemVariants = shouldReduceMotion ? heroItemReduced : heroItem;

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden flex items-center justify-center snap-start pt-20 sm:pt-16"
    >
      {/* ── Layer z-0: deep background — Zekrom video over radial gradient ──
          Drifts slowest of all layers (mid intensity). Subtle scale gives
          breathing depth without pixel rounding. The radial gradient remains
          beneath the video so it covers any reduced-motion or load failure. */}
      <motion.div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        id="hero-background"
        style={{ y: bgLayer.y, scale: bgLayer.scale }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 60% 40%, #001B4D 0%, #001030 40%, #0a0a0f 100%)',
          }}
        />
        {!shouldReduceMotion && (
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
            src="/assets/hero-zekrom.mp4"
            poster="/assets/hero-zekrom.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          />
        )}
      </motion.div>

      {/* ── Layer z-10: vignette overlay — drifts faster than the bg and
          fades darker toward the bottom of the section so text gains contrast
          as the user scrolls. */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          y: overlayLayer.y,
          opacity: overlayLayer.opacity,
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, rgba(10,10,15,0.55) 70%, rgba(10,10,15,0.85) 100%)',
        }}
      />

      {/* ── Layer z-20: electric particles ──
          Lazy-mounted: only rendered after client-side check confirms
          non-mobile + non-reduced-motion. Drifts barely (deep intensity)
          and fades as the section scrolls past. */}
      <motion.div
        id="hero-particles-container"
        className="absolute inset-0 z-20 pointer-events-none"
        aria-hidden="true"
        style={{ y: particlesLayer.y, opacity: particlesLayer.opacity }}
      >
        {showParticles && (
          <Particles
            id="hero-tsparticles"
            options={particlesOptions}
            className="absolute inset-0"
          />
        )}
      </motion.div>

      {/* ── Layer z-30: lightning bolt SVGs ──
          Foreground intensity (drifts most) and fades fastest so the bolts
          read as flashes anchored to the hero, not the page. */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 z-30 opacity-20"
        aria-hidden="true"
        style={{ y: lightningLayer.y, opacity: lightningLayer.opacity }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {shouldReduceMotion ? (
            <>
              <path
                d="M 20 10 L 80 90 L 55 90 L 120 190"
                stroke="#00BFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 50 5 L 90 70 L 70 70 L 100 140"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </>
          ) : (
            <>
              <motion.path
                d="M 20 10 L 80 90 L 55 90 L 120 190"
                stroke="#00BFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={lightningTransition(0.5)}
              />
              <motion.path
                d="M 50 5 L 90 70 L 70 70 L 100 140"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={lightningTransition(0.9)}
              />
            </>
          )}
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 z-30 opacity-20 rotate-180"
        aria-hidden="true"
        style={{ y: lightningLayer.y, opacity: lightningLayer.opacity }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {shouldReduceMotion ? (
            <path
              d="M 20 10 L 80 90 L 55 90 L 120 190"
              stroke="#00BFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <motion.path
              d="M 20 10 L 80 90 L 55 90 L 120 190"
              stroke="#00BFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={lightningTransition(1.4)}
            />
          )}
        </svg>
      </motion.div>

      {/* ── Layer z-40: main content ──
          h1 is a plain element (no Framer wrapping) so the browser paints it
          at SSR-render time and records LCP before any JS runs. Subtitle and
          CTAs stagger in after hydration as progressive enhancement. */}
      <div
        className="relative z-40 w-full max-w-5xl mx-auto px-6 lg:px-8 text-center lg:text-left"
      >
        {/* H1 principal — plain element, no opacity:0 in SSR, LCP-safe */}
        <h1
          id="hero-heading"
          className="font-display font-black leading-[0.92] text-white"
          style={{
            fontSize: 'clamp(48px, 9vw, 120px)',
            textShadow: '0 0 40px rgba(0, 191, 255, 0.25)',
          }}
        >
          El poder de todos{' '}
          <br className="hidden lg:block" />
          los Pokémon,
          <br />
          <span className="text-accent-blue">en tus manos.</span>
        </h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Subheadline */}
          <motion.p
            id="hero-subheadline"
            className="font-body text-text-secondary text-lg lg:text-xl mt-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)' }}
            variants={itemVariants}
          >
            Más de 1000 Pokémon. Stats completos. Evoluciones, habilidades ocultas,
            naturalezas y el meta competitivo más actualizado.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start"
            variants={itemVariants}
          >
            {/* CTA primario — amarillo, magnético */}
            <MagneticLink
              href="#pokédex"
              className="inline-flex items-center justify-center gap-2 bg-accent-yellow text-bg font-display font-bold px-8 py-4 rounded-full text-base hover:bg-white hover:shadow-glow-yellow transition-[background-color,box-shadow,color] duration-base ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explorar la Pokédex
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticLink>

            {/* CTA secundario — outline blanco, magnético */}
            <MagneticLink
              href="#novedades"
              strength={0.2}
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-display font-medium px-8 py-4 rounded-full text-base hover:bg-white/10 hover:border-white/60 transition-[background-color,border-color] duration-base ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver novedades →
            </MagneticLink>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Badge glassmorphism flotante — Zekrom (inferior izquierda) ──
          Extra delay so it lands after the main content stagger completes.
          Hidden under sm to avoid stacking under the CTAs and scroll
          indicator on tight phone screens. */}
      <motion.div
        id="hero-badge"
        className="hidden sm:flex absolute bottom-24 left-4 sm:left-6 lg:left-8 z-40 glass-card px-4 py-3 rounded-xl max-w-[calc(100vw-2rem)] sm:max-w-xs"
        aria-label="Pokémon destacado: Zekrom, tipo Dragón y Eléctrico, número 644"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.2,
          duration: shouldReduceMotion ? duration.fast : 0.5,
          ease: easing,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7038F8 0%, #0a0a0f 100%)',
            }}
            aria-hidden="true"
          >
            <span className="font-display font-black text-white text-lg">Z</span>
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-muted">#0644</p>
            <p className="font-display font-bold text-white text-sm">ZEKROM</p>
            <p className="font-body text-xs text-text-muted">Dragón / Eléctrico</p>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator (chevron pulsante — inferior centro) ──
          Replaces Tailwind `animate-bounce` with a Framer Motion loop so it
          respects reduced-motion. When shouldReduceMotion is true, the element
          is rendered statically (opacity visible, no y movement). */}
      <motion.div
        id="hero-scroll-indicator"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40"
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
        }
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
};

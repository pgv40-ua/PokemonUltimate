'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { easing } from '@/lib/motion/tokens';

const NAV_LINKS = [
  { label: 'Pokédex', href: '/pokedex' },
  { label: 'Novedades', href: '/novedades' },
  { label: 'Destacados', href: '#destacados' },
  { label: 'Evoluciones', href: '/evoluciones' },
  { label: 'Tipos', href: '/tipos' },
  { label: 'Habilidades', href: '/habilidades' },
] as const;

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easing },
  },
};

const linkVariants = {
  closed: { opacity: 0, y: 20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: easing },
  }),
};

const reducedMenuVariants = {
  closed: { opacity: 0, transition: { duration: 0.15 } },
  open: { opacity: 1, transition: { duration: 0.15 } },
};

const reducedLinkVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.15 } },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeMenuVariants = shouldReduceMotion ? reducedMenuVariants : menuVariants;
  const activeLinkVariants = shouldReduceMotion ? reducedLinkVariants : linkVariants;

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 lg:px-8 justify-between"
        style={{
          background: (scrolled || isOpen) ? 'rgba(10,10,15,0.97)' : 'transparent',
          backdropFilter: (scrolled || isOpen) ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: (scrolled || isOpen) ? 'blur(16px)' : 'none',
          borderBottom: (scrolled || isOpen)
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid transparent',
          transition:
            'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          className="font-display font-black text-xl tracking-tight shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] rounded-sm"
        >
          <span style={{ color: '#FFD700' }}>Poké</span>
          <span className="text-white">Dex Ultimate</span>
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-6"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-text-secondary hover:text-white transition-colors duration-base text-sm font-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] rounded-sm"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex items-center gap-4">
          <a
            href="/pokedex"
            className="hidden lg:inline-flex items-center gap-1 border border-[#FFD700]/50 text-[#FFD700] px-4 py-1.5 rounded-full text-sm font-body font-medium hover:bg-[#FFD700]/10 transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
          >
            Explorar Pokédex →
          </a>

          <button
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] rounded-sm"
          >
            <motion.span
              className="block h-[2px] w-6 bg-white origin-center"
              animate={
                isOpen
                  ? { rotate: 45, y: 5, scaleX: 1 }
                  : { rotate: 0, y: 0, scaleX: 1 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.25, ease: easing }
              }
            />
            <motion.span
              className="block h-[2px] w-6 bg-white mt-[5px]"
              animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.2, ease: easing }
              }
            />
            <motion.span
              className="block h-[2px] w-6 bg-white mt-[5px] origin-center"
              animate={
                isOpen
                  ? { rotate: -45, y: -11, scaleX: 1 }
                  : { rotate: 0, y: 0, scaleX: 1 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.25, ease: easing }
              }
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-x-0 top-16 bottom-0 z-40 lg:hidden flex flex-col items-center justify-center gap-2"
            style={{
              background: 'rgba(10,10,15,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            variants={activeMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <nav
              aria-label="Navegación móvil"
              className="flex flex-col items-center gap-6 w-full px-6"
            >
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="font-display font-black text-3xl text-white hover:text-[#FFD700] transition-colors duration-base text-center w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] rounded-sm"
                  variants={activeLinkVariants}
                  custom={i}
                >
                  {label}
                </motion.a>
              ))}

              <motion.a
                href="/pokedex"
                onClick={closeMenu}
                className="mt-4 inline-flex items-center gap-1 border border-[#FFD700]/50 text-[#FFD700] px-6 py-3 rounded-full text-base font-body font-medium hover:bg-[#FFD700]/10 transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
                variants={activeLinkVariants}
                custom={NAV_LINKS.length}
              >
                Explorar Pokédex →
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

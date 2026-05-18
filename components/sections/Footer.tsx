'use client';

import type { FC } from 'react';
import { Reveal } from '@/components/ui/Reveal';

const NAV_COLUMNS = [
  {
    label: 'Explorar',
    links: [
      { text: 'Pokédex', href: '#pokédex' },
      { text: 'Tipos', href: '#tipos' },
      { text: 'Habilidades', href: '#habilidades' },
      { text: 'Naturalezas', href: '#naturalezas' },
    ],
  },
  {
    label: 'Recursos',
    links: [
      { text: 'Novedades', href: '#novedades' },
      { text: 'Guías', href: '#' },
      { text: 'Glosario', href: '#' },
      { text: 'FAQ', href: '#' },
    ],
  },
  {
    label: 'Comunidad',
    links: [
      { text: 'Discord', href: '#' },
      { text: 'Twitter / X', href: '#' },
      { text: 'YouTube', href: '#' },
      { text: 'GitHub', href: '#' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { text: 'Privacidad', href: '#' },
      { text: 'Términos', href: '#' },
      { text: 'Disclaimer', href: '#' },
      { text: 'Contacto', href: '#' },
    ],
  },
] as const;

const LINK_CLASSES =
  'text-text-secondary text-sm hover:text-white transition-colors duration-base ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow ' +
  'rounded-sm';

const COLUMN_HEADING_CLASSES =
  'font-display font-bold text-sm uppercase tracking-widest text-text-muted mb-4';

const IconDiscord: FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.052a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const IconTwitterX: FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconYouTube: FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const IconGitHub: FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'Discord', href: '#', Icon: IconDiscord },
  { label: 'Twitter / X', href: '#', Icon: IconTwitterX },
  { label: 'YouTube', href: '#', Icon: IconYouTube },
  { label: 'GitHub', href: '#', Icon: IconGitHub },
] as const;

const SOCIAL_LINK_CLASSES =
  'text-text-muted hover:text-white transition-colors duration-base ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow ' +
  'rounded-sm';

export const Footer: FC = () => {
  return (
    <footer
      id="footer"
      role="contentinfo"
      className="bg-bg-elevated border-t border-white/10 pt-16 pb-8"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">

        {/* Top area: logo + nav columns */}
        <Reveal margin="-40px" className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:gap-16">

          {/* Logo + tagline */}
          <div className="shrink-0 lg:w-64">
            <p className="font-display font-black text-xl leading-none">
              <span className="text-accent-yellow">Poké</span>
              <span className="text-white">Dex Ultimate</span>
            </p>
            <p className="mt-3 text-text-muted text-sm leading-relaxed max-w-xs">
              La enciclopedia Pokémon más completa del mundo.
            </p>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 flex-1">
            {NAV_COLUMNS.map(({ label, links }) => (
              <nav key={label} aria-label={label}>
                <p className={COLUMN_HEADING_CLASSES}>{label}</p>
                <ul className="flex flex-col gap-3" role="list">
                  {links.map(({ text, href }) => (
                    <li key={text}>
                      <a href={href} className={LINK_CLASSES}>
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </Reveal>

        {/* Bottom area: separator + disclaimer + copyright */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-text-muted text-xs leading-relaxed max-w-2xl">
            PokéDex Ultimate no está afiliado con Nintendo, Game Freak ni The
            Pokémon Company. Todos los derechos de Pokémon pertenecen a sus
            respectivos propietarios.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-text-muted text-xs">
              &copy; 2026 PokéDex Ultimate. Sitio creado por fans, para fans.
            </p>

            {/* Social icons */}
            <ul className="flex items-center gap-4" role="list" aria-label="Redes sociales">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className={SOCIAL_LINK_CLASSES}
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

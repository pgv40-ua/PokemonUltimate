import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        'bg-elevated': '#12121a',
        surface: 'rgba(255, 255, 255, 0.05)',
        'surface-hover': 'rgba(255, 255, 255, 0.08)',
        'border-soft': 'rgba(255, 255, 255, 0.12)',
        'border-strong': 'rgba(255, 255, 255, 0.2)',

        'accent-yellow': '#FFD700',
        'accent-red': '#E3350D',
        'accent-blue': '#00BFFF',
        'accent-purple': '#7B2FBE',
        'accent-electric': '#F4D03F',

        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255, 255, 255, 0.65)',
        'text-muted': 'rgba(255, 255, 255, 0.5)',
        'text-inverse': '#0a0a0f',

        type: {
          normal: '#A8A878',
          fire: '#F08030',
          water: '#6890F0',
          electric: '#F8D030',
          grass: '#78C850',
          ice: '#98D8D8',
          fighting: '#C03028',
          poison: '#A040A0',
          ground: '#E0C068',
          flying: '#A890F0',
          psychic: '#F85888',
          bug: '#A8B820',
          rock: '#B8A038',
          ghost: '#705898',
          dragon: '#7038F8',
          dark: '#705848',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        'base': '400ms',
        'slow': '600ms',
      },
      boxShadow: {
        'glow-yellow': '0 0 32px rgba(255, 215, 0, 0.3)',
        'glow-blue': '0 0 32px rgba(0, 191, 255, 0.25)',
        'glow-red': '0 0 32px rgba(227, 53, 13, 0.25)',
        'glow-purple': '0 0 32px rgba(123, 47, 190, 0.25)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        card: '16px',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

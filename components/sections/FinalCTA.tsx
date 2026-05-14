import type { FC } from 'react';

export const FinalCTA: FC = () => {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden py-32 lg:py-40 bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#E3350D]"
    >
      {/* Decorative PokéBall — purely visual, aria-hidden */}
      <svg
        viewBox="0 0 600 600"
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute -bottom-20 -right-20 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] lg:w-[620px] lg:h-[620px] text-bg opacity-[0.09] z-0"
      >
        {/* Outer ring */}
        <circle
          cx="300"
          cy="300"
          r="280"
          fill="none"
          stroke="currentColor"
          strokeWidth="40"
        />
        {/* Horizontal divider */}
        <line
          x1="20"
          y1="300"
          x2="580"
          y2="300"
          stroke="currentColor"
          strokeWidth="40"
        />
        {/* Inner ring */}
        <circle
          cx="300"
          cy="300"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="40"
        />
        {/* Center dot */}
        <circle cx="300" cy="300" r="40" fill="currentColor" />
      </svg>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-12 flex flex-col items-center text-center">
        <h2
          id="final-cta-heading"
          className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-bg leading-none tracking-tight max-w-4xl"
        >
          ¿Listo para convertirte en el mejor Maestro&nbsp;Pokémon?
        </h2>

        <p className="mt-6 text-lg sm:text-xl font-body text-bg/80 max-w-xl">
          Accede a la Pokédex más completa. Gratis. Para siempre.
        </p>

        <a
          href="#pokedex"
          className="
            mt-10 inline-flex items-center justify-center
            rounded-full font-body font-bold
            px-10 py-4 text-lg
            bg-bg text-accent-yellow
            transition-all duration-base ease-smooth
            hover:bg-accent-yellow hover:text-bg
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bg focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFA500]
            select-none
          "
        >
          Empezar ahora&nbsp;→
        </a>
      </div>
    </section>
  );
};

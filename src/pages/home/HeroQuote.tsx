import React from 'react';

export const HeroQuote: React.FC = () => (
  <div className="py-8 sm:py-16 text-center max-w-4xl mx-auto px-4 relative">
    <div className="w-full h-[1px] bg-gray-200 mb-8 sm:mb-12"></div>
    <div className="absolute top-[0.5rem] sm:top-[1.5rem] left-1/2 -translate-x-1/2 bg-paper px-6 z-10">
      <img src="/LOGO2.png" alt="S.H.I.T" className="h-16 sm:h-20" />
    </div>
    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-tight">
      "Truth Fades, S.H.I.T Lasts."
    </h2>
    <p className="mt-4 chinese-serif text-2xl text-charcoal-light font-medium tracking-wide">
      "真理会过时，构石永恒。"
    </p>
    <div className="w-full h-[1px] bg-gray-200 mt-6 sm:mt-12"></div>
  </div>
);

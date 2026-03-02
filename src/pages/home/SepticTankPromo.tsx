import React from 'react';
import { Link } from 'react-router-dom';

export const SepticTankPromo: React.FC = () => (
  <section className="bg-[#FCFCFC] p-6 sm:p-10 border border-gray-200 mb-16 shadow-sm">
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="max-w-2xl">
        <h6 className="text-xs font-bold text-science-red uppercase tracking-[0.2em] mb-3">Preprint / 旱厕</h6>
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">🚽 旱厕盲评已开启</h3>
        <p className="text-base text-gray-500 font-sans">
          为旱厕中的 S.H.I.T 盲评打分，高评分稿件自动晋升化粪池。<br />
          Blind-rate manuscripts in the Latrine — top-rated papers graduate to the Septic Tank.
        </p>
      </div>
      <Link to="/preprints?zone=latrine" className="flex-shrink-0 w-full md:w-auto px-8 py-4 bg-white border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-md text-center">
        Enter Latrine / 进入旱厕
      </Link>
    </div>
  </section>
);

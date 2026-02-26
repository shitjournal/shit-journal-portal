import React from 'react';
import { Link } from 'react-router-dom';

export const SepticTankPromo: React.FC = () => (
  <section className="bg-[#FCFCFC] p-6 sm:p-10 border border-gray-200 mb-16 shadow-sm">
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="max-w-2xl">
        <h6 className="text-xs font-bold text-science-red uppercase tracking-[0.2em] mb-3">Preprint / 发酵池</h6>
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">发酵池 Preprint 已开启</h3>
        <p className="text-base text-gray-500 font-sans">
          为你最喜爱的 S.H.I.T 评分，高评分稿件将被铲屎官优先评审。<br />
          Rate your favorite S.H.I.T — top-rated manuscripts go straight to the Scoopers.
        </p>
      </div>
      <Link to="/preprints" className="flex-shrink-0 w-full md:w-auto px-8 py-4 bg-white border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-md text-center">
        Browse Preprints / 浏览发酵池
      </Link>
    </div>
  </section>
);

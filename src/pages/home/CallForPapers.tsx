import React from 'react';
import { Link } from 'react-router-dom';

export const CallForPapers: React.FC = () => (
  <section className="bg-[#FCFCFC] p-6 sm:p-10 border border-gray-200 mb-16 shadow-sm">
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="max-w-2xl">
        <h6 className="text-xs font-bold text-science-red uppercase tracking-[0.2em] mb-3">Call for Papers / 征稿启事</h6>
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">S.H.I.T 治理公约 1.0：学术去中心化方案征稿</h3>
        <p className="text-base text-gray-500 font-sans">
          如果把编辑部的权力交还给社区，学术评价会变得更好还是更糟？我们需要你的方案。
        </p>
      </div>
      <Link to="/news/governance-1.0" className="flex-shrink-0 w-full md:w-auto px-8 py-4 bg-white border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-md text-center">
        View Details / 查看详情
      </Link>
    </div>
  </section>
);

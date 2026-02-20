import React from 'react';
import { Link } from 'react-router-dom';

export const CallForPapers: React.FC = () => (
  <section className="bg-[#FCFCFC] p-6 sm:p-10 border border-gray-200 mb-16 shadow-sm">
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="max-w-2xl">
        <h6 className="text-xs font-bold text-science-red uppercase tracking-[0.2em] mb-3">Call for Papers / 征稿启事</h6>
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Topic: "DISCHARGE NOW" / 主题："立即排泄"</h3>
        <p className="text-base text-gray-500 font-sans">
          Collecting the soul-remnants floating between 'Academic Breakthrough' and 'Pure Rubbish'. <br/>
          我们收容那些介于'学术突破'与'纯粹垃圾'之间的灵魂边角料。
        </p>
      </div>
      <Link to="/submit" className="flex-shrink-0 w-full md:w-auto px-8 py-4 bg-white border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-md text-center">
        Submit Manuscript / 提交手稿
      </Link>
    </div>
  </section>
);

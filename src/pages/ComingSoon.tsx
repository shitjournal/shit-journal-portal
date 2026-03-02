import React from 'react';
import { Link } from 'react-router-dom';

export const ComingSoon: React.FC = () => (
  <div className="max-w-2xl mx-auto px-4 py-32 text-center">
    <img src="/LOGO2.png" alt="构石" className="w-24 h-24 inline-block mb-4" />
    <h2 className="text-4xl font-serif font-black text-charcoal mb-3">排泄中ing...</h2>
    <p className="text-xl text-charcoal-light font-serif italic mb-2">This page is currently being excreted.</p>
    <p className="chinese-serif text-lg text-gray-400 mb-12">敬请期待</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/" className="inline-block px-8 py-3 border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all">
        Back to Home / 返回首页
      </Link>
      <Link to="/submit" className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md">
        Submit S.H.I.T / 立即排泄
      </Link>
    </div>
  </div>
);

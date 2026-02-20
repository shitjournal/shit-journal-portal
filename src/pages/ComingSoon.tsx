import React from 'react';
import { Link } from 'react-router-dom';

export const ComingSoon: React.FC = () => (
  <div className="max-w-2xl mx-auto px-4 py-32 text-center">
    <span className="text-8xl block mb-8">💩</span>
    <h2 className="text-4xl font-serif font-black text-charcoal mb-3">排泄中ing...</h2>
    <p className="text-xl text-charcoal-light font-serif italic mb-2">This page is currently being excreted.</p>
    <p className="chinese-serif text-lg text-gray-400 mb-12">敬请期待</p>
    <Link to="/" className="inline-block px-8 py-3 border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all">
      Back to Home / 返回首页
    </Link>
  </div>
);

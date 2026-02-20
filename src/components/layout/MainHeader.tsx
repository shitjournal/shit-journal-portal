import React from 'react';
import { Link } from 'react-router-dom';

export const MainHeader: React.FC<{ onToggleMenu: () => void }> = ({ onToggleMenu }) => (
  <header className="w-full bg-white pt-6 pb-6 border-b-2 border-charcoal">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
      <div className="flex md:hidden items-center">
        <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer" onClick={onToggleMenu}>menu</span>
      </div>
      <div className="hidden md:flex items-center gap-3 w-1/4">
        <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer">menu</span>
        <span className="text-xs font-bold uppercase tracking-widest">Menu / 菜单</span>
      </div>

      <Link to="/" className="flex items-end justify-center">
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-black tracking-tighter text-charcoal leading-[0.8]">SHIT</h1>
        <div className="chinese-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal tracking-[0.2em] ml-3 sm:ml-4 pb-1 leading-none">奥力给</div>
      </Link>

      <div className="flex items-center justify-end gap-5">
        <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer">search</span>
        <a className="px-5 py-2.5 bg-science-red text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-700 transition-colors hidden sm:block whitespace-nowrap" href="#">
          Become a Member / 加入会员
        </a>
      </div>
    </div>
  </header>
);

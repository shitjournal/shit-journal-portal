import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS_FULL } from './navData';
import { useAuth } from '../../hooks/useAuth';

export const StickyHeader: React.FC<{ onToggleMenu: () => void }> = ({ onToggleMenu }) => {
  const { user } = useAuth();
  const links = NAV_LINKS_FULL.filter(l => !l.authRequired || user);

  return (
    <div className="fixed top-0 left-0 w-full bg-black z-50 shadow-lg animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between relative">
        <div className="flex md:hidden items-center">
          <span className="material-symbols-outlined text-white text-xl cursor-pointer" onClick={onToggleMenu}>menu</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(link =>
            link.to ? (
              <Link key={link.label} to={link.to} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href="#" className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
                {link.label}
              </a>
            )
          )}
        </nav>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-end gap-2">
          <Link to="/" className="text-white font-serif font-black text-2xl tracking-tighter hover:text-accent-gold transition-colors">SHIT</Link>
          <span className="chinese-serif text-sm text-gray-400 hidden sm:inline">奥力给</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-white text-xl cursor-pointer hover:text-accent-gold transition-colors">search</span>
          <a className="px-4 py-1.5 bg-science-red text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-700 transition-colors hidden sm:block" href="#">
            Member / 会员
          </a>
        </div>
      </div>
    </div>
  );
};

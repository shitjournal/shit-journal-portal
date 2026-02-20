import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS_FULL } from './navData';

export const MobileMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
    <div className="fixed top-0 left-0 right-0 bg-black z-50 md:hidden shadow-xl pt-14">
      <div className="px-6 py-6 flex flex-col gap-1">
        {NAV_LINKS_FULL.map(link =>
          link.to ? (
            <Link key={link.label} to={link.to} onClick={onClose} className="py-3 border-b border-gray-800 text-white text-sm font-bold uppercase tracking-wider hover:text-accent-gold transition-colors">
              {link.label} <span className="chinese-serif text-gray-400 text-xs font-normal normal-case tracking-normal">/ {link.cn}</span>
            </Link>
          ) : (
            <a key={link.label} href="#" onClick={onClose} className="py-3 border-b border-gray-800 text-white text-sm font-bold uppercase tracking-wider hover:text-accent-gold transition-colors">
              {link.label} <span className="chinese-serif text-gray-400 text-xs font-normal normal-case tracking-normal">/ {link.cn}</span>
            </a>
          )
        )}
      </div>
      <div className="absolute top-4 right-4">
        <span className="material-symbols-outlined text-white text-2xl cursor-pointer hover:text-accent-gold transition-colors" onClick={onClose}>close</span>
      </div>
    </div>
  </>
);

import React, { useState, useEffect } from 'react';
import { TopUtilityBar } from './TopUtilityBar';
import { MainHeader } from './MainHeader';
import { SecondaryNav } from './SecondaryNav';
import { StickyHeader } from './StickyHeader';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <TopUtilityBar />
      <MainHeader onToggleMenu={toggleMenu} />
      <SecondaryNav />
      {scrolled && <StickyHeader onToggleMenu={toggleMenu} />}
      {menuOpen && <MobileMenu onClose={closeMenu} />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

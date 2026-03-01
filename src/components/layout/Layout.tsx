import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TopUtilityBar } from './TopUtilityBar';
import { MainHeader } from './MainHeader';
import { SecondaryNav } from './SecondaryNav';
import { StickyHeader } from './StickyHeader';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setUnreadCount(count || 0);
  }, [user]);

  // Single notification poll with visibility awareness
  useEffect(() => {
    fetchUnreadCount();

    const startPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchUnreadCount, 60000);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchUnreadCount();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchUnreadCount]);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
      <MainHeader onToggleMenu={toggleMenu} unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
      <SecondaryNav />
      {scrolled && <StickyHeader onToggleMenu={toggleMenu} hasUnread={unreadCount > 0} />}
      {menuOpen && <MobileMenu onClose={closeMenu} />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TopUtilityBar } from './TopUtilityBar';
import { MainHeader } from './MainHeader';
import { SecondaryNav } from './SecondaryNav';
import { StickyHeader } from './StickyHeader';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../lib/api';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.notifications.getUnreadCount();
      setUnreadCount(res.count || 0);
    } catch (error) {
      console.error("轮询未读通知失败:", error);
    }
  }, [user]);

  // Single notification poll with visibility awareness
  useEffect(() => {
    fetchUnreadCount();

    const startPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchUnreadCount, 60000); // 60秒轮询一次
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
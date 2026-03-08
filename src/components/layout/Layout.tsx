import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TopUtilityBar } from './TopUtilityBar';
import { MainHeader } from './MainHeader';
import { SecondaryNav } from './SecondaryNav';
import { StickyHeader } from './StickyHeader';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { SearchOverlay } from '../search/SearchOverlay';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../lib/api';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSearchRoute = pathname === '/search';
  const isSearchOverlayVisible = !isSearchRoute && searchOpen;

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
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchRoute && searchOpen) {
      setSearchOpen(false);
    }
  }, [isSearchRoute, searchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setSearchOpen(false);
    setMenuOpen(prev => !prev);
  };
  const closeMenu = () => setMenuOpen(false);
  const toggleSearch = () => {
    setMenuOpen(false);
    if (isSearchRoute) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSearchOpen(prev => {
      const next = !prev;
      if (next && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return next;
    });
  };
  const closeSearch = () => setSearchOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <TopUtilityBar />
      <MainHeader
        onToggleMenu={toggleMenu}
        onToggleSearch={toggleSearch}
        searchOpen={isSearchOverlayVisible}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
      />
      {!isSearchRoute && <SearchOverlay open={isSearchOverlayVisible} onClose={closeSearch} />}
      {!isSearchOverlayVisible && <SecondaryNav />}
      {scrolled && (
        <StickyHeader
          onToggleMenu={toggleMenu}
          onToggleSearch={toggleSearch}
          searchOpen={isSearchOverlayVisible}
          hasUnread={unreadCount > 0}
        />
      )}
      {menuOpen && <MobileMenu onClose={closeMenu} />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

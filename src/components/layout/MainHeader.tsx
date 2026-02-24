import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const MainHeader: React.FC<{ onToggleMenu: () => void }> = ({ onToggleMenu }) => {
  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <header className="w-full bg-white pt-6 pb-6 border-b-2 border-charcoal">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        <div className="flex md:hidden items-center">
          <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer" onClick={onToggleMenu}>menu</span>
        </div>
        <div className="hidden md:flex items-center gap-3 w-1/4 cursor-pointer" onClick={onToggleMenu}>
          <span className="material-symbols-outlined text-charcoal text-2xl">menu</span>
          <span className="text-xs font-bold uppercase tracking-widest">Menu / 菜单</span>
        </div>

        <Link to="/" className="flex items-end justify-center">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-black tracking-tighter text-charcoal leading-[0.8]">SHIT</h1>
          <div className="chinese-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal tracking-[0.2em] ml-3 sm:ml-4 pb-1 leading-none">奥力给</div>
        </Link>

        <div className="flex items-center justify-end gap-4">
          <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer">search</span>
          <a className="px-5 py-2.5 bg-science-red text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-700 transition-colors hidden sm:block whitespace-nowrap" href="#">
            Become a Member / 加入会员
          </a>

          {user ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 cursor-pointer hover:text-accent-gold transition-colors"
              >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="text-[10px] font-bold uppercase tracking-widest max-w-[100px] truncate">
                  {profile?.display_name || user.email}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg z-50 min-w-[180px]">
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-accent-gold transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm align-middle mr-2">dashboard</span>
                    Dashboard / 仪表台
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-science-red transition-colors cursor-pointer border-t border-gray-100"
                  >
                    <span className="material-symbols-outlined text-sm align-middle mr-2">logout</span>
                    Log Out / 登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 border border-charcoal text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all hidden sm:block whitespace-nowrap"
            >
              Log In / 登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

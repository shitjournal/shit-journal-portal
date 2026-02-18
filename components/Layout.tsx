
import React, { useState, useEffect } from 'react';

const TopUtilityBar: React.FC = () => (
  <div className="w-full bg-white border-b border-gray-200 py-1.5 px-4 lg:px-8 flex justify-end items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
    <a className="hover:text-science-red transition-colors" href="#">Log In<span className="hidden sm:inline"> / 登录</span></a>
    <a className="hover:text-science-red transition-colors" href="#">Register<span className="hidden sm:inline"> / 注册</span></a>
    <a className="hover:text-science-red transition-colors" href="#">Subscribe<span className="hidden sm:inline"> / 订阅</span></a>
  </div>
);

const MainHeader: React.FC<{ onToggleMenu: () => void }> = ({ onToggleMenu }) => (
  <header className="w-full bg-white pt-6 pb-6 border-b-2 border-charcoal">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
      <div className="flex md:hidden items-center">
        <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer" onClick={onToggleMenu}>menu</span>
      </div>
      <div className="hidden md:flex items-center gap-3 w-1/4">
        <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer">menu</span>
        <span className="text-xs font-bold uppercase tracking-widest">Menu / 菜单</span>
      </div>

      <div className="flex items-end justify-center">
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-black tracking-tighter text-charcoal leading-[0.8]">SHIT</h1>
        <div className="chinese-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal tracking-[0.2em] ml-3 sm:ml-4 pb-1 leading-none">奥力给</div>
      </div>

      <div className="flex items-center justify-end gap-5">
        <span className="material-symbols-outlined text-charcoal text-2xl cursor-pointer">search</span>
        <a className="px-5 py-2.5 bg-science-red text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-700 transition-colors hidden sm:block whitespace-nowrap" href="#">
          Become a Member / 加入会员
        </a>
      </div>
    </div>
  </header>
);

const NavLink: React.FC<{ label: string; cnLabel: string }> = ({ label, cnLabel }) => (
  <a href="#" className="px-3 border-r border-gray-300 last:border-r-0 text-[11px] font-bold uppercase tracking-wider text-charcoal-light hover:text-science-red transition-colors whitespace-nowrap">
    {label} / {cnLabel}
  </a>
);

const SecondaryNav: React.FC = () => (
  <div className="hidden md:block w-full bg-[#F2F2F2] border-b border-gray-300">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-wrap justify-center gap-y-1">
      <NavLink label="News" cnLabel="新闻" />
      <NavLink label="Archive" cnLabel="往期回顾" />
      <NavLink label="Submit" cnLabel="提交稿件" />
      <NavLink label="Editorial Board" cnLabel="编委会" />
      <NavLink label="About" cnLabel="关于期刊" />
      <NavLink label="Journals" cnLabel="子刊" />
    </div>
  </div>
);

const NAV_LINKS_FULL = [
  { label: 'News', cn: '新闻' },
  { label: 'Archive', cn: '往期回顾' },
  { label: 'Submit', cn: '提交稿件' },
  { label: 'Editorial Board', cn: '编委会' },
  { label: 'About', cn: '关于期刊' },
  { label: 'Journals', cn: '子刊' },
];

const NAV_LINKS = NAV_LINKS_FULL.map(l => l.label);

const MobileMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
    <div className="fixed top-0 left-0 right-0 bg-black z-50 md:hidden shadow-xl pt-14">
      <div className="px-6 py-6 flex flex-col gap-1">
        {NAV_LINKS_FULL.map(link => (
          <a key={link.label} href="#" onClick={onClose} className="py-3 border-b border-gray-800 text-white text-sm font-bold uppercase tracking-wider hover:text-accent-gold transition-colors">
            {link.label} <span className="chinese-serif text-gray-400 text-xs font-normal normal-case tracking-normal">/ {link.cn}</span>
          </a>
        ))}
      </div>
      <div className="absolute top-4 right-4">
        <span className="material-symbols-outlined text-white text-2xl cursor-pointer hover:text-accent-gold transition-colors" onClick={onClose}>close</span>
      </div>
    </div>
  </>
);

const Footer: React.FC = () => (
  <footer className="bg-black text-white pt-16 pb-12 px-6 lg:px-20 mt-16">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-5xl">💩</span>
            <div>
              <h2 className="text-2xl font-bold italic tracking-wider">SHIT PORTAL</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">
                Digital Library of Inner Trash / 内在糟粕数字图书馆
              </p>
            </div>
          </div>
          <p className="font-serif text-gray-400 text-sm leading-relaxed max-w-md">
            The Official Academic Portal for the Studies of High Inner Trash. Dedicated to the rigorous peer review of academic waste since 2026.
            <br/><br/>
            致力于高阶内在糟粕研究的官方学术门户。自2026年起专注于学术废料的严谨同行评审。
          </p>
        </div>

        <div className="lg:col-span-1"></div>

        <div className="lg:col-span-3">
          <h5 className="text-[11px] font-bold uppercase tracking-widest text-white mb-6 border-b border-gray-800 pb-2">Guidelines / 指南</h5>
          <ul className="space-y-4 font-serif text-gray-400 text-sm">
            <li><a className="hover:text-white transition-colors" href="#">Submission Ethics / 投稿伦理</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Scooper Review / 铲屎官评审</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Open Stink / 开放获取</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h5 className="text-[11px] font-bold uppercase tracking-widest text-white mb-6 border-b border-gray-800 pb-2">Contact / 联系</h5>
          <ul className="space-y-4 font-serif text-gray-400 text-sm">
            <li><a className="hover:text-white transition-colors" href="#">Editorial Office / 编辑部</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Media Inquiries / 媒体垂询</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Sponsorship / 赞助合作</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <p>© 2026 SHIT JOURNAL ACADEMIC. ALL RIGHTS WASTED. / 版权所有：浪费一生</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="hover:text-white transition-colors" href="#">Privacy / 隐私</a>
          <a className="hover:text-white transition-colors" href="#">Terms / 条款</a>
          <span>DOI: 10.SHIT/ROOT</span>
        </div>
      </div>
    </div>
  </footer>
);

const StickyHeader: React.FC<{ onToggleMenu: () => void }> = ({ onToggleMenu }) => (
  <div className="fixed top-0 left-0 w-full bg-black z-50 shadow-lg animate-slideDown">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between relative">
      <div className="flex md:hidden items-center">
        <span className="material-symbols-outlined text-white text-xl cursor-pointer" onClick={onToggleMenu}>menu</span>
      </div>
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <a key={link} href="#" className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
            {link}
          </a>
        ))}
      </nav>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-end gap-2">
        <a href="#" className="text-white font-serif font-black text-2xl tracking-tighter hover:text-accent-gold transition-colors">SHIT</a>
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

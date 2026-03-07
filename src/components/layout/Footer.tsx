import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-black text-white pt-16 pb-12 px-6 lg:px-20 mt-12">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 mb-8">
            <img src="/LOGO2.png" alt="构石" className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold italic tracking-wider">S.H.I.T PORTAL</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">
                Sciences, Humanities, Information, Technology / 构石（构建学术的基石）
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
            <li><a className="hover:text-white transition-colors" href="/submission-guidelines">Submission Guidelines / 投稿准则</a></li>
            <li><a className="hover:text-white transition-colors" href="/daily-recruitment-guidelines">Daily Recruitment Guidelines / 每日录用准则</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Open Stink / 开放嗅探</a></li>
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
        <p>Copyright © 2026 S.H.I.T Journal “shitjournal.org” All Rights Reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="hover:text-white transition-colors" href="/privacy">Privacy Policy / 隐私政策</a>
          <a className="hover:text-white transition-colors" href="/terms">Terms of Service / 用户条款</a>
          <span>DOI: 10.S.H.I.T/ROOT</span>
        </div>
      </div>
    </div>
  </footer>
);

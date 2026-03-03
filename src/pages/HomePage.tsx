import React from 'react';
import { Link } from 'react-router-dom';
import { ARTICLES } from '../constants';
import { HeroQuote } from './home/HeroQuote';
import { EditorialSection } from './home/EditorialSection';
import { CallForPapers } from './home/CallForPapers';
import { SepticTankPromo } from './home/SepticTankPromo';
import { ArticleRow } from './home/ArticleRow';
import { HomeSidebar } from './home/HomeSidebar';

export const HomePage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
    {/* News banner */}
    <Link
      to="/news/maintenance"
      className="block bg-charcoal text-white px-4 sm:px-6 py-3 mb-6 -mx-4 lg:-mx-8 hover:bg-black transition-colors group"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest bg-science-red px-2 py-0.5">NEW</span>
          <span className="text-sm font-serif truncate">投稿通道暂时关闭，评论功能维护中</span>
        </div>
        <span className="material-symbols-outlined text-sm shrink-0 text-gray-400 group-hover:text-accent-gold transition-colors">arrow_forward</span>
      </div>
    </Link>

    <HeroQuote />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      <div className="lg:col-span-8">
        <EditorialSection />
        <SepticTankPromo />
        <CallForPapers />

        <section className="mb-2 sm:mb-16">
          <div className="border-b-2 border-charcoal pb-1 mb-6">
            <h3 className="text-xl font-bold uppercase tracking-[0.1em]">Research Articles / 研究论文</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {ARTICLES.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-6 sm:mt-12 text-center border-t border-gray-100 pt-4 sm:pt-8">
            <Link to="/preprints" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold hover:text-charcoal transition-all">
              View All Research / 查看所有研究
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>

      <div className="lg:col-span-4">
        <HomeSidebar />
      </div>
    </div>
  </div>
);

import React from 'react';
import { ARTICLES } from '../constants';
import { HeroQuote } from './home/HeroQuote';
import { EditorialSection } from './home/EditorialSection';
import { CallForPapers } from './home/CallForPapers';
import { ArticleRow } from './home/ArticleRow';
import { HomeSidebar } from './home/HomeSidebar';

export const HomePage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
    <HeroQuote />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      <div className="lg:col-span-8">
        <EditorialSection />
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
            <a href="#" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold hover:text-charcoal transition-all">
              View All Research / 查看所有研究
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </section>
      </div>

      <div className="lg:col-span-4">
        <HomeSidebar />
      </div>
    </div>
  </div>
);

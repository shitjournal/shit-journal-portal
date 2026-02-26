import React from 'react';
import { Link } from 'react-router-dom';
import { NEWS } from '../../constants';

interface NewsArticle {
  slug: string;
  date: string;
  tag: string;
  title: string;
  titleCn: string;
  summary: string;
}

const FEATURED_ARTICLES: NewsArticle[] = [
  {
    slug: 'governance-1.0',
    date: '2026-02-20',
    tag: 'Call for Papers / 征稿启事',
    title: 'S.H.I.T 治理公约 1.0：学术去中心化方案征稿',
    titleCn: 'Governance Covenant 1.0: Call for Academic Decentralization Proposals',
    summary: '如果把编辑部的权力交还给社区，学术评价会变得更好还是更糟？我们需要你的方案。',
  },
];

export const NewsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
    <div className="mb-8">
      <h2 className="text-3xl font-serif font-bold mb-1">News</h2>
      <h3 className="chinese-serif text-xl text-charcoal-light">新闻与公告</h3>
    </div>

    {/* Featured articles */}
    <div className="space-y-6 mb-12">
      {FEATURED_ARTICLES.map(article => (
        <Link
          key={article.slug}
          to={`/news/${article.slug}`}
          className="block bg-white border border-gray-200 p-6 sm:p-8 hover:border-accent-gold transition-colors group"
        >
          <span className="text-[10px] font-bold text-science-red uppercase tracking-widest">{article.tag}</span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold mt-2 mb-1 group-hover:text-accent-gold transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-400 mb-3">{article.date}</p>
          <p className="font-serif text-gray-600 leading-relaxed">{article.summary}</p>
        </Link>
      ))}
    </div>

    {/* Brief news items */}
    <div className="border-t-4 border-charcoal pt-6">
      <h3 className="text-lg font-bold uppercase tracking-[0.1em] mb-6">Briefs / 简讯</h3>
      <div className="space-y-6">
        {NEWS.map((item, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-4">
            <span className="text-[9px] font-bold text-science-red uppercase tracking-widest block mb-1">
              {item.isAnnouncement ? 'Announcement / 公告' : item.date}
            </span>
            <h4 className="text-base font-serif font-bold text-charcoal leading-tight">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 chinese-serif">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

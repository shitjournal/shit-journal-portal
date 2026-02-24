import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';

export const ArticleRow: React.FC<{ article: Article }> = ({ article }) => (
  <Link to="/preprints" className="block group pt-8 pb-8 border-b border-gray-100 last:border-0">
    <div className="flex gap-4 sm:gap-8 items-start">
      <div className="flex-1">
        <span className={`inline-block px-2 py-1 border text-[9px] font-bold uppercase tracking-widest mb-3 ${article.type === 'Original Research' ? 'border-accent-gold text-accent-gold' : 'border-gray-400 text-gray-500'}`}>
          {article.type} / {article.type === 'Original Research' ? '原创研究' : '综述'}
        </span>
        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-1 group-hover:text-accent-gold transition-colors cursor-pointer leading-tight">
          {article.title}
        </h4>
        <h5 className="text-xl chinese-serif text-gray-400 mb-4">{article.chineseTitle}</h5>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{article.description}</p>
        <div className="flex flex-wrap items-center text-[10px] font-bold text-gray-400 gap-3 uppercase tracking-wider">
          <span className="text-charcoal">{article.authors}</span>
          <span>•</span>
          <span>DOI: {article.doi}</span>
        </div>
      </div>
      {article.imageUrl && (
        <div className="w-48 h-32 hidden lg:block overflow-hidden border border-gray-100 mt-9">
          <img src={article.imageUrl} alt="Abstract" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
        </div>
      )}
    </div>
  </Link>
);

import React from 'react';
import { Link } from 'react-router-dom';
import { VISCOSITY_LABELS } from '../../lib/constants';

interface PreprintCardProps {
  id: string;
  manuscript_title: string;
  author_name: string;
  institution: string;
  viscosity: string;
  created_at: string;
  avg_score: number;
  rating_count: number;
  co_authors: unknown[] | null;
  solicited_topic: string | null;
}

export const PreprintCard: React.FC<{ preprint: PreprintCardProps }> = ({ preprint }) => {
  const score = Math.round(preprint.avg_score || 0);
  const coAuthorCount = Array.isArray(preprint.co_authors) ? preprint.co_authors.length : 0;

  return (
    <Link
      to={`/preprints/${preprint.id}`}
      className="block bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-serif font-bold text-lg text-charcoal group-hover:text-accent-gold transition-colors leading-tight">
              {preprint.manuscript_title}
            </h4>
            {preprint.solicited_topic && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                {preprint.solicited_topic}
              </span>
            )}
          </div>
          <p className="text-sm text-charcoal-light mb-1">
            {preprint.author_name} · {preprint.institution}
            {coAuthorCount > 0 && (
              <span className="text-gray-400"> (+{coAuthorCount})</span>
            )}
          </p>
          <div className="flex flex-wrap items-center text-[10px] font-bold text-gray-400 gap-2 uppercase tracking-wider">
            <span>{new Date(preprint.created_at).toLocaleDateString('zh-CN')}</span>
            <span>·</span>
            <span>{VISCOSITY_LABELS[preprint.viscosity] || preprint.viscosity}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl leading-none" title={`${preprint.avg_score.toFixed(1)} / 5`}>
            {'💩'.repeat(score)}{'⚪'.repeat(5 - score)}
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
            {preprint.avg_score > 0 ? preprint.avg_score.toFixed(1) : '—'} / 5
            <span className="ml-2">({preprint.rating_count})</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

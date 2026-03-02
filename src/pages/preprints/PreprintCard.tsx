import React from 'react';
import { Link } from 'react-router-dom';
import { VISCOSITY_LABELS, DISCIPLINE_LABELS, ZONE_THRESHOLDS } from '../../lib/constants';
import type { Zone, Discipline } from '../../lib/constants';

interface PreprintCardProps {
  id: string;
  manuscript_title: string;
  author_name: string;
  institution: string;
  viscosity: string;
  discipline?: string;
  created_at: string;
  avg_score: number;
  weighted_score: number;
  rating_count: number;
  co_authors: unknown[] | null;
  solicited_topic: string | null;
}

export const PreprintCard: React.FC<{ preprint: PreprintCardProps; zone: Zone }> = ({ preprint, zone }) => {
  const score = Math.round(preprint.weighted_score || 0);
  const coAuthorCount = Array.isArray(preprint.co_authors) ? preprint.co_authors.length : 0;
  const disciplineLabel = preprint.discipline
    ? DISCIPLINE_LABELS[preprint.discipline as Discipline]
    : null;

  const isLatrine = zone === 'latrine';
  const isStone = zone === 'stone';

  return (
    <Link
      to={`/preprints/${preprint.id}`}
      className="block bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {isStone && (
              <span className="text-lg" title="构石 / The Stone">🪨</span>
            )}
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
            {disciplineLabel && (
              <>
                <span>·</span>
                <span className="text-accent-gold">{disciplineLabel.cn} / {disciplineLabel.en}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side: score or progress */}
        <div className="text-right shrink-0">
          {isLatrine ? (
            // Latrine: blind mode — show progress bar
            <div className="min-w-[120px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                评价进度 / Progress
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-accent-gold h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (preprint.rating_count / ZONE_THRESHOLDS.LATRINE_TO_SEPTIC_COUNT) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-1">
                {preprint.rating_count} / {ZONE_THRESHOLDS.LATRINE_TO_SEPTIC_COUNT}
              </p>
            </div>
          ) : (
            // Other zones: show score
            <>
              <div className="text-xl leading-none" title={`${(preprint.weighted_score || 0).toFixed(2)} / 5`}>
                {'💩'.repeat(score)}{'⚪'.repeat(5 - score)}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                {preprint.weighted_score > 0 ? preprint.weighted_score.toFixed(2) : '—'} / 5
                <span className="ml-2">({preprint.rating_count})</span>
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

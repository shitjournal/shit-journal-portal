import React, { useState } from 'react';
import { ZONE_THRESHOLDS } from '../../lib/constants';

interface LatrineRatingWidgetProps {
  currentRating: number | null;
  ratingCount: number;
  isOwnSubmission: boolean;
  onRate: (score: number) => void;
}

export const LatrineRatingWidget: React.FC<LatrineRatingWidgetProps> = ({
  currentRating, ratingCount, isOwnSubmission, onRate,
}) => {
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const threshold = ZONE_THRESHOLDS.LATRINE_TO_SEPTIC_COUNT;
  const progress = Math.min(100, (ratingCount / threshold) * 100);

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        Rate / 盲评
      </h3>

      {isOwnSubmission ? (
        <p className="text-sm text-gray-500 italic">
          You cannot rate your own submission. / 不能评价自己的稿件。
        </p>
      ) : (
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map(score => (
            <button
              key={score}
              onClick={() => onRate(score)}
              onMouseEnter={() => setHoverScore(score)}
              onMouseLeave={() => setHoverScore(null)}
              className="text-3xl cursor-pointer transition-transform hover:scale-125 focus:outline-none"
              title={`${score} / 5`}
            >
              {score <= (hoverScore ?? currentRating ?? 0) ? '💩' : '⚪'}
            </button>
          ))}
          {currentRating && (
            <span className="ml-3 text-sm text-gray-500">
              Your rating: {currentRating}/5
            </span>
          )}
        </div>
      )}

      {/* Progress bar instead of avg score */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            评价进度 / Rating Progress
          </span>
          <span className="text-sm font-serif font-bold text-charcoal">
            {ratingCount} / {threshold}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-accent-gold h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          {ratingCount < threshold
            ? `还需 ${threshold - ratingCount} 份评价即可解锁分数 / ${threshold - ratingCount} more ratings to unlock score`
            : '即将毕业进入化粪池 / Graduating to Septic Tank soon'}
        </p>
      </div>
    </div>
  );
};

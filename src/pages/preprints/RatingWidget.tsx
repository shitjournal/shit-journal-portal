import React, { useState } from 'react';

interface RatingWidgetProps {
  currentRating: number | null;
  avgScore: number;
  ratingCount: number;
  isOwnSubmission: boolean;
  onRate: (score: number) => void;
}

export const RatingWidget: React.FC<RatingWidgetProps> = ({
  currentRating, avgScore, ratingCount, isOwnSubmission, onRate,
}) => {
  const [hoverScore, setHoverScore] = useState<number | null>(null);

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        Rate / 评价
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

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div>
          <span className="text-2xl font-serif font-bold text-charcoal">
            {avgScore > 0 ? avgScore.toFixed(1) : '—'}
          </span>
          <span className="text-sm text-gray-400"> / 5</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'} / {ratingCount}个评分
        </span>
      </div>
    </div>
  );
};

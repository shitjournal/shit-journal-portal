import React from 'react';
import { Link } from 'react-router-dom';
// 🔥 这里增加了 TAG_LABELS 的引入
import { DISCIPLINE_LABELS, ZONE_THRESHOLDS, TAG_LABELS } from '../../lib/constants';
import type { Zone, Discipline } from '../../lib/constants';

// 🚀 纯粹的 FastAPI 数据结构映射
interface PreprintCardProps {
  id: string;
  title: string; 
  tag: string;
  discipline: string;
  created_at: string;
  avg_score: number;
  weighted_score: number;
  rating_count: number;
  co_authors: unknown[] | null;
  topic?: string | null; 
  author?: { 
    display_name: string;
    institution?: string; 
  };
}

// 🛡️ 终极过滤器：专杀 Pandas 的 NaN 和 JS 的 "null", "undefined"
const isValidText = (text: any): boolean => {
  if (!text) return false;
  if (typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  return t !== '' && t !== 'nan' && t !== 'null' && t !== 'undefined' && t !== 'none';
};

export const PreprintCard: React.FC<{ preprint: PreprintCardProps; zone: Zone }> = ({ preprint, zone }) => {
  const score = Math.round(preprint.weighted_score || preprint.avg_score || 0);
  const coAuthorCount = Array.isArray(preprint.co_authors) ? preprint.co_authors.length : 0;
  const disciplineLabel = preprint.discipline
    ? DISCIPLINE_LABELS[preprint.discipline as Discipline]
    : null;

  const isLatrine = zone === 'latrine';
  const isStone = zone === 'stone';

  // 🚀 经过无菌处理的干净数据
  const displayTitle = isValidText(preprint.title) ? preprint.title : '无题 / Untitled';
  const displayAuthor = isValidText(preprint.author?.display_name) ? preprint.author!.display_name : '匿名作者 / Anonymous';
  const displayInstitution = isValidText(preprint.author?.institution) ? preprint.author!.institution : null;
  const displayTopic = isValidText(preprint.topic) ? preprint.topic : null;

  // 🔥 核心修改：利用 TAG_LABELS 字典，将后端的 'hardcore'/'meme' 翻译成中文
  const rawTag = isValidText(preprint.tag) ? preprint.tag : null;
  // 如果字典里找不到，就兜底显示原文本，避免白板
  const displayTag = rawTag ? (TAG_LABELS[rawTag] || rawTag) : '未分类 / Uncategorized';

  return (
    <Link
      to={`/preprints/${preprint.id}`}
      className="block bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-start gap-2.5">
            {isStone && (
              <span className="mt-0.5 shrink-0 text-lg" title="构石 / The Stone">🪨</span>
            )}

            <div className="min-w-0 flex-1">
              <h4
                className="font-serif font-bold text-lg text-charcoal group-hover:text-accent-gold transition-colors leading-snug line-clamp-2 [overflow-wrap:anywhere]"
              >
                {displayTitle}
              </h4>

              {/* 🔥 绝对不会再出现黄橙色的 NaN 框框了 */}
              {displayTopic && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap">
                    {displayTopic}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-charcoal-light mb-1">
            {displayAuthor} 
            {/* 🚀 机构如果是 NaN，直接消失，不会显示 " · NaN" */}
            {displayInstitution && ` · ${displayInstitution}`}
            {coAuthorCount > 0 && (
              <span className="text-gray-400"> (+{coAuthorCount})</span>
            )}
          </p>
          
          <div className="flex flex-wrap items-center text-[10px] font-bold text-gray-400 gap-2 uppercase tracking-wider">
            <span>{new Date(preprint.created_at).toLocaleDateString('zh-CN')}</span>
            <span>·</span>
            
            <span className="text-charcoal border border-gray-200 px-1.5 py-0.5 bg-gray-50">
              {displayTag}
            </span>
            
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
            <div className="min-w-[120px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                评价进度 / Progress
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-accent-gold h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((preprint.rating_count || 0) / ZONE_THRESHOLDS.LATRINE_TO_SEPTIC_COUNT) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-1">
                {preprint.rating_count || 0} / {ZONE_THRESHOLDS.LATRINE_TO_SEPTIC_COUNT}
              </p>
            </div>
          ) : (
            <>
              <div className="text-xl leading-none" title={`${(preprint.weighted_score || preprint.avg_score || 0).toFixed(2)} / 5`}>
                {'💩'.repeat(score)}{'⚪'.repeat(5 - score)}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                {(preprint.weighted_score || preprint.avg_score || 0) > 0 ? (preprint.weighted_score || preprint.avg_score || 0).toFixed(2) : '—'} / 5
                <span className="ml-2">({preprint.rating_count || 0})</span>
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

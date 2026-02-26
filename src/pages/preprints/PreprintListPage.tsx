import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PreprintCard } from './PreprintCard';

type SortMode = 'newest' | 'highest_rated' | 'most_rated';

const PAGE_SIZE = 10;
const VALID_SORTS: SortMode[] = ['newest', 'highest_rated', 'most_rated'];

const SORT_OPTIONS: { value: SortMode; en: string; cn: string }[] = [
  { value: 'newest', en: 'Newest', cn: '最新' },
  { value: 'highest_rated', en: 'Highest Rated', cn: '最高评分' },
  { value: 'most_rated', en: 'Most Rated', cn: '最多评分' },
];

const TOPIC_TABS: { value: string; en: string; cn: string }[] = [
  { value: 'all', en: 'All', cn: '全部' },
  { value: 'S.H.I.T社区治理1.0', en: 'Governance 1.0', cn: '社区治理1.0' },
];

export const PreprintListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [preprints, setPreprints] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const rawSort = searchParams.get('sort') as SortMode | null;
  const sort: SortMode = rawSort && VALID_SORTS.includes(rawSort) ? rawSort : 'newest';
  const topic = searchParams.get('topic') || 'all';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    const fetchPreprints = async () => {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('preprints_with_ratings')
        .select('*', { count: 'exact' });

      if (topic !== 'all') {
        query = query.eq('solicited_topic', topic);
      }

      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'highest_rated') {
        query = query.order('weighted_score', { ascending: false }).order('rating_count', { ascending: false });
      } else {
        query = query.order('rating_count', { ascending: false }).order('weighted_score', { ascending: false });
      }

      const { data, count } = await query.range(from, to);

      setPreprints(data || []);
      setTotalCount(count || 0);
      setLoading(false);
    };

    fetchPreprints();
  }, [page, sort, topic]);

  const setPage = (p: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (p <= 1) next.delete('page'); else next.set('page', String(p));
      return next;
    });
  };

  const handleTopicChange = (newTopic: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newTopic === 'all') next.delete('topic'); else next.set('topic', newTopic);
      next.delete('page');
      return next;
    });
  };

  const handleSortChange = (newSort: SortMode) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newSort === 'newest') next.delete('sort'); else next.set('sort', newSort);
      next.delete('page');
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-1">Preprints</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">化粪池</h3>
        <p className="text-sm text-gray-500 mt-2">
          Browse and rate submitted manuscripts. / 浏览并评价已提交的稿件。
        </p>
      </div>

      {/* Topic tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {TOPIC_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => handleTopicChange(t.value)}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
              topic === t.value
                ? 'border-b-2 border-accent-gold text-accent-gold'
                : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            {t.en} / {t.cn}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort / 排序:</span>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSortChange(opt.value)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
              sort === opt.value
                ? 'border-accent-gold text-accent-gold bg-yellow-50'
                : 'border-gray-300 text-gray-400 hover:border-accent-gold hover:text-accent-gold'
            }`}
          >
            {opt.en} / {opt.cn}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <span className="text-4xl animate-pulse">💩</span>
        </div>
      ) : preprints.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200">
          <span className="text-6xl block mb-6">🚽</span>
          <p className="font-serif text-lg text-gray-500 mb-2">The tank is empty.</p>
          <p className="chinese-serif text-gray-400">化粪池是空的</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {preprints.map(p => (
              <PreprintCard key={p.id} preprint={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-300 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500 px-4">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-300 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

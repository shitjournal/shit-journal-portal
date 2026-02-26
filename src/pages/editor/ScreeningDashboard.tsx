import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ProfileSidebar } from '../../components/dashboard/ProfileSidebar';

interface Submission {
  id: string;
  manuscript_title: string;
  author_name: string;
  email: string;
  institution: string;
  viscosity: string;
  status: string;
  created_at: string;
  solicited_topic: string | null;
  weighted_score?: number;
  rating_count?: number;
}

type TabFilter = 'pending' | 'approved' | 'rejected' | 'all';
type SortMode = 'newest' | 'oldest' | 'highest_rated' | 'most_rated';

const TAB_OPTIONS: { value: TabFilter; en: string; cn: string }[] = [
  { value: 'pending', en: 'Pending', cn: '待预审' },
  { value: 'approved', en: 'Approved', cn: '已入池' },
  { value: 'rejected', en: 'Rejected', cn: '已拒绝' },
  { value: 'all', en: 'All', cn: '全部' },
];

const SORT_OPTIONS: { value: SortMode; en: string; cn: string }[] = [
  { value: 'newest', en: 'Newest', cn: '最新' },
  { value: 'oldest', en: 'Oldest', cn: '最早' },
  { value: 'highest_rated', en: 'Highest Rated', cn: '最高评分' },
  { value: 'most_rated', en: 'Most Rated', cn: '最多评分' },
];

const STATUS_LABELS: Record<string, { en: string; cn: string; color: string }> = {
  pending: { en: 'Pending', cn: '待预审', color: 'bg-amber-50 text-amber-700' },
  under_review: { en: 'In Tank', cn: '已入池', color: 'bg-green-50 text-green-700' },
  revisions_requested: { en: 'Revisions', cn: '需修改', color: 'bg-blue-50 text-blue-700' },
  accepted: { en: 'Accepted', cn: '已接受', color: 'bg-green-50 text-green-700' },
  rejected: { en: 'Rejected', cn: '已拒绝', color: 'bg-red-50 text-red-700' },
  flushed: { en: 'Flushed', cn: '已冲掉', color: 'bg-red-50 text-red-500' },
};

const statusFilter = (tab: TabFilter): string[] => {
  switch (tab) {
    case 'pending': return ['pending'];
    case 'approved': return ['under_review', 'accepted'];
    case 'rejected': return ['rejected', 'flushed', 'revisions_requested'];
    default: return [];
  }
};

export const ScreeningDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const tab = (searchParams.get('tab') as TabFilter) || 'pending';
  const sort = (searchParams.get('sort') as SortMode) || 'newest';

  useEffect(() => {
    if (!user) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      let query = supabase
        .from('submissions')
        .select('id, manuscript_title, author_name, email, institution, viscosity, status, created_at, solicited_topic')
        .order('created_at', { ascending: sort === 'oldest' });

      const filter = statusFilter(tab);
      if (filter.length > 0) {
        query = query.in('status', filter);
      }

      const { data: subs } = await query;
      let results: Submission[] = subs || [];

      // Fetch rating data for score-based sorting
      if (results.length > 0) {
        const { data: ratings } = await supabase
          .from('preprints_with_ratings')
          .select('id, weighted_score, rating_count');

        if (ratings) {
          const ratingsMap = new Map(ratings.map(r => [r.id, r]));
          results = results.map(s => {
            const r = ratingsMap.get(s.id);
            return { ...s, weighted_score: r?.weighted_score ?? 0, rating_count: r?.rating_count ?? 0 };
          });
        }
      }

      // Client-side sort for score-based modes
      if (sort === 'highest_rated') {
        results.sort((a, b) => (b.weighted_score ?? 0) - (a.weighted_score ?? 0) || (b.rating_count ?? 0) - (a.rating_count ?? 0));
      } else if (sort === 'most_rated') {
        results.sort((a, b) => (b.rating_count ?? 0) - (a.rating_count ?? 0) || (b.weighted_score ?? 0) - (a.weighted_score ?? 0));
      }

      setSubmissions(results);
      setLoading(false);
    };

    fetchSubmissions();
  }, [user, tab, sort]);

  const setTab = (t: TabFilter) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (t === 'pending') next.delete('tab'); else next.set('tab', t);
      next.delete('page');
      return next;
    });
  };

  const setSort = (s: SortMode) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (s === 'newest') next.delete('sort'); else next.set('sort', s);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside>
          <ProfileSidebar submissionCount={submissions.length} />
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-1">Screening Queue</h2>
            <h3 className="chinese-serif text-xl text-charcoal-light">预审台</h3>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            {TAB_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  tab === t.value
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
                onClick={() => setSort(opt.value)}
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
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200">
              <span className="text-6xl block mb-6">📭</span>
              <p className="font-serif text-lg text-gray-500 mb-2">No submissions in this category.</p>
              <p className="chinese-serif text-gray-400">该分类暂无稿件</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => {
                const status = STATUS_LABELS[sub.status] || STATUS_LABELS.pending;
                return (
                  <Link
                    key={sub.id}
                    to={`/screening/${sub.id}`}
                    className="block bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-lg text-charcoal group-hover:text-accent-gold transition-colors truncate">
                            {sub.manuscript_title}
                          </h4>
                          {sub.solicited_topic && (
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                              {sub.solicited_topic}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {sub.author_name} · {sub.institution} · {new Date(sub.created_at).toLocaleDateString('zh-CN')} · {sub.viscosity}
                        </p>
                        <p className="text-xs text-gray-300 mt-0.5">{sub.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {(sub.rating_count ?? 0) > 0 && (
                          <span className="text-[10px] font-bold text-gray-400">
                            {(sub.weighted_score ?? 0).toFixed(1)}★ · {sub.rating_count}票
                          </span>
                        )}
                        <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${status.color}`}>
                          {status.en} / {status.cn}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

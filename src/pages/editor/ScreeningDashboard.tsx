import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API } from '../../lib/api';
import { EDITOR_STATUS_LABELS, DISCIPLINE_LABELS } from '../../lib/constants';
import type { Discipline } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { ProfileSidebar } from '../../components/dashboard/ProfileSidebar';

// 严格对应后端 status
type TabFilter = 'pending' | 'passed' | 'revisions' | 'flushed';
type SortMode = 'newest' | 'oldest' | 'highest_rated' | 'most_rated';

const PAGE_SIZE = 20;

const TAB_OPTIONS: { value: TabFilter; en: string; cn: string }[] = [
  { value: 'pending', en: 'Pending', cn: '待预审' },
  { value: 'passed', en: 'Approved', cn: '已入池' },
  { value: 'revisions', en: 'Revisions', cn: '退回修改' },
  { value: 'flushed', en: 'Flushed', cn: '已冲掉' },
];

const ALL_SORT_OPTIONS: { value: SortMode; en: string; cn: string }[] = [
  { value: 'newest', en: 'Newest', cn: '最新' },
  { value: 'oldest', en: 'Oldest', cn: '最早' },
  { value: 'highest_rated', en: 'Highest Rated', cn: '最高评分' },
  { value: 'most_rated', en: 'Most Rated', cn: '最多评分' },
];

// 控制不同 Tab 下允许的排序方式
const TAB_SORTS: Record<TabFilter, SortMode[]> = {
  pending: ['newest', 'oldest'],
  passed: ['newest', 'oldest', 'highest_rated', 'most_rated'],
  revisions: ['newest', 'oldest'],
  flushed: ['newest', 'oldest'],
};

// 🛡️ 终极过滤器：专杀 Pandas 的 NaN 和 JS 的 "null", "undefined"
const isValidText = (text: any): boolean => {
  if (!text) return false;
  if (typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  return t !== '' && t !== 'nan' && t !== 'null' && t !== 'undefined' && t !== 'none';
};

export const ScreeningDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [currentTabCount, setCurrentTabCount] = useState(0); 
  const [globalTotalCount, setGlobalTotalCount] = useState(0); // 🔥 全站总排泄数
  const [loading, setLoading] = useState(true);

  const tab = (searchParams.get('tab') as TabFilter) || 'pending';
  const allowedSorts = TAB_SORTS[tab];
  const rawSort = (searchParams.get('sort') as SortMode) || 'newest';
  const sort: SortMode = allowedSorts.includes(rawSort) ? rawSort : 'newest';
  
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const totalPages = Math.ceil(currentTabCount / PAGE_SIZE);
  const sortOptions = ALL_SORT_OPTIONS.filter(o => allowedSorts.includes(o.value));

  // 加载全站总数 (仅加载一次)
  useEffect(() => {
    if (!user) return;
    API.articles.getTotalArticleCount()
      .then(res => setGlobalTotalCount(res.total_count || 0))
      .catch(err => console.error("获取全站总数失败", err));
  }, [user]);

  // 加载列表
  useEffect(() => {
    if (!user) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await API.admin.getAdminArticles(tab, sort, page, PAGE_SIZE);
        setSubmissions(res.data || []);
        setCurrentTabCount(res.count || 0);
      } catch (error) {
        console.error("加载审核列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, tab, sort, page]);

  const setTab = (t: TabFilter) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (t === 'pending') next.delete('tab'); else next.set('tab', t);
      next.delete('page');
      // Reset sort if not available in new tab
      const currentSort = (prev.get('sort') as SortMode) || 'newest';
      if (!TAB_SORTS[t].includes(currentSort)) next.delete('sort');
      return next;
    });
  };

  const setSort = (s: SortMode) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (s === 'newest') next.delete('sort'); else next.set('sort', s);
      next.delete('page');
      return next;
    });
  };

  const setPage = (p: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (p <= 1) next.delete('page'); else next.set('page', String(p));
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside>
          <ProfileSidebar submissionCount={globalTotalCount} />
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-1">Screening Queue</h2>
            <h3 className="chinese-serif text-xl text-charcoal-light">编辑预审台</h3>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
            {TAB_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
                  tab === t.value ? 'border-b-2 border-accent-gold text-accent-gold' : 'text-gray-400 hover:text-charcoal'
                }`}
              >
                {t.en} / {t.cn}
              </button>
            ))}
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort / 排序:</span>
            {sortOptions.map(opt => (
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
              <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200">
              <span className="text-6xl block mb-6">📭</span>
              <p className="font-serif text-lg text-gray-500 mb-2">No submissions in this category.</p>
              <p className="chinese-serif text-gray-400">该分类暂无稿件</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {submissions.map(sub => {
                  const statusInfo = EDITOR_STATUS_LABELS[sub.status] || EDITOR_STATUS_LABELS.pending;
                  
                  // 🚀 极其严格的防污提取
                  const displayTitle = isValidText(sub.title) ? sub.title : (isValidText(sub.manuscript_title) ? sub.manuscript_title : 'Untitled');
                  const displayAuthor = isValidText(sub.author?.display_name) ? sub.author.display_name : (isValidText(sub.author_name) ? sub.author_name : '匿名作者');
                  const displayInstitution = isValidText(sub.author?.institution) ? sub.author.institution : null;
                  const displayTopic = isValidText(sub.topic) ? sub.topic : null;
                  const displayTag = isValidText(sub.tag) ? sub.tag : '未分类';
                  const displayDiscipline = sub.discipline ? (DISCIPLINE_LABELS[sub.discipline as Discipline]?.cn || sub.discipline) : null;
                  // 获取邮箱，优先从作者表拿，拿不到用老字段
                  const displayEmail = isValidText(sub.author?.email) ? sub.author.email : isValidText(sub.email) ? sub.email : null;

                  return (
                    <Link
                      key={sub.id}
                      to={`/screening/${sub.id}`}
                      className="block bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          
                          {/* 🚀 标题不省略：用 items-start 和 flex-wrap 应对长标题，leading-tight 让多行标题紧凑 */}
                          <div className="flex items-start gap-2 flex-wrap mb-1">
                            <h4 className="font-serif font-bold text-lg text-charcoal group-hover:text-accent-gold transition-colors leading-tight">
                              {displayTitle}
                            </h4>
                            {displayTopic && (
                              <span className="mt-1 inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                                {displayTopic}
                              </span>
                            )}
                          </div>
                          
                          {/* 🚀 完美复刻字号和点号分隔设计，加上 Tag 和学科 */}
                          <p className="text-xs text-gray-400 mt-1">
                            {displayAuthor} 
                            {displayInstitution && ` · ${displayInstitution}`}
                            {` · ${new Date(sub.created_at).toLocaleDateString('zh-CN')}`}
                            {` · ${displayTag}`}
                            {displayDiscipline && ` · ${displayDiscipline}`}
                          </p>
                          
                          {/* 独立展示邮箱的次行设计 */}
                          {displayEmail && <p className="text-xs text-gray-300 mt-0.5">{displayEmail}</p>}
                        </div>

                        {/* 🚀 右侧状态和星星 */}
                        <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                          {(sub.rating_count ?? 0) > 0 && (
                            <span className="text-[10px] font-bold text-gray-400">
                              {(sub.avg_score ?? sub.weighted_score ?? 0).toFixed(1)}★ · {sub.rating_count}票
                            </span>
                          )}
                          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${statusInfo.color}`}>
                            {statusInfo.en} / {statusInfo.cn}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
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
      </div>
    </div>
  );
};
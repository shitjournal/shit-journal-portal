import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../lib/api';
import { FAVORITES_ENABLED, STATUS_LABELS, TAG_LABELS } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { ProfileSidebar } from '../../components/dashboard/ProfileSidebar';

interface DashboardArticle {
  id: string;
  title: string;
  status: string;
  tag: string;
  created_at: string;
  topic?: string | null;
  rated_at?: string;
  my_score?: number | null;
  author?: {
    display_name?: string;
    institution?: string | null;
  };
}

type DashboardTab = 'submissions' | 'favorites' | 'rated';

const DASHBOARD_TABS: Array<{ value: DashboardTab; en: string; cn: string }> = [
  { value: 'submissions', en: 'My Excretions', cn: '我的排泄物' },
  { value: 'favorites', en: 'Favorites', cn: '我的收藏' },
  { value: 'rated', en: 'Rated', cn: '我的评价' },
];

const extractArray = (response: any): DashboardArticle[] => {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
  if (response?.articles && Array.isArray(response.articles)) return response.articles;
  return [];
};

const isValidText = (text: any): boolean => {
  if (!text) return false;
  if (typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  return t !== '' && t !== 'nan' && t !== 'null' && t !== 'undefined' && t !== 'none';
};

function formatDashboardDate(dateString?: string | null) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('zh-CN');
}

function getDashboardBadge(tab: DashboardTab, article: DashboardArticle) {
  if (tab === 'submissions') {
    return STATUS_LABELS[article.status] || STATUS_LABELS.pending;
  }

  if (tab === 'favorites') {
    return {
      en: 'Favorited',
      cn: '已收藏',
      color: 'bg-rose-50 text-rose-600',
    };
  }

  return {
    en: article.my_score ? `Rated ${article.my_score}/5` : 'Rated',
    cn: article.my_score ? `已评价 ${article.my_score}/5` : '已评价',
    color: 'bg-emerald-50 text-emerald-700',
  };
}

function getEmptyState(tab: DashboardTab) {
  if (tab === 'favorites') {
    return {
      icon: '💾',
      title: 'No favorites yet.',
      subtitle: '还没有收藏文章',
    };
  }

  if (tab === 'rated') {
    return {
      icon: '💩',
      title: 'No rated articles yet.',
      subtitle: '还没有评价过文章',
    };
  }

  return {
    icon: '🚽',
    title: 'No submissions yet.',
    subtitle: '还没有投过稿',
  };
}

export const AuthorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<DashboardArticle[]>([]);
  const [favorites, setFavorites] = useState<DashboardArticle[]>([]);
  const [ratedArticles, setRatedArticles] = useState<DashboardArticle[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('submissions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [submissionResponse, ratedResponse] = await Promise.all([
          API.users.getMyArticles(),
          API.users.getMyRatedArticles(),
        ]);

        setSubmissions(extractArray(submissionResponse));
        setFavorites([]);
        setRatedArticles(extractArray(ratedResponse));
      } catch (error) {
        console.error('拉取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const currentTabConfig = DASHBOARD_TABS.find(tab => tab.value === activeTab) ?? DASHBOARD_TABS[0];
  const currentItems = useMemo(() => {
    if (activeTab === 'favorites') return favorites;
    if (activeTab === 'rated') return ratedArticles;
    return submissions;
  }, [activeTab, favorites, ratedArticles, submissions]);

  const emptyState = getEmptyState(activeTab);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside>
          <ProfileSidebar submissionCount={submissions.length} />
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-1">{currentTabConfig.en}</h2>
            <h3 className="chinese-serif text-xl text-charcoal-light">{currentTabConfig.cn}</h3>
          </div>

          <div className="mb-8 border border-gray-200 bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap gap-2">
              {DASHBOARD_TABS.map(tab => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    if (tab.value !== 'favorites' || FAVORITES_ENABLED) {
                      setActiveTab(tab.value);
                    }
                  }}
                  disabled={tab.value === 'favorites' && !FAVORITES_ENABLED}
                  className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    tab.value === 'favorites' && !FAVORITES_ENABLED
                      ? 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
                      : 'cursor-pointer'
                  } ${
                    activeTab === tab.value
                      ? 'border border-[#e6d5a0] bg-[#fbf7ea] text-accent-gold'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-charcoal'
                  }`}
                >
                  {tab.en} / {tab.cn}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200">
              <span className="text-6xl block mb-6">{emptyState.icon}</span>
              <p className="font-serif text-lg text-gray-500 mb-2">{emptyState.title}</p>
              <p className="chinese-serif text-gray-400 mb-8">{emptyState.subtitle}</p>
              {activeTab === 'submissions' && (
                <Link to="/submit" className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md">
                  SUBMIT S.H.I.T / 立即排泄
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map(article => {
                const badge = getDashboardBadge(activeTab, article);
                const displayTitle = isValidText(article.title) ? article.title : '无题 / Untitled';
                const displayTopic = isValidText(article.topic) ? article.topic : null;
                const rawTag = isValidText(article.tag) ? article.tag : '';
                const displayTag = rawTag ? (TAG_LABELS[rawTag] || rawTag) : '未分类';
                const destination = activeTab === 'submissions'
                  ? (article.status === 'passed' ? `/preprints/${article.id}` : `/dashboard/${article.id}`)
                  : `/preprints/${article.id}`;
                const footerLinkText = activeTab === 'submissions'
                  ? 'Submission Details / 排泄详情'
                  : 'View Preprint / 查看预印本';

                return (
                  <div
                    key={`${activeTab}-${article.id}`}
                    className="group cursor-pointer border border-gray-200 bg-white p-7 shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-gold/70 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <Link to={destination} className="block cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start sm:items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-serif font-bold text-lg text-charcoal group-hover:text-accent-gold transition-colors leading-tight">
                              {displayTitle}
                            </h4>

                            {displayTopic && (
                              <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0 mt-1 sm:mt-0">
                                {displayTopic}
                              </span>
                            )}
                          </div>

                          {activeTab !== 'submissions' && article.author?.display_name && (
                            <p className="text-sm text-charcoal-light">
                              {article.author.display_name}
                              {article.author.institution ? ` · ${article.author.institution}` : ''}
                            </p>
                          )}

                          <p className="text-xs text-gray-400 mt-2">
                            {activeTab === 'rated' && article.rated_at
                              ? `评价于 ${formatDashboardDate(article.rated_at)} · `
                              : `${formatDashboardDate(article.created_at)} · `}
                            <span className="ml-1 rounded-sm border border-gray-200 bg-gray-50 px-1 text-charcoal">
                              {displayTag}
                            </span>
                          </p>
                        </div>

                        <div className="shrink-0 mt-2 sm:mt-0">
                          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${badge.color}`}>
                            {badge.en} / {badge.cn}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-5">
                      <Link
                        to={destination}
                        className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-accent-gold"
                      >
                        {footerLinkText} →
                      </Link>
                    </div>
                  </div>
                );
              })}

              {activeTab === 'submissions' && (
                <div className="text-center pt-8">
                  <Link to="/submit" className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md">
                    SUBMIT S.H.I.T / 再投一篇
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

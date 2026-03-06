import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../lib/api';
import { STATUS_LABELS } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { ProfileSidebar } from '../../components/dashboard/ProfileSidebar';

// 🚀 完全对齐 FastAPI 返回结构
interface Submission {
  id: string;
  title: string;          
  status: string;
  tag: string;            
  created_at: string;
  topic?: string | null;  // 🔥 已经改为 topic
}

// 🛡️ 终极过滤器：防 NaN 和 "null" 幽灵数据
const isValidText = (text: any): boolean => {
  if (!text) return false;
  if (typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  return t !== '' && t !== 'nan' && t !== 'null' && t !== 'undefined' && t !== 'none';
};

export const AuthorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSubmissions = async () => {
      try {
        const response = await API.users.getMyArticles();
        const data = response.articles || response.data || response || [];
        setSubmissions(data);
      } catch (error) {
        console.error("拉取我的文章失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside>
          <ProfileSidebar submissionCount={submissions.length} />
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-1">My Excretions</h2>
            <h3 className="chinese-serif text-xl text-charcoal-light">我的排泄物</h3>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200">
              <span className="text-6xl block mb-6">🚽</span>
              <p className="font-serif text-lg text-gray-500 mb-2">No submissions yet.</p>
              <p className="chinese-serif text-gray-400 mb-8">还没有投过稿</p>
              <Link to="/submit" className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md">
                SUBMIT S.H.I.T / 立即排泄
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => {
                const status = STATUS_LABELS[sub.status] || STATUS_LABELS.pending;
                const displayTitle = isValidText(sub.title) ? sub.title : '无题 / Untitled';
                const displayTopic = isValidText(sub.topic) ? sub.topic : null;
                const displayTag = isValidText(sub.tag) ? sub.tag : '未分类';

                return (
                  <div key={sub.id} className="bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group">
                    <Link to={['under_review', 'accepted', 'passed'].includes(sub.status) ? `/preprints/${sub.id}` : `/dashboard/${sub.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          
                          {/* 🚀 加入了 flex-wrap，并且去掉了 truncate，超长标题会自动优雅换行 */}
                          <div className="flex items-start sm:items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-serif font-bold text-lg text-charcoal group-hover:text-accent-gold transition-colors leading-tight">
                              {displayTitle}
                            </h4>
                            
                            {/* 🔥 加入小黄标 Topic */}
                            {displayTopic && (
                              <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0 mt-1 sm:mt-0">
                                {displayTopic}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(sub.created_at).toLocaleDateString('zh-CN')} · 
                            <span className="ml-1 text-charcoal border border-gray-200 px-1 bg-gray-50 rounded-sm">
                              {displayTag}
                            </span>
                          </p>
                        </div>
                        
                        <div className="shrink-0 mt-2 sm:mt-0">
                          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${status.color}`}>
                            {status.en} / {status.cn}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="mt-4 pt-3 border-t border-gray-50">
                      <Link to={`/dashboard/${sub.id}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors">
                        Submission Details / 排泄详情 →
                      </Link>
                    </div>
                  </div>
                );
              })}
              <div className="text-center pt-8">
                <Link to="/submit" className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md">
                  SUBMIT S.H.I.T / 再投一篇
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
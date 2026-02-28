import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { STATUS_LABELS } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { ProfileSidebar } from '../../components/dashboard/ProfileSidebar';

interface Submission {
  id: string;
  manuscript_title: string;
  status: string;
  viscosity: string;
  created_at: string;
  solicited_topic: string | null;
}

export const AuthorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const isEditor = profile?.role === 'editor';
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSubmissions = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('id, manuscript_title, status, viscosity, created_at, solicited_topic')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setSubmissions(data || []);
      setLoading(false);
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
              <span className="text-4xl animate-pulse">💩</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200">
              <span className="text-6xl block mb-6">🚽</span>
              <p className="font-serif text-lg text-gray-500 mb-2">No submissions yet.</p>
              <p className="chinese-serif text-gray-400 mb-8">还没有投过稿</p>
              <Link
                to="/submit"
                className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md"
              >
                SUBMIT S.H.I.T / 立即投稿
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => {
                const status = STATUS_LABELS[sub.status] || STATUS_LABELS.pending;
                return (
                  <div key={sub.id} className="bg-white border border-gray-200 p-6 hover:border-accent-gold transition-colors group">
                    <Link to={['under_review', 'accepted'].includes(sub.status) ? `/preprints/${sub.id}` : `/dashboard/${sub.id}`} className="block">
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
                            {new Date(sub.created_at).toLocaleDateString('zh-CN')} · {sub.viscosity}
                          </p>
                        </div>
                        <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${status.color}`}>
                          {status.en} / {status.cn}
                        </span>
                      </div>
                    </Link>
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <Link to={`/dashboard/${sub.id}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors">
                        Submission Details / 投稿详情 →
                      </Link>
                    </div>
                  </div>
                );
              })}

              <div className="text-center pt-8">
                <Link
                  to="/submit"
                  className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md"
                >
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

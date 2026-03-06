import React, { useEffect, useState } from 'react';
import { API } from '../../lib/api';

const PAGE_SIZE = 20;

interface FeedbackItem {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    display_name: string;
    email: string;
  } | null;
}

export const FeedbackViewer: React.FC = () => {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const res = await API.admin.getAllFeedback(page, PAGE_SIZE);
        setItems(res.data || []);
        setTotalCount(res.total || 0);
      } catch (error) {
        console.error("加载反馈失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-1">Feedback</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">留言反馈</h3>
        <p className="text-sm text-gray-400 mt-2">{totalCount} 条留言</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200">
          <span className="text-6xl block mb-6">📭</span>
          <p className="font-serif text-lg text-gray-500">暂无反馈 / No feedback yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal">
                      {item.user?.display_name || '匿名'}
                    </span>
                    {item.user && (
                      <span className="text-[10px] font-bold text-accent-gold bg-yellow-50 px-1.5 py-0.5 rounded">
                        注册用户
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.created_at).toLocaleString('zh-CN')}
                  </span>
                </div>
                {item.user?.email && (
                  <p className="text-xs text-gray-400 mb-2">{item.user.email}</p>
                )}
                <p className="text-sm text-charcoal whitespace-pre-wrap">{item.content}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-300 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500 px-4">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
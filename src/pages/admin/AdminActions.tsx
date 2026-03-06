import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../lib/api';

type Tab = 'hidden' | 'deleted';

export const AdminActions: React.FC = () => {
  const [tab, setTab] = useState<Tab>('hidden');
  const [items, setItems] = useState<any[]>([]); // 统一存放列表
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'hidden') {
        // 获取隐藏的文章
        const res = await API.admin.getHiddenArticles();
        setItems(res.data || []);
      } else {
        // 获取管理员删除(hidden)或用户自删(deleted)的评论
        // 这里默认看管理员删除的
        const res = await API.admin.getComments('hidden');
        setItems(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRestoreArticle = async (id: string) => {
    setActing(id);
    try {
      await API.admin.unhideArticle(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) { alert(e.message); }
    setActing(null);
  };

  const handleRestoreComment = async (id: string) => {
    setActing(id);
    try {
      await API.admin.restoreComment(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) { alert(e.message); }
    setActing(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-1">Admin Actions</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">违规拦截箱</h3>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button onClick={() => setTab('hidden')} className={`px-4 py-2.5 text-[11px] font-bold uppercase transition-colors ${tab === 'hidden' ? 'border-b-2 border-accent-gold text-accent-gold' : 'text-gray-400'}`}>
          隐藏的文章
        </button>
        <button onClick={() => setTab('deleted')} className={`px-4 py-2.5 text-[11px] font-bold uppercase transition-colors ${tab === 'deleted' ? 'border-b-2 border-accent-gold text-accent-gold' : 'text-gray-400'}`}>
          删除的评论
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20"><img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border"><p className="text-gray-500">此分类下暂无内容</p></div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border p-5 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                {tab === 'hidden' ? (
                  <>
                    <Link to={`/preprints/${item.id}`} className="font-serif font-bold text-charcoal hover:text-accent-gold line-clamp-1">{item.title || item.manuscript_title}</Link>
                    <p className="text-xs text-gray-400 mt-1">作者: {item.author?.display_name || item.author_name}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-charcoal mb-2 line-clamp-2">{item.content}</p>
                    <div className="flex gap-2 text-[10px] text-gray-400">
                      <span>评论者: {item.user_name}</span>
                      <span>·</span>
                      <span className="text-accent-gold">来自文章: {item.article_title}</span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => tab === 'hidden' ? handleRestoreArticle(item.id) : handleRestoreComment(item.id)}
                disabled={acting === item.id}
                className="px-4 py-1.5 text-[10px] font-bold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {acting === item.id ? '...' : '恢复'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
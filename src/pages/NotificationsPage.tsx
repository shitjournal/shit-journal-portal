import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

// 🔥 对齐 FastAPI 吐出的嵌套字典结构
interface Notification {
  id: string;
  type: 'reply' | 'like' | 'new_comment' | string;
  is_read: boolean;
  created_at: string;
  actor: { id: string; display_name: string; avatar_url: string | null } | null;
  article: { id: string; title: string } | null;
  comment: { id: string; content: string } | null;
}

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(5);

  useEffect(() => {
    if (!user) return;

    const fetchNotifs = async () => {
      try {
        // 🔥 一键呼叫后端，拿 50 条
        const res = await API.notifications.getList(1, 50);
        setNotifications(res.data || []);
        
        // 🔥 如果有未读消息，静默调用一键已读接口
        if (res.unread_count && res.unread_count > 0) {
          await API.notifications.readAll();
        }
      } catch (error) {
        console.error("加载通知失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">请先登录</h2>
        <Link to="/login" className="text-accent-gold font-bold hover:underline">
          Sign In / 登录
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-32">
        <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
      </div>
    );
  }

  const getDescription = (n: Notification) => {
    switch (n.type) {
      case 'reply': return '回复了你的评论';
      case 'like': return '给你的评论点了屎';
      case 'new_comment': return '评论了你的稿件';
      default: return '与你进行了互动';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reply': return 'chat';
      case 'like': return '💩';
      case 'new_comment': return 'comment';
      default: return 'notifications';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 30) return `${diffDay}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-2xl font-serif font-bold mb-8">消息通知</h2>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200">
          <span className="text-4xl block mb-4">📭</span>
          <p className="text-sm text-gray-400">暂无通知</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {notifications.slice(0, showCount).map(n => (
            <div
              key={n.id}
              // 🔥 跳转时使用嵌套在 article 对象里的 id
              onClick={() => n.article?.id && navigate(`/preprints/${n.article.id}`)}
              className={`px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-amber-50/30' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5 shrink-0">
                  {n.type === 'like' ? '💩' : (
                    <span className="material-symbols-outlined text-lg text-gray-400">
                      {getIcon(n.type)}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-charcoal">
                    {/* 🔥 提取 actor 名字 */}
                    <span className="font-bold">{n.actor?.display_name || '匿名用户'}</span>
                    {' '}{getDescription(n)}
                  </p>
                  
                  {/* 🔥 提取 comment 内容 */}
                  {n.comment?.content && (
                    <p className="text-xs text-gray-400 mt-1 truncate">"{n.comment.content}"</p>
                  )}
                  
                  {/* 🔥 提取 article 标题 */}
                  {n.article?.title && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      《{n.article.title}》
                    </p>
                  )}
                  
                  <p className="text-[10px] text-gray-300 mt-1.5">{formatTime(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <span className="w-2 h-2 bg-science-red rounded-full mt-2 shrink-0" />
                )}
              </div>
            </div>
          ))}
          {notifications.length > showCount && (
            <button
              onClick={() => setShowCount(prev => prev + 5)}
              className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors cursor-pointer"
            >
              查看更多 ({notifications.length - showCount} 条) ▼
            </button>
          )}
        </div>
      )}
    </div>
  );
};
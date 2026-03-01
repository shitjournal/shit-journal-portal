import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Notification {
  id: string;
  type: 'reply' | 'like' | 'new_comment';
  actor_name: string;
  manuscript_title: string | null;
  comment_content: string | null;
  submission_id: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(5);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('notifications_with_details')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setNotifications((data as Notification[]) || []);
      setLoading(false);

      // Mark all as read
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    };

    fetch();
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
        <span className="text-4xl animate-pulse">💩</span>
      </div>
    );
  }

  const getDescription = (n: Notification) => {
    switch (n.type) {
      case 'reply':
        return '回复了你的评论';
      case 'like':
        return '给你的评论点了屎';
      case 'new_comment':
        return '评论了你的稿件';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reply': return 'chat';
      case 'like': return '💩';
      case 'new_comment': return 'comment';
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
              onClick={() => navigate(`/preprints/${n.submission_id}`)}
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
                    <span className="font-bold">{n.actor_name}</span>
                    {' '}{getDescription(n)}
                  </p>
                  {n.comment_content && (
                    <p className="text-xs text-gray-400 mt-1 truncate">"{n.comment_content}"</p>
                  )}
                  {n.manuscript_title && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      《{n.manuscript_title}》
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

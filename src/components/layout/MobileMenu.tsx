import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_LINKS_FULL } from './navData';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../lib/api';
import { REGISTRATION_CLOSED } from '../../lib/maintenanceConfig';
import { isEditor as checkIsEditor, isAdmin as checkIsAdmin, isSuperAdmin as checkIsSuperAdmin } from '../../lib/roles';

export const MobileMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    // 🔥 替换为咱们的统一 API 接口
    const fetchUnreadCount = async () => {
      try {
        const res = await API.notifications.getList(1, 50);
        // 如果后端直接返回了 unread_count 就用后端的，否则前端过滤一下当页的未读数
        const count = res.unread_count ?? (res.data?.filter((n: any) => !n.is_read)?.length || 0);
        setUnreadCount(count);
      } catch (error) {
        console.error("加载通知失败:", error);
      }
    };

    fetchUnreadCount();
  }, [user]);
  
  const navigate = useNavigate();
  const editorAccess = checkIsEditor(profile?.role);
  const adminAccess = checkIsAdmin(profile?.role);
  const superAdminAccess = checkIsSuperAdmin(profile?.role);
  
  const links = NAV_LINKS_FULL.filter(l => 
    (!l.authRequired || user) && 
    (!l.editorOnly || editorAccess) && 
    (!l.adminOnly || adminAccess) && 
    (!l.superAdminOnly || superAdminAccess) && 
    !l.userMenuOnly
  );

  const handleSignOut = async () => {
    onClose();
    await signOut();
    navigate('/');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[380px] bg-black z-50 shadow-xl overflow-y-auto">
        <div className="px-6 py-8 flex flex-col gap-1">
          {/* User section at top */}
          {user ? (
            <div className="pb-4 mb-2 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-white text-2xl">person</span>
                <span className="text-white text-sm font-bold uppercase tracking-wider">
                  {profile?.display_name || user.email}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/notifications"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:border-accent-gold transition-all"
                >
                  消息 / Notifications
                  {unreadCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-science-red text-white text-[8px] font-bold rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:border-accent-gold transition-all"
                >
                  Dashboard / 仪表台
                </Link>
                {editorAccess && (
                  <>
                    <Link
                      to="/screening"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:border-accent-gold transition-all"
                    >
                      Screening / 预审稿
                    </Link>
                    <Link
                      to="/admin/feedback"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:border-accent-gold transition-all"
                    >
                      Feedback / 反馈箱
                    </Link>
                  </>
                )}
                {adminAccess && (
                  <Link
                    to="/admin/actions"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:border-accent-gold transition-all"
                  >
                    Admin Actions / 管理操作
                  </Link>
                )}
                {superAdminAccess && (
                  <Link
                    to="/admin/users"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:border-accent-gold transition-all"
                  >
                    Users / 用户管理
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-science-red hover:border-science-red transition-all cursor-pointer"
                >
                  Log Out / 登出
                </button>
              </div>
            </div>
          ) : (
            <div className="pb-4 mb-2 border-b border-gray-700 flex gap-3">
              <Link
                to="/login"
                onClick={onClose}
                className="px-5 py-2.5 bg-accent-gold text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-colors"
              >
                Log In / 登录
              </Link>
              {!REGISTRATION_CLOSED && (
                <Link
                  to="/register"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Register / 注册
                </Link>
              )}
            </div>
          )}

          {/* Nav links */}
          {links.map(link =>
            link.to ? (
              <Link key={link.label} to={link.to} onClick={onClose} className="py-3 border-b border-gray-800 text-white text-sm font-bold uppercase tracking-wider hover:text-accent-gold transition-colors">
                {link.label} <span className="chinese-serif text-gray-400 text-xs font-normal normal-case tracking-normal">/ {link.cn}</span>
              </Link>
            ) : (
              <a key={link.label} href="#" onClick={onClose} className="py-3 border-b border-gray-800 text-white text-sm font-bold uppercase tracking-wider hover:text-accent-gold transition-colors">
                {link.label} <span className="chinese-serif text-gray-400 text-xs font-normal normal-case tracking-normal">/ {link.cn}</span>
              </a>
            )
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="material-symbols-outlined text-white text-2xl cursor-pointer hover:text-accent-gold transition-colors" onClick={onClose}>close</span>
        </div>
      </div>
    </>
  );
};
import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../lib/api';

export const TopUtilityBar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  useEffect(() => {
    // 如果用户已经登录，就没必要查注册开关了
    if (user) return;

    const checkMaintenance = async () => {
      try {
        const res = await API.maintainance.getList();
        if (res) {
          // 注意：后端返回 registration: true 表示“维护中/关闭”，
          // 所以前端 enabled 应该取反
          setRegistrationEnabled(!res.registration);
        }
      } catch (error) {
        console.error("TopBar获取维护状态失败", error);
        // 失败则保持默认开启
      }
    };
    checkMaintenance();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 py-1.5 px-4 lg:px-8 flex justify-end items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {user ? (
        <>
          <Link to="/dashboard" className="hover:text-accent-gold transition-colors">
            {profile?.display_name || user.email}
          </Link>
          <button
            onClick={handleSignOut}
            className="hover:text-science-red transition-colors cursor-pointer"
          >
            Log Out<span className="hidden sm:inline"> / 登出</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-science-red transition-colors">
            Log In<span className="hidden sm:inline"> / 登录</span>
          </Link>
          {!registrationEnabled && (
            <Link to="/register" className="hover:text-science-red transition-colors">
              Register<span className="hidden sm:inline"> / 注册</span>
            </Link>
          )}
        </>
      )}
      <a className="hover:text-science-red transition-colors" href="#">
        Subscribe<span className="hidden sm:inline"> / 订阅</span>
      </a>
    </div>
  );
};

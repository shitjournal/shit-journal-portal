import React, { createContext, useEffect, useState } from 'react';
import { API } from '../lib/api';

// 1. 我们自己定义 User 接口，摆脱 @supabase/supabase-js 的依赖
export interface User {
  id: string;
  email: string;
}

// 2. 完美继承你之前的 Profile 接口
export interface Profile {
  id: string;
  display_name: string;
  institution?: string | null;
  social_media?: string | null;
  avatar_url?: string | null; // 后端有的字段顺便补上
  role: 'author' | 'reviewer' | 'community_guard' | 'editor' | 'admin' | 'super_admin';
  created_at?: string;
  author_badge?: 'stone' | 'septic' | null;
  is_sniffer_today?: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  // 💡 注意：我在这里加了 verificationCode 参数，配合咱们后端的验证码闭环！
  signUp: (email: string, password: string, displayName: string, verificationCode?: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsConfirmation: false }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // 核心魔术：应用初始化时，检查本地令牌并拉取最新用户信息
  // 彻底平替 Supabase 臃肿的 onAuthStateChange
  // ---------------------------------------------------------
  const initAuth = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        // 拿着 Token 去 FastAPI 换取最新用户信息
        const userData = await API.users.getMe();
        setUser({ id: userData.id, email: userData.email });
        setProfile(userData); // FastAPI 返回的用户对象包含了所有 Profile 信息
      } catch (error) {
        console.error("Token 已过期或获取用户信息失败", error);
        // api.ts 里的拦截器已经自动清除了 token，这里只需要清空 state
        setUser(null);
        setProfile(null);
      }
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  };

  // 页面首次加载时执行一次
  useEffect(() => {
    initAuth();
  }, []);

  const refreshProfile = async () => {
    if (user) await initAuth();
  };

  // ---------------------------------------------------------
  // 极简登录逻辑
  // ---------------------------------------------------------
  const signIn = async (email: string, password: string) => {
    try {
      const res = await API.auth.login(email, password);
      // api.ts 已经帮你把 token 存进 localStorage 了
      setUser({ id: res.user.id, email: res.user.email });
      setProfile(res.user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || '登录失败' };
    }
  };

  // ---------------------------------------------------------
  // 极简注册逻辑 (接入了咱们的 FastAPI)
  // ---------------------------------------------------------
  const signUp = async (email: string, password: string, displayName: string, verificationCode: string = "000000") => {
    try {
      await API.auth.register(email, password, displayName, verificationCode);
      // 注册成功，返回 error: null
      return { error: null, needsConfirmation: false }; 
    } catch (error: any) {
      return { error: error.message || '注册失败', needsConfirmation: false };
    }
  };

  // ---------------------------------------------------------
  // 秒级登出
  // ---------------------------------------------------------
  const signOut = async () => {
    API.auth.logout(); // 清理 localStorage
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
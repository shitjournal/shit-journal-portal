// src/lib/api.ts

// ⚠️ 今晚本地联调时用 localhost，等部署到服务器后，改成服务器 IP 或域名
const BASE_URL = 'http://localhost:8000'; 

/**
 * 核心拦截器：所有请求都要经过这个管道
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = { ...options.headers as Record<string, string> };

  // 如果请求体是 JSON 字符串，且没有手动设置 Content-Type，则自动加上
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // 挂载 Token 令牌
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 全局拦截报错
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // 401 Unauthorized：令牌过期或未登录
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
    
    // 提取后端极其严谨的 FastAPI 报错信息
    const errorMsg = errorData.detail 
      ? (typeof errorData.detail === 'string' ? errorData.detail : errorData.detail[0]?.msg)
      : '服务器开小差了，请稍后再试';
      
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * ==========================================
 * 🚀 S.H.I.T. Journal V2.1 终极接口调用库
 * 严格按照最新 openapi.json 封装
 * ==========================================
 */
export const API = {
  // -------------------------
  // 1. Auth (认证中心)
  // -------------------------
  auth: {
    // 发送验证码 (type: 'register' | 'reset')
    sendCode: async (email: string, type: 'register' | 'reset' = 'register') => {
      return fetchAPI('/api/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email, type }),
      });
    },
    // 登录
    login: async (email, password) => {
      const res = await fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      return res;
    },
    // 注册
    register: async (email, password, displayName, verificationCode) => {
      return fetchAPI('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          display_name: displayName, 
          verification_code: verificationCode 
        }),
      });
    },
    // 忘记密码 / 重置密码
    resetPassword: async (email, newPassword, verificationCode) => {
      return fetchAPI('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          new_password: newPassword, 
          verification_code: verificationCode 
        }),
      });
    },
    // 登出
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  // -------------------------
  // 2. Articles (文章核心)
  // -------------------------
  articles: {
    getList: async (zone = 'latrine', sort = 'newest', discipline = 'all', page = 1, limit = 10) => {
      const params = new URLSearchParams({
        zone, sort, discipline, page: page.toString(), limit: limit.toString()
      });
      return fetchAPI(`/api/articles/?${params.toString()}`);
    },
    getDetail: async (articleId) => {
      return fetchAPI(`/api/articles/${articleId}`);
    },
    upload: async (title, tag, discipline, file) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('tag', tag);
      formData.append('discipline', discipline);
      formData.append('file', file);
      
      return fetchAPI('/api/articles/upload', {
        method: 'POST',
        body: formData,
      });
    }
  },

  // -------------------------
  // 3. Interactions (打分与评论)
  // -------------------------
  interactions: {
    rate: async (articleId, score) => {
      return fetchAPI('/api/interactions/rate', {
        method: 'POST',
        body: JSON.stringify({ article_id: articleId, score }),
      });
    },
    comment: async (articleId, content, parentId = null) => {
      return fetchAPI('/api/interactions/comment', {
        method: 'POST',
        body: JSON.stringify({ article_id: articleId, content, parent_id: parentId }),
      });
    },
    toggleLike: async (commentId) => {
      return fetchAPI(`/api/interactions/comment/${commentId}/like`, { method: 'POST' });
    }
  },

  // -------------------------
  // 4. Users (用户)
  // -------------------------
  users: {
    getMe: async () => fetchAPI('/api/users/me'),
    getMyArticles: async () => fetchAPI('/api/users/me/articles'),
    updateProfile: async (displayName, avatarUrl) => {
      return fetchAPI('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ display_name: displayName, avatar_url: avatarUrl }),
      });
    }
  }
};
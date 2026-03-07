// src/lib/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'https://api.shitjournal.org';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    upload: async (title: string, tag: string, discipline: string, topic: string | null | undefined, coAuthors: any[], file: File) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('tag', tag);
      formData.append('discipline', discipline);
      
      // 🔥 核心防呆：如果没填，传空字符串，坚决不传 "null"
      formData.append('topic', topic || '');
      
      formData.append('co_authors', JSON.stringify(coAuthors)); 
      formData.append('file', file);
      
      return fetchAPI('/api/articles/upload', {
        method: 'POST',
        body: formData,
      });
    },
    // 修改文章基本信息 (仅限特定状态)
    updateInfo: async (articleId: string, updates: { title?: string; tag?: string; discipline?: string; co_authors?: any[] }) => {
      return fetchAPI(`/api/articles/${articleId}/info`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    // 重新上传 PDF/Word (退回修改时用)
    reuploadFile: async (articleId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchAPI(`/api/articles/${articleId}/file`, {
        method: 'PUT',
        body: formData,
      });
    },

    // 用户自己撤稿/软删除
    deleteMyArticle: async (articleId: string) => {
      return fetchAPI(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
    },

    getTotalArticleCount: async () => {
      return fetchAPI(`/api/articles/count`);
    },

    report: async (id: string, reason: string = '') => 
      fetchAPI(`/api/articles/${id}/report`, { 
        method: 'POST'
      }),
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
    },
    deleteComment: async (commentId) => {
      return fetchAPI(`/api/interactions/comments/${commentId}`, { method: 'DELETE' });
    },
    reportComment: async (commentId: string, reason: string = '') => 
      fetchAPI(`/api/interactions/comments/${commentId}/report`, { 
        method: 'POST'
      }),
  },

  // -------------------------
  // 4. Users (用户)
  // -------------------------
  users: {
    getMe: async () => {
      const res = await fetchAPI('/api/users/me');
      return res.user || res; 
    },
    getMyArticles: async () => {
      const res = await fetchAPI('/api/users/me/articles');
      return res.data || res.items || res.articles || res;
    },
    updateProfile: async (displayName?: string, avatarUrl?: string, institution?: string, socialMedia?: string) => {
      const res = await fetchAPI('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ 
          display_name: displayName, 
          avatar_url: avatarUrl,
          institution: institution,
          social_media: socialMedia
        }),
      });
      return res.user || res;
    }
  },

  // -------------------------
  // 5. Notifications (通知)
  // -------------------------
  notifications: {
    // 获取通知列表 (返回包含 unread_count, data, total)
    getList: async (page = 1, limit = 50) => {
      return fetchAPI(`/api/notifications/?page=${page}&limit=${limit}`);
    },
    // 一键已读
    readAll: async () => {
      return fetchAPI('/api/notifications/read-all', { method: 'PUT' });
    },
    // 单条已读 (预留着，虽然现在的交互是一进页面全读)
    readSingle: async (notifId: string) => {
      return fetchAPI(`/api/notifications/${notifId}/read`, { method: 'PUT' });
    },
    getUnreadCount: async () => fetchAPI('/api/notifications/unread-count'),
  },

  maintainance: {
    getList: async () => {
      return fetchAPI(`/api/maintainance/`);
    }
  },

  feedback: {
    checkMine: async () => fetchAPI('/api/feedback/me'),
    submit: async (content: string) => fetchAPI('/api/feedback/submit', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },

  admin: {
    // 管理员删评论 (banned_at)
    deleteComment: async (commentId) => {
      return fetchAPI(`/api/admin/comments/${commentId}`, { method: 'DELETE' });
    },
    // 管理员软删除/隐藏文章
    deleteArticle: async (articleId) => {
      return fetchAPI(`/api/admin/articles/${articleId}`, { method: 'DELETE' });
    },
    reviewArticle: async (
      articleId: string, 
      data: { status?: string; discipline?: string; suggestions?: string; topic?: string; tag?: string; }
    ) => {
      return fetchAPI(`/api/admin/articles/${articleId}/review`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    getAdminArticles: async (status = 'pending', sort = 'newest', page = 1, limit = 20) => {
      const params = new URLSearchParams({ status, sort, page: page.toString(), limit: limit.toString() });
      return fetchAPI(`/api/admin/articles/status?${params.toString()}`);
    },
    getAdminArticleDetail: async (articleId: string) => {
      return fetchAPI(`/api/admin/articles/${articleId}`);
    },
    updateUserRole: async (userId: string, newRole: string) => {
      return fetchAPI(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ new_role: newRole }),
      });
    },
    getAllFeedback: async (page = 1, limit = 20) => {
      return fetchAPI(`/api/admin/?page=${page}&limit=${limit}`);
    },
    getComments: async (status = 'hidden', page = 1, limit = 20) => {
      return fetchAPI(`/api/admin/comments?status=${status}&page=${page}&limit=${limit}`);
    },
    
    // 获取隐藏的文章列表
    getHiddenArticles: async (page = 1, limit = 20) => {
      return fetchAPI(`/api/admin/articles/status?status=hidden&page=${page}&limit=${limit}`);
    },

    // 恢复评论 (把状态改回 active)
    restoreComment: async (commentId: string) => {
      return fetchAPI(`/api/admin/comments/${commentId}/restore`, { method: 'PUT' });
    },

    // 取消隐藏文章 (把状态改回 passed 或 pending，看你业务需求)
    unhideArticle: async (articleId: string) => {
      return fetchAPI(`/api/admin/articles/${articleId}/review`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'passed' }), // 直接放行回“通过”状态
      });
    },

    listUsers: async (searchTerm?: string, roleFilter?: string, page = 1, limit = 20) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);
      return fetchAPI(`/api/admin/users?${params.toString()}`);
    }
  },
};

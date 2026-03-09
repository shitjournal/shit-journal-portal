import { delay, http, HttpResponse } from 'msw';
import { createInitialMockDatabase, type MockArticle, type MockDatabase, type MockRole, type MockUser } from './data';

let db = createInitialMockDatabase();

export function resetMockDb() {
  db = createInitialMockDatabase();
}

const MOCK_DELAY_MS = 120;

const maintenanceConfig = {
  registration: false,
  comment_send: false,
  comment_show: false,
  submit: false,
  comment: false,
};

function json<T>(body: T, init?: ResponseInit) {
  return HttpResponse.json(body, init);
}

function unauthorized() {
  return json({ detail: 'Unauthorized' }, { status: 401 });
}

function forbidden() {
  return json({ detail: 'Forbidden' }, { status: 403 });
}

function parseRoleFromEmail(email: string): MockRole {
  const normalized = email.toLowerCase();
  if (normalized.includes('super') || normalized === 'bukolosier@gmail.com') return 'super_admin';
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('editor')) return 'editor';
  if (normalized.includes('guard')) return 'community_guard';
  if (normalized.includes('review')) return 'reviewer';
  return 'author';
}

function slugToName(email: string) {
  const local = email.split('@')[0] ?? 'mock-user';
  return local
    .split(/[._-]/g)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function createDynamicUser(email: string): MockUser {
  const role = parseRoleFromEmail(email);
  return {
    id: `user-${Math.random().toString(36).slice(2, 10)}`,
    email,
    display_name: slugToName(email),
    institution: 'Mock Research Institute',
    social_media: `@${email.split('@')[0]}`,
    avatar_url: null,
    role,
    created_at: new Date().toISOString(),
    author_badge: role === 'author' ? 'septic' : null,
    is_sniffer_today: false,
  };
}

function issueToken(userId: string) {
  const token = `mock-token-${userId}-${Math.random().toString(36).slice(2, 8)}`;
  db.sessions[token] = userId;
  return token;
}

function getUserFromAuth(request: Request) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice('Bearer '.length);
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find(user => user.id === userId) ?? null;
}

function hasRole(user: MockUser, required: MockRole) {
  const order: Record<MockRole, number> = {
    author: 0,
    reviewer: 10,
    community_guard: 20,
    editor: 30,
    admin: 40,
    super_admin: 50,
  };
  return order[user.role] >= order[required];
}

function getZone(article: Pick<MockArticle, 'rating_count' | 'avg_score'>) {
  if (article.rating_count > 100 && article.avg_score >= 4.5) return 'stone';
  if (article.rating_count >= 30 && article.avg_score >= 3.8) return 'septic';
  if (article.rating_count >= 30 && article.avg_score < 3.8) return 'sediment';
  return 'latrine';
}

function commentCountForArticle(articleId: string) {
  return db.comments.filter(comment => comment.article_id === articleId && !comment.hidden).length;
}

function visiblePreprints() {
  return db.articles.filter(article => article.status === 'passed');
}

function getUserRating(userId: string, articleId: string) {
  return db.ratings.find(rating => rating.user_id === userId && rating.article_id === articleId) ?? null;
}

function getUserFavoriteArticleIds(userId: string) {
  return db.favorite_article_ids_by_user[userId] ?? [];
}

function isArticleFavoritedByUser(userId: string, articleId: string) {
  return getUserFavoriteArticleIds(userId).includes(articleId);
}

function articleForResponse(article: MockArticle, user?: MockUser | null) {
  return {
    ...article,
    zone: getZone(article),
    my_score: user ? getUserRating(user.id, article.id)?.score ?? null : null,
    is_favorited: user ? isArticleFavoritedByUser(user.id, article.id) : false,
  };
}

function userProfile(user: MockUser) {
  return {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    institution: user.institution,
    social_media: user.social_media,
    avatar_url: user.avatar_url,
    role: user.role,
    created_at: user.created_at,
    author_badge: user.author_badge,
    is_sniffer_today: user.is_sniffer_today,
  };
}

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

function sortArticles(items: MockArticle[], sort: string) {
  const copy = [...items];
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.created_at.localeCompare(b.created_at));
    case 'highest_rated':
      return copy.sort((a, b) => b.weighted_score - a.weighted_score);
    case 'most_rated':
      return copy.sort((a, b) => b.rating_count - a.rating_count);
    case 'hottest':
      return copy.sort((a, b) => commentCountForArticle(b.id) - commentCountForArticle(a.id));
    case 'newest':
    default:
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

function findArticle(articleId: string) {
  return db.articles.find(article => article.id === articleId) ?? null;
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const handlers = [
  http.get('*/api/maintainance/', async () => {
    await delay(MOCK_DELAY_MS);
    return json(maintenanceConfig);
  }),

  http.post('*/api/auth/send-code', async () => {
    await delay(MOCK_DELAY_MS);
    return json({ message: 'Mock verification code sent', code: '000000' });
  }),

  http.post('*/api/auth/login', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return json({ detail: 'Email and password are required' }, { status: 422 });
    }

    let user = db.users.find(item => item.email.toLowerCase() === email) ?? null;
    if (!user) {
      user = createDynamicUser(email);
      db.users.unshift(user);
    }

    const accessToken = issueToken(user.id);
    return json({
      access_token: accessToken,
      token_type: 'bearer',
      user: userProfile(user),
    });
  }),

  http.post('*/api/auth/register', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const body = await request.json() as {
      email?: string;
      password?: string;
      display_name?: string;
      verification_code?: string;
    };

    if (!body.email || !body.password || !body.display_name) {
      return json({ detail: 'Missing required registration fields' }, { status: 422 });
    }

    if (db.users.some(user => user.email.toLowerCase() === body.email!.toLowerCase())) {
      return json({ detail: 'This email is already registered' }, { status: 400 });
    }

    const user = createDynamicUser(body.email.toLowerCase());
    user.display_name = body.display_name;
    db.users.unshift(user);

    return json({
      message: 'Mock registration completed',
      user: userProfile(user),
    });
  }),

  http.post('*/api/auth/forgot-password', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const body = await request.json() as { email?: string; new_password?: string; verification_code?: string };
    if (!body.email || !body.new_password || !body.verification_code) {
      return json({ detail: 'Reset payload is incomplete' }, { status: 422 });
    }
    return json({ message: 'Mock password has been updated' });
  }),

  http.get('*/api/users/me', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    return json(userProfile(user));
  }),

  http.put('*/api/users/me', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const body = await request.json() as {
      display_name?: string;
      institution?: string;
      social_media?: string;
    };

    user.display_name = body.display_name?.trim() || user.display_name;
    user.institution = body.institution?.trim() || null;
    user.social_media = body.social_media?.trim() || null;

    return json({ user: userProfile(user) });
  }),

  http.get('*/api/users/me/articles', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const articles = db.articles
      .filter(article => article.author.id === user.id && article.status !== 'hidden' && article.status !== 'deleted')
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(article => ({
        id: article.id,
        title: article.title,
        status: article.status,
        tag: article.tag,
        created_at: article.created_at,
        topic: article.topic,
      }));

    return json({ articles });
  }),

  http.get('*/api/users/me/favorites', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const articles = getUserFavoriteArticleIds(user.id)
      .map(articleId => findArticle(articleId))
      .filter((article): article is MockArticle => Boolean(article && article.status === 'passed'))
      .map(article => ({
        ...articleForResponse(article, user),
        zones: getZone(article),
      }));

    return json({ articles });
  }),

  http.get('*/api/users/me/ratings', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const articles = db.ratings
      .filter(rating => rating.user_id === user.id)
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .map(rating => {
        const article = findArticle(rating.article_id);
        if (!article || article.status !== 'passed') return null;
        return {
          ...articleForResponse(article, user),
          zones: getZone(article),
          rated_at: rating.created_at,
          my_score: rating.score,
        };
      })
      .filter(Boolean);

    return json({ articles });
  }),

  http.get('*/api/articles/', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const url = new URL(request.url);
    const user = getUserFromAuth(request);
    const zone = url.searchParams.get('zone') ?? 'latrine';
    const sort = url.searchParams.get('sort') ?? 'newest';
    const discipline = url.searchParams.get('discipline') ?? 'all';
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');

    const filtered = sortArticles(
      visiblePreprints().filter(article => {
        if (discipline !== 'all' && article.discipline !== discipline) return false;
        return getZone(article) === zone;
      }),
      sort,
    );

    return json({
      data: paginate(filtered.map(article => articleForResponse(article, user)), page, limit),
      count: filtered.length,
      total: filtered.length,
    });
  }),

  http.get('*/api/articles/count', async () => {
    await delay(MOCK_DELAY_MS);
    const totalCount = db.articles.filter(article => article.status !== 'hidden' && article.status !== 'deleted').length;
    return json({ total_count: totalCount });
  }),

  http.get('*/api/search/article', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const url = new URL(request.url);
    const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const type = (url.searchParams.get('type') ?? 'article').trim().toLowerCase();
    const limit = Math.min(30, Number(url.searchParams.get('limit') ?? '10'));

    if (query.length < 2) {
      return json({ detail: 'Search term must be at least 2 characters' }, { status: 422 });
    }

    const matched = db.articles
      .filter(article => article.status !== 'hidden' && article.status !== 'deleted')
      .filter(article => {
        const titleHit = article.title.toLowerCase().includes(query) || article.topic?.toLowerCase().includes(query);
        const authorHit = article.author.display_name.toLowerCase().includes(query);

        if (type === 'author') return authorHit;
        return titleHit;
      })
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .slice(0, limit)
      .map(article => ({
        id: article.id,
        title: article.title,
        tag: article.tag,
        zones: getZone(article),
        status: article.status,
        topic: article.topic,
        discipline: article.discipline,
        created_at: article.created_at,
        rating_count: article.rating_count,
        avg_score: article.avg_score,
        weighted_score: article.weighted_score,
        comment_count: commentCountForArticle(article.id),
        author: article.author,
      }));

    return json({ status: 'success', data: matched });
  }),

  http.get('*/api/articles/:articleId', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const articleId = params.articleId as string;
    const article = findArticle(articleId);
    const user = getUserFromAuth(request);

    if (!article || article.status === 'hidden') {
      return json({ detail: 'Article not found' }, { status: 404 });
    }

    const comments = db.comments
      .filter(comment => comment.article_id === articleId && !comment.hidden)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(comment => ({
        id: comment.id,
        parent_id: comment.parent_id,
        content: comment.content,
        created_at: comment.created_at,
        like_count: comment.like_count,
        is_liked_by_me: Boolean(user && comment.user.id !== user.id && comment.like_count > 0),
        user: comment.user,
      }));

    return json({
      article: articleForResponse(article, user),
      comments,
    });
  }),

  http.post('*/api/articles/upload', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const tag = String(formData.get('tag') ?? '').trim();
    const discipline = String(formData.get('discipline') ?? 'interdisciplinary').trim();
    const topic = String(formData.get('topic') ?? '').trim();
    const coAuthorsRaw = String(formData.get('co_authors') ?? '[]');
    const file = formData.get('file');

    if (!title || !tag || !file) {
      return json({ detail: 'Title, tag, and file are required' }, { status: 422 });
    }

    const article: MockArticle = {
      id: nextId('art'),
      title,
      manuscript_title: title,
      tag,
      discipline,
      status: 'pending',
      created_at: new Date().toISOString(),
      topic: topic || null,
      avg_score: 0,
      weighted_score: 0,
      rating_count: 0,
      co_authors: JSON.parse(coAuthorsRaw),
      author: {
        id: user.id,
        display_name: user.display_name,
        institution: user.institution,
        social_media: user.social_media,
        email: user.email,
      },
      suggestions: '',
      pdf_url: '/mock-manuscript.pdf',
      file_path: '/mock-manuscript.pdf',
      file_name: typeof file === 'string' ? file : file.name,
      file_size_bytes: typeof file === 'string' ? 0 : file.size,
    };

    db.articles.unshift(article);
    return json({
      message: 'Mock submission created',
      article: articleForResponse(article, user),
    }, { status: 201 });
  }),

  http.put('*/api/articles/:articleId/info', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const article = findArticle(params.articleId as string);
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });
    if (article.author.id !== user.id && !hasRole(user, 'admin')) return forbidden();

    const body = await request.json() as Partial<MockArticle>;
    article.title = body.title?.trim() || article.title;
    article.manuscript_title = article.title;
    article.tag = body.tag?.trim() || article.tag;
    article.discipline = body.discipline?.trim() || article.discipline;
    if (Array.isArray(body.co_authors)) article.co_authors = body.co_authors as MockArticle['co_authors'];

    return json({ article: articleForResponse(article, user) });
  }),

  http.put('*/api/articles/:articleId/file', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const article = findArticle(params.articleId as string);
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });
    if (article.author.id !== user.id && !hasRole(user, 'admin')) return forbidden();

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return json({ detail: 'A replacement file is required' }, { status: 422 });
    }

    article.file_name = file.name;
    article.file_size_bytes = file.size;
    if (article.status === 'revisions') article.status = 'pending';

    return json({ message: 'Mock file replaced', article: articleForResponse(article, user) });
  }),

  http.post('*/api/articles/:articleId/favorite', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const article = findArticle(params.articleId as string);
    if (!article || article.status !== 'passed') {
      return json({ detail: 'Article not found' }, { status: 404 });
    }

    const favorites = db.favorite_article_ids_by_user[user.id] ?? [];
    if (!favorites.includes(article.id)) {
      db.favorite_article_ids_by_user[user.id] = [article.id, ...favorites];
    }

    return json({
      message: 'Mock favorite saved',
      is_favorited: true,
      article: articleForResponse(article, user),
    });
  }),

  http.delete('*/api/articles/:articleId/favorite', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const article = findArticle(params.articleId as string);
    if (!article || article.status !== 'passed') {
      return json({ detail: 'Article not found' }, { status: 404 });
    }

    db.favorite_article_ids_by_user[user.id] = getUserFavoriteArticleIds(user.id).filter(
      articleId => articleId !== article.id,
    );

    return json({
      message: 'Mock favorite removed',
      is_favorited: false,
      article: articleForResponse(article, user),
    });
  }),

  http.delete('*/api/articles/:articleId', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const article = findArticle(params.articleId as string);
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });
    if (article.author.id !== user.id && !hasRole(user, 'admin')) return forbidden();

    article.status = hasRole(user, 'admin') ? 'hidden' : 'deleted';
    return json({ message: 'Mock article removed' });
  }),

  http.post('*/api/articles/:articleId/report', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    const body = await request.json().catch(() => ({})) as { reason?: string };
    const reason = body.reason?.trim() ?? '';
    if (reason.length < 4) {
      return json({ detail: 'Report reason must be at least 4 characters long' }, { status: 422 });
    }
    return json({ message: '举报已提交，我们会尽快审核。/ Report submitted successfully.' });
  }),

  http.post('*/api/interactions/rate', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const body = await request.json() as { article_id?: string; score?: number };
    const article = findArticle(body.article_id ?? '');
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });
    if (article.author.id === user.id) {
      return json({ detail: 'You cannot rate your own submission' }, { status: 400 });
    }

    const score = Math.max(1, Math.min(5, Number(body.score ?? 0)));
    const existingRating = getUserRating(user.id, article.id);

    if (existingRating) {
      const totalScore = article.avg_score * article.rating_count;
      article.avg_score = Number(((totalScore - existingRating.score + score) / Math.max(article.rating_count, 1)).toFixed(2));
      existingRating.score = score;
      existingRating.created_at = new Date().toISOString();
    } else {
      article.avg_score = Number((((article.avg_score * article.rating_count) + score) / (article.rating_count + 1)).toFixed(2));
      article.rating_count += 1;
      db.ratings.push({
        user_id: user.id,
        article_id: article.id,
        score,
        created_at: new Date().toISOString(),
      });
    }
    article.weighted_score = Number((article.avg_score * 0.96).toFixed(2));

    return json({ message: 'Mock rating recorded', article: articleForResponse(article, user) });
  }),

  http.post('*/api/interactions/comment', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const body = await request.json() as {
      article_id?: string;
      content?: string;
      parent_id?: string | null;
    };

    if (!body.article_id || !body.content?.trim()) {
      return json({ detail: 'Article and comment content are required' }, { status: 422 });
    }

    const comment = {
      id: nextId('comment'),
      article_id: body.article_id,
      parent_id: body.parent_id ?? null,
      content: body.content.trim(),
      created_at: new Date().toISOString(),
      like_count: 0,
      hidden: false,
      user: {
        id: user.id,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
      },
    };

    db.comments.push(comment);
    return json({ message: 'Mock comment published', comment }, { status: 201 });
  }),

  http.post('*/api/interactions/comment/:commentId/like', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const comment = db.comments.find(item => item.id === params.commentId);
    if (!comment) return json({ detail: 'Comment not found' }, { status: 404 });

    comment.like_count += 1;
    return json({ message: 'Mock like recorded', like_count: comment.like_count });
  }),

  http.delete('*/api/interactions/comments/:commentId', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    db.comments = db.comments.filter(comment => comment.id !== params.commentId);
    return json({ message: 'Mock comment deleted' });
  }),

  http.post('*/api/interactions/comments/:commentId/report', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    const body = await request.json().catch(() => ({})) as { reason?: string };
    const reason = body.reason?.trim() ?? '';
    if (reason.length < 4) {
      return json({ detail: 'Report reason must be at least 4 characters long' }, { status: 422 });
    }
    return json({ message: '举报已提交，我们会尽快审核。/ Report submitted successfully.' });
  }),

  http.get('*/api/notifications/', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const notifications = db.notifications
      .filter(notification => notification.target_user_id === user.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    return json({
      data: notifications,
      unread_count: notifications.filter(item => !item.is_read).length,
      total: notifications.length,
    });
  }),

  http.put('*/api/notifications/read-all', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    db.notifications = db.notifications.map(notification =>
      notification.target_user_id === user.id ? { ...notification, is_read: true } : notification,
    );

    return json({ message: 'Mock notifications marked as read' });
  }),

  http.put('*/api/notifications/:notificationId/read', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const notification = db.notifications.find(item => item.id === params.notificationId && item.target_user_id === user.id);
    if (!notification) return json({ detail: 'Notification not found' }, { status: 404 });
    notification.is_read = true;
    return json({ message: 'Mock notification marked as read' });
  }),

  http.get('*/api/notifications/unread-count', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    return json({
      count: db.notifications.filter(notification => notification.target_user_id === user.id && !notification.is_read).length,
    });
  }),

  http.get('*/api/feedback/me', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const mine = db.feedback.find(item => item.user?.id === user.id) ?? null;
    return json({
      exists: Boolean(mine),
      item: mine,
    });
  }),

  http.post('*/api/feedback/submit', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();

    const body = await request.json() as { content?: string };
    if (!body.content?.trim()) return json({ detail: 'Feedback content is required' }, { status: 422 });

    const item = {
      id: nextId('feedback'),
      content: body.content.trim(),
      created_at: new Date().toISOString(),
      user: {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
      },
    };

    db.feedback.unshift(item);
    return json({ message: 'Mock feedback stored', item }, { status: 201 });
  }),

  http.get('*/api/admin/', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'editor')) return forbidden();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const items = [...db.feedback].sort((a, b) => b.created_at.localeCompare(a.created_at));

    return json({
      data: paginate(items, page, limit),
      total: items.length,
    });
  }),

  http.get('*/api/admin/articles/status', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'editor')) return forbidden();

    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? 'pending';
    const sort = url.searchParams.get('sort') ?? 'newest';
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');

    const filtered = sortArticles(
      db.articles.filter(article => article.status === status),
      sort,
    );

    return json({
      data: paginate(filtered.map(articleForResponse), page, limit),
      count: filtered.length,
      total: filtered.length,
    });
  }),

  http.get('*/api/admin/articles/:articleId', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'editor')) return forbidden();

    const article = findArticle(params.articleId as string);
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });
    return json({ article: articleForResponse(article) });
  }),

  http.put('*/api/admin/articles/:articleId/review', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'editor')) return forbidden();

    const article = findArticle(params.articleId as string);
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });

    const body = await request.json() as {
      status?: string;
      discipline?: string;
      suggestions?: string;
      topic?: string;
      tag?: string;
    };

    if (body.status) article.status = body.status;
    if (body.discipline) article.discipline = body.discipline;
    if (body.tag) article.tag = body.tag;
    article.topic = body.topic?.trim() || null;
    article.suggestions = body.suggestions?.trim() || '';

    return json({ message: 'Mock review saved', article: articleForResponse(article) });
  }),

  http.delete('*/api/admin/articles/:articleId', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'admin')) return forbidden();

    const article = findArticle(params.articleId as string);
    if (!article) return json({ detail: 'Article not found' }, { status: 404 });
    article.status = 'hidden';

    return json({ message: 'Mock article hidden' });
  }),

  http.get('*/api/admin/comments', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'admin')) return forbidden();

    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? 'hidden';
    const items = db.comments
      .filter(comment => status === 'hidden' ? comment.hidden : !comment.hidden)
      .map(comment => {
        const article = findArticle(comment.article_id);
        return {
          id: comment.id,
          content: comment.content,
          user_name: comment.user.display_name,
          article_title: article?.title ?? 'Unknown article',
          created_at: comment.created_at,
        };
      });

    return json({ data: items, total: items.length });
  }),

  http.delete('*/api/admin/comments/:commentId', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'admin')) return forbidden();

    const comment = db.comments.find(item => item.id === params.commentId);
    if (!comment) return json({ detail: 'Comment not found' }, { status: 404 });
    comment.hidden = true;

    return json({ message: 'Mock comment hidden' });
  }),

  http.put('*/api/admin/comments/:commentId/restore', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'admin')) return forbidden();

    const comment = db.comments.find(item => item.id === params.commentId);
    if (!comment) return json({ detail: 'Comment not found' }, { status: 404 });
    comment.hidden = false;

    return json({ message: 'Mock comment restored' });
  }),

  http.get('*/api/admin/users', async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'super_admin')) return forbidden();

    const url = new URL(request.url);
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const role = url.searchParams.get('role');
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');

    const items = db.users.filter(item => {
      if (role && item.role !== role) return false;
      if (!search) return true;
      return item.email.toLowerCase().includes(search) || item.display_name.toLowerCase().includes(search);
    });

    return json({
      data: paginate(items.map(item => ({
        id: item.id,
        display_name: item.display_name,
        email: item.email,
        role: item.role,
        created_at: item.created_at,
      })), page, limit),
      total: items.length,
    });
  }),

  http.put('*/api/admin/users/:userId/role', async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const user = getUserFromAuth(request);
    if (!user) return unauthorized();
    if (!hasRole(user, 'super_admin')) return forbidden();

    const target = db.users.find(item => item.id === params.userId);
    if (!target) return json({ detail: 'User not found' }, { status: 404 });

    const body = await request.json() as { new_role?: MockRole };
    if (!body.new_role) return json({ detail: 'new_role is required' }, { status: 422 });

    target.role = body.new_role;
    return json({ message: 'Mock role updated', user: userProfile(target) });
  }),
];

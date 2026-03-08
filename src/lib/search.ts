export type SearchScope = 'anywhere' | 'article' | 'author' | 'tag';

export interface SearchArticleItem {
  id: string;
  title: string;
  tag: string;
  zones: string;
  status: string;
  topic?: string | null;
  discipline: string;
  created_at: string;
  rating_count?: number;
  avg_score?: number;
  weighted_score?: number;
  comment_count?: number;
  author?: {
    id?: string;
    display_name: string;
    institution?: string | null;
    social_media?: string | null;
    email?: string;
  } | null;
}

export const SEARCH_SCOPE_OPTIONS: Array<{ value: SearchScope; label: string; labelCn: string }> = [
  { value: 'anywhere', label: 'Anywhere', labelCn: '全站' },
  { value: 'article', label: 'Article Title', labelCn: '文章标题' },
  { value: 'author', label: 'Author Name', labelCn: '作者昵称' },
  { value: 'tag', label: 'Tag', labelCn: '标签' },
];

export const QUICK_TAG_SEARCHES = [
  { label: '纯享整活', labelEn: 'Meme', query: 'meme' },
  { label: '硬核学术', labelEn: 'Hardcore', query: 'hardcore' },
] as const;

export const TAG_SEARCH_ALIASES: Record<string, string[]> = {
  meme: ['meme', 'memes', '纯享整活', '整活', '抽象整活', '红楼梦 meme 研究'],
  hardcore: ['hardcore', '硬核', '硬核学术', '学术', '硬核研究'],
};

export function normalizeSearchKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

export function createSearchParams(query: string, scope: SearchScope, limit?: number) {
  const params = new URLSearchParams();
  params.set('q', query.trim());
  if (scope !== 'anywhere') params.set('type', scope);
  if (limit) params.set('limit', String(limit));
  return params;
}

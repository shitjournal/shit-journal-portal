import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ZONE_LABELS } from '../lib/constants';
import { API } from '../lib/api';
import { QUICK_TAG_SEARCHES, SEARCH_API_MAX_LIMIT, SEARCH_SCOPE_OPTIONS, type SearchArticleItem, type SearchScope, createSearchParams } from '../lib/search';
import { PreprintCard } from './preprints/PreprintCard';

const PAGE_SIZE = 10;
const SEARCH_FETCH_LIMIT = SEARCH_API_MAX_LIMIT;

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchArticleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const query = searchParams.get('q')?.trim() ?? '';
  const scope = ((searchParams.get('type') as SearchScope | null) ?? 'anywhere');
  const committedScope: SearchScope = scope === 'article' || scope === 'author' || scope === 'tag' ? scope : 'anywhere';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [draftQuery, setDraftQuery] = useState(query);
  const [draftScope, setDraftScope] = useState<SearchScope>(committedScope);

  useEffect(() => {
    setDraftQuery(query);
    setDraftScope(committedScope);
  }, [query, committedScope]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      setError('搜索词至少需要 2 个字符。');
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await API.search.articles(query, committedScope, SEARCH_FETCH_LIMIT);
        if (!cancelled) {
          setResults(response.data || []);
        }
      } catch (fetchError: any) {
        if (!cancelled) {
          setResults([]);
          setError(fetchError?.message || '搜索失败，请稍后重试。');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [query, committedScope]);

  const totalPages = results.length > 0 ? Math.ceil(results.length / PAGE_SIZE) : 0;
  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paginatedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (totalPages === 0 || page <= totalPages) return;

    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (totalPages <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(totalPages));
      }
      return next;
    });
  }, [page, setSearchParams, totalPages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draftQuery.trim();
    if (trimmed.length < 2) {
      setError('搜索词至少需要 2 个字符。');
      return;
    }

    setSearchParams(createSearchParams(trimmed, draftScope));
  };

  const setPage = (nextPage: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(nextPage));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-paper">
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/55">Search Archive / 搜索档案</p>
              <h1 className="mt-2 font-serif text-3xl md:text-5xl">Search The Journal / 搜索期刊</h1>
              <p className="mt-2 max-w-2xl text-[13px] text-white/70 md:text-sm">
                从文章标题、作者昵称和标签线索里快速定位你要找的研究、整活和社区材料。
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-white/75 transition-colors hover:text-white"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm">arrow_back</span>
              Back To Home / 返回首页
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_auto]">
            <input
              value={draftQuery}
              onChange={event => setDraftQuery(event.target.value)}
              placeholder="搜索标题、作者与标签"
              className="w-full border-b border-white/30 bg-transparent pb-3 text-lg italic text-white placeholder:text-white/70 focus:border-white focus:outline-none md:text-2xl"
            />
            <div className="relative">
              <select
                value={draftScope}
                onChange={event => setDraftScope(event.target.value as SearchScope)}
                className="w-full appearance-none rounded-full border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none"
              >
                {SEARCH_SCOPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label} / {option.labelCn}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
                expand_more
              </span>
            </div>
            <button
              type="submit"
              aria-label="Search / 搜索"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-science-red px-7 py-2.5 text-[12px] font-bold uppercase tracking-widest text-white transition-transform duration-300 hover:translate-x-0.5 hover:bg-red-700"
            >
              Search / 搜索
              <span aria-hidden="true" className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {QUICK_TAG_SEARCHES.map(tag => (
              <button
                key={tag.query}
                type="button"
                onClick={() => setSearchParams(createSearchParams(tag.query, 'tag'))}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/8"
              >
                {tag.label} / {tag.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col gap-2.5 border-b border-gray-200 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gray-500">Result Snapshot / 结果快照</p>
            <h2 className="mt-1.5 text-xl font-bold uppercase tracking-[0.08em] text-charcoal md:text-2xl">
              {query ? `“${query}”` : 'Search Everything / 搜索全站'}
            </h2>
          </div>
          <p className="text-[13px] text-gray-500 md:text-sm">
            {loading
              ? 'Searching… / 搜索中…'
              : `${results.length} result${results.length === 1 ? '' : 's'} / 条，范围 ${SEARCH_SCOPE_OPTIONS.find(option => option.value === committedScope)?.labelCn ?? '全站'}${totalPages > 1 ? `，第 ${currentPage} / ${totalPages} 页` : ''}`}
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 md:text-sm">
            {error}
          </div>
        )}

        {!query && !error && (
          <div className="mt-8 rounded-[2rem] border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gray-500">Ready / 就绪</p>
            <p className="mt-3 font-serif text-xl text-charcoal md:text-2xl">从上面的搜索框开始 / Start from the search box above.</p>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex items-center justify-center py-12">
            <img src="/LOGO2.png" alt="Loading" className="h-8 w-8 animate-pulse" />
          </div>
        )}

        {!loading && query && !error && results.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gray-500">No Match / 无匹配</p>
            <p className="mt-3 font-serif text-xl text-charcoal md:text-2xl">没有找到相关内容 / No matching results found.</p>
            <p className="mt-2.5 text-[13px] text-gray-500 md:text-sm">试试换一个关键词，或者改成 `Anywhere / 全站` 搜索。</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="mt-6 space-y-4">
              {paginatedResults.map((result, index) => {
                const zone = result.zones in ZONE_LABELS ? result.zones : 'latrine';

                return (
                  <div
                    key={result.id}
                    className="animate-searchResultIn"
                    style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
                  >
                    <PreprintCard
                      zone={zone as keyof typeof ZONE_LABELS}
                      preprint={{
                        id: result.id,
                        title: result.title,
                        tag: result.tag,
                        discipline: result.discipline,
                        created_at: result.created_at,
                        avg_score: result.avg_score || 0,
                        weighted_score: result.weighted_score || 0,
                        rating_count: result.rating_count || 0,
                        co_authors: [],
                        topic: result.topic || null,
                        author: result.author
                          ? {
                              display_name: result.author.display_name,
                              institution: result.author.institution || '',
                            }
                          : undefined,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-100 pt-8">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border border-gray-300 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-accent-gold hover:text-accent-gold disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Prev
                </button>
                <span className="px-4 text-sm text-gray-500">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border border-gray-300 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-accent-gold hover:text-accent-gold disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

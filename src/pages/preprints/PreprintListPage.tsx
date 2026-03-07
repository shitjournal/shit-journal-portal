import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API } from '../../lib/api'; 
import { PreprintCard } from './PreprintCard';
import { ZONE_LABELS, DISCIPLINE_LABELS } from '../../lib/constants';
import type { Zone, Discipline } from '../../lib/constants';

const VALID_ZONES: Zone[] = ['latrine', 'septic', 'stone', 'sediment'];
const PAGE_SIZE = 10;

type SortMode = 'newest' | 'highest_rated' | 'most_rated' | 'hottest';

const ZONE_SORT_OPTIONS: Record<Zone, { value: SortMode; en: string; cn: string }[]> = {
  latrine: [], // No user-facing sort — server-side random
  septic: [
    { value: 'newest', en: 'Newest', cn: '最新' },
    { value: 'highest_rated', en: 'Highest Rated', cn: '最高分' },
    { value: 'most_rated', en: 'Most Rated', cn: '最多评分' },
    { value: 'hottest', en: 'Hottest', cn: '最热' },
  ],
  stone: [
    { value: 'highest_rated', en: 'Highest Rated', cn: '最高分' },
    { value: 'most_rated', en: 'Most Rated', cn: '最多评分' },
  ],
  sediment: [
    { value: 'newest', en: 'Newest', cn: '最新' },
    { value: 'most_rated', en: 'Most Rated', cn: '最多评分' },
  ],
  published: []
};

const DISCIPLINES = [
  { value: 'all' as const, en: 'All', cn: '全部' },
  ...Object.entries(DISCIPLINE_LABELS).map(([key, label]) => ({
    value: key as Discipline,
    en: label.en,
    cn: label.cn,
  })),
];

// Tiered cache TTL (ms) based on sort mode
const CACHE_TTL: Record<string, number> = {
  highest_rated: 60 * 1000,
  most_rated: 60 * 1000,
  newest: 60 * 1000,
  hottest: 60 * 1000,
  latrine: 60 * 1000,
};

export const PreprintListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [preprints, setPreprints] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const rawZone = searchParams.get('zone') as Zone | null;
  const zone: Zone = rawZone && VALID_ZONES.includes(rawZone) ? rawZone : 'latrine';

  const sortOptions = ZONE_SORT_OPTIONS[zone];
  const defaultSort = sortOptions[0]?.value || 'newest';
  const rawSort = searchParams.get('sort') as SortMode | null;
  const sort: SortMode = rawSort && sortOptions.some(o => o.value === rawSort) ? rawSort : defaultSort;

  const rawDiscipline = searchParams.get('discipline') || 'all';
  const discipline = rawDiscipline;

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    const cacheKey = `preprints_${zone}_${sort}_${discipline}_${page}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, count, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        setPreprints(data);
        setTotalCount(count);
        setLoading(false);
        return;
      }
    }

    // 🔥 2. 核心魔术：用 FastAPI 极简接口替换 Supabase 几十行链式调用
    const fetchPreprints = async () => {
      setLoading(true);
      try {
        // 直接把过滤条件扔给后端，后端 SQL 引擎会用毫秒级速度算好吐给你
        const response = await API.articles.getList(zone, sort, discipline, page, PAGE_SIZE);
        
        // 兼容不同后端的返回格式 (防呆设计)
        const fetchedData = response.data || response.items || [];
        const fetchedCount = response.count || response.total || 0;

        setPreprints(fetchedData);
        setTotalCount(fetchedCount);

        // 重新写入缓存
        const ttl = zone === 'latrine' ? CACHE_TTL.latrine : (CACHE_TTL[sort] || CACHE_TTL.newest);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: fetchedData,
          count: fetchedCount,
          expiry: Date.now() + ttl,
        }));
      } catch (error) {
        console.error("拉取文章列表失败:", error);
        setPreprints([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPreprints();
  }, [zone, sort, discipline, page]);

  const setParam = (key: string, value: string, resetPage = true) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      if (resetPage) next.delete('page');
      // Clean up defaults
      if (key === 'discipline' && value === 'all') next.delete('discipline');
      return next;
    });
  };

  const setPage = (p: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (p <= 1) next.delete('page'); else next.set('page', String(p));
      return next;
    });
  };

  const zoneInfo = ZONE_LABELS[zone];

  // ---------------------------------------------------------
  // 🔥 下面的 UI 渲染部分一字不差全部保留！这就是前后端解耦的魅力！
  // ---------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-2 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-1">
          <span className="mr-2">{zoneInfo.icon}</span>
          {zoneInfo.en}
        </h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">{zoneInfo.cn}</h3>
        {zone === 'latrine' && (
          <p className="text-sm text-gray-500 mt-2">
            Rate new manuscripts to help them graduate. / 为新稿件评分，帮助它们毕业。
          </p>
        )}
        {zone === 'septic' && (
          <p className="text-sm text-gray-500 mt-2">
            Established manuscripts with 30+ ratings. / 已获得 30+ 评分的成熟稿件。
          </p>
        )}
        {zone === 'stone' && (
          <p className="text-sm text-gray-500 mt-2">
            Crystallized excellence — the highest honor. / 学术结晶 — 最高荣誉。
          </p>
        )}
        {zone === 'sediment' && (
          <p className="text-sm text-gray-500 mt-2">
            Manuscripts that didn't make the cut. / 未能通过考验的稿件。
          </p>
        )}
      </div>

      {/* Zone tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {VALID_ZONES.map((z, i) => (
          <React.Fragment key={z}>
            {i > 0 && (
              <span className="flex items-center text-gray-300 text-xs px-1 select-none">
                {i === 3 ? '→?' : '→'}
              </span>
            )}
            <button
              onClick={() => setParam('zone', z)}
              className={`px-3 md:px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
                zone === z
                  ? 'border-b-2 border-accent-gold text-accent-gold'
                  : 'text-gray-400 hover:text-charcoal'
              }`}
            >
              {ZONE_LABELS[z].icon} {ZONE_LABELS[z].cn}<span className="hidden md:inline"> / {ZONE_LABELS[z].en}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Discipline filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Discipline / 学科:</span>
        <select
          value={discipline}
          onChange={e => setParam('discipline', e.target.value)}
          className="border border-gray-300 px-1 py-[6px] md:px-3 md:py-1.5 text-sm focus:outline-none focus:border-accent-gold bg-white cursor-pointer"
        >
          {DISCIPLINES.map(d => (
            <option key={d.value} value={d.value}>{d.cn} / {d.en}</option>
          ))}
        </select>
      </div>

      {/* Sort controls (not shown for latrine) */}
      {sortOptions.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort / 排序:</span>
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setParam('sort', opt.value)}
              className={`px-1 py-[6px] md:px-3 md:py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors cursor-pointer ${
                sort === opt.value
                  ? 'border-accent-gold text-accent-gold bg-yellow-50'
                  : 'border-gray-300 text-gray-400 hover:border-accent-gold hover:text-accent-gold'
              }`}
            >
              {opt.en} / {opt.cn}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
        </div>
      ) : preprints.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200">
          <span className="text-6xl block mb-6">{zoneInfo.icon}</span>
          <p className="font-serif text-lg text-gray-500 mb-2">
            {zone === 'latrine' ? 'No new manuscripts yet.' : zone === 'stone' ? 'No crystallized works yet.' : 'Nothing here yet.'}
          </p>
          <p className="chinese-serif text-gray-400">
            {zone === 'latrine' ? '暂无新稿件' : zone === 'stone' ? '暂无构石作品' : '这里还没有内容'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {preprints.map(p => (
              <PreprintCard key={p.id} preprint={p} zone={zone} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-300 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500 px-4">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-300 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

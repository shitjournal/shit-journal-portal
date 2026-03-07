import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../lib/api'; 
import { useAuth } from '../../hooks/useAuth';
// 🔥 引入你刚刚加好的 TAG_LABELS
import { DISCIPLINE_LABELS, ZONE_LABELS, ZONE_THRESHOLDS, TAG_LABELS } from '../../lib/constants';
import type { Zone, Discipline } from '../../lib/constants';
import { PdfViewer } from './PdfViewer';
import { RatingWidget } from './RatingWidget';
import { LatrineRatingWidget } from './LatrineRatingWidget';
import { isAdmin } from '../../lib/roles';

// ---------------------------------------------------------
// 常量定义 & 防呆拦截器
// ---------------------------------------------------------
const TOP_LEVEL_PAGE_SIZE = 5;
const REPLY_DEFAULT_VISIBLE = 2;
const REPLY_EXPAND_STEP = 5;

type SortMode = 'hot' | 'newest';

// 🛡️ 终极过滤器：专杀 Pandas 的 NaN 和 JS 的 "null", "undefined"
const isValidText = (text: any): boolean => {
  if (!text) return false;
  if (typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  return t !== '' && t !== 'nan' && t !== 'null' && t !== 'undefined' && t !== 'none';
};

export const PreprintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  const [preprint, setPreprint] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState({
    registration: false,
    comment_send: false,
    submit: false,
    comment_show: false,
  });
  const [editingDiscipline, setEditingDiscipline] = useState<string | null>(null);
  const [savingDiscipline, setSavingDiscipline] = useState(false);
  const [togglingHidden, setTogglingHidden] = useState(false);

  const isOwnSubmission = preprint?.author?.id === user?.id;
  const canDeleteAny = isAdmin(profile?.role);

  // ==========================================
  // 1. 数据拉取与交互逻辑
  // ==========================================
  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [data, maintData] = await Promise.all([
        API.articles.getDetail(id),
        API.maintainance.getList().catch(() => null)
      ]);
      setPreprint(data.article);
      setComments(data.comments || []);
    } catch (error) {
      console.error("获取详情失败", error);
      setPreprint(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRate = useCallback(async (score: number) => {
    if (!user || !id || isOwnSubmission) return;
    try {
      await API.interactions.rate(id, score);
      setPreprint((prev: any) => ({ ...prev, my_score: score }));
      fetchData(); 
    } catch (error: any) { alert(error.message); }
  }, [user, id, isOwnSubmission, fetchData]);

  const handleToggleLike = useCallback(async (commentId: string) => {
    if (!user) return;
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isCurrentlyLiked = c.is_liked_by_me;
        return { ...c, is_liked_by_me: !isCurrentlyLiked, like_count: c.like_count + (isCurrentlyLiked ? -1 : 1) };
      }
      return c;
    }));
    try { await API.interactions.toggleLike(commentId); } catch (error) {}
  }, [user]);

  const handleDeleteComment = async (commentId: string, isAuthorOfComment: boolean) => {
    try {
      if (canDeleteAny && !isAuthorOfComment) {
        await API.admin.deleteComment(commentId);
      } else {
        await API.interactions.deleteComment(commentId);
      }
      fetchData();
    } catch (e: any) { alert(e.message || "删除失败"); }
  };

  const handleReportArticle = async () => {
    if (!user) {
      alert("请先登录后再举报 / Please sign in to report");
      return;
    }
    // 🔥 防呆拦截：防手抖误触
    if (!window.confirm("确定要举报该文章吗？恶意举报可能导致账号被封禁。/ Are you sure to report this?")) {
      return;
    }

    try {
      const res = await API.articles.report(id!);
      alert(res.message);
      fetchData(); // 刷新页面
    } catch (e: any) {
      alert(e.message || "举报失败");
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!user) {
      alert("请先登录后再举报 / Please sign in to report");
      return;
    }
    if (!window.confirm("确定要举报该评论吗？/ Are you sure to report this comment?")) {
      return;
    }

    try {
      const res = await API.interactions.reportComment(commentId);
      alert(res.message);
      fetchData(); // 刷新评论列表
    } catch (e: any) {
      alert(e.message || "举报失败");
    }
  };

  // ==========================================
  // 2. 评论区 UI 状态与方法
  // ==========================================
  const [content, setContent] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('hot');
  const [replyTarget, setReplyTarget] = useState<{ parentId: string; replyToId: string; replyToName: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [topLevelVisible, setTopLevelVisible] = useState(TOP_LEVEL_PAGE_SIZE);
  const [replyVisibleCounts, setReplyVisibleCounts] = useState<Record<string, number>>({});
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { topLevel, repliesByParent } = useMemo(() => {
    const top: any[] = [];
    const byParent: Record<string, any[]> = {};
    for (const c of comments) {
      if (!c.parent_id) top.push(c);
      else {
        if (!byParent[c.parent_id]) byParent[c.parent_id] = [];
        byParent[c.parent_id].push(c);
      }
    }
    for (const replies of Object.values(byParent)) {
      replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    return { topLevel: top, repliesByParent: byParent };
  }, [comments]);

  const sortedTopLevel = useMemo(() => {
    if (sortMode === 'newest') {
      return [...topLevel].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      return [...topLevel].sort((a, b) => {
        const aReplies = repliesByParent[a.id] || [];
        const bReplies = repliesByParent[b.id] || [];
        const aUniqueUsers = new Set(aReplies.map(r => r.user?.id)).size;
        const bUniqueUsers = new Set(bReplies.map(r => r.user?.id)).size;
        return ((b.like_count || 0) + bUniqueUsers) - ((a.like_count || 0) + aUniqueUsers);
      });
    }
  }, [topLevel, repliesByParent, sortMode]);

  const handleSubmitTopLevel = async () => {
    if (!content.trim() || !user?.id) return;
    setSubmitting(true);
    try {
      await API.interactions.comment(id!, content.trim(), null);
      setContent('');
      fetchData();
    } catch (e: any) { alert(e.message); }
    setSubmitting(false);
  };

  const handleSubmitReply = async (replyContent: string) => {
    if (!replyContent.trim() || !user?.id || !replyTarget) return;
    setSubmitting(true);
    try {
      await API.interactions.comment(id!, replyContent.trim(), replyTarget.parentId);
      setReplyVisibleCounts(prev => ({
        ...prev,
        [replyTarget.parentId]: Math.max(prev[replyTarget.parentId] ?? REPLY_DEFAULT_VISIBLE, (repliesByParent[replyTarget.parentId]?.length || 0) + 1),
      }));
      setReplyTarget(null);
      fetchData();
    } catch (e: any) { alert(e.message); }
    setSubmitting(false);
  };

  const startReply = (parentId: string, replyToId: string, replyToName: string) => {
    setReplyTarget({ parentId, replyToId, replyToName });
    setTimeout(() => replyTextareaRef.current?.focus(), 50);
  };

  const getReplyVisibleCount = (parentId: string) => replyVisibleCounts[parentId] ?? REPLY_DEFAULT_VISIBLE;
  const expandReplies = (parentId: string) => {
    setReplyVisibleCounts(prev => ({ ...prev, [parentId]: (prev[parentId] ?? REPLY_DEFAULT_VISIBLE) + REPLY_EXPAND_STEP }));
  };

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setTopLevelVisible(TOP_LEVEL_PAGE_SIZE);
  };

  // ==========================================
  // 3. 主渲染层
  // ==========================================
  if (loading) return <div className="text-center py-32"><img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" /></div>;
  if (!preprint) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><span className="text-6xl block mb-6">🚫</span><h2 className="text-2xl font-serif font-bold mb-4">Not found / 未找到</h2><Link to="/preprints?zone=latrine" className="text-accent-gold font-bold hover:underline">返回首页</Link></div>;

  const zone: Zone = preprint.zones || preprint.status || 'latrine';
  const isLatrine = zone === 'latrine';
  const isStone = zone === 'stone';
  const disciplineLabel = preprint.discipline ? DISCIPLINE_LABELS[preprint.discipline as Discipline] : null;

  const visibleTopLevel = sortedTopLevel.slice(0, topLevelVisible);
  const remainingTopLevel = sortedTopLevel.length - topLevelVisible;

  // 🚀 核心数据提取与净化
  const displayTitle = isValidText(preprint.title) ? preprint.title : '无题 / Untitled';
  const displayAuthor = isValidText(preprint.author?.display_name) ? preprint.author!.display_name : '匿名作者 / Anonymous';
  const displayInstitution = isValidText(preprint.author?.institution) ? preprint.author!.institution : null;
  const displaySocialMedia = isValidText(preprint.author?.social_media) ? preprint.author!.social_media : null;
  
  // 🔥 核心改动：用 TAG_LABELS 字典做翻译！如果找不到就用回原来的 fallback
  const rawTag = preprint.tag;
  const displayTag = (rawTag && TAG_LABELS[rawTag]) 
      ? TAG_LABELS[rawTag] 
      : (isValidText(rawTag) ? rawTag : '未分类 / Uncategorized');

  const displayTopic = isValidText(preprint.topic) ? preprint.topic : null;
  const coAuthors = Array.isArray(preprint.co_authors) ? preprint.co_authors : [];

  return (
    <div className="max-w-4xl mx-auto px-2 lg:px-8 py-6">
      <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold mb-8">← Back</button>

      {/* 管理员操作 */}
      {isAdmin(profile?.role) && (
        <div className="flex items-center justify-between p-4 mb-4 border text-sm bg-gray-50 border-gray-200">
          <span className="text-xs font-bold text-gray-500">管理操作</span>
          <button onClick={async () => {
              if (window.confirm("确定要软删除并隐藏这篇文章吗？")) {
                setTogglingHidden(true);
                try { await API.admin.deleteArticle(preprint.id); navigate('/'); } catch (e: any) { alert(e.message); }
                setTogglingHidden(false);
              }
            }} disabled={togglingHidden} className="px-4 py-1.5 text-[10px] bg-red-500 text-white hover:bg-red-600 transition-colors">隐藏/软删除稿件</button>
        </div>
      )}

      {/* 🌟 文章元数据 */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        
        {/* 标题 & 话题徽章 */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {isStone && <span className="text-3xl" title="构石 / The Stone">🪨</span>}
          <h2 className="text-2xl font-serif font-bold">{displayTitle}</h2>
          
          {displayTopic && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0 mt-1">
              {displayTopic}
            </span>
          )}
        </div>

        {/* 详细信息网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Author / 作者</span>
            <p className="text-charcoal">{displayAuthor}</p>
          </div>
          
          {displayInstitution && (
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Institution / 单位</span>
              <p className="text-charcoal">{displayInstitution}</p>
            </div>
          )}
          
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Tag / 标签</span>
            <p className="inline-block px-2 py-0.5 border border-gray-200 bg-gray-50 text-charcoal rounded text-xs">
              {displayTag}
            </p>
          </div>
          
          {disciplineLabel && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                Discipline / 学科
              </span>
              {isAdmin(profile?.role) ? (
                <div className="flex items-center gap-2">
                  <select
                    value={editingDiscipline ?? preprint.discipline}
                    onChange={e => setEditingDiscipline(e.target.value)}
                    disabled={savingDiscipline}
                    className="border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-accent-gold bg-white cursor-pointer"
                  >
                    {Object.entries(DISCIPLINE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label.cn} / {label.en}</option>
                    ))}
                  </select>
                  <button
                    disabled={savingDiscipline}
                    onClick={async () => {
                      const newDiscipline = editingDiscipline ?? preprint.discipline;
                      setSavingDiscipline(true);
                      try {
                        await API.admin.reviewArticle(preprint.id, { discipline: newDiscipline });
                        setPreprint({ ...preprint, discipline: newDiscipline });
                        setEditingDiscipline(null);
                        alert("学科已由管理员修正");
                      } catch (e: any) { alert(e.message || "修改失败"); }
                      setSavingDiscipline(false);
                    }}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-accent-gold text-white hover:bg-charcoal transition-colors disabled:opacity-50"
                  >
                    {savingDiscipline ? '...' : 'Fix / 修正'}
                  </button>
                </div>
              ) : (
                <p className="text-charcoal">{disciplineLabel.cn} / {disciplineLabel.en}</p>
              )}
            </div>
          )}
          
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Submitted / 提交时间</span>
            <p className="text-charcoal">{new Date(preprint.created_at).toLocaleString()}</p>
          </div>

          {displaySocialMedia && (
             <div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Social Media / 社交媒体</span>
               <p className="text-charcoal">{displaySocialMedia}</p>
             </div>
          )}
        </div>

        {coAuthors.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Co-Authors / 共同作者</span>
            <div className="space-y-2">
              {coAuthors.map((ca: any, i: number) => {
                 const caName = isValidText(ca.name) ? ca.name : 'Unknown';
                 const caInst = isValidText(ca.institution) ? ca.institution : null;
                 return (
                   <p key={i} className="text-sm text-charcoal flex items-center">
                     {caName} {caInst && <span className="text-gray-500 ml-1">· {caInst}</span>}
                     {ca.contribution === 'co-first' && (
                       <span className="ml-2 px-1 py-0.5 text-[9px] font-bold bg-yellow-50 text-accent-gold rounded">
                         共一
                       </span>
                     )}
                   </p>
                 );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 评分区 */}
      <div className="mb-8">
        {user ? (
          isLatrine ? <LatrineRatingWidget currentRating={preprint.my_score} ratingCount={preprint.rating_count} isOwnSubmission={isOwnSubmission} onRate={handleRate} />
                    : <RatingWidget currentRating={preprint.my_score} weightedScore={preprint.avg_score} ratingCount={preprint.rating_count} isOwnSubmission={isOwnSubmission} onRate={handleRate} />
        ) : (
          <div className="bg-white border border-gray-200 p-6 flex items-center gap-4">
            <span className="text-sm text-gray-500">登录后可参与评分 / Sign in to rate</span>
            <Link to="/login" className="px-4 py-1.5 text-[10px] font-bold bg-accent-gold text-white uppercase tracking-widest hover:bg-charcoal transition-colors">登录</Link>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold">Manuscript / 全文</h3>
          {user && !isOwnSubmission && (
            <button 
              onClick={handleReportArticle} 
              className="px-3 py-1 text-[10px] font-bold text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
              title="举报违规内容"
            >
              REPORT / 举报
            </button>
          )}
        </div>
        <PdfViewer pdfPath={preprint.pdf_url} />
      </div>

      {/* ============================================================== */}
      {/* 评论区 */}
      {/* ============================================================== */}
      <div className="bg-white border border-gray-200 p-6">
        
        {/* 输入框顶部 */}
        {!maintenance.comment ? (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-sm text-amber-700">评论功能维护中，暂时关闭</div>
        ) : user?.id ? (
          <div className="mb-6">
            <textarea ref={textareaRef} value={replyTarget ? '' : content} onChange={e => { if (!replyTarget) setContent(e.target.value); }} onFocus={() => { if (replyTarget) setReplyTarget(null); }} placeholder="理性发言，禁止涉政、暴力、色情等违规内容" maxLength={100} rows={3} className="w-full border border-gray-200 rounded p-3 text-sm resize-none focus:outline-none focus:border-accent-gold transition-colors" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-gray-400">{content.length}/100</span>
              <button onClick={handleSubmitTopLevel} disabled={!content.trim() || submitting || !!replyTarget} className="px-5 py-1.5 text-[11px] font-bold bg-accent-gold text-white rounded hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? '发布中...' : '发布'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-500">登录后可参与讨论 / Sign in to comment</span>
            <Link to="/login" state={{ from: location.pathname }} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-accent-gold text-white hover:bg-charcoal transition-colors">登录</Link>
          </div>
        )}

        {/* 排序与计数器 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-charcoal font-bold">{comments.length} 条评论</span>
          <div className="flex items-center gap-1">
            <button onClick={() => handleSortChange('hot')} className={`px-2 py-1 text-[11px] font-bold transition-colors ${sortMode === 'hot' ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'}`}>默认</button>
            <button onClick={() => handleSortChange('newest')} className={`px-2 py-1 text-[11px] font-bold transition-colors ${sortMode === 'newest' ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'}`}>最新</button>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-4" />

        {/* 评论列表 */}
        {visibleTopLevel.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">暂无评论 / No comments yet</p>
        ) : (
          <div className="space-y-5">
            {visibleTopLevel.map(comment => {
              const replies = repliesByParent[comment.id] || [];
              const visibleCount = getReplyVisibleCount(comment.id);
              const visibleReplies = replies.slice(0, visibleCount);
              const remainingReplies = replies.length - visibleCount;

              return (
                <div key={comment.id} className="pb-5 border-b border-gray-50 last:border-b-0">
                  <CommentItem
                    comment={comment}
                    isReply={false}
                    isAuthor={comment.user?.id === preprint.author?.id}
                    isLiked={comment.is_liked_by_me}
                    currentUserId={user?.id}
                    canDeleteAny={canDeleteAny}
                    onReply={() => startReply(comment.id, comment.id, comment.user?.display_name || '匿名')}
                    onDelete={() => handleDeleteComment(comment.id, comment.user?.id === user?.id)}
                    onToggleLike={() => handleToggleLike(comment.id)}
                    onReport={() => handleReportComment(comment.id)}
                    hideScores={isLatrine}
                  />

                  {visibleReplies.length > 0 && (
                    <div className="ml-6 mt-3 space-y-3">
                      {visibleReplies.map(reply => {
                        let replyToName = comment.user?.display_name;
                        if (reply.reply_to_id && reply.reply_to_id !== comment.id) {
                          const target = replies.find(r => r.id === reply.reply_to_id);
                          if (target) replyToName = target.user?.display_name;
                        }

                        return (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            isReply
                            isAuthor={reply.user?.id === preprint.author?.id}
                            showReplyTo={reply.reply_to_id !== reply.parent_id}
                            replyToName={replyToName}
                            isLiked={reply.is_liked_by_me}
                            currentUserId={user?.id}
                            canDeleteAny={canDeleteAny}
                            onReply={() => startReply(comment.id, reply.id, reply.user?.display_name || '匿名')}
                            onDelete={() => handleDeleteComment(reply.id, reply.user?.id === user?.id)}
                            onToggleLike={() => handleToggleLike(reply.id)}
                            onReport={() => handleReportComment(comment.id)}
                            hideScores={isLatrine}
                          />
                        )
                      })}
                    </div>
                  )}

                  {remainingReplies > 0 && (
                    <button onClick={() => expandReplies(comment.id)} className="mt-2 ml-6 text-[11px] font-bold text-accent-gold hover:text-charcoal transition-colors">
                      展开更多 {Math.min(remainingReplies, REPLY_EXPAND_STEP)} 条回复 {remainingReplies > REPLY_EXPAND_STEP && ` (共${replies.length}条)`}
                    </button>
                  )}

                  {replyTarget?.parentId === comment.id && user?.id && (
                    <ReplyInput
                      ref={replyTextareaRef}
                      replyToName={replyTarget.replyToName}
                      submitting={submitting}
                      onSubmit={handleSubmitReply}
                      onCancel={() => setReplyTarget(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {remainingTopLevel > 0 && (
          <button onClick={() => setTopLevelVisible(prev => prev + TOP_LEVEL_PAGE_SIZE)} className="w-full mt-4 py-3 text-[11px] font-bold text-accent-gold hover:text-charcoal transition-colors">
            查看更多评论 ({remainingTopLevel})
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 辅助函数与子组件
// ==========================================
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const diffMs = new Date().getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 30) return `${diffDay}天前`;
  return date.toLocaleDateString('zh-CN');
};

const CommentItem: React.FC<any> = ({ 
  comment, isReply, isAuthor, showReplyTo, replyToName, isLiked, 
  currentUserId, canDeleteAny, onReply, onDelete, onToggleLike, hideScores, onReport
}) => {
  const authorBadge = comment.user?.author_badge;
  const isSnifferToday = comment.user?.is_sniffer_today;
  const userScore = comment.user?.user_score; 

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-bold text-charcoal ${isReply ? 'text-xs' : 'text-sm'}`}>
          {comment.user?.display_name || '匿名用户'}
        </span>
        {isAuthor && <span className="text-[10px] font-bold text-accent-gold bg-yellow-50 px-1.5 py-0.5 rounded">作者</span>}
        {isSnifferToday && <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded" title="今日嗅探兽">🐽</span>}
        {authorBadge === 'stone' && <span className="text-[10px] font-bold text-accent-gold bg-yellow-50 px-1.5 py-0.5 rounded" title="造粪王">🏆 造粪王</span>}
        {authorBadge === 'septic' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded" title="造粪机">🏭 造粪机</span>}
        {!hideScores && userScore != null && <span className="text-xs" title={`${userScore}/5`}>{'💩'.repeat(userScore)}</span>}
      </div>

      <p className={`text-charcoal whitespace-pre-wrap ${isReply ? 'text-xs' : 'text-sm'}`}>
        {showReplyTo && replyToName && <span className="text-accent-gold font-bold">回复 {replyToName}：</span>}
        {comment.content}
      </p>

      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400">{formatTime(comment.created_at)}</span>
          {currentUserId && comment.user?.id !== "deleted" && <button onClick={onReply} className="text-[10px] font-bold text-gray-400 hover:text-accent-gold transition-colors">回复</button>}
          {(currentUserId === comment.user?.id || canDeleteAny) && comment.user?.id !== "deleted" && <button onClick={onDelete} className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors">删除</button>}
          {currentUserId && comment.user?.id !== currentUserId && comment.user?.id !== "deleted" && (
            <button onClick={onReport} className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors">
              举报
            </button>
          )}
        </div>
        <button onClick={currentUserId && comment.user?.id !== "deleted" ? onToggleLike : undefined} className={`flex items-center gap-1 text-xs transition-all ${currentUserId ? 'cursor-pointer' : 'cursor-default'} ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
          <span className={`text-sm transition-all ${isLiked ? 'scale-110' : 'grayscale opacity-40'}`} style={isLiked ? {} : { filter: 'grayscale(100%)' }}>💩</span>
          {comment.like_count > 0 && <span>{comment.like_count}</span>}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 独立的高级回复框组件
// ==========================================
const ReplyInput = React.forwardRef<HTMLTextAreaElement, any>(({ replyToName, submitting, onSubmit, onCancel }, ref) => {
  const [text, setText] = useState('');
  return (
    <div className="ml-6 mt-3">
      <div className="text-[10px] text-gray-400 mb-1">回复 {replyToName}</div>
      <textarea ref={ref} value={text} onChange={e => setText(e.target.value)} placeholder="写下你的回复..." maxLength={100} rows={2} className="w-full border border-gray-200 rounded p-2 text-sm resize-none focus:outline-none focus:border-accent-gold transition-colors" />
      <div className="flex items-center justify-end gap-2 mt-1">
        <button onClick={onCancel} className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-charcoal transition-colors">取消</button>
        <button onClick={() => onSubmit(text)} disabled={!text.trim() || submitting} className="px-3 py-1 text-[10px] font-bold bg-accent-gold text-white rounded hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{submitting ? '发布中...' : '回复'}</button>
      </div>
    </div>
  );
});
ReplyInput.displayName = 'ReplyInput';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Comment {
  id: string;
  submission_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  reply_to_id: string | null;
  created_at: string;
  display_name: string;
  user_score: number | null;
  like_count: number;
  reply_to_name: string | null;
}

interface CommentSectionProps {
  submissionId: string;
  authorUserId: string;
  comments: Comment[];
  currentUserId?: string;
  userLikes: Set<string>;
  onCommentAdded: () => void;
  onToggleLike: (commentId: string) => void;
}

type SortMode = 'hot' | 'newest';

const TOP_LEVEL_PAGE_SIZE = 5;
const REPLY_DEFAULT_VISIBLE = 2;
const REPLY_EXPAND_STEP = 5;

export const CommentSection: React.FC<CommentSectionProps> = ({
  submissionId,
  authorUserId,
  comments,
  currentUserId,
  userLikes,
  onCommentAdded,
  onToggleLike,
}) => {
  const location = useLocation();
  const [content, setContent] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('hot');
  const [replyTarget, setReplyTarget] = useState<{
    parentId: string;
    replyToId: string;
    replyToName: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [topLevelVisible, setTopLevelVisible] = useState(TOP_LEVEL_PAGE_SIZE);
  const [replyVisibleCounts, setReplyVisibleCounts] = useState<Record<string, number>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Group comments by parent
  const { topLevel, repliesByParent } = useMemo(() => {
    const top: Comment[] = [];
    const byParent: Record<string, Comment[]> = {};

    for (const c of comments) {
      if (!c.parent_id) {
        top.push(c);
      } else {
        if (!byParent[c.parent_id]) byParent[c.parent_id] = [];
        byParent[c.parent_id].push(c);
      }
    }

    // Sort replies by time ascending
    for (const replies of Object.values(byParent)) {
      replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return { topLevel: top, repliesByParent: byParent };
  }, [comments]);

  // Stable sort order: only recalculate when comment IDs change or sort mode changes
  // (NOT on like count changes from optimistic updates)
  const topLevelIds = useMemo(
    () => topLevel.map(c => c.id).sort().join(','),
    [topLevel]
  );

  const [sortedIds, setSortedIds] = useState<string[]>([]);
  useEffect(() => {
    if (sortMode === 'newest') {
      const sorted = [...topLevel].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setSortedIds(sorted.map(c => c.id));
    } else {
      const sorted = [...topLevel].sort((a, b) => {
        const aReplies = repliesByParent[a.id] || [];
        const bReplies = repliesByParent[b.id] || [];
        const aUniqueUsers = new Set(aReplies.map(r => r.user_id)).size;
        const bUniqueUsers = new Set(bReplies.map(r => r.user_id)).size;
        return (b.like_count + bUniqueUsers) - (a.like_count + aUniqueUsers);
      });
      setSortedIds(sorted.map(c => c.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topLevelIds, sortMode]);

  // Map IDs back to current comment data (so like counts display correctly)
  const topLevelMap = useMemo(
    () => new Map(topLevel.map(c => [c.id, c])),
    [topLevel]
  );
  const sortedTopLevel = sortedIds
    .map(id => topLevelMap.get(id))
    .filter((c): c is Comment => !!c);

  const handleSubmitTopLevel = useCallback(async () => {
    if (!content.trim() || !currentUserId) return;
    setSubmitting(true);

    const { error } = await supabase.from('preprint_comments').insert({
      submission_id: submissionId,
      user_id: currentUserId,
      content: content.trim(),
      parent_id: null,
      reply_to_id: null,
    });

    if (!error) {
      setContent('');
      onCommentAdded();
    }
    setSubmitting(false);
  }, [content, currentUserId, submissionId, onCommentAdded]);

  const handleSubmitReply = useCallback(async (replyContent: string) => {
    if (!replyContent.trim() || !currentUserId || !replyTarget) return;
    setSubmitting(true);

    const { error } = await supabase.from('preprint_comments').insert({
      submission_id: submissionId,
      user_id: currentUserId,
      content: replyContent.trim(),
      parent_id: replyTarget.parentId,
      reply_to_id: replyTarget.replyToId,
    });

    if (!error) {
      setReplyTarget(null);
      onCommentAdded();
      const replies = repliesByParent[replyTarget.parentId] || [];
      setReplyVisibleCounts(prev => ({
        ...prev,
        [replyTarget.parentId]: Math.max(
          prev[replyTarget.parentId] ?? REPLY_DEFAULT_VISIBLE,
          replies.length + 1
        ),
      }));
    }
    setSubmitting(false);
  }, [currentUserId, submissionId, replyTarget, onCommentAdded, repliesByParent]);

  const startReply = (parentId: string, replyToId: string, replyToName: string) => {
    setReplyTarget({ parentId, replyToId, replyToName });
    setTimeout(() => replyTextareaRef.current?.focus(), 50);
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase
      .from('preprint_comments')
      .delete()
      .eq('id', commentId);
    if (!error) onCommentAdded();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 30) return `${diffDay}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getReplyVisibleCount = (parentId: string) => {
    return replyVisibleCounts[parentId] ?? REPLY_DEFAULT_VISIBLE;
  };

  const expandReplies = (parentId: string) => {
    setReplyVisibleCounts(prev => ({
      ...prev,
      [parentId]: (prev[parentId] ?? REPLY_DEFAULT_VISIBLE) + REPLY_EXPAND_STEP,
    }));
  };

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setTopLevelVisible(TOP_LEVEL_PAGE_SIZE);
  };

  const visibleTopLevel = sortedTopLevel.slice(0, topLevelVisible);
  const remainingTopLevel = sortedTopLevel.length - topLevelVisible;

  return (
    <div className="bg-white border border-gray-200 p-6">
      {/* Post input (top) */}
      {currentUserId ? (
        <div className="mb-6">
          <textarea
            ref={textareaRef}
            value={replyTarget ? '' : content}
            onChange={e => { if (!replyTarget) setContent(e.target.value); }}
            onFocus={() => { if (replyTarget) setReplyTarget(null); }}
            placeholder="理性发言，禁止涉政、暴力、色情等违规内容"
            maxLength={100}
            rows={3}
            className="w-full border border-gray-200 rounded p-3 text-sm resize-none focus:outline-none focus:border-accent-gold transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400">{content.length}/100</span>
            <button
              onClick={handleSubmitTopLevel}
              disabled={!content.trim() || submitting || !!replyTarget}
              className="px-5 py-1.5 text-[11px] font-bold bg-accent-gold text-white rounded hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? '发布中...' : '发布'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">登录后可评论 / Sign in to comment</span>
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-accent-gold text-white hover:bg-charcoal transition-colors"
          >
            登录
          </Link>
        </div>
      )}

      {/* Comment count + sort */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-charcoal font-bold">{comments.length} 条评论</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSortChange('hot')}
            className={`px-2 py-1 text-[11px] font-bold transition-colors ${
              sortMode === 'hot' ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            默认
          </button>
          <button
            onClick={() => handleSortChange('newest')}
            className={`px-2 py-1 text-[11px] font-bold transition-colors ${
              sortMode === 'newest' ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            最新
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Comment list */}
      {visibleTopLevel.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          暂无评论 / No comments yet
        </p>
      ) : (
        <div className="space-y-5">
          {visibleTopLevel.map(comment => {
            const replies = repliesByParent[comment.id] || [];
            const visibleCount = getReplyVisibleCount(comment.id);
            const visibleReplies = replies.slice(0, visibleCount);
            const remainingReplies = replies.length - visibleCount;

            return (
              <div key={comment.id} className="pb-5 border-b border-gray-50 last:border-b-0">
                {/* Top-level comment */}
                <CommentItem
                  comment={comment}
                  isReply={false}
                  isAuthor={comment.user_id === authorUserId}
                  isLiked={userLikes.has(comment.id)}
                  currentUserId={currentUserId}
                  onReply={() => startReply(comment.id, comment.id, comment.display_name)}
                  onDelete={() => handleDelete(comment.id)}
                  onToggleLike={() => onToggleLike(comment.id)}
                  formatTime={formatTime}
                />

                {/* Replies */}
                {visibleReplies.length > 0 && (
                  <div className="ml-6 mt-3 space-y-3">
                    {visibleReplies.map(reply => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        isReply
                        isAuthor={reply.user_id === authorUserId}
                        showReplyTo={reply.reply_to_id !== reply.parent_id}
                        isLiked={userLikes.has(reply.id)}
                        currentUserId={currentUserId}
                        onReply={() => startReply(comment.id, reply.id, reply.display_name)}
                        onDelete={() => handleDelete(reply.id)}
                        onToggleLike={() => onToggleLike(reply.id)}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                )}

                {/* Expand more replies */}
                {remainingReplies > 0 && (
                  <button
                    onClick={() => expandReplies(comment.id)}
                    className="mt-2 ml-6 text-[11px] font-bold text-accent-gold hover:text-charcoal transition-colors"
                  >
                    展开更多 {Math.min(remainingReplies, REPLY_EXPAND_STEP)} 条回复
                    {remainingReplies > REPLY_EXPAND_STEP && ` (共${replies.length}条)`}
                  </button>
                )}

                {/* Reply input */}
                {replyTarget?.parentId === comment.id && currentUserId && (
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

      {/* Show more top-level comments */}
      {remainingTopLevel > 0 && (
        <button
          onClick={() => setTopLevelVisible(prev => prev + TOP_LEVEL_PAGE_SIZE)}
          className="w-full mt-4 py-3 text-[11px] font-bold text-accent-gold hover:text-charcoal transition-colors"
        >
          查看更多评论 ({remainingTopLevel})
        </button>
      )}
    </div>
  );
};

/* ── Comment item ── */

interface CommentItemProps {
  comment: Comment;
  isReply: boolean;
  isAuthor: boolean;
  showReplyTo?: boolean;
  isLiked: boolean;
  currentUserId?: string;
  onReply: () => void;
  onDelete: () => void;
  onToggleLike: () => void;
  formatTime: (d: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply,
  isAuthor,
  showReplyTo,
  isLiked,
  currentUserId,
  onReply,
  onDelete,
  onToggleLike,
  formatTime,
}) => (
  <div>
    {/* Name row */}
    <div className="flex items-center gap-2 mb-1">
      <span className={`font-bold text-charcoal ${isReply ? 'text-xs' : 'text-sm'}`}>
        {comment.display_name}
      </span>
      {isAuthor && (
        <span className="text-[10px] font-bold text-accent-gold bg-yellow-50 px-1.5 py-0.5 rounded">
          作者
        </span>
      )}
      {comment.user_score != null && (
        <span className="text-xs" title={`${comment.user_score}/5`}>
          {'💩'.repeat(comment.user_score)}
        </span>
      )}
    </div>

    {/* Content */}
    <p className={`text-charcoal whitespace-pre-wrap ${isReply ? 'text-xs' : 'text-sm'}`}>
      {showReplyTo && comment.reply_to_name && (
        <span className="text-accent-gold font-bold">回复 {comment.reply_to_name}：</span>
      )}
      {comment.content}
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between mt-1.5">
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-gray-400">{formatTime(comment.created_at)}</span>
        {currentUserId && (
          <button
            onClick={onReply}
            className="text-[10px] font-bold text-gray-400 hover:text-accent-gold transition-colors"
          >
            回复
          </button>
        )}
        {currentUserId === comment.user_id && (
          <button
            onClick={onDelete}
            className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            删除
          </button>
        )}
      </div>

      {/* Like (点屎) button */}
      <button
        onClick={currentUserId ? onToggleLike : undefined}
        className={`flex items-center gap-1 text-xs transition-all ${
          currentUserId ? 'cursor-pointer' : 'cursor-default'
        } ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        title={currentUserId ? (isLiked ? '取消' : '点屎') : '登录后可点屎'}
      >
        <span
          className={`text-sm transition-all ${isLiked ? 'scale-110' : 'grayscale opacity-40'}`}
          style={isLiked ? {} : { filter: 'grayscale(100%)' }}
        >
          💩
        </span>
        {comment.like_count > 0 && <span>{comment.like_count}</span>}
      </button>
    </div>
  </div>
);

/* ── Reply input ── */

interface ReplyInputProps {
  replyToName: string;
  submitting: boolean;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const ReplyInput = React.forwardRef<HTMLTextAreaElement, ReplyInputProps>(
  ({ replyToName, submitting, onSubmit, onCancel }, ref) => {
    const [text, setText] = useState('');

    return (
      <div className="ml-6 mt-3">
        <div className="text-[10px] text-gray-400 mb-1">
          回复 {replyToName}
        </div>
        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="写下你的回复..."
          maxLength={100}
          rows={2}
          className="w-full border border-gray-200 rounded p-2 text-sm resize-none focus:outline-none focus:border-accent-gold transition-colors"
        />
        <div className="flex items-center justify-end gap-2 mt-1">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-charcoal transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSubmit(text)}
            disabled={!text.trim() || submitting}
            className="px-3 py-1 text-[10px] font-bold bg-accent-gold text-white rounded hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? '发布中...' : '回复'}
          </button>
        </div>
      </div>
    );
  }
);

ReplyInput.displayName = 'ReplyInput';

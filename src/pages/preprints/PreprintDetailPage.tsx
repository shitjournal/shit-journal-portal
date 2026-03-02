import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { VISCOSITY_LABELS, DISCIPLINE_LABELS, ZONE_LABELS, ZONE_THRESHOLDS } from '../../lib/constants';
import type { Zone, Discipline } from '../../lib/constants';
import { PdfViewer } from './PdfViewer';
import { RatingWidget } from './RatingWidget';
import { LatrineRatingWidget } from './LatrineRatingWidget';
import { CommentSection } from './CommentSection';

export const PreprintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [preprint, setPreprint] = useState<any>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [editingDiscipline, setEditingDiscipline] = useState<string | null>(null);
  const [savingDiscipline, setSavingDiscipline] = useState(false);

  const isOwnSubmission = preprint?.user_id === user?.id;

  const fetchComments = useCallback(async (alsoFetchLikes = false) => {
    if (!id) return;
    const { data } = await supabase
      .from('preprint_comments_with_user')
      .select('*')
      .eq('submission_id', id);
    const loaded = data || [];
    setComments(loaded);
    if (alsoFetchLikes && user) {
      // Pass loaded comments directly to avoid needing a separate query for comment IDs
      const commentIds = loaded.map(c => c.id);
      if (commentIds.length) {
        const { data: likesData } = await supabase
          .from('preprint_comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds);
        setUserLikes(new Set((likesData || []).map(l => l.comment_id)));
      }
    }
  }, [id, user]);

  const handleToggleLike = useCallback(async (commentId: string) => {
    if (!user) return;
    const isLiked = userLikes.has(commentId);

    // Optimistic update
    setUserLikes(prev => {
      const next = new Set(prev);
      if (isLiked) next.delete(commentId); else next.add(commentId);
      return next;
    });
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, like_count: c.like_count + (isLiked ? -1 : 1) }
        : c
    ));

    if (isLiked) {
      await supabase
        .from('preprint_comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('preprint_comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });
    }
  }, [user, userLikes]);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('preprints_with_ratings_mat')
        .select('id,user_id,manuscript_title,author_name,institution,viscosity,discipline,created_at,social_media,co_authors,pdf_path,avg_score,weighted_score,rating_count,zone')
        .eq('id', id)
        .single();

      // discipline_user_edited lives on submissions table, not in the mat view
      if (data && user && data.user_id === user.id) {
        const { data: subData } = await supabase
          .from('submissions')
          .select('discipline_user_edited')
          .eq('id', id)
          .single();
        if (subData) {
          data.discipline_user_edited = subData.discipline_user_edited;
        }
      }

      if (data) setPreprint(data);

      if (user) {
        const { data: ratingData } = await supabase
          .from('preprint_ratings')
          .select('score')
          .eq('submission_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (ratingData) setUserRating(ratingData.score);
      }

      setLoading(false);
    };

    fetch();
    fetchComments(true);
  }, [id, user, fetchComments]);

  const handleRate = useCallback(async (score: number) => {
    if (!user || !id || isOwnSubmission) return;

    const { error } = await supabase
      .from('preprint_ratings')
      .upsert(
        { user_id: user.id, submission_id: id, score },
        { onConflict: 'user_id,submission_id' }
      );

    if (!error) {
      setUserRating(score);
      const { data } = await supabase
        .from('preprints_with_ratings_mat')
        .select('avg_score, weighted_score, rating_count')
        .eq('id', id)
        .single();
      if (data && preprint) {
        setPreprint({ ...preprint, avg_score: data.avg_score, weighted_score: data.weighted_score, rating_count: data.rating_count });
      }
    }
  }, [user, id, isOwnSubmission, preprint]);

  if (loading) {
    return (
      <div className="text-center py-32">
        <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
      </div>
    );
  }

  if (!preprint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🚫</span>
        <h2 className="text-2xl font-serif font-bold mb-4">Not found / 未找到</h2>
        <Link to="/preprints?zone=latrine" className="text-accent-gold font-bold hover:underline">
          Back to Latrine / 返回旱厕
        </Link>
      </div>
    );
  }

  const coAuthors = Array.isArray(preprint.co_authors) ? preprint.co_authors : [];
  const zone: Zone = preprint.zone || 'latrine';
  const isLatrine = zone === 'latrine';
  const isStone = zone === 'stone';
  const zoneLabel = ZONE_LABELS[zone];
  const disciplineLabel = preprint.discipline
    ? DISCIPLINE_LABELS[preprint.discipline as Discipline]
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block"
      >
        ← Back to {zoneLabel.en} / 返回{zoneLabel.cn}
      </button>

      {/* Metadata */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          {isStone && <span className="text-3xl" title="构石 / The Stone">🪨</span>}
          <h2 className="text-2xl font-serif font-bold">{preprint.manuscript_title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Author / 作者</span>
            <p className="text-charcoal">{preprint.author_name}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Institution / 单位</span>
            <p className="text-charcoal">{preprint.institution}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Viscosity / 粘度</span>
            <p className="text-charcoal">{VISCOSITY_LABELS[preprint.viscosity] || preprint.viscosity}</p>
          </div>
          {disciplineLabel && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Discipline / 学科</span>
              {isOwnSubmission && !preprint.discipline_user_edited ? (
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
                      const { error } = await supabase
                        .from('submissions')
                        .update({ discipline: newDiscipline, discipline_user_edited: true })
                        .eq('id', preprint.id);
                      setSavingDiscipline(false);
                      if (!error) {
                        setPreprint({ ...preprint, discipline: newDiscipline, discipline_user_edited: true });
                        setEditingDiscipline(null);
                      }
                    }}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-accent-gold text-white hover:bg-charcoal transition-colors disabled:opacity-50"
                  >
                    {savingDiscipline ? '...' : 'Confirm / 确认'}
                  </button>
                </div>
              ) : (
                <p className="text-charcoal">{disciplineLabel.cn} / {disciplineLabel.en}</p>
              )}
            </div>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submitted / 提交时间</span>
            <p className="text-charcoal">{new Date(preprint.created_at).toLocaleString('zh-CN')}</p>
          </div>
          {preprint.social_media && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Social Media / 社交媒体</span>
              <p className="text-charcoal">{preprint.social_media}</p>
            </div>
          )}
        </div>

        {coAuthors.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Co-Authors / 共同作者</span>
            <div className="space-y-2">
              {coAuthors.map((ca: any, i: number) => (
                <p key={i} className="text-sm text-charcoal">
                  {ca.name} · {ca.institution}
                  {ca.contribution === 'co-first' && <span className="text-accent-gold ml-2 text-xs font-bold">共一</span>}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-8">
        {user ? (
          isLatrine ? (
            <LatrineRatingWidget
              currentRating={userRating}
              ratingCount={preprint.rating_count}
              isOwnSubmission={isOwnSubmission}
              onRate={handleRate}
            />
          ) : (
            <RatingWidget
              currentRating={userRating}
              weightedScore={preprint.weighted_score}
              ratingCount={preprint.rating_count}
              isOwnSubmission={isOwnSubmission}
              onRate={handleRate}
            />
          )
        ) : (
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              {isLatrine ? 'Rate / 盲评' : 'Rate / 评价'}
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-500">登录后可评分 / Sign in to rate</span>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-accent-gold text-white hover:bg-charcoal transition-colors"
              >
                Sign In / 登录
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              {isLatrine ? (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    评价进度 / Progress: {preprint.rating_count} / {ZONE_THRESHOLDS.LATRINE_TO_SEPTIC_COUNT}
                  </span>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-2xl font-serif font-bold text-charcoal">
                      {preprint.weighted_score > 0 ? preprint.weighted_score.toFixed(2) : '—'}
                    </span>
                    <span className="text-sm text-gray-400"> / 5</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {preprint.rating_count} {preprint.rating_count === 1 ? 'rating' : 'ratings'} / {preprint.rating_count}个评分
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold mb-4">Manuscript / 全文</h3>
        <PdfViewer pdfPath={preprint.pdf_path} />
      </div>

      {/* Comments */}
      <div className="mb-8">
        <CommentSection
          submissionId={preprint.id}
          authorUserId={preprint.user_id}
          comments={comments}
          currentUserId={user?.id}
          userLikes={userLikes}
          onCommentAdded={fetchComments}
          onToggleLike={handleToggleLike}
          hideScores={isLatrine}
        />
      </div>
    </div>
  );
};

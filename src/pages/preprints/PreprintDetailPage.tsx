import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { VISCOSITY_LABELS } from '../../lib/constants';
import { PdfViewer } from './PdfViewer';
import { RatingWidget } from './RatingWidget';

export const PreprintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [preprint, setPreprint] = useState<any>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnSubmission = preprint?.user_id === user?.id;

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('preprints_with_ratings')
        .select('*')
        .eq('id', id)
        .single();

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
  }, [id, user]);

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
        .from('preprints_with_ratings')
        .select('avg_score, rating_count')
        .eq('id', id)
        .single();
      if (data && preprint) {
        setPreprint({ ...preprint, avg_score: data.avg_score, rating_count: data.rating_count });
      }
    }
  }, [user, id, isOwnSubmission, preprint]);

  if (loading) {
    return (
      <div className="text-center py-32">
        <span className="text-4xl animate-pulse">💩</span>
      </div>
    );
  }

  if (!preprint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🚫</span>
        <h2 className="text-2xl font-serif font-bold mb-4">Not found / 未找到</h2>
        <Link to="/preprints" className="text-accent-gold font-bold hover:underline">
          Back to Preprints / 返回化粪池
        </Link>
      </div>
    );
  }

  const coAuthors = Array.isArray(preprint.co_authors) ? preprint.co_authors : [];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block"
      >
        ← Back to Preprints / 返回化粪池
      </button>

      {/* Metadata */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-serif font-bold mb-6">{preprint.manuscript_title}</h2>

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
          <RatingWidget
            currentRating={userRating}
            avgScore={preprint.avg_score}
            ratingCount={preprint.rating_count}
            isOwnSubmission={isOwnSubmission}
            onRate={handleRate}
          />
        ) : (
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Rate / 评价
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
              <div>
                <span className="text-2xl font-serif font-bold text-charcoal">
                  {preprint.avg_score > 0 ? preprint.avg_score.toFixed(1) : '—'}
                </span>
                <span className="text-sm text-gray-400"> / 5</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {preprint.rating_count} {preprint.rating_count === 1 ? 'rating' : 'ratings'} / {preprint.rating_count}个评分
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold mb-4">Manuscript / 全文</h3>
        <PdfViewer pdfPath={preprint.pdf_path} />
      </div>
    </div>
  );
};

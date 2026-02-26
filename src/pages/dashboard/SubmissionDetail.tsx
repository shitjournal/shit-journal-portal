import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface SubmissionData {
  id: string;
  manuscript_title: string;
  author_name: string;
  email: string;
  institution: string;
  social_media: string | null;
  co_authors: { name: string; email: string; institution: string; contribution: string }[];
  viscosity: string;
  file_name: string;
  file_path: string;
  pdf_path: string;
  file_size_bytes: number;
  status: string;
  created_at: string;
  screening_notes: string | null;
  solicited_topic: string | null;
}

interface ReviewData {
  recommendation: string | null;
  comments_to_author: string | null;
  stink_score: number | null;
  status: string;
}

const STATUS_LABELS: Record<string, { en: string; cn: string; color: string }> = {
  pending: { en: 'Screening', cn: '待预审', color: 'bg-gray-100 text-gray-500' },
  under_review: { en: 'Scooper Review', cn: '铲屎官评审中', color: 'bg-yellow-50 text-yellow-700' },
  revisions_requested: { en: 'Revisions Requested', cn: '需要修改', color: 'bg-blue-50 text-blue-700' },
  accepted: { en: 'Approved for Flush', cn: '批准冲水', color: 'bg-green-50 text-green-700' },
  rejected: { en: 'Clogged', cn: '堵塞了', color: 'bg-red-50 text-red-700' },
  flushed: { en: 'Desk Flushed', cn: '直接冲掉', color: 'bg-red-50 text-red-500' },
};

const RECOMMENDATION_LABELS: Record<string, string> = {
  accept: 'Accept / 接受',
  minor_revisions: 'Minor Revisions / 小修',
  major_revisions: 'Major Revisions / 大修',
  reject: 'Reject / 拒绝',
  flush: 'Emergency Flush / 紧急冲水',
};

export const SubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  // Revision reupload state
  const [revisionWord, setRevisionWord] = useState<File | null>(null);
  const [revisionPdf, setRevisionPdf] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const wordInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetch = async () => {
      const { data: sub } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (sub) {
        setSubmission(sub);
        // Fetch completed reviews (only comments_to_author visible to author)
        const { data: revs } = await supabase
          .from('reviews')
          .select('recommendation, comments_to_author, stink_score, status')
          .eq('submission_id', id)
          .eq('status', 'completed');
        setReviews(revs || []);
      }
      setLoading(false);
    };

    fetch();
  }, [user, id]);

  const handleResubmit = async () => {
    if (!submission || !revisionWord || !revisionPdf || uploading) return;
    setUploading(true);
    setUploadError('');

    try {
      // Use .update() to overwrite existing files (requires UPDATE policy)
      const { error: wordErr } = await supabase.storage
        .from('manuscripts')
        .update(submission.file_path, revisionWord);
      if (wordErr) throw new Error(`Word upload failed / Word上传失败: ${wordErr.message}`);

      const { error: pdfErr } = await supabase.storage
        .from('manuscripts')
        .update(submission.pdf_path, revisionPdf, { contentType: 'application/pdf' });
      if (pdfErr) throw new Error(`PDF upload failed / PDF上传失败: ${pdfErr.message}`);

      // Update submission: reset to pending, update file metadata
      const { error: dbErr } = await supabase
        .from('submissions')
        .update({
          status: 'pending',
          file_name: revisionWord.name,
          file_size_bytes: revisionWord.size,
          screening_notes: null,
          screened_at: null,
          screened_by: null,
        })
        .eq('id', submission.id);

      if (dbErr) throw new Error(`Update failed / 更新失败: ${dbErr.message}`);

      // Refresh submission data
      setSubmission(prev => prev ? {
        ...prev,
        status: 'pending',
        file_name: revisionWord.name,
        file_size_bytes: revisionWord.size,
        screening_notes: null,
      } : null);
      setRevisionWord(null);
      setRevisionPdf(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed / 上传失败');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-32">
        <span className="text-4xl animate-pulse">💩</span>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🚫</span>
        <h2 className="text-2xl font-serif font-bold mb-4">Submission not found</h2>
        <Link to="/dashboard" className="text-accent-gold font-bold hover:underline">
          Back to Dashboard / 返回仪表台
        </Link>
      </div>
    );
  }

  const status = STATUS_LABELS[submission.status] || STATUS_LABELS.pending;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block">
        ← Back to Dashboard / 返回仪表台
      </Link>

      <div className="bg-white border border-gray-200 p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif font-bold">{submission.manuscript_title}</h2>
              {submission.solicited_topic && (
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                  {submission.solicited_topic}
                </span>
              )}
            </div>
          </div>
          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${status.color}`}>
            {status.en} / {status.cn}
          </span>
        </div>
        {['under_review', 'accepted'].includes(submission.status) && (
          <Link
            to={`/preprints/${submission.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent-gold hover:text-charcoal transition-colors mb-6"
          >
            View in 发酵池 / 查看预印本
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Author / 作者</span>
            <p className="text-charcoal">{submission.author_name}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Email / 邮箱</span>
            <p className="text-charcoal">{submission.email}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Institution / 单位</span>
            <p className="text-charcoal">{submission.institution}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Viscosity / 粘度</span>
            <p className="text-charcoal">{submission.viscosity}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submitted / 提交时间</span>
            <p className="text-charcoal">{new Date(submission.created_at).toLocaleString('zh-CN')}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">File / 文件</span>
            <p className="text-charcoal">{submission.file_name} ({(submission.file_size_bytes / 1024).toFixed(1)} KB)</p>
          </div>
        </div>

        {submission.co_authors && submission.co_authors.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Co-Authors / 共同作者</span>
            <div className="space-y-2">
              {submission.co_authors.map((ca, i) => (
                <p key={i} className="text-sm text-charcoal">
                  {ca.name} · {ca.email} · {ca.institution} · {ca.contribution === 'co-first' ? '共一' : '其他'}
                </p>
              ))}
            </div>
          </div>
        )}

        {submission.screening_notes && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-2">Editor Notes / 编辑备注</span>
            <p className="font-serif text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-amber-50 border border-amber-200 p-4">
              {submission.screening_notes}
            </p>
          </div>
        )}

        {/* Revision reupload section */}
        {submission.status === 'revisions_requested' && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-serif font-bold mb-1">Resubmit Revised Manuscript</h3>
            <p className="text-xs text-gray-400 mb-4">请上传修改后的稿件，重新提交预审</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Word upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  revisionWord ? 'border-accent-gold/30 bg-amber-50/30' : 'border-gray-300 bg-gray-50 hover:border-accent-gold hover:bg-white'
                }`}
                onClick={() => wordInputRef.current?.click()}
              >
                <input
                  ref={wordInputRef}
                  type="file"
                  accept=".doc,.docx"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setRevisionWord(f);
                  }}
                />
                <span className={`material-symbols-outlined text-2xl mb-2 block ${revisionWord ? 'text-accent-gold' : 'text-gray-400'}`}>description</span>
                {revisionWord ? (
                  <>
                    <p className="text-sm font-medium text-charcoal">{revisionWord.name}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{(revisionWord.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-charcoal">Word Document / Word文档</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">.doc / .docx</p>
                  </>
                )}
              </div>

              {/* PDF upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  revisionPdf ? 'border-accent-gold/30 bg-amber-50/30' : 'border-gray-300 bg-gray-50 hover:border-accent-gold hover:bg-white'
                }`}
                onClick={() => pdfInputRef.current?.click()}
              >
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setRevisionPdf(f);
                  }}
                />
                <span className={`material-symbols-outlined text-2xl mb-2 block ${revisionPdf ? 'text-accent-gold' : 'text-gray-400'}`}>picture_as_pdf</span>
                {revisionPdf ? (
                  <>
                    <p className="text-sm font-medium text-charcoal">{revisionPdf.name}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{(revisionPdf.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-charcoal">PDF Document / PDF文档</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">.pdf</p>
                  </>
                )}
              </div>
            </div>

            {uploadError && (
              <p className="text-red-500 text-xs font-bold mb-3">{uploadError}</p>
            )}

            <button
              onClick={handleResubmit}
              disabled={!revisionWord || !revisionPdf || uploading}
              className="px-6 py-3 bg-accent-gold text-white text-[11px] font-bold uppercase tracking-widest hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading... / 上传中...' : 'Resubmit for Review / 重新提交预审'}
            </button>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold">Review Feedback / 评审反馈</h3>
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Reviewer #{idx + 1}
                </span>
                {review.recommendation && (
                  <span className="text-xs font-bold text-accent-gold">
                    {RECOMMENDATION_LABELS[review.recommendation] || review.recommendation}
                  </span>
                )}
                {review.stink_score && (
                  <span className="text-xs text-gray-500">
                    Stink Score: {review.stink_score}/10
                  </span>
                )}
              </div>
              {review.comments_to_author && (
                <p className="font-serif text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {review.comments_to_author}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

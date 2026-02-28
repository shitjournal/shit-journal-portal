import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { EDITOR_STATUS_LABELS, VISCOSITY_LABELS } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { PdfViewer } from '../preprints/PdfViewer';

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
  file_size_bytes: number;
  pdf_path: string | null;
  status: string;
  created_at: string;
  screening_notes: string | null;
  solicited_topic: string | null;
}

const DECISIONS = [
  { value: 'under_review', en: 'Approve to Tank', cn: '批准入池', color: 'bg-green-600 hover:bg-green-700' },
  { value: 'revisions_requested', en: 'Request Revisions', cn: '退回修改', color: 'bg-blue-600 hover:bg-blue-700' },
  { value: 'flushed', en: 'Desk Flush', cn: '直接冲掉', color: 'bg-red-600 hover:bg-red-700' },
];

export const ScreeningDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [topicOverride, setTopicOverride] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSubmission = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setSubmission(data);
        setNotes(data.screening_notes || '');
        setTopicOverride(data.solicited_topic || '');
      }
      setLoading(false);
    };

    fetchSubmission();
  }, [id]);

  const handleDecision = async (decision: string) => {
    if (!user || !id || submitting) return;
    setSubmitting(true);

    // Send notification email first (before potential deletion)
    if (submission) {
      supabase.functions.invoke('send-screening-email', {
        body: {
          email: submission.email,
          authorName: submission.author_name,
          manuscriptTitle: submission.manuscript_title,
          submissionId: id,
          decision,
          notes: notes.trim() || null,
        },
      }).catch(e => console.error('Screening email failed:', e));
    }

    // Flushed submissions are kept for 24h then cleaned up by database cron

    const { error } = await supabase
      .from('submissions')
      .update({
        status: decision,
        screened_at: new Date().toISOString(),
        screened_by: user.id,
        screening_notes: notes.trim() || null,
        solicited_topic: topicOverride || null,
      })
      .eq('id', id);

    if (!error) {
      navigate('/screening');
    } else {
      setSubmitting(false);
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
        <Link to="/screening" className="text-accent-gold font-bold hover:underline">
          Back to Screening / 返回预审台
        </Link>
      </div>
    );
  }

  const status = EDITOR_STATUS_LABELS[submission.status] || EDITOR_STATUS_LABELS.pending;
  const coAuthors = Array.isArray(submission.co_authors) ? submission.co_authors : [];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <Link
        to="/screening"
        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block"
      >
        &larr; Back to Screening / 返回预审台
      </Link>

      {/* Metadata */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold">{submission.manuscript_title}</h2>
            {submission.solicited_topic && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                {submission.solicited_topic}
              </span>
            )}
          </div>
          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${status.color}`}>
            {status.en} / {status.cn}
          </span>
        </div>

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
            <p className="text-charcoal">{VISCOSITY_LABELS[submission.viscosity] || submission.viscosity}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submitted / 提交时间</span>
            <p className="text-charcoal">{new Date(submission.created_at).toLocaleString('zh-CN')}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">File / 文件</span>
            <p className="text-charcoal">{submission.file_name} ({(submission.file_size_bytes / 1024).toFixed(1)} KB)</p>
          </div>
          {submission.social_media && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Social Media / 社交媒体</span>
              <p className="text-charcoal">{submission.social_media}</p>
            </div>
          )}
        </div>

        {coAuthors.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Co-Authors / 共同作者</span>
            <div className="space-y-2">
              {coAuthors.map((ca, i) => (
                <p key={i} className="text-sm text-charcoal">
                  {ca.name} · {ca.email} · {ca.institution}
                  {ca.contribution === 'co-first' && <span className="text-accent-gold ml-2 text-xs font-bold">共一</span>}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold mb-4">Manuscript / 全文</h3>
        <PdfViewer pdfPath={submission.pdf_path} />
      </div>

      {/* Decision Form */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-xl font-serif font-bold mb-4">Screening Decision / 预审决定</h3>

        <div className="mb-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
            Solicited Topic / 约稿主题
          </label>
          <select
            value={topicOverride}
            onChange={e => setTopicOverride(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-accent-gold bg-white"
          >
            <option value="">None / 无</option>
            <option value="S.H.I.T社区治理1.0">S.H.I.T社区治理1.0</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
            Notes to Author (optional) / 编辑备注（可选）
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-accent-gold resize-none"
            placeholder="Optional feedback for the author..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {DECISIONS.map(d => (
            <button
              key={d.value}
              onClick={() => handleDecision(d.value)}
              disabled={submitting}
              className={`flex-1 py-3 px-4 text-white text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 ${d.color}`}
            >
              {d.en} / {d.cn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

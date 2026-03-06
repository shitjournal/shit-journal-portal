import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../../lib/api'; 
import { EDITOR_STATUS_LABELS, DISCIPLINE_LABELS } from '../../lib/constants';
import type { Discipline } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { PdfViewer } from '../preprints/PdfViewer';

// 严格对应后端 ArticleStatus 枚举值
const DECISIONS = [
  { value: 'passed', en: 'Approve to Tank', cn: '批准入池', color: 'bg-green-600 hover:bg-green-700' },
  { value: 'revisions', en: 'Request Revisions', cn: '退回修改', color: 'bg-blue-600 hover:bg-blue-700' },
  { value: 'flushed', en: 'Desk Flush', cn: '直接冲掉', color: 'bg-red-600 hover:bg-red-700' },
];

// 🛡️ 终极过滤器：专杀 Pandas 的 NaN 和 JS 的 "null", "undefined"
const isValidText = (text: any): boolean => {
  if (!text) return false;
  if (typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  return t !== '' && t !== 'nan' && t !== 'null' && t !== 'undefined' && t !== 'none';
};

export const ScreeningDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 审批表单状态
  const [notes, setNotes] = useState('');
  const [topicOverride, setTopicOverride] = useState<string>('');
  const [disciplineOverride, setDisciplineOverride] = useState<string>('interdisciplinary');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSubmission = async () => {
      try {
        // 🔥 调用 FastAPI 管理员透视接口
        const data = await API.admin.getAdminArticleDetail(id);
        setSubmission(data.article);
        
        // 初始化审批表单状态
        setNotes(data.article.suggestions || '');
        setTopicOverride(isValidText(data.article.topic) ? data.article.topic : '');
        if (data.article.discipline) setDisciplineOverride(data.article.discipline);
      } catch (error) {
        console.error("加载详情失败", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  const handleDecision = async (decision: string) => {
    if (!user || !id || submitting) return;
    setSubmitting(true);

    try {
      // 🔥 提交包含 topic 的修改意见
      await API.admin.reviewArticle(id, {
        status: decision,
        discipline: disciplineOverride,
        topic: topicOverride, // 传给后端
        suggestions: notes.trim() || undefined
      });
      
      navigate('/screening'); 
    } catch (error: any) {
      alert(error.message || "审批失败，请重试或联系技术支持");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-32"><img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" /></div>;
  }

  if (!submission) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🚫</span>
        <h2 className="text-2xl font-serif font-bold mb-4">Submission not found</h2>
        <Link to="/screening" className="text-accent-gold font-bold hover:underline">Back to Screening / 返回预审台</Link>
      </div>
    );
  }

  const statusInfo = EDITOR_STATUS_LABELS[submission.status] || EDITOR_STATUS_LABELS.pending;
  const coAuthors = Array.isArray(submission.co_authors) ? submission.co_authors : [];

  // 🚀 极其严格的防污提取
  const displayTitle = isValidText(submission.title) ? submission.title : (isValidText(submission.manuscript_title) ? submission.manuscript_title : 'Untitled');
  const displayAuthor = isValidText(submission.author?.display_name) ? submission.author.display_name : (isValidText(submission.author_name) ? submission.author_name : '匿名作者');
  const displayInstitution = isValidText(submission.author?.institution) ? submission.author.institution : null;
  const displayEmail = isValidText(submission.author?.email) ? submission.author.email : isValidText(submission.email) ? submission.email : '无邮箱记录';
  const displayTopic = isValidText(submission.topic) ? submission.topic : null;
  const displayTag = isValidText(submission.tag) ? submission.tag : '未分类';

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <Link to="/screening" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block">
        &larr; Back to Screening / 返回预审台
      </Link>

      {/* Metadata 区 */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            {/* 🚀 标题不省略，支持多行，保持 leading-tight */}
            <div className="flex items-start gap-2 flex-wrap mb-2">
              <h2 className="text-2xl font-serif font-bold leading-tight">{displayTitle}</h2>
              {displayTopic && (
                <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                  {displayTopic}
                </span>
              )}
            </div>
          </div>
          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${statusInfo.color}`}>
            {statusInfo.en} / {statusInfo.cn}
          </span>
        </div>

        {/* 🚀 完整的网格数据展示区 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Author / 作者</span>
            <p className="text-charcoal">{displayAuthor} {displayInstitution && ` · ${displayInstitution}`}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Email / 邮箱</span>
            <p className="text-charcoal">{displayEmail}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Tag / 分类</span>
            <span className="inline-block text-charcoal border border-gray-200 px-2 py-0.5 bg-gray-50 text-xs font-bold mt-0.5">
              {displayTag}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Discipline / 学科</span>
            <p className="text-charcoal">{DISCIPLINE_LABELS[submission.discipline as Discipline]?.cn || submission.discipline} / {DISCIPLINE_LABELS[submission.discipline as Discipline]?.en || submission.discipline}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submitted / 提交时间</span>
            <p className="text-charcoal">{new Date(submission.created_at).toLocaleString('zh-CN')}</p>
          </div>
        </div>

        {coAuthors.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Co-Authors / 共同作者</span>
            <div className="space-y-2">
              {coAuthors.map((ca: any, i: number) => (
                <p key={i} className="text-sm text-charcoal">
                  {ca.name} · {ca.email} · {ca.institution}
                  {ca.contribution === 'co-first' && <span className="text-accent-gold ml-2 text-xs font-bold">共一</span>}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold mb-4">Manuscript / 全文</h3>
        <PdfViewer pdfPath={submission.pdf_url || submission.file_path} /> 
      </div>

      {/* Decision Form */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-xl font-serif font-bold mb-4">Screening Decision / 预审决定</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
              Solicited Topic / 约稿主题修正
            </label>
            <select
              value={topicOverride}
              onChange={e => setTopicOverride(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-accent-gold bg-white"
            >
              <option value="">None / 无</option>
              <option value="S.H.I.T社区治理1.0">S.H.I.T社区治理1.0</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
              Discipline / 强制修正学科分类
            </label>
            <select
              value={disciplineOverride}
              onChange={e => setDisciplineOverride(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-accent-gold bg-white"
            >
              {Object.entries(DISCIPLINE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label.cn} / {label.en}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
            Notes to Author / 编辑备注（如退回请填写理由）
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-accent-gold resize-none"
            placeholder="如果拒绝或要求修改，请填写建议..."
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
              {submitting ? '...' : `${d.en} / ${d.cn}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
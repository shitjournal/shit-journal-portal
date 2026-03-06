import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../../lib/api';
import { STATUS_LABELS } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';
import { PdfViewer } from '../preprints/PdfViewer';

export const SubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Revision reupload state
  const [revisionPdf, setRevisionPdf] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetchSubData = async () => {
      try {
        const data = await API.articles.getDetail(id);
        setSubmission(data.article);
      } catch (error) {
        console.error("获取稿件详情失败", error);
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubData();
  }, [user, id]);

  // 🔥 重新上传 PDF：直接调用封装好的 reuploadFile
  const handleUpdatePdf = async () => {
    if (!submission || !revisionPdf || uploading) return;
    setUploading(true);
    setUploadError('');

    try {
      await API.articles.reuploadFile(submission.id, revisionPdf);

      // 成功后，更新本地 UI 状态，将状态切回 pending
      setSubmission((prev: any) => ({
        ...prev,
        file_name: revisionPdf.name,
        file_size_bytes: revisionPdf.size,
        status: (prev.status === 'revisions') ? 'pending' : prev.status
      }));
      setRevisionPdf(null);
      alert("PDF 更新成功！已重新进入预审队列。");
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed / 上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 🔥 撤稿/软删除：直接调用封装好的 deleteArticle
  const handleDelete = async () => {
    if (!submission || deleting) return;
    setDeleting(true);
    setDeleteError('');

    try {
      // 注意：这里调用你自己 api.ts 里对应删除自己文章的方法
      await API.articles.deleteMyArticle(submission.id); 
      navigate('/dashboard'); // 删完直接滚回列表
    } catch (err: any) {
      setDeleteError(err.message || 'Delete failed / 删除失败');
      setDeleting(false);
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
        <Link to="/dashboard" className="text-accent-gold font-bold hover:underline">Back to Dashboard / 返回仪表台</Link>
      </div>
    );
  }

  // 🚀 彻底规范化状态：FastAPI 返回的已经是英文的 enum value 了（如 'pending', 'passed'）
  const statusKey = submission.status || 'pending';
  const statusInfo = STATUS_LABELS[statusKey as keyof typeof STATUS_LABELS] || STATUS_LABELS.pending;

  // 防呆处理
  const displayTitle = submission.title || submission.manuscript_title || 'Untitled / 无题';
  const displayAuthor = submission.author?.display_name || submission.author_name || 'Anonymous / 匿名作者';
  const displayInstitution = submission.author?.institution;
  const displayTopic = submission.topic && submission.topic.trim() !== '' ? submission.topic : null;
  const displayTag = submission.tag || '未分类 / Uncategorized';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block">
        ← Back to Dashboard / 返回仪表台
      </Link>

      <div className="bg-white border border-gray-200 p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="text-2xl font-serif font-bold">{displayTitle}</h2>
              {/* 🔥 小黄标 Topic 闪亮登场 */}
              {displayTopic && (
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap shrink-0">
                  {displayTopic}
                </span>
              )}
            </div>
            
            {/* 🔥 机构信息回归 */}
            <p className="text-sm text-charcoal-light">
              {displayAuthor} {displayInstitution && ` · ${displayInstitution}`}
            </p>
          </div>
          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${statusInfo.color}`}>
            {statusInfo.en} / {statusInfo.cn}
          </span>
        </div>

        {submission.status === 'passed' && (
          <Link to={`/preprints/${submission.id}`} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent-gold hover:text-charcoal transition-colors mb-6">
            View Preprint / 查看预印本 <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-6 border-t border-gray-100 pt-4">
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Email / 邮箱</span><p className="text-charcoal">{user?.email}</p></div>
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submitted / 提交时间</span><p className="text-charcoal">{new Date(submission.created_at).toLocaleString('zh-CN')}</p></div>
          
          <div className="col-span-1 sm:col-span-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Tag / 分类</span>
            <span className="inline-block text-charcoal border border-gray-200 px-2 py-0.5 bg-gray-50 text-xs font-bold mt-0.5">
              {displayTag}
            </span>
          </div>
          {/* ✂️ 去掉了文件大小和名称的展示 */}
        </div>

        {/* 退回理由/编辑笔记 */}
        {submission.suggestions && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-2">Editor Notes / 编辑意见</span>
            <p className="font-serif text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-amber-50 border border-amber-200 p-4">
              {submission.suggestions}
            </p>
          </div>
        )}

        {/* 重新上传 PDF 的区域 (只允许在被退回修改时操作) */}
        {['revisions', 'pending'].includes(submission.status) && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-serif font-bold mb-1">Update PDF / 更新稿件</h3>
            <p className="text-xs text-gray-400 mb-4">上传新版本 PDF 替换当前文件（仅限 PDF 格式）</p>

            <div className="mb-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${revisionPdf ? 'border-accent-gold/30 bg-amber-50/30' : 'border-gray-300 bg-gray-50 hover:border-accent-gold hover:bg-white'}`}
                onClick={() => pdfInputRef.current?.click()}
              >
                <input 
                  ref={pdfInputRef} 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={e => { 
                    const f = e.target.files?.[0]; 
                    if (f && f.type === 'application/pdf') {
                      setRevisionPdf(f); 
                      setUploadError('');
                    } else if (f) {
                      setUploadError('Only PDF files are allowed / 仅允许上传 PDF 格式文件');
                      e.target.value = ''; // 清空选择
                    }
                  }} 
                />
                <span className={`material-symbols-outlined text-2xl mb-2 block ${revisionPdf ? 'text-accent-gold' : 'text-gray-400'}`}>picture_as_pdf</span>
                {revisionPdf ? (
                  <><p className="text-sm font-medium text-charcoal">{revisionPdf.name}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{(revisionPdf.size / 1024).toFixed(1)} KB</p></>
                ) : (
                  <><p className="text-sm font-medium text-charcoal">点击选择新的 PDF / Click to select</p></>
                )}
              </div>
            </div>

            {uploadError && <p className="text-red-500 text-xs font-bold mb-3">{uploadError}</p>}

            <button
              onClick={handleUpdatePdf} disabled={!revisionPdf || uploading}
              className="px-6 py-3 bg-accent-gold text-white text-[11px] font-bold uppercase tracking-widest hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading... / 上传中...' : 'Update PDF / 更新文件'}
            </button>
          </div>
        )}
      </div>

      {/* PDF 预览 */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold mb-4">Manuscript Preview / 稿件预览</h3>
        <div className="border border-gray-200">
          <PdfViewer pdfPath={submission.pdf_url || submission.file_path} />
        </div>
      </div>

      {/* 删除稿件区 */}
      {submission.status !== 'passed' && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          {deleteError && <p className="text-red-500 text-xs font-bold mb-3">{deleteError}</p>}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
              Delete Submission / 删除稿件
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm text-red-600 font-bold">确认删除？稿件和文件将永久删除。</p>
              <button onClick={handleDelete} disabled={deleting} className="px-5 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Confirm Delete / 确认删除'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-charcoal transition-colors">Cancel / 取消</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
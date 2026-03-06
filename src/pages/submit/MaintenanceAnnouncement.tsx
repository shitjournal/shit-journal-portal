import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export const MaintenanceAnnouncement: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 检查是否已经留言过
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setCheckingExisting(false); return; }
    
    API.feedback.checkMine()
      .then(res => {
        if (res.has_submitted) setAlreadySubmitted(true);
      })
      .catch(err => console.error("检查留言状态失败:", err))
      .finally(() => setCheckingExisting(false));
  }, [user, authLoading]);

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      await API.feedback.submit(content.trim());
      setSubmitted(true);
      setAlreadySubmitted(true);
      setContent('');
    } catch (err: any) {
      // 拦截后端的查重报错
      if (err.message && err.message.includes('已经提交过')) {
        setError('您已经留过言了 / You have already submitted feedback');
        setAlreadySubmitted(true);
      } else {
        setError(err.message || '提交失败，请稍后再试 / Submission failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <img src="/LOGO2.png" alt="S.H.I.T." className="w-16 h-16 inline-block mb-4" />
        <h2 className="text-3xl font-serif font-bold mb-2">致各位石友</h2>
        <p className="text-sm text-gray-400">A Letter to Our Community</p>
      </div>

      {/* Announcement */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <div className="font-serif text-charcoal leading-relaxed space-y-4 text-[15px]">
          <p>各位石友：</p>
          <p>说句心里话，我们做这个的初衷最开始真的只是整活。</p>
          <p>但后来发现，原来这里也可以成为大家表达和释放的地方。看着后台涌入的几千的投稿，我们真的被震撼到了。但随之而来的，是内容开始变得有些不可控。所以<strong className="underline decoration-accent-gold decoration-2 underline-offset-4">我们不希望《SHIT》构石变成一个昙花一现的产物，而是真的很希望能够成为我们这一群人的社群</strong>。</p>
          <p>因为有些人真的花了很大的功夫去写稿，我们不希望你们的付出白费。为了让这里能<strong className="underline decoration-accent-gold decoration-2 underline-offset-4">长久、健康地</strong>存在下去，我们目前要做以下几件事：</p>

          <div className="pl-4 border-l-2 border-accent-gold space-y-2">
            <p><span className="font-bold">1</span> <strong className="underline decoration-accent-gold decoration-2 underline-offset-4">完善稿件、评论合规审查机制</strong>：面对不可控的内容增长，我们要建立起有效的保护机制。</p>
            <p><span className="font-bold">2</span> <strong className="underline decoration-accent-gold decoration-2 underline-offset-4">完善评分系统</strong>：尽可能的让大家的稿件受到公平的对待，逐步靠近去中心化，不让好内容被埋没。</p>
            <p><span className="font-bold">3</span> <strong className="underline decoration-accent-gold decoration-2 underline-offset-4">完善功能上的不足</strong>：增加更多的交互和更多的玩法，让社群更有生命力。</p>
          </div>

          <p>目前我们正在全力闭关开发。所以，我们决定先<strong className="underline decoration-accent-gold decoration-2 underline-offset-4">暂时</strong>关闭<strong className="underline decoration-accent-gold decoration-2 underline-offset-4">投稿入口</strong>（不用担心，你们已经投的稿件，后期审核之后都会再上线）和评论功能（后面会接入内容的审核）。暂时的关闭是为了未来更公平、更长久的存在。</p>
          <p><strong className="underline decoration-accent-gold decoration-2 underline-offset-4">SHIT是所有人的SHIT</strong>，如果你有什么建议可以在下方留言，非常感谢！</p>

          <p className="text-right text-gray-500 pt-4">—— 《SHIT》构石 敬上</p>
        </div>
      </div>

      {/* Feedback box */}
      <div className="bg-white border border-gray-200 p-8">
        <h3 className="text-xl font-serif font-bold mb-1">留言板</h3>
        <p className="text-sm text-gray-400 mb-6">Message Board / 您的声音对我们很重要</p>

        {checkingExisting ? (
          <div className="text-center py-8">
            <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse inline-block" />
          </div>
        ) : !user ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🔒</span>
            <p className="font-serif font-bold text-charcoal mb-1">请先登录后留言</p>
            <p className="text-sm text-gray-500 mb-4">Please log in to leave feedback</p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-colors"
            >
              登录 / Log In
            </Link>
          </div>
        ) : submitted || alreadySubmitted ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">✉️</span>
            <p className="font-serif font-bold text-charcoal mb-1">
              {submitted ? '感谢您的留言！' : '您已经留过言了'}
            </p>
            <p className="text-sm text-gray-500">
              {submitted ? 'Thank you for your message!' : 'You have already submitted feedback'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              以 {profile?.display_name ?? user.email} 的身份留言（每人限一条）
            </p>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="请留下您的意见、建议或想法..."
              maxLength={500}
              rows={5}
              className="w-full border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:border-accent-gold transition-colors"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-gray-400">{content.length}/500</span>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || submitting}
                className="px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? '提交中...' : '提交留言 / Submit'}
              </button>
            </div>

            {error && (
              <p className="text-science-red text-xs mt-2 font-bold">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
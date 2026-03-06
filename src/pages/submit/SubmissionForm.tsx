import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StepIndicator } from './StepIndicator';
import { CoAuthorsSection } from './CoAuthorsSection';
// 🔥 彻底删除了 import { ViscositySection } from './ViscositySection';
import { DisciplineSection } from './DisciplineSection';
import { PayloadSection } from './PayloadSection';
import { useSubmissionForm } from './useSubmissionForm';
import { GuidelinesGate } from './GuidelinesGate';

export const SubmissionForm: React.FC = () => {
  const { formData, errors, isSubmitting, isSubmitted, currentStep, updateField, handleSubmit } = useSubmissionForm();
  const [agreed, setAgreed] = useState(false);

  if (isSubmitted) {
    return (
      <div className="text-center py-20">
        <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
        <h2 className="text-3xl font-serif font-bold mb-3">Submitted for Review!</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light mb-6">稿件已提交，等待预审</h3>
        <p className="font-serif text-gray-500 max-w-md mx-auto">
          Your manuscript has been received and is awaiting editorial screening. It will enter the Latrine for blind review once approved.
        </p>
        <p className="chinese-serif text-gray-400 mt-2 mb-8">
          您的稿件已收到，正在等待编辑预审。通过后将进入旱厕接受盲评。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/preprints?zone=latrine"
            className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md"
          >
            Enter Latrine / 进入旱厕
          </Link>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 border border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-widest hover:border-accent-gold hover:text-accent-gold transition-all"
          >
            My Submissions / 我的排泄
          </Link>
        </div>
      </div>
    );
  }

  if (!agreed) {
    return <GuidelinesGate onAgree={() => setAgreed(true)} />;
  }

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold mb-2">Manuscript Submission Portal</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">稿件提交门户</h3>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="space-y-12">
        
        {/* 🚀 1. 基本信息区 */}
        <div id="section-identity" className="bg-white border border-gray-200 p-8">
          <h3 className="text-xl font-serif font-bold text-charcoal mb-6 border-b border-gray-100 pb-4">
            Basic Information / 基本信息
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">
                Manuscript Title / 稿件标题 <span className="text-science-red">*</span>
              </label>
              <input
                type="text"
                value={formData.manuscriptTitle}
                onChange={e => updateField('manuscriptTitle', e.target.value)}
                className={`w-full border ${errors.manuscriptTitle ? 'border-science-red' : 'border-gray-300'} p-3 font-serif focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition-colors`}
                placeholder="Enter the full title of your manuscript"
              />
              {errors.manuscriptTitle && <p className="text-science-red text-xs mt-2 font-bold">{errors.manuscriptTitle}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">
                Contact Email / 联系邮箱 <span className="text-science-red">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                className={`w-full border ${errors.email ? 'border-science-red' : 'border-gray-300'} p-3 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition-colors`}
                placeholder="author@institution.edu"
              />
              {errors.email && <p className="text-science-red text-xs mt-2 font-bold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">
                Submission Topic / 约稿主题
              </label>
              <select
                value={formData.topic}
                onChange={e => updateField('topic', e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">无 / None</option>
                <option value="S.H.I.T社区治理1.0">S.H.I.T 社区治理 1.0 (约稿专题)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🚀 2. Tag 文章分类区（彻底替代原粘度） */}
        <div id="section-tag" className="bg-white border border-gray-200 p-8">
          <h3 className="text-xl font-serif font-bold text-charcoal mb-6 border-b border-gray-100 pb-4">
            Article Tag / 文章分类 <span className="text-science-red">*</span>
          </h3>
          <div className="space-y-4">
            <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${formData.tag === 'hardcore' ? 'border-accent-gold bg-amber-50' : 'border-gray-200 hover:border-accent-gold'}`}>
              <input
                type="radio"
                name="article_tag"
                value="hardcore"
                checked={formData.tag === 'hardcore'}
                onChange={e => updateField('tag', e.target.value)}
                className="mt-1 accent-accent-gold cursor-pointer"
              />
              <div>
                <div className="font-bold text-charcoal">硬核学术 (Hardcore)</div>
                <div className="text-xs text-gray-500 mt-1">披着胡说八道外衣的一本正经学术。格式极其严谨，论证极其离谱，引经据典，论证过程坚不可摧。</div>
              </div>
            </label>
            
            <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${formData.tag === 'meme' ? 'border-accent-gold bg-amber-50' : 'border-gray-200 hover:border-accent-gold'}`}>
              <input
                type="radio"
                name="article_tag"
                value="meme"
                checked={formData.tag === 'meme'}
                onChange={e => updateField('tag', e.target.value)}
                className="mt-1 accent-accent-gold cursor-pointer"
              />
              <div>
                <div className="font-bold text-charcoal">纯享整活 (Meme)</div>
                <div className="text-xs text-gray-500 mt-1">用严格的八股文论文格式包装的纯粹的灵光一闪、科幻设定或学术段子，主打痛快和想象力。</div>
              </div>
            </label>
          </div>
          {errors.tag && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.tag}</p>
          )}
        </div>

        {/* 🚀 3. 共同作者 */}
        <div id="section-coauthors">
          <CoAuthorsSection
            coAuthors={formData.coAuthors}
            onChange={v => updateField('coAuthors', v)}
          />
          {errors.coAuthors && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.coAuthors}</p>
          )}
        </div>

        {/* 🚀 4. 学科 */}
        <div id="section-discipline">
          <DisciplineSection
            discipline={formData.discipline}
            onChange={v => updateField('discipline', v)}
          />
          {errors.discipline && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.discipline}</p>
          )}
        </div>

        {/* 🚀 5. 上传 PDF */}
        <div id="section-payload">
          <PayloadSection
            pdfFile={formData.pdfFile}
            onPdfFileSelect={f => updateField('pdfFile', f)}
          />
          {errors.pdfFile && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.pdfFile}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="pt-6">
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-science-red text-science-red text-sm font-bold">
              {errors.submit}
            </div>
          )}
          <button
            className="w-full py-5 bg-accent-gold text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting... / 提交中...' : 'Submit / 提交排泄'}
            {!isSubmitting && <span className="material-symbols-outlined text-lg">send</span>}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
            By submitting, you agree to our Ethics Guidelines / 提交即表示您同意我们的伦理指南
          </p>
        </div>
      </div>
    </>
  );
};
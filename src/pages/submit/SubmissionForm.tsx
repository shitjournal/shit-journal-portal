import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StepIndicator } from './StepIndicator';
import { IdentitySection } from './IdentitySection';
import { CoAuthorsSection } from './CoAuthorsSection';
import { ViscositySection } from './ViscositySection';
import { PayloadSection } from './PayloadSection';
import { useSubmissionForm } from './useSubmissionForm';
import { GuidelinesGate } from './GuidelinesGate';

export const SubmissionForm: React.FC = () => {
  const { formData, errors, isSubmitting, isSubmitted, currentStep, updateField, handleSubmit } = useSubmissionForm();
  const [agreed, setAgreed] = useState(false);

  if (isSubmitted) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl block mb-6">💩</span>
        <h2 className="text-3xl font-serif font-bold mb-3">Submitted for Review!</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light mb-6">稿件已提交，等待预审</h3>
        <p className="font-serif text-gray-500 max-w-md mx-auto">
          Your manuscript has been received and is awaiting editorial screening. It will appear in the Septic Tank once approved.
        </p>
        <p className="chinese-serif text-gray-400 mt-2 mb-8">
          您的稿件已收到，正在等待编辑预审。通过后将进入化粪池。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/preprints"
            className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md"
          >
            Browse 化粪池 / 浏览化粪池
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
        <div id="section-identity">
          <IdentitySection
            email={formData.email}
            manuscriptTitle={formData.manuscriptTitle}
            authorName={formData.authorName}
            institution={formData.institution}
            socialMedia={formData.socialMedia}
            onEmailChange={v => updateField('email', v)}
            onTitleChange={v => updateField('manuscriptTitle', v)}
            onAuthorNameChange={v => updateField('authorName', v)}
            onInstitutionChange={v => updateField('institution', v)}
            onSocialMediaChange={v => updateField('socialMedia', v)}
          />
          {(errors.authorName || errors.email || errors.manuscriptTitle || errors.institution) && (
            <p className="text-science-red text-xs mt-2 font-bold">
              {errors.authorName || errors.email || errors.manuscriptTitle || errors.institution}
            </p>
          )}
        </div>

        <div id="section-coauthors">
          <CoAuthorsSection
            coAuthors={formData.coAuthors}
            onChange={v => updateField('coAuthors', v)}
          />
          {errors.coAuthors && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.coAuthors}</p>
          )}
        </div>

        <div id="section-viscosity">
          <ViscositySection
            viscosity={formData.viscosity}
            onChange={v => updateField('viscosity', v)}
          />
          {errors.viscosity && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.viscosity}</p>
          )}
        </div>

        <div id="section-payload">
          <PayloadSection
            pdfFile={formData.pdfFile}
            onPdfFileSelect={f => updateField('pdfFile', f)}
          />
          {errors.pdfFile && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.pdfFile}</p>
          )}
        </div>

        {/* Solicited submission checkbox */}
        <div className="bg-amber-50 border border-amber-200">
          <label className="flex items-start gap-3 p-5 cursor-pointer hover:bg-amber-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.solicitedTopic === 'S.H.I.T社区治理1.0'}
              onChange={e => updateField('solicitedTopic', e.target.checked ? 'S.H.I.T社区治理1.0' : null)}
              className="mt-0.5 w-4 h-4 accent-accent-gold cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-charcoal">本稿件为《S.H.I.T社区治理1.0》专题约稿</span>
              <p className="text-xs text-gray-500 mt-1">
                勾选此项表示您的稿件是针对"S.H.I.T 治理公约 1.0：学术去中心化方案"征稿主题撰写的。如非约稿请勿勾选。
              </p>
            </div>
          </label>

          {formData.solicitedTopic && (
            <div className="px-5 pb-5 border-t border-amber-200">
              <h4 className="font-serif font-bold text-charcoal mt-4 mb-2">S.H.I.T 治理公约 1.0：学术去中心化方案征稿</h4>
              <p className="text-xs text-charcoal leading-relaxed mb-3">
                <span className="font-bold">项目背景：</span>本社会实验旨在通过构建一套自运行的评价与治理逻辑，探讨在无行政干预、无传统同行评审（Peer Review）的环境下，学术平权与内容质量自治的可能性。
              </p>
              <p className="text-xs text-science-red leading-relaxed mb-3 font-bold">
                重要提示：本征稿不接受以 AI 为核心的治理方案。我们寻求的是人类社区自治逻辑，而非将决策外包给算法黑箱。
              </p>
              <h5 className="text-xs font-bold text-charcoal mb-2">结构建议：四大核心模块</h5>
              <p className="text-xs text-gray-500 mb-3">我们诚邀各位"嗅探兽"针对以下机制缺陷提交辩稿方案：</p>
              <ol className="space-y-3 text-xs text-charcoal leading-relaxed list-decimal list-inside">
                <li>
                  <span className="font-bold">价值度量模块：贡献度的量化模型</span>
                  <p className="ml-4 mt-1 text-gray-600">研究课题：如何精准定义"排泄者"（创作者）与"嗅探兽"（审稿人）的行为权重？</p>
                  <p className="ml-4 text-gray-500">方案要求：设计一套博弈论模型，量化个人贡献，确保社区话语权随学术输出质量动态调整，而非受身份地位驱动。</p>
                </li>
                <li>
                  <span className="font-bold">见刊判定模块：化粪池自动降解与晋升算法</span>
                  <p className="ml-4 mt-1 text-gray-600">研究课题：稿件如何从预印本（Preprint Reservoir）自动转化为"已见刊"状态？</p>
                  <p className="ml-4 text-gray-500">方案要求：设定"S.H.I.T 分数"的具体加权算法（包含阅读量、争议度、深度评价等），明确自动晋升的阈值。</p>
                </li>
                <li>
                  <span className="font-bold">冲突解决机制：学术不端自动降解系统</span>
                  <p className="ml-4 mt-1 text-gray-600">研究课题：在捍卫学术自由的同时，如何识别并清除真正的毒素？</p>
                  <p className="ml-4 text-gray-500">方案要求：建立一套基于算法的"降解协议"，在无需编辑部介入的前提下，有效识别并处理人身攻击、数据造假或恶意灌水。</p>
                </li>
                <li>
                  <span className="font-bold">资源配置模块：有限资源下的逻辑闭环</span>
                  <p className="ml-4 mt-1 text-gray-600">研究课题：如何在低算力的极端环境下维持系统运行？</p>
                  <p className="ml-4 text-gray-500">方案要求：提供一套自治的社群激励与技术运行方案，防止系统因过载或资源枯萎而崩塌。</p>
                </li>
              </ol>
            </div>
          )}
        </div>

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

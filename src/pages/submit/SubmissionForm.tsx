import React from 'react';
import { Link } from 'react-router-dom';
import { StepIndicator } from './StepIndicator';
import { IdentitySection } from './IdentitySection';
import { CoAuthorsSection } from './CoAuthorsSection';
import { ViscositySection } from './ViscositySection';
import { PayloadSection } from './PayloadSection';
import { useSubmissionForm } from './useSubmissionForm';

const SUBMISSIONS_PAUSED = true;

export const SubmissionForm: React.FC = () => {
  const { formData, errors, isSubmitting, isSubmitted, currentStep, updateField, handleSubmit } = useSubmissionForm();

  if (SUBMISSIONS_PAUSED) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl block mb-6">🚧</span>
        <h2 className="text-3xl font-serif font-bold mb-3">Submissions Temporarily Paused</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light mb-6">投稿暂时关闭</h3>
        <p className="font-serif text-gray-500 max-w-md mx-auto">
          We are upgrading our submission system. Submissions will reopen soon with new formatting requirements.
        </p>
        <p className="chinese-serif text-gray-400 mt-2">
          投稿系统升级中，即将重新开放，届时将提供新的稿件格式要求。
        </p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl block mb-6">💩</span>
        <h2 className="text-3xl font-serif font-bold mb-3">Submission Received!</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light mb-6">稿件已收到！</h3>
        <p className="font-serif text-gray-500 max-w-md mx-auto">
          Your manuscript has been flushed into our Scooper Review pipeline.
          You will receive a confirmation at <strong>{formData.email}</strong>.
        </p>
        <p className="chinese-serif text-gray-400 mt-2 mb-8">
          您的稿件已进入铲屎官评审管道。确认函将发送至您的邮箱。
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-all shadow-md"
        >
          View My Submissions / 查看我的投稿
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold mb-2">Manuscript Submission Portal</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">稿件提交门户</h3>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="space-y-12">
        <div>
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

        <div>
          <CoAuthorsSection
            coAuthors={formData.coAuthors}
            onChange={v => updateField('coAuthors', v)}
          />
          {errors.coAuthors && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.coAuthors}</p>
          )}
        </div>

        <div>
          <ViscositySection
            viscosity={formData.viscosity}
            onChange={v => updateField('viscosity', v)}
          />
          {errors.viscosity && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.viscosity}</p>
          )}
        </div>

        <div>
          <PayloadSection
            file={formData.file}
            onFileSelect={f => updateField('file', f)}
          />
          {errors.file && (
            <p className="text-science-red text-xs mt-2 font-bold">{errors.file}</p>
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
            {isSubmitting ? 'Submitting... / 提交中...' : 'Submit for Peer Review / 提交同行评审'}
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

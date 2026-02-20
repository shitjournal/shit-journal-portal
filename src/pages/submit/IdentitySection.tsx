import React from 'react';

interface Props {
  email: string;
  manuscriptTitle: string;
  authorName: string;
  institution: string;
  socialMedia: string;
  onEmailChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onAuthorNameChange: (value: string) => void;
  onInstitutionChange: (value: string) => void;
  onSocialMediaChange: (value: string) => void;
}

export const IdentitySection: React.FC<Props> = ({
  email, manuscriptTitle, authorName, institution, socialMedia,
  onEmailChange, onTitleChange, onAuthorNameChange, onInstitutionChange, onSocialMediaChange,
}) => (
  <section className="bg-white p-8 border border-gray-200 shadow-sm">
    <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
      <span className="text-2xl font-serif font-bold text-accent-gold">01</span>
      <h4 className="text-lg font-bold uppercase tracking-widest">排便人 / Defecator</h4>
    </div>
    <div className="space-y-6">
      <div>
        <label className="form-label">Name / 笔名 <span className="text-gray-400 text-xs normal-case tracking-normal">（通讯作者，不建议用真名）</span></label>
        <input
          className="form-input"
          placeholder="e.g. 拉屎侠"
          type="text"
          value={authorName}
          onChange={e => onAuthorNameChange(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label">Email / 邮箱</label>
        <input
          className="form-input"
          placeholder="e.g. your.shit@email.com"
          type="email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label">Manuscript Title / 论文题目</label>
        <input
          className="form-input"
          placeholder="Enter your full manuscript title / 请输入完整论文题目"
          type="text"
          value={manuscriptTitle}
          onChange={e => onTitleChange(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label">Institution / 单位</label>
        <input
          className="form-input"
          placeholder="e.g. 屎壳郎大学"
          type="text"
          value={institution}
          onChange={e => onInstitutionChange(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label">Social Media / 社交媒体 <span className="text-gray-400 text-xs normal-case tracking-normal">（选填，如抖音号等，发表时如需tag出来请填写）</span></label>
        <input
          className="form-input"
          placeholder="e.g. 抖音号 / 小红书号 / Twitter handle"
          type="text"
          value={socialMedia}
          onChange={e => onSocialMediaChange(e.target.value)}
        />
      </div>
    </div>
  </section>
);

import React from 'react';

interface Props {
  email: string;
  manuscriptTitle: string;
  onEmailChange: (value: string) => void;
  onTitleChange: (value: string) => void;
}

export const IdentitySection: React.FC<Props> = ({ email, manuscriptTitle, onEmailChange, onTitleChange }) => (
  <section className="bg-white p-8 border border-gray-200 shadow-sm">
    <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
      <span className="text-2xl font-serif font-bold text-accent-gold">01</span>
      <h4 className="text-lg font-bold uppercase tracking-widest">Identity / 身份识别</h4>
    </div>
    <div className="space-y-6">
      <div>
        <label className="form-label">Email / 邮箱</label>
        <input
          className="form-input"
          placeholder="e.g. academic.trash@university.edu"
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
    </div>
  </section>
);

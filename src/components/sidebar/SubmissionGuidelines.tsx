import React from 'react';

export const SubmissionGuidelines: React.FC = () => (
  <div className="bg-white border border-gray-200 p-6">
    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">Submission Guidelines / 投稿指南</h3>
    <div className="space-y-4">
      <div>
        <h4 className="text-[11px] font-bold uppercase text-charcoal">Originality / 原创性</h4>
        <p className="text-xs text-gray-500 font-serif leading-relaxed">Manuscripts must contain at least 80% raw, unrefined academic waste. / 稿件必须包含至少80%的原始、未加工的学术废料。</p>
      </div>
      <div>
        <h4 className="text-[11px] font-bold uppercase text-charcoal">Review Process / 评审流程</h4>
        <p className="text-xs text-gray-500 font-serif leading-relaxed">Our 'Scooper Review' typically takes 2-4 flushes. / 我们的"铲屎官评审"通常需要2-4次冲水的时间。</p>
      </div>
    </div>
  </div>
);

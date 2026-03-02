import React from 'react';
import { DISCIPLINE_LABELS } from '../../lib/constants';
import type { Discipline } from '../../lib/constants';

interface Props {
  discipline: string;
  onChange: (value: string) => void;
}

const DISCIPLINES = Object.entries(DISCIPLINE_LABELS) as [Discipline, { en: string; cn: string }][];

export const DisciplineSection: React.FC<Props> = ({ discipline, onChange }) => (
  <section className="bg-white p-8 border border-gray-200 shadow-sm">
    <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
      <span className="text-2xl font-serif font-bold text-accent-gold">03</span>
      <h4 className="text-lg font-bold uppercase tracking-widest">Discipline / 学科分类</h4>
    </div>
    <div>
      <label className="form-label">Select Discipline / 选择学科</label>
      <select
        value={discipline}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-accent-gold bg-white cursor-pointer"
      >
        <option value="" disabled>请选择学科 / Select discipline</option>
        {DISCIPLINES.map(([key, label]) => (
          <option key={key} value={key}>{label.cn} / {label.en}</option>
        ))}
      </select>
    </div>
  </section>
);

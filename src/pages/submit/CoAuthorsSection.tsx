import React from 'react';

export interface CoAuthor {
  name: string;
  email: string;
  institution: string;
  contribution: 'co-first' | 'other';
}

interface Props {
  coAuthors: CoAuthor[];
  onChange: (coAuthors: CoAuthor[]) => void;
}

const emptyCoAuthor = (): CoAuthor => ({
  name: '',
  email: '',
  institution: '',
  contribution: 'other',
});

export const CoAuthorsSection: React.FC<Props> = ({ coAuthors, onChange }) => {
  const updateCoAuthor = (index: number, field: keyof CoAuthor, value: string) => {
    const updated = coAuthors.map((a, i) =>
      i === index ? { ...a, [field]: value } : a
    );
    onChange(updated);
  };

  const addCoAuthor = () => onChange([...coAuthors, emptyCoAuthor()]);

  const removeCoAuthor = (index: number) =>
    onChange(coAuthors.filter((_, i) => i !== index));

  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm">
      <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
        <span className="text-2xl font-serif font-bold text-accent-gold">01.5</span>
        <h4 className="text-lg font-bold uppercase tracking-widest">其他排便者 / Co-Defecators</h4>
      </div>

      {coAuthors.length === 0 && (
        <p className="text-sm text-gray-400 chinese-serif mb-6">暂未添加共同作者 / No co-authors added yet</p>
      )}

      <div className="space-y-6">
        {coAuthors.map((author, idx) => (
          <div key={idx} className="relative border border-gray-100 bg-gray-50 p-6 pt-8">
            <button
              type="button"
              onClick={() => removeCoAuthor(idx)}
              className="absolute top-2 right-3 text-gray-400 hover:text-science-red transition-colors text-lg font-bold cursor-pointer"
              title="删除此作者"
            >
              ×
            </button>
            <span className="absolute top-2 left-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Co-Author #{idx + 1}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name / 姓名</label>
                <input
                  className="form-input"
                  placeholder="姓名"
                  type="text"
                  value={author.name}
                  onChange={e => updateCoAuthor(idx, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Email / 邮箱</label>
                <input
                  className="form-input"
                  placeholder="email@example.com"
                  type="email"
                  value={author.email}
                  onChange={e => updateCoAuthor(idx, 'email', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Institution / 单位</label>
                <input
                  className="form-input"
                  placeholder="单位"
                  type="text"
                  value={author.institution}
                  onChange={e => updateCoAuthor(idx, 'institution', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Contribution / 贡献度</label>
                <select
                  className="form-input"
                  value={author.contribution}
                  onChange={e => updateCoAuthor(idx, 'contribution', e.target.value)}
                >
                  <option value="co-first">共同第一作者 / Co-first Author</option>
                  <option value="other">其他贡献者 / Other Contributor</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCoAuthor}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-gray-300 text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-accent-gold hover:text-accent-gold transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Add Co-Author / 添加共同作者
      </button>
    </section>
  );
};

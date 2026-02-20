import React from 'react';

interface Props {
  viscosity: string;
  onChange: (value: string) => void;
}

export const ViscositySection: React.FC<Props> = ({ viscosity, onChange }) => (
  <section className="bg-white p-8 border border-gray-200 shadow-sm">
    <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
      <span className="text-2xl font-serif font-bold text-accent-gold">02</span>
      <h4 className="text-lg font-bold uppercase tracking-widest">Viscosity Check / 粘度核验</h4>
    </div>
    <div>
      <label className="form-label">Select Viscosity / 选择粘度</label>
      <select
        className="form-input appearance-none cursor-pointer"
        value={viscosity}
        onChange={e => onChange(e.target.value)}
      >
        <option disabled value="">Please select / 请选择</option>
        <option value="stringy">Stringy / 拉丝</option>
        <option value="semi">Semi-solidified / 半凝固</option>
        <option value="high-entropy">High-Entropy Residue / 高熵残余</option>
      </select>
    </div>
  </section>
);

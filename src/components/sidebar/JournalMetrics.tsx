import React from 'react';
import { METRICS } from '../../constants';

export const JournalMetrics: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const metrics = compact
    ? METRICS.filter(m => m.label === 'IMPACT FACTOR' || m.label === 'REJECTION RATE')
    : METRICS;

  if (compact) {
    return (
      <div className="bg-gray-50 p-6 border border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-200 pb-2">Journal Metrics / 期刊指标</h3>
        <div className="grid grid-cols-2 gap-6">
          {metrics.map((metric, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                {metric.label} / {metric.labelCn}
              </p>
              <p className="text-2xl font-serif font-bold text-charcoal">
                {metric.value}{metric.unit && <span className="text-xs font-normal text-gray-300 ml-1">{metric.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <div className="border-b border-gray-200 pb-1 mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Journal Metrics / 期刊指标</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-10 gap-x-4 max-w-xs mx-auto lg:max-w-none lg:mx-0">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {metric.label} / {metric.labelCn}
            </p>
            <p className="text-3xl font-serif font-bold text-charcoal">
              {metric.value} {metric.unit && <span className="text-xs font-normal text-gray-300 ml-1">{metric.unit}</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

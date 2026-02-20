import React from 'react';

const STEPS = [
  { num: 1, label: 'Identity / 身份识别' },
  { num: 2, label: 'Viscosity / 粘度核验' },
  { num: 3, label: 'Payload / 载荷上传' },
];

export const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-16 max-w-3xl mx-auto">
    {STEPS.map((step, idx) => (
      <React.Fragment key={step.num}>
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold bg-white mb-2 ${currentStep >= step.num ? 'step-active' : 'step-inactive'}`}>
            {step.num}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${currentStep >= step.num ? '' : 'text-gray-400'}`}>
            {step.label}
          </span>
        </div>
        {idx < STEPS.length - 1 && <div className="h-[1px] bg-gray-300 flex-grow mb-6" />}
      </React.Fragment>
    ))}
  </div>
);

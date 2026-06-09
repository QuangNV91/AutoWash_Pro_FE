import React from 'react';

const steps = [
  { id: 1, label: 'Chọn dịch vụ' },
  { id: 2, label: 'Thời gian' },
  { id: 3, label: 'Xác nhận' }
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-dark-800 -z-10 -translate-y-1/2"></div>
        
        {/* Active connecting line */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-gold-500 -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${isActive ? 'bg-gold-500 text-dark-950 shadow-[0_0_15px_rgba(201,152,26,0.4)]' : 
                    isCompleted ? 'bg-gold-500/20 text-gold-500 border border-gold-500' : 
                    'bg-dark-800 text-text-muted border border-dark-600'}
                `}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              <span 
                className={`mt-2 text-xs font-semibold uppercase tracking-wider
                  ${isActive ? 'text-gold-500' : isCompleted ? 'text-text-primary' : 'text-text-muted'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

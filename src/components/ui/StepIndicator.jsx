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
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10 -translate-y-1/2"></div>
        
        {/* Active connecting line */}
        <div 
          className="absolute top-1/2 left-0 h-[1px] bg-white -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300
                  ${isActive ? 'bg-white text-black' : 
                    isCompleted ? 'bg-black text-white border border-white' : 
                    'bg-black text-white/40 border border-white/10'}
                `}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              <span 
                className={`mt-2 text-xs font-medium uppercase tracking-wider
                  ${isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/40'}
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

interface StepIndicatorProps {
  steps: ReadonlyArray<{ id: string; label: string }>;
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-slate-500">
        <span>Journey Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold text-slate-600">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center gap-1">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                index <= currentStep
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-slate-300 text-slate-500"
              }`}
            >
              {index + 1}
            </span>
            <span className="hidden sm:block">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

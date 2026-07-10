"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepIndicatorItem {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
}

interface FormStepIndicatorProps<T extends string = string> {
  steps: Array<StepIndicatorItem & { id: T }>;
  currentStep: T;
  completedSteps: T[];
  onStepClick?: (step: T) => void;
}

export function FormStepIndicator<T extends string = string>({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: FormStepIndicatorProps<T>) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable =
            Boolean(onStepClick) && (isCompleted || index <= currentIndex);

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "group flex min-w-0 flex-1 flex-col items-center gap-2 text-center transition-opacity",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-outfit font-light transition-all",
                    isCurrent
                      ? "border-tl-gold bg-tl-gold text-tl-black shadow-[0_0_20px_rgba(214,181,133,0.35)]"
                      : isCompleted
                        ? "border-tl-gold/60 bg-tl-gold/15 text-tl-gold"
                        : "border-tl-gold/20 bg-[#0a0a0a] text-tl-beige/40",
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:block">
                  <span
                    className={cn(
                      "block font-outfit font-light text-[10px] uppercase tracking-[0.14em]",
                      isCurrent ? "text-tl-gold" : "text-tl-beige/50",
                    )}
                  >
                    {step.shortLabel}
                  </span>
                </span>
              </button>
              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 h-px flex-1 transition-colors sm:mx-2",
                    index < currentIndex ? "bg-tl-gold/50" : "bg-tl-gold/15",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="text-center font-outfit font-light text-xs text-tl-beige/55 sm:text-left">
        Paso {currentIndex + 1} de {steps.length} —{" "}
        <span className="text-tl-beige/80">
          {steps[currentIndex]?.description}
        </span>
      </p>
    </div>
  );
}

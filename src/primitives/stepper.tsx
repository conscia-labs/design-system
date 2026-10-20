import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "./utils";

type StepperStep = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
};

type StepperStepState = "complete" | "current" | "upcoming";

type StepperProps = Omit<React.ComponentProps<"ol">, "children"> & {
  steps: readonly StepperStep[];
  /** Zero-based index of the current step. Use `steps.length` when every step is complete. */
  currentStep: number;
  orientation?: "horizontal" | "vertical";
};

const stateLabels: Record<StepperStepState, string> = {
  complete: "completed",
  current: "current step",
  upcoming: "upcoming",
};

/**
 * Progress through a wizard or multi-step dialog. Completed, current, and
 * upcoming steps are distinguished by marker, weight, and announced state, not
 * by color alone.
 */
function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  const vertical = orientation === "vertical";

  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(vertical ? "grid" : "flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state: StepperStepState =
          index < currentStep ? "complete" : index === currentStep ? "current" : "upcoming";
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            data-slot="stepper-step"
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn(
              "group/step min-w-0",
              vertical ? "grid grid-cols-[auto_minmax(0,1fr)] gap-x-3" : "flex flex-1 items-center gap-2 last:flex-none",
            )}
          >
            <span className={cn(vertical && "flex flex-col items-center")}>
              <span
                data-slot="stepper-marker"
                aria-hidden="true"
                className={cn(
                  "ds-type-metadata flex size-6 shrink-0 items-center justify-center rounded-full border font-semibold tabular-nums",
                  state === "complete" && "border-action bg-action text-action-foreground",
                  state === "current" && "border-2 border-selection-indicator bg-selection-background text-selection-foreground",
                  state === "upcoming" && "border-border-strong bg-canvas text-text-supporting",
                )}
              >
                {state === "complete" ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              {vertical && !isLast ? (
                <span
                  aria-hidden="true"
                  data-slot="stepper-connector"
                  className={cn("my-1 min-h-4 w-px flex-1", state === "complete" ? "bg-action" : "bg-border-default")}
                />
              ) : null}
            </span>
            <span
              className={cn(
                "min-w-0",
                vertical ? "pb-5 pt-0.5 group-last/step:pb-0" : state !== "current" && "max-sm:sr-only",
              )}
            >
              <span
                data-slot="stepper-label"
                className={cn(
                  "ds-type-ui block truncate",
                  state === "current" ? "font-semibold text-text-primary" : state === "complete" ? "text-text-primary" : "text-text-supporting",
                )}
              >
                {step.label}
                <span className="sr-only">, {stateLabels[state]}</span>
              </span>
              {step.description ? (
                <span data-slot="stepper-description" className="ds-type-metadata block text-text-supporting">
                  {step.description}
                </span>
              ) : null}
            </span>
            {!vertical && !isLast ? (
              <span
                aria-hidden="true"
                data-slot="stepper-connector"
                className={cn("h-px min-w-4 flex-1", state === "complete" ? "bg-action" : "bg-border-default")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
export type { StepperProps, StepperStep, StepperStepState };

"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";

import { cn } from "./utils";

type ProgressProps = Omit<React.ComponentProps<typeof BaseProgress.Root>, "children" | "value"> & {
  /** Completed amount between `min` and `max`. Omit or pass `null` while the amount is unknown. */
  value?: number | null;
  /** Visible name of the task. Without it, pass `aria-label`. */
  label?: React.ReactNode;
  /** Shows the formatted percentage beside the label. */
  showValue?: boolean;
  size?: "sm" | "default";
};

/**
 * Progress of a running task. For a static measurement such as quota used,
 * use ValueMeter.
 */
function Progress({ value = null, label, showValue = false, size = "default", className, "aria-labelledby": ariaLabelledBy, ...props }: ProgressProps) {
  // Base UI links the label after mount; our own id names the bar in server HTML too.
  const labelId = React.useId();
  return (
    <BaseProgress.Root data-slot="progress" aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)} value={value} className={cn("grid gap-2", className)} {...props}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-4 text-sm">
          {label ? <BaseProgress.Label id={labelId} data-slot="progress-label" className="font-medium text-text-primary">{label}</BaseProgress.Label> : <span />}
          {showValue ? <BaseProgress.Value data-slot="progress-value" className="tabular-nums text-text-supporting" /> : null}
        </div>
      ) : null}
      <BaseProgress.Track
        data-slot="progress-track"
        data-size={size}
        className="overflow-hidden rounded-full bg-surface-muted data-[size=default]:h-2 data-[size=sm]:h-1"
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className="h-full rounded-full bg-action transition-[width] duration-[var(--ds-duration-slow)] ease-standard data-indeterminate:w-2/5 data-indeterminate:animate-[ds-progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:data-indeterminate:animate-none"
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export { Progress };
export type { ProgressProps };

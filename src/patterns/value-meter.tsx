import * as React from "react";

import { cn } from "../primitives/utils";

type ValueMeterProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: number;
  maximum?: number | null;
  valueLabel?: React.ReactNode;
  detail?: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
};

function ValueMeter({
  label,
  value,
  maximum,
  valueLabel,
  detail,
  tone = "neutral",
  className,
  ...props
}: ValueMeterProps) {
  const labelId = React.useId();
  const hasMaximum = typeof maximum === "number" && maximum > 0;
  const boundedValue = hasMaximum
    ? Math.min(maximum, Math.max(0, value))
    : value;
  const percentage = hasMaximum
    ? (boundedValue / maximum) * 100
    : null;
  const resolvedValueLabel =
    valueLabel ??
    (hasMaximum ? `${boundedValue} of ${maximum}` : String(boundedValue));

  return (
    <div
      data-slot="value-meter"
      className={cn("grid gap-2", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span id={labelId} className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{resolvedValueLabel}</span>
      </div>
      {percentage === null ? null : (
        <div
          role="progressbar"
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={maximum ?? undefined}
          aria-valuenow={boundedValue}
          className="h-2 overflow-hidden rounded-full bg-surface-muted"
        >
          <div
            className={cn(
              "h-full rounded-full bg-neutral-foreground transition-[width]",
              tone === "success" && "bg-success-foreground",
              tone === "warning" && "bg-warning-foreground",
              tone === "danger" && "bg-danger-foreground",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {detail ? <div className="text-xs text-muted-foreground">{detail}</div> : null}
    </div>
  );
}

export { ValueMeter };
export type { ValueMeterProps };

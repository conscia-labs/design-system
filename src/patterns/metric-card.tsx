import * as React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Skeleton } from "../primitives/skeleton";
import { cn } from "../primitives/utils";

type MetricTrendProps = React.ComponentProps<"span"> & {
  direction: "up" | "down" | "flat";
  sentiment?: "positive" | "negative" | "neutral";
  value: React.ReactNode;
  accessibleLabel: string;
};

function MetricTrend({
  direction,
  sentiment = "neutral",
  value,
  accessibleLabel,
  className,
  ...props
}: MetricTrendProps) {
  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;

  return (
    <span
      data-slot="metric-trend"
      data-direction={direction}
      data-sentiment={sentiment}
      role="img"
      aria-label={accessibleLabel}
      className={cn(
        "inline-flex items-center gap-1 ds-type-metadata font-medium text-trend-neutral",
        sentiment === "positive" && "text-trend-positive",
        sentiment === "negative" && "text-trend-negative",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="size-3.5 stroke-[2]" />
      <span aria-hidden="true">{value}</span>
    </span>
  );
}

type MetricCardBaseProps = React.ComponentProps<"section"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;
  unit?: React.ReactNode;
  trend?: React.ReactNode;
  status?: React.ReactNode;
  emphasis?: "primary" | "supporting";
  loading?: boolean;
};

type MetricCardProps = MetricCardBaseProps &
  (
    | { visualization?: undefined; visualizationSummary?: never }
    | { visualization: React.ReactNode; visualizationSummary: string }
  );

function MetricCard({
  label,
  description,
  value,
  unit,
  trend,
  status,
  emphasis = "supporting",
  loading = false,
  visualization,
  visualizationSummary,
  className,
  ...props
}: MetricCardProps) {
  const labelId = React.useId();

  return (
    <section
      data-slot="metric-card"
      data-emphasis={emphasis}
      aria-labelledby={labelId}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-surface text-text-primary shadow-[var(--ds-shadow-raised)]",
        emphasis === "primary" ? "min-h-80" : "min-h-40",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4 px-[var(--ds-surface-padding)] pt-[var(--ds-surface-padding)]">
        <div className="min-w-0">
          <h2 id={labelId} className="ds-type-card-title">{label}</h2>
          {description ? <p className="ds-type-metadata mt-0.5 text-text-supporting">{description}</p> : null}
        </div>
        {status ? <div className="shrink-0">{status}</div> : null}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-[var(--ds-surface-padding)] pt-3">
        {loading ? (
          <Skeleton className={cn("h-8", emphasis === "primary" ? "w-24" : "w-16")} />
        ) : (
          <>
            <span className={cn("font-semibold tabular-nums tracking-tight", emphasis === "primary" ? "text-4xl" : "text-2xl")}>
              {value ?? 0}
            </span>
            {unit ? <span className="ds-type-ui text-text-supporting">{unit}</span> : null}
          </>
        )}
        {trend ? <div className="ml-1">{trend}</div> : null}
      </div>
      {visualization ? (
        <figure className="mt-auto min-h-0 flex-1 pt-4">
          <div data-slot="metric-card-visualization" className="h-full min-h-20 w-full">{visualization}</div>
          <figcaption className="sr-only">{visualizationSummary}</figcaption>
        </figure>
      ) : null}
    </section>
  );
}

export { MetricCard, MetricTrend };
export type { MetricCardProps, MetricTrendProps };

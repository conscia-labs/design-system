import * as React from "react";

import { Skeleton } from "../primitives/skeleton";
import { cn } from "../primitives/utils";

type MetricBandProps = React.ComponentProps<"div"> & {
  columns?: 2 | 3 | 4 | 5;
};

function MetricBand({ columns = 4, className, ...props }: MetricBandProps) {
  return (
    <div
      data-slot="metric-band"
      data-columns={columns}
      className={cn(
        "grid grid-cols-2 border-b border-border-subtle",
        columns === 2 && "lg:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        columns === 5 && "lg:grid-cols-5",
        className,
      )}
      {...props}
    />
  );
}

type MetricBandItemProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  detail?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  loading?: boolean;
};

function MetricBandItem({
  label,
  value,
  detail,
  icon,
  iconClassName,
  loading = false,
  className,
  ...props
}: MetricBandItemProps) {
  return (
    <div
      data-slot="metric-band-item"
      className={cn(
        "flex min-h-28 flex-col items-start gap-3 border-r border-border-subtle p-4 last:border-r-0 sm:flex-row sm:items-center sm:gap-4 sm:p-5",
        "[&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md bg-neutral-background text-neutral-foreground [&_svg]:size-5",
            iconClassName,
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className="grid min-w-0 gap-1">
        <div className="ds-type-ui text-text-supporting">{label}</div>
        {loading ? (
          <Skeleton className="h-7 w-14" />
        ) : (
          <div className="text-2xl font-semibold tracking-tight">{value ?? 0}</div>
        )}
        {detail ? (
          <div className="ds-type-metadata text-text-supporting">
            {detail}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { MetricBand, MetricBandItem };
export type { MetricBandItemProps, MetricBandProps };

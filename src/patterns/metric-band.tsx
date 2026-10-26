import * as React from "react";

import { Skeleton } from "../primitives/skeleton";
import { cn } from "../primitives/utils";

type MetricBandProps = React.ComponentProps<"div"> & {
  columns?: 2 | 3 | 4 | 5;
  presentation?: "default" | "compact";
};

type MetricBandPresentation = NonNullable<MetricBandProps["presentation"]>;

const MetricBandPresentationContext = React.createContext<MetricBandPresentation>("default");

function MetricBand({
  columns = 4,
  presentation = "default",
  className,
  children,
  ...props
}: MetricBandProps) {
  const columnClasses = cn(
    columns === 2 && "lg:grid-cols-2",
    columns === 3 && "lg:grid-cols-3",
    columns === 4 && "lg:grid-cols-4",
    columns === 5 && "lg:grid-cols-5",
  );

  return (
    <MetricBandPresentationContext.Provider value={presentation}>
      <div
        data-slot="metric-band"
        data-columns={columns}
        data-presentation={presentation === "compact" ? "compact" : undefined}
        className={cn(
          presentation === "compact"
            ? cn("grid grid-cols-1 border-b border-border-subtle", columnClasses)
            : cn("grid grid-cols-2 border-b border-border-subtle", columnClasses),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </MetricBandPresentationContext.Provider>
  );
}

type MetricBandItemProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  detail?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  loading?: boolean;
  /**
   * Shown in a quiet style when the value is missing, such as "Never" or "Not
   * reported". Defaults to an em dash announced as "Unavailable". Pass
   * `value={null}` to mark a value missing in the default presentation, where
   * an omitted value still renders 0.
   */
  emptyValue?: React.ReactNode;
};

function MetricBandEmptyValue({ children }: { children?: React.ReactNode }) {
  return (
    <span data-slot="metric-band-empty-value" className="ds-type-ui font-medium text-text-muted">
      {children ?? <span aria-label="Unavailable">—</span>}
    </span>
  );
}

function MetricBandItem({
  label,
  value,
  detail,
  icon,
  iconClassName,
  loading = false,
  emptyValue,
  className,
  ...props
}: MetricBandItemProps) {
  const isEmpty = value === null || value === undefined;
  const presentation = React.useContext(MetricBandPresentationContext);

  if (presentation === "compact") {
    return (
      <div
        data-slot="metric-band-item"
        data-presentation="compact"
        className={cn(
          "grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] items-center gap-x-3 gap-y-1 border-b border-border-subtle px-4 py-3 last:border-b-0",
          "lg:flex lg:min-h-32 lg:flex-col lg:items-start lg:justify-center lg:gap-1 lg:border-b-0 lg:border-r lg:px-5 lg:py-4 lg:last:border-r-0",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-2 lg:items-start">
          {icon ? (
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center text-text-supporting [&_svg]:size-4",
                iconClassName,
              )}
            >
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <div className="ds-type-ui break-words text-text-supporting">{label}</div>
            {detail ? (
              <div className="ds-type-metadata mt-0.5 break-words text-text-supporting">
                {detail}
              </div>
            ) : (
              <div aria-hidden="true" className="ds-type-metadata mt-0.5 hidden min-h-[1lh] lg:block" />
            )}
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-6 w-14 justify-self-end lg:justify-self-start" />
        ) : (
          <div className="flex min-h-[1.5625rem] min-w-0 max-w-full items-center justify-end break-words text-right ds-type-metric-value text-xl leading-tight text-text-primary lg:justify-start lg:text-left">
            {isEmpty ? <MetricBandEmptyValue>{emptyValue}</MetricBandEmptyValue> : value}
          </div>
        )}
      </div>
    );
  }

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
          <div className="ds-type-metric-value flex min-h-8 items-center text-2xl">
            {/* An omitted value keeps the 1.x zero fallback; null or emptyValue marks it missing. */}
            {value === undefined && emptyValue === undefined
              ? 0
              : isEmpty
                ? <MetricBandEmptyValue>{emptyValue}</MetricBandEmptyValue>
                : value}
          </div>
        )}
        {/* The detail line is reserved so values share a baseline across items. */}
        <div aria-hidden={detail ? undefined : true} className="ds-type-metadata min-h-[1lh] text-text-supporting">
          {detail}
        </div>
      </div>
    </div>
  );
}

export { MetricBand, MetricBandItem };
export type { MetricBandItemProps, MetricBandProps };

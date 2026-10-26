import * as React from "react";

import { cn } from "../primitives/utils";

type StateViewProps = React.ComponentProps<"div"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  /**
   * `compact` suits empty states inside a section, panel, or tab; `default`
   * suits a state that replaces a page's primary content.
   */
  size?: "default" | "compact";
  /** Adds a bottom divider, for a state that replaces rows inside a table body. */
  divider?: boolean;
  /**
   * Colors the icon spot. `brand` suits empty and first-run states,
   * `success` a completed flow, `neutral` a quiet inline state, and `danger`
   * is set by ErrorState.
   */
  tone?: "brand" | "neutral" | "success" | "danger";
};

function StateView({
  title,
  description,
  action,
  icon,
  size = "default",
  divider = false,
  tone = "brand",
  className,
  ...props
}: StateViewProps) {
  const compact = size === "compact";

  return (
    <div
      data-slot="state-view"
      data-size={size}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "min-h-72 gap-3 px-6 py-12",
        divider && "border-b border-border-subtle",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          data-slot="state-view-spot"
          data-tone={tone}
          data-size={size}
          aria-hidden="true"
          className={cn(compact ? "size-9 [&_svg]:size-4" : "my-[1.125rem] size-14 [&_svg]:size-6")}
        >
          {icon}
        </div>
      ) : null}
      <h2 className={compact ? "ds-type-card-title" : "ds-type-section-title"}>{title}</h2>
      {description ? <p className="ds-type-ui max-w-md text-text-supporting">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

function LoadingRows({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div data-slot="loading-rows" className="border-b">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid h-[var(--ds-row-height)] items-center gap-4 border-b px-5 last:border-b-0"
          style={{ gridTemplateColumns: `2fr repeat(${Math.max(columns - 1, 1)}, minmax(5rem, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <div
              key={columnIndex}
              className={cn(
                "h-3 rounded bg-surface-muted",
                columnIndex === 0 ? "w-44" : "w-24",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ErrorState({ title, description, action, tone = "danger", className, ...props }: StateViewProps) {
  return (
    <StateView
      title={title}
      description={description}
      action={action}
      tone={tone}
      className={cn("bg-danger-background/60", className)}
      role="alert"
      aria-live="assertive"
      {...props}
    />
  );
}

export { ErrorState, LoadingRows, StateView };
export type { StateViewProps };

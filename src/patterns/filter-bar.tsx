import * as React from "react";

import { Button } from "../primitives/button";
import { cn } from "../primitives/utils";

type FilterBarProps = React.ComponentProps<"div"> & {
  clearAllLabel?: string;
  onClearAll?: () => void;
};

function FilterBar({
  children,
  clearAllLabel = "Clear all",
  className,
  onClearAll,
  ...props
}: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-2 rounded-[var(--ds-radius-control)] border border-border-subtle bg-surface-muted/60 px-2 py-1.5",
        className,
      )}
      role="group"
      aria-label={props["aria-label"] ?? "Active filters"}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{children}</div>
      {onClearAll ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClearAll} className="shrink-0">
          {clearAllLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { FilterBar };
export type { FilterBarProps };

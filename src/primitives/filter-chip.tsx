import * as React from "react";
import { XIcon } from "lucide-react";

import { IconButton } from "./button";
import { cn } from "./utils";

type FilterChipProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  value?: React.ReactNode;
};

function FilterChip({
  className,
  label,
  onRemove,
  removeLabel,
  value,
  ...props
}: FilterChipProps) {
  const fallbackRemoveLabel = typeof label === "string" ? `Remove ${label} filter` : "Remove filter";

  return (
    <div
      data-slot="filter-chip"
      className={cn(
        "inline-flex min-w-0 max-w-full items-center gap-1 rounded-full border border-border-default bg-surface-muted px-2 py-1 text-sm text-foreground",
        className,
      )}
      {...props}
    >
      <span className="shrink-0 text-muted-foreground">{label}</span>
      {value !== undefined ? <span className="min-w-0 truncate font-medium">{value}</span> : null}
      {onRemove ? (
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label={removeLabel ?? fallbackRemoveLabel}
          onClick={onRemove}
          className="-mr-1 size-5 rounded-full text-muted-foreground hover:bg-surface-control-hover hover:text-foreground"
        >
          <XIcon aria-hidden="true" className="size-3" />
        </IconButton>
      ) : null}
    </div>
  );
}

export { FilterChip };
export type { FilterChipProps };

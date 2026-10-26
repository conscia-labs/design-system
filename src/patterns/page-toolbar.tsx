import * as React from "react";

import { cn } from "../primitives/utils";

type PageToolbarProps = React.ComponentProps<"div"> & {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  viewControls?: React.ReactNode;
  bulkActions?: React.ReactNode;
};

function PageToolbar({
  search,
  filters,
  viewControls,
  bulkActions,
  className,
  children,
  ...props
}: PageToolbarProps) {
  const hasStart = Boolean(search || filters);
  const hasEnd = Boolean(bulkActions || viewControls || hasChildren(children));

  if (!hasStart && !hasEnd) return null;

  return (
    <div
      data-slot="page-toolbar"
      className={cn(
        // Inside a Card or InventorySurface the toolbar sits on the card surface.
        "grid gap-2 border-b border-border-subtle bg-canvas in-data-[slot=card]:bg-transparent in-data-[slot=inventory-surface]:bg-transparent px-[var(--ds-frame-content-inset,var(--ds-frame-padding-x))] py-3",
        hasStart && hasEnd && "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
        className,
      )}
      {...props}
    >
      {hasStart ? (
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {search ? <div className="min-w-0 flex-1 sm:min-w-48 sm:max-w-sm">{search}</div> : null}
          {filters ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">{filters}</div> : null}
        </div>
      ) : null}
      {hasEnd ? (
        <div className={cn("flex min-h-[var(--ds-control-height)] flex-wrap items-center gap-2", hasStart && "lg:justify-end")}>
          {bulkActions ? (
            <div data-slot="page-toolbar-bulk-actions" className="contents">
              {bulkActions}
            </div>
          ) : null}
          {viewControls}
          {children}
        </div>
      ) : null}
    </div>
  );
}

function hasChildren(children: React.ReactNode) {
  return React.Children.toArray(children).length > 0;
}

export { PageToolbar };
export type { PageToolbarProps };

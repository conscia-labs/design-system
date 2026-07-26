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
  return (
    <div
      data-slot="page-toolbar"
      className={cn("grid gap-2 border-b border-border-subtle bg-background px-5 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        {search ? <div className="min-w-0 flex-1 sm:min-w-48 sm:max-w-sm">{search}</div> : null}
        {filters ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">{filters}</div> : null}
      </div>
      <div className="flex min-h-[var(--ds-control-height)] flex-wrap items-center gap-2 lg:justify-end">
        {bulkActions ? (
          <div data-slot="page-toolbar-bulk-actions" className="contents">
            {bulkActions}
          </div>
        ) : null}
        {viewControls}
        {children}
      </div>
    </div>
  );
}

export { PageToolbar };
export type { PageToolbarProps };

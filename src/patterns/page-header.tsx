import * as React from "react";

import { cn } from "../primitives/utils";

type PageHeaderProps = React.ComponentProps<"header"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * Temporary compatibility prop for migrated Admin UI pages.
   * New implementations should pass an explicit actions node.
   */
  action?: {
    label: string;
    href: string;
  };
  /**
   * Temporary compatibility prop for migrated Admin UI pages.
   * New implementations should use actions.
   */
  actionNode?: React.ReactNode;
};

function PageHeader({
  title,
  description,
  status,
  metadata,
  actions,
  action,
  actionNode,
  className,
  ...props
}: PageHeaderProps) {
  const resolvedActions =
    actions ??
    actionNode ??
    (action ? (
      <a
        className="inline-flex h-[var(--ds-control-height)] items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-xs outline-none transition-colors hover:bg-accent-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        href={action.href}
      >
        {action.label}
      </a>
    ) : null);

  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-3 border-b border-border-subtle bg-background px-5 py-4 lg:flex-row lg:items-start lg:justify-between", className)}
      {...props}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h1 className="truncate text-[length:var(--ds-page-title)] font-semibold leading-tight">{title}</h1>
          {status}
        </div>
        {description ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
        {metadata ? <div className="mt-2 text-[var(--ds-metadata)] text-muted-foreground">{metadata}</div> : null}
      </div>
      {resolvedActions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{resolvedActions}</div> : null}
    </header>
  );
}

export { PageHeader };
export type { PageHeaderProps };

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
        className="ds-type-button inline-flex h-[var(--ds-control-height)] items-center justify-center gap-2 whitespace-nowrap rounded-md bg-action px-3 py-2 text-action-foreground shadow-xs outline-none transition-colors hover:bg-action-hover focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50"
        href={action.href}
      >
        {action.label}
      </a>
    ) : null);

  return (
    <header
      data-slot="page-header"
      className={cn(
        // On the page the header shares the frame's left edge. Inside a Card
        // or InventorySurface it sits on the card surface with the surface's
        // own inset and no page texture, so consumers add no padding of their own.
        "flex flex-col gap-3 ds-texture-wash border-b border-border-subtle bg-canvas px-[var(--ds-frame-content-inset,var(--ds-frame-padding-x))] py-4 lg:flex-row lg:items-start lg:justify-between",
        "in-data-[slot=card]:bg-transparent in-data-[slot=card]:px-[var(--ds-surface-padding)] in-data-[slot=card]:bg-none in-data-[slot=inventory-surface]:bg-transparent in-data-[slot=inventory-surface]:px-[var(--ds-surface-padding)] in-data-[slot=inventory-surface]:bg-none",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h1 className="ds-type-page-title truncate">{title}</h1>
          {status}
        </div>
        {description ? <p className="ds-type-ui mt-1 max-w-3xl text-text-supporting">{description}</p> : null}
        {metadata ? <div className="ds-type-metadata mt-2 text-text-supporting">{metadata}</div> : null}
      </div>
      {resolvedActions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{resolvedActions}</div> : null}
    </header>
  );
}

export { PageHeader };
export type { PageHeaderProps };

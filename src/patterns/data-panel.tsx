import * as React from "react";

import { cn } from "../primitives/utils";

function DataPanel({ className, ...props }: React.ComponentProps<"section">) {
  return <section data-slot="data-panel" className={cn("min-w-0 overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-surface text-text-primary shadow-[var(--ds-shadow-raised)]", className)} {...props} />;
}

type DataPanelHeaderProps = React.ComponentProps<"header"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
};

function DataPanelHeader({ title, description, status, actions, className, ...props }: DataPanelHeaderProps) {
  return (
    <header data-slot="data-panel-header" className={cn("flex min-w-0 items-start justify-between gap-4 border-b border-border-subtle px-[var(--ds-surface-padding)] py-3", className)} {...props}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="ds-type-card-title">{title}</h2>
          {status}
        </div>
        {description ? <p className="ds-type-metadata mt-0.5 text-text-supporting">{description}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}

type DataPanelContentProps = React.ComponentProps<"div"> & { padded?: boolean };

function DataPanelContent({ padded = false, className, ...props }: DataPanelContentProps) {
  return <div data-slot="data-panel-content" data-padded={padded ? "true" : undefined} className={cn(padded && "p-[var(--ds-surface-padding)]", className)} {...props} />;
}

function DataPanelFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return <footer data-slot="data-panel-footer" className={cn("border-t border-border-subtle px-[var(--ds-surface-padding)] py-3 ds-type-metadata text-text-supporting", className)} {...props} />;
}

export { DataPanel, DataPanelContent, DataPanelFooter, DataPanelHeader };
export type { DataPanelContentProps, DataPanelHeaderProps };

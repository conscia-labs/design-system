import * as React from "react";

import { cn } from "../primitives/utils";

function ActivityList({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="activity-list" className={cn("divide-y divide-border-subtle", className)} {...props} />;
}

type ActivityItemProps = React.ComponentProps<"div"> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  metadata?: React.ReactNode;
  status?: React.ReactNode;
};

function ActivityItem({ icon, title, description, metadata, status, className, ...props }: ActivityItemProps) {
  return (
    <div data-slot="activity-item" className={cn("grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 py-3", className)} {...props}>
      <div className="flex size-8 items-center justify-center rounded-md bg-neutral-background text-neutral-foreground [&_svg]:size-4">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description ? <div className="mt-0.5 text-sm text-muted-foreground">{description}</div> : null}
        {metadata ? <div className="mt-1 text-[var(--ds-metadata)] text-muted-foreground">{metadata}</div> : null}
      </div>
      {status ? <div className="shrink-0">{status}</div> : null}
    </div>
  );
}

export { ActivityItem, ActivityList };
export type { ActivityItemProps };

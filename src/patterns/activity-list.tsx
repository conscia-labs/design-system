import * as React from "react";

import { cn } from "../primitives/utils";

function ActivityList({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="activity-list" className={cn("divide-y divide-border-subtle", className)} {...props} />;
}

type ActivityItemProps = React.ComponentProps<"div"> & {
  leading?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  metadata?: React.ReactNode;
  trailing?: React.ReactNode;
  status?: React.ReactNode;
  layout?: "standard" | "compact";
};

function ActivityItem({
  leading,
  icon,
  title,
  description,
  metadata,
  trailing,
  status,
  layout = "standard",
  className,
  ...props
}: ActivityItemProps) {
  const hasLeading = leading !== undefined || icon !== undefined;
  const resolvedTrailing = trailing ?? status;

  return (
    <div
      data-slot="activity-item"
      data-layout={layout}
      className={cn(
        "grid gap-3 py-3",
        hasLeading && resolvedTrailing && "grid-cols-[auto_minmax(0,1fr)_auto]",
        hasLeading && !resolvedTrailing && "grid-cols-[auto_minmax(0,1fr)]",
        !hasLeading && resolvedTrailing && "grid-cols-[minmax(0,1fr)_auto]",
        !hasLeading && !resolvedTrailing && "grid-cols-1",
        layout === "compact" && "py-2",
        className,
      )}
      {...props}
    >
      {leading !== undefined ? (
        <div data-slot="activity-item-leading" className="shrink-0">{leading}</div>
      ) : icon !== undefined ? (
        <div data-slot="activity-item-leading" className="flex size-8 items-center justify-center rounded-md bg-neutral-background text-neutral-foreground [&_svg]:size-4">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <div className="ds-type-ui font-medium text-text-primary">{title}</div>
        {description ? <div className="ds-type-ui mt-0.5 text-text-supporting">{description}</div> : null}
        {metadata ? <div className="ds-type-metadata mt-1 text-text-supporting">{metadata}</div> : null}
      </div>
      {resolvedTrailing ? <div data-slot="activity-item-trailing" className="shrink-0">{resolvedTrailing}</div> : null}
    </div>
  );
}

export { ActivityItem, ActivityList };
export type { ActivityItemProps };

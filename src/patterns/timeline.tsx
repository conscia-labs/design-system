import * as React from "react";

import { cn } from "../primitives/utils";

/** Events in order, joined by a line. Use ActivityList when the order is not the point. */
function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="timeline" className={cn("grid", className)} {...props} />;
}

type TimelineItemProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** Replaces the dot in the marker. */
  icon?: React.ReactNode;
  tone?: "neutral" | "information" | "success" | "warning" | "danger";
  title: React.ReactNode;
  description?: React.ReactNode;
  /** When it happened, shown opposite the title. */
  time?: React.ReactNode;
};

const timelineTones = {
  neutral: "bg-neutral-background text-neutral-foreground",
  information: "bg-information-background text-information-foreground",
  success: "bg-success-background text-success-foreground",
  warning: "bg-warning-background text-warning-foreground",
  danger: "bg-danger-background text-danger-foreground",
};

function TimelineItem({ icon, tone = "neutral", title, description, time, children, className, ...props }: TimelineItemProps) {
  return (
    <li data-slot="timeline-item" data-tone={tone} className={cn("group/timeline-item grid grid-cols-[auto_minmax(0,1fr)] gap-3 pb-5 last:pb-0", className)} {...props}>
      <div className="flex flex-col items-center" aria-hidden="true">
        <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full [&_svg]:size-3.5", timelineTones[tone])}>
          {icon ?? <span className="size-2 rounded-full bg-current" />}
        </span>
        <span className="mt-1 w-px flex-1 bg-border-default group-last/timeline-item:hidden" />
      </div>
      <div className="min-w-0 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <div className="ds-type-ui font-medium text-text-primary">{title}</div>
          {time ? <div className="ds-type-metadata tabular-nums text-text-supporting">{time}</div> : null}
        </div>
        {description ? <div className="ds-type-ui mt-0.5 text-text-supporting">{description}</div> : null}
        {children}
      </div>
    </li>
  );
}

export { Timeline, TimelineItem };
export type { TimelineItemProps };

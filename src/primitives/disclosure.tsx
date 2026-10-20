"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { cn } from "./utils";

type DisclosureProps = Omit<React.ComponentProps<typeof Collapsible>, "children"> & {
  /** The always-visible summary row. Keep it short; it names the hidden content. */
  summary: React.ReactNode;
  /** Optional count shown after the summary, such as the number of hidden rows. */
  count?: React.ReactNode;
  summaryClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

/**
 * A summary row with a chevron that shows or hides supporting content. Use it
 * in place of native `<details>` so the summary has the system's focus and
 * hover treatment.
 */
function Disclosure({
  summary,
  count,
  className,
  summaryClassName,
  contentClassName,
  children,
  ...props
}: DisclosureProps) {
  return (
    <Collapsible data-slot="disclosure" className={cn("min-w-0", className)} {...props}>
      <CollapsibleTrigger
        data-slot="disclosure-summary"
        className={cn(
          "group/disclosure ds-type-ui -mx-2 flex min-h-[var(--ds-control-height-sm)] w-[calc(100%+1rem)] items-center gap-2 rounded-md px-2 text-left font-medium text-text-primary outline-none transition-colors hover:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-focus/50 disabled:pointer-events-none disabled:opacity-50",
          summaryClassName,
        )}
      >
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-text-supporting transition-transform duration-150 group-data-[panel-open]/disclosure:rotate-90 motion-reduce:transition-none"
        />
        <span className="min-w-0 flex-1">{summary}</span>
        {count !== undefined && count !== null ? (
          <span
            data-slot="disclosure-count"
            className="ds-type-metadata shrink-0 rounded-full bg-neutral-background px-2 font-medium tabular-nums text-neutral-foreground"
          >
            {count}
          </span>
        ) : null}
      </CollapsibleTrigger>
      <CollapsibleContent data-slot="disclosure-content" className={cn("pt-2", contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export { Disclosure };
export type { DisclosureProps };

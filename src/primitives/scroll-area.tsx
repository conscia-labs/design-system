"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";

import { cn } from "./utils";

const scrollbarClasses =
  "flex touch-none select-none p-0.5 opacity-0 transition-opacity duration-[var(--ds-duration-fast)] data-hovering:opacity-100 data-scrolling:opacity-100 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5";

/**
 * A scroll region with thin overlay scrollbars that look the same on every
 * platform. Give it a height or max-height through `className`, and an
 * `aria-label` so keyboard users know what they are scrolling.
 */
function ScrollArea({ className, children, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: React.ComponentProps<typeof BaseScrollArea.Root>) {
  // The viewport takes keyboard focus, so the name belongs on it.
  const named = ariaLabel !== undefined || ariaLabelledBy !== undefined;
  return (
    <BaseScrollArea.Root data-slot="scroll-area" className={cn("relative min-h-0", className)} {...props}>
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        role={named ? "region" : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="size-full max-h-[inherit] overscroll-contain rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
      >
        {children}
      </BaseScrollArea.Viewport>
      {(["vertical", "horizontal"] as const).map((orientation) => (
        <BaseScrollArea.Scrollbar key={orientation} orientation={orientation} data-slot="scroll-area-scrollbar" className={scrollbarClasses}>
          <BaseScrollArea.Thumb className="w-full rounded-full bg-border-strong" />
        </BaseScrollArea.Scrollbar>
      ))}
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  );
}

export { ScrollArea };

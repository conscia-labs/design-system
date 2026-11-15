"use client";

import * as React from "react";
import { PreviewCard } from "@base-ui/react/preview-card";

import { overlayLayers } from "./overlay-layers";
import { cn } from "./utils";

/**
 * A preview of a link's target, shown on hover or focus. Touch and
 * screen-reader users do not get it, so never put content or actions in it
 * that are not also on the linked page.
 */
function HoverCard({ ...props }: React.ComponentProps<typeof PreviewCard.Root>) {
  return <PreviewCard.Root data-slot="hover-card" {...props} />;
}

/** Renders a link. Pass `href`, or `render` for a router link. */
function HoverCardTrigger({ ...props }: React.ComponentProps<typeof PreviewCard.Trigger>) {
  return <PreviewCard.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({
  className,
  sideOffset = 6,
  side,
  align,
  ...props
}: React.ComponentProps<typeof PreviewCard.Popup> & {
  sideOffset?: number;
  side?: React.ComponentProps<typeof PreviewCard.Positioner>["side"];
  align?: React.ComponentProps<typeof PreviewCard.Positioner>["align"];
}) {
  return (
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-slot="hover-card-positioner" className={overlayLayers.popup} sideOffset={sideOffset} side={side} align={align}>
        <PreviewCard.Popup
          data-slot="hover-card-content"
          className={cn("w-72 rounded-md border bg-surface-floating p-4 text-sm text-text-primary shadow-[var(--ds-shadow-floating)] outline-none", className)}
          {...props}
        />
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };

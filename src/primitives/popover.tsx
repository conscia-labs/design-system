"use client";
import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { overlayLayers } from "./overlay-layers";
import { cn } from "./utils";

function Popover({ ...props }: React.ComponentProps<typeof BasePopover.Root>) { return <BasePopover.Root data-slot="popover" {...props} />; }
function PopoverTrigger({ ...props }: React.ComponentProps<typeof BasePopover.Trigger>) { return <BasePopover.Trigger data-slot="popover-trigger" {...props} />; }
function PopoverPortal({ ...props }: React.ComponentProps<typeof BasePopover.Portal>) { return <BasePopover.Portal data-slot="popover-portal" {...props} />; }
function PopoverPositioner({ className, ...props }: React.ComponentProps<typeof BasePopover.Positioner>) { return <BasePopover.Positioner data-slot="popover-positioner" className={cn(overlayLayers.popup, className)} {...props} />; }
function PopoverContent({ className, children, ...props }: React.ComponentProps<typeof BasePopover.Popup>) { return <PopoverPortal><PopoverPositioner><BasePopover.Popup data-slot="popover-content" className={cn("w-72 rounded-md border bg-surface-floating p-4 text-text-primary shadow-[var(--ds-shadow-floating)] outline-none data-open:animate-in data-closed:animate-out", className)} {...props}>{children}</BasePopover.Popup></PopoverPositioner></PopoverPortal>; }
function PopoverArrow({ ...props }: React.ComponentProps<typeof BasePopover.Arrow>) { return <BasePopover.Arrow data-slot="popover-arrow" {...props} />; }
function PopoverTitle({ className, ...props }: React.ComponentProps<typeof BasePopover.Title>) { return <BasePopover.Title data-slot="popover-title" className={cn("font-semibold", className)} {...props} />; }
function PopoverDescription({ className, ...props }: React.ComponentProps<typeof BasePopover.Description>) { return <BasePopover.Description data-slot="popover-description" className={cn("text-sm text-text-supporting", className)} {...props} />; }
function PopoverClose({ ...props }: React.ComponentProps<typeof BasePopover.Close>) { return <BasePopover.Close data-slot="popover-close" {...props} />; }
export { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverDescription, PopoverPositioner, PopoverPortal, PopoverTitle, PopoverTrigger };

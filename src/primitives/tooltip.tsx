"use client";
import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { overlayLayers } from "./overlay-layers";
import { cn } from "./utils";
function TooltipProvider({ delayDuration = 150, ...props }: React.ComponentProps<typeof BaseTooltip.Provider> & { delayDuration?: number }) { return <BaseTooltip.Provider delay={delayDuration} {...props} />; }
function Tooltip({ ...props }: React.ComponentProps<typeof BaseTooltip.Root>) { return <BaseTooltip.Root data-slot="tooltip" {...props} />; }
function TooltipTrigger({ ...props }: React.ComponentProps<typeof BaseTooltip.Trigger>) { return <BaseTooltip.Trigger data-slot="tooltip-trigger" {...props} />; }
function TooltipContent({ className, sideOffset = 6, side, align, children, ...props }: React.ComponentProps<typeof BaseTooltip.Popup> & { sideOffset?: number; side?: React.ComponentProps<typeof BaseTooltip.Positioner>["side"]; align?: React.ComponentProps<typeof BaseTooltip.Positioner>["align"] }) { return <BaseTooltip.Portal><BaseTooltip.Positioner className={overlayLayers.transient} sideOffset={sideOffset} side={side} align={align}><BaseTooltip.Popup role="tooltip" data-slot="tooltip-content" className={cn("w-fit rounded-md bg-text-primary px-3 py-1.5 text-balance text-xs text-canvas shadow-[var(--ds-shadow-floating)]", className)} {...props}>{children}<BaseTooltip.Arrow className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-text-primary fill-text-primary" /></BaseTooltip.Popup></BaseTooltip.Positioner></BaseTooltip.Portal>; }
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

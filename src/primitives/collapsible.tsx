"use client";
import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

function Collapsible({ open: controlledOpen, defaultOpen = false, onOpenChange, children, ...props }: React.ComponentProps<typeof BaseCollapsible.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const handleOpenChange = (nextOpen: boolean, ...details: Parameters<NonNullable<React.ComponentProps<typeof BaseCollapsible.Root>["onOpenChange"]>> extends [boolean, infer D] ? [D] : []) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen, ...details);
  };
  return <BaseCollapsible.Root data-slot="collapsible" open={open} onOpenChange={handleOpenChange} {...props}>{children}</BaseCollapsible.Root>;
}
function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof BaseCollapsible.Trigger>) { return <BaseCollapsible.Trigger data-slot="collapsible-trigger" {...props} />; }
function CollapsibleContent({ ...props }: React.ComponentProps<typeof BaseCollapsible.Panel>) { return <BaseCollapsible.Panel data-slot="collapsible-content" {...props} />; }
export { Collapsible, CollapsibleContent, CollapsibleTrigger };

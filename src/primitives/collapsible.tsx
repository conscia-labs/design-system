"use client";
import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

const CollapsibleStateContext = React.createContext(false);
function Collapsible({ open: controlledOpen, defaultOpen = false, onOpenChange, children, ...props }: React.ComponentProps<typeof BaseCollapsible.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const handleOpenChange = (nextOpen: boolean, ...details: Parameters<NonNullable<React.ComponentProps<typeof BaseCollapsible.Root>["onOpenChange"]>> extends [boolean, infer D] ? [D] : []) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen, ...details);
  };
  return <CollapsibleStateContext.Provider value={open}><BaseCollapsible.Root data-slot="collapsible" open={open} onOpenChange={handleOpenChange} {...props}>{children}</BaseCollapsible.Root></CollapsibleStateContext.Provider>;
}
function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof BaseCollapsible.Trigger>) { const open = React.useContext(CollapsibleStateContext); return <BaseCollapsible.Trigger data-slot="collapsible-trigger" data-state={open ? "open" : "closed"} {...props} />; }
function CollapsibleContent({ ...props }: React.ComponentProps<typeof BaseCollapsible.Panel>) { return <BaseCollapsible.Panel data-slot="collapsible-content" {...props} />; }
export { Collapsible, CollapsibleContent, CollapsibleTrigger };

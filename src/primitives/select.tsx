"use client";
import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "./utils";
type SelectProps = Omit<React.ComponentProps<typeof BaseSelect.Root>, "onValueChange"> & { onValueChange?: (value: string) => void };
function collectItems(children: React.ReactNode): Array<{ value: string; label: React.ReactNode }> {
  const items: Array<{ value: string; label: React.ReactNode }> = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const childProps = child.props as { value?: string; children?: React.ReactNode };
    if (childProps.value !== undefined) items.push({ value: childProps.value, label: childProps.children });
    if (childProps.children) items.push(...collectItems(childProps.children));
  });
  return items;
}
function Select({ onValueChange, children, items, ...props }: SelectProps & { children?: React.ReactNode; items?: React.ComponentProps<typeof BaseSelect.Root>["items"] }) { const resolvedItems = items ?? collectItems(children); return <BaseSelect.Root data-slot="select" items={resolvedItems} onValueChange={onValueChange as React.ComponentProps<typeof BaseSelect.Root>["onValueChange"]} {...props}>{children}</BaseSelect.Root>; }
function SelectGroup({ ...props }: React.ComponentProps<typeof BaseSelect.Group>) { return <BaseSelect.Group data-slot="select-group" {...props} />; }
function SelectValue({ ...props }: React.ComponentProps<typeof BaseSelect.Value>) { return <BaseSelect.Value data-slot="select-value" {...props} />; }
function SelectTrigger({ className, size="default", children, ...props }: React.ComponentProps<typeof BaseSelect.Trigger> & { size?: "sm"|"default" }) { return <BaseSelect.Trigger data-slot="select-trigger" data-size={size} className={cn("ds-type-control border-control-border data-[placeholder]:text-text-supporting focus-visible:border-focus focus-visible:ring-focus/50 flex w-fit items-center justify-between gap-2 rounded-[var(--ds-field-control-radius)] border bg-surface-control px-[var(--ds-field-control-padding-x)] py-2 whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[var(--ds-field-control-height)] data-[size=sm]:h-[var(--ds-control-height-sm)] [&_svg]:pointer-events-none [&_svg]:shrink-0", className)} {...props}>{children}<BaseSelect.Icon><ChevronDownIcon className="size-4 opacity-50" /></BaseSelect.Icon></BaseSelect.Trigger>; }
function SelectContent({ className, children, ...props }: React.ComponentProps<typeof BaseSelect.Popup>) { return <BaseSelect.Portal><BaseSelect.Positioner><BaseSelect.Popup data-slot="select-content" className={cn("bg-surface-floating text-text-primary relative z-50 max-h-[var(--available-height)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none data-open:animate-in data-closed:animate-out", className)} {...props}>{children}</BaseSelect.Popup></BaseSelect.Positioner></BaseSelect.Portal>; }
function SelectItem({ className, children, ...props }: React.ComponentProps<typeof BaseSelect.Item>) { return <BaseSelect.Item data-slot="select-item" className={cn("ds-type-menu-item data-highlighted:bg-surface-muted relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50", className)} {...props}><span className="absolute right-2 flex size-3.5 items-center justify-center"><BaseSelect.ItemIndicator><CheckIcon className="size-4" /></BaseSelect.ItemIndicator></span><BaseSelect.ItemText>{children}</BaseSelect.ItemText></BaseSelect.Item>; }
function SelectLabel({ className, ...props }: React.ComponentProps<typeof BaseSelect.GroupLabel>) { return <BaseSelect.GroupLabel data-slot="select-label" className={cn("ds-type-menu-label text-text-supporting px-2 py-1.5", className)} {...props} />; }
function SelectSeparator({ className, ...props }: React.ComponentProps<typeof BaseSelect.Separator>) { return <BaseSelect.Separator data-slot="select-separator" className={cn("bg-border-default pointer-events-none -mx-1 my-1 h-px", className)} {...props} />; }
function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof BaseSelect.ScrollUpArrow>) { return <BaseSelect.ScrollUpArrow data-slot="select-scroll-up-button" className={cn("flex items-center justify-center py-1", className)} {...props}><ChevronUpIcon className="size-4" /></BaseSelect.ScrollUpArrow>; }
function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof BaseSelect.ScrollDownArrow>) { return <BaseSelect.ScrollDownArrow data-slot="select-scroll-down-button" className={cn("flex items-center justify-center py-1", className)} {...props}><ChevronDownIcon className="size-4" /></BaseSelect.ScrollDownArrow>; }
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };

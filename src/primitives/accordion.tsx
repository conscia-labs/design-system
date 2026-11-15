"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

/** Stacked sections that expand in place. Pass `multiple` to allow several open. */
function Accordion({ className, ...props }: React.ComponentProps<typeof BaseAccordion.Root>) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      className={cn("divide-y divide-border-subtle overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-surface text-text-primary", className)}
      {...props}
    />
  );
}

function AccordionItem({ ...props }: React.ComponentProps<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item data-slot="accordion-item" {...props} />;
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header data-slot="accordion-header" className="flex">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "ds-type-ui group/accordion-trigger flex flex-1 items-center justify-between gap-4 px-[var(--ds-surface-padding)] py-3 text-left font-medium outline-none transition-colors hover:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-focus/50 data-disabled:pointer-events-none data-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-text-supporting transition-transform duration-[var(--ds-duration-base)] ease-standard group-data-panel-open/accordion-trigger:rotate-180"
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-content"
      className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-[var(--ds-duration-base)] ease-standard data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn("ds-type-ui px-[var(--ds-surface-padding)] pb-4 text-text-supporting", className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import { cn } from "./utils";

type SegmentedControlProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "value" | "defaultValue" | "onValueChange" | "multiple"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "default";
};

/**
 * Switches between a few views or modes of the same content, one always
 * selected. Give it an `aria-label`. Use Tabs when each option owns a panel.
 */
function SegmentedControl({
  value,
  defaultValue,
  onValueChange,
  size = "default",
  className,
  ...props
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const current = value ?? internalValue;

  return (
    <ToggleGroup
      data-slot="segmented-control"
      data-size={size}
      value={current === undefined ? [] : [current]}
      onValueChange={(next) => {
        const nextValue = next[0] as string | undefined;
        // Pressing the selected segment again keeps it selected.
        if (nextValue === undefined) return;
        if (value === undefined) setInternalValue(nextValue);
        onValueChange?.(nextValue);
      }}
      className={cn(
        "group/segmented inline-flex w-fit items-center gap-1 rounded-md bg-surface-track p-1 data-[size=default]:h-[var(--ds-control-height)] data-[size=sm]:h-[var(--ds-control-height-sm)] data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function SegmentedControlItem({ className, ...props }: React.ComponentProps<typeof Toggle>) {
  return (
    <Toggle
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--ds-radius-control)-2px)] px-3 text-sm font-medium text-text-supporting outline-none transition-[background-color,color,box-shadow] hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring data-disabled:pointer-events-none data-pressed:bg-surface-track-selected data-pressed:text-text-primary data-pressed:shadow-raised data-pressed:ring-1 data-pressed:ring-inset data-pressed:ring-border-subtle group-data-[size=sm]/segmented:px-2 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
export type { SegmentedControlProps };

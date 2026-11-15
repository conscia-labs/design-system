"use client";

import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { cn } from "./utils";

/** One choice from a short, visible list. Use Select once the list is long. */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof BaseRadioGroup>) {
  return <BaseRadioGroup data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />;
}

/** Wrap in a `<label>` with its text, like Checkbox. */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof BaseRadio.Root>) {
  return (
    <BaseRadio.Root
      data-slot="radio-group-item"
      className={cn(
        "peer inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-control-indicator bg-surface-control outline-none transition-colors focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 data-checked:border-action data-checked:bg-action",
        className,
      )}
      {...props}
    >
      <BaseRadio.Indicator data-slot="radio-group-indicator" className="size-1.5 rounded-full bg-action-foreground" />
    </BaseRadio.Root>
  );
}

export { RadioGroup, RadioGroupItem };

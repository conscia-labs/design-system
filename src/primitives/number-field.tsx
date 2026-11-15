"use client";

import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";

import { fieldGroupClasses, fieldGroupInputClasses } from "./field-control";
import { cn } from "./utils";

type NumberFieldProps = Omit<React.ComponentProps<typeof BaseNumberField.Root>, "children"> & {
  placeholder?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

const stepButtonClasses =
  "flex w-9 shrink-0 items-center justify-center text-text-supporting outline-none transition-colors hover:bg-surface-control-hover hover:text-text-primary focus-visible:bg-surface-control-hover focus-visible:text-text-primary data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4";

/**
 * A number input with step buttons, min/max clamping and locale formatting
 * (`format`).
 */
function NumberField({
  className,
  id,
  placeholder,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: NumberFieldProps) {
  return (
    <BaseNumberField.Root data-slot="number-field" className={cn("min-w-0", className)} {...props}>
      <BaseNumberField.Group data-slot="number-field-group" className={fieldGroupClasses}>
        <BaseNumberField.Decrement aria-label={decrementLabel} className={cn(stepButtonClasses, "border-r border-control-border")}>
          <MinusIcon aria-hidden="true" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          data-slot="number-field-input"
          // On the input, an explicit id survives server rendering inside a Field.
          {...(id !== undefined ? { id } : {})}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(fieldGroupInputClasses, "text-center tabular-nums")}
        />
        <BaseNumberField.Increment aria-label={incrementLabel} className={cn(stepButtonClasses, "border-l border-control-border")}>
          <PlusIcon aria-hidden="true" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}

export { NumberField };
export type { NumberFieldProps };

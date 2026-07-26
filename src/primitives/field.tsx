import * as React from "react";

import { cn } from "./utils";

function Field({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("grid gap-[var(--ds-field-label-gap)]", className)}
      {...props}
    />
  );
}

function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-[var(--ds-field-gap)]", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-[length:var(--ds-field-label-size)] font-medium leading-[var(--ds-field-label-line-height)] text-foreground", className)}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("mt-[var(--ds-field-message-gap)] text-[var(--ds-metadata)] text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      className={cn("mt-[var(--ds-field-message-gap)] text-[var(--ds-metadata)] font-medium text-danger-foreground", className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };

"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";

import { InsideFieldContext } from "./field-context";
import { cn } from "./utils";

/**
 * Connects a control to its label, description and error: no ids,
 * `aria-describedby` or `aria-invalid` to write by hand. Pass `invalid` when
 * the value is wrong; the control inside is then marked invalid.
 */
function Field({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Root>) {
  return (
    <InsideFieldContext.Provider value>
    <BaseField.Root
      data-slot="field"
      className={cn("grid gap-[var(--ds-field-label-gap)] [&>[data-slot=field-description]]:mt-[calc(var(--ds-field-message-gap)-var(--ds-field-label-gap))] [&>[data-slot=field-error]]:mt-[calc(var(--ds-field-message-gap)-var(--ds-field-label-gap))]", className)}
      {...props}
    />
    </InsideFieldContext.Provider>
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
  const Component = React.useContext(InsideFieldContext) ? BaseField.Label : "label";
  return (
    <Component
      data-slot="field-label"
      className={cn("ds-type-label text-text-primary", className)}
      {...(props as object)}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const Component = React.useContext(InsideFieldContext) ? BaseField.Description : "p";
  return (
    <Component
      data-slot="field-description"
      className={cn("ds-type-metadata mt-[var(--ds-field-message-gap)] text-text-supporting", className)}
      {...(props as object)}
    />
  );
}

/** Shown whenever it is rendered; render it only while there is an error to report. */
function FieldError({
  className,
  match = true,
  ...props
}: React.ComponentProps<"p"> & { match?: React.ComponentProps<typeof BaseField.Error>["match"] }) {
  const insideField = React.useContext(InsideFieldContext);
  const Component = insideField ? BaseField.Error : "p";
  return (
    <Component
      {...(insideField ? { match } : {})}
      data-slot="field-error"
      className={cn("ds-type-metadata mt-[var(--ds-field-message-gap)] font-medium text-danger-foreground", className)}
      {...(props as object)}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };

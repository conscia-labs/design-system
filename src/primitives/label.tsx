"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";

import { InsideFieldContext } from "./field-context";
import { cn } from "./utils";

/**
 * A label for any control. Inside a Field it connects to the control like
 * FieldLabel does; FieldLabel is the same label without the inline layout.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  const Component = React.useContext(InsideFieldContext) ? BaseField.Label : "label";
  return <Component data-slot="label" className={cn("ds-type-label flex items-center gap-2 text-text-primary select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)} {...(props as object)} />;
}

export { Label };

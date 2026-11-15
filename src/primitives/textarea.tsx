"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";

import { fieldControlClasses } from "./field-control";
import { cn } from "./utils";

// The shared field shell, grown into a multi-line block.
const textareaClasses = cn(fieldControlClasses, "block h-auto min-h-28 py-3");

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  // An explicit id means the label is wired by hand; see Input.
  if (props.id !== undefined) return <textarea data-slot="textarea" className={cn(textareaClasses, className)} {...props} />;

  return (
    <BaseField.Control
      data-slot="textarea"
      render={<textarea />}
      className={cn(textareaClasses, className)}
      {...(props as React.ComponentProps<typeof BaseField.Control>)}
    />
  );
}

export { Textarea };

"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { fieldControlClasses } from "./field-control";
import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const shared = {
    type: type ?? "text",
    "data-slot": "input",
    className: cn(fieldControlClasses, "disabled:pointer-events-none", className),
  };

  // An explicit id means the label is wired by hand. Field would replace the id
  // in server-rendered HTML, so such an input stays a plain element.
  if (props.id !== undefined) return <input {...shared} {...props} />;

  return <BaseInput {...shared} {...(props as React.ComponentProps<typeof BaseInput>)} />;
}

export { Input };

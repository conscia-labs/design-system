"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { fieldGroupClasses, fieldGroupInputClasses } from "./field-control";
import { cn } from "./utils";

/** An input with a fixed prefix or suffix inside one field frame, such as a unit, icon or URL scheme. */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-group" className={cn(fieldGroupClasses, className)} {...props} />;
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-addon"
      className={cn(
        "ds-type-control flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-text-supporting first:pr-0 last:pl-0 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, type, ...props }: React.ComponentProps<"input">) {
  const shared = { type: type ?? "text", "data-slot": "input-group-input", className: cn(fieldGroupInputClasses, className) };

  // An explicit id means the label is wired by hand; see Input.
  if (props.id !== undefined) return <input {...shared} {...props} />;

  return <BaseInput {...shared} {...(props as React.ComponentProps<typeof BaseInput>)} />;
}

export { InputGroup, InputGroupAddon, InputGroupInput };

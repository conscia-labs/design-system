import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-surface-control flex h-[var(--ds-field-control-height)] w-full min-w-0 rounded-[var(--ds-field-control-radius)] border px-[var(--ds-field-control-padding-x)] py-2 text-sm leading-5 shadow-none transition-colors outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-sm placeholder:leading-5 placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

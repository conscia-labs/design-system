import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type ?? "text"}
      data-slot="input"
      className={cn(
        "ds-type-control border-control-border bg-surface-control flex h-[var(--ds-field-control-height)] w-full min-w-0 rounded-[var(--ds-field-control-radius)] border px-[var(--ds-field-control-padding-x)] py-2 shadow-none transition-colors outline-none selection:bg-action selection:text-action-foreground placeholder:text-text-supporting disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-[3px]",
        "aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

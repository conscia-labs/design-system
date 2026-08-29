import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("ds-type-control min-h-28 w-full rounded-[var(--ds-field-control-radius)] border border-control-border bg-surface-control px-[var(--ds-field-control-padding-x)] py-3 outline-none transition-colors placeholder:text-text-supporting focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    />
  );
}

export { Textarea };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[var(--ds-metadata)] font-medium leading-4 transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground",
        accent: "border-selection-border bg-selection-background text-selection-foreground",
        secondary: "border-neutral-border bg-neutral-background text-neutral-foreground",
        neutral: "border-neutral-border bg-neutral-background text-neutral-foreground",
        outline: "border-border-default text-foreground",
        information: "border-information-border bg-information-background text-information-foreground",
        info: "border-information-border bg-information-background text-information-foreground",
        success: "border-success-border bg-success-background text-success-foreground",
        warning: "border-warning-border bg-warning-background text-warning-foreground",
        danger: "border-danger-border bg-danger-background text-danger-foreground",
        destructive: "border-danger-border bg-danger-background text-danger-foreground"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };

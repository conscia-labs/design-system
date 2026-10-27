import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex w-fit max-w-full items-center justify-self-start rounded-md border px-1.5 py-0.5 text-[var(--ds-metadata)] font-medium leading-4 transition-colors",
  {
    variants: {
      /**
       * Tone meanings: `neutral` for lifecycle states (Active, Enabled,
       * Published); `success` only for positive evidence (Healthy, Ready,
       * Verified); `information` for pending or in-progress work; `warning`
       * for problems that need action; `danger` for failures. `accent` and
       * `outline` are for taxonomy, not status.
       */
      variant: {
        default: "border-action bg-action text-action-foreground",
        accent: "border-selection-border bg-selection-background text-selection-foreground",
        secondary: "border-neutral-border bg-neutral-background text-neutral-foreground",
        neutral: "border-neutral-border bg-neutral-background text-neutral-foreground",
        outline: "border-border-default text-text-primary",
        information: "border-information-border bg-information-background text-information-foreground",
        info: "border-information-border bg-information-background text-information-foreground",
        success: "border-success-border bg-success-background text-success-foreground",
        warning: "border-warning-border bg-warning-background text-warning-foreground",
        danger: "border-danger-border bg-danger-background text-danger-foreground",
        destructive: "border-danger-border bg-danger-background text-danger-foreground"
      },
      /**
       * `pill` is the fully rounded category tag from conscia.com. Use it for
       * taxonomy (service area, topic); status badges stay `rounded`.
       */
      shape: {
        rounded: "",
        pill: "rounded-full px-2",
      }
    },
    defaultVariants: {
      variant: "neutral",
      shape: "rounded"
    }
  },
);

function Badge({
  className,
  variant,
  shape,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" data-shape={shape ?? "rounded"} className={cn(badgeVariants({ variant, shape, className }))} {...props} />;
}

export { Badge, badgeVariants };

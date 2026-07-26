import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-accent-hover active:bg-accent-active",
        destructive:
          "bg-danger text-white shadow-xs hover:bg-danger/90 focus-visible:ring-danger/20 dark:focus-visible:ring-danger/40",
        outline:
          "border border-border-default bg-background shadow-xs hover:bg-surface-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-surface-muted hover:text-foreground",
        link: "text-text-link underline-offset-4 hover:underline"
      },
      size: {
        default: "h-[var(--ds-control-height)] px-3 py-2 has-[>svg]:px-3",
        sm: "h-[var(--ds-control-height-sm)] rounded-md gap-1.5 px-2.5 has-[>svg]:px-2",
        lg: "h-[var(--ds-control-height-lg)] rounded-md px-4 has-[>svg]:px-3.5",
        icon: "size-[var(--ds-control-height)]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

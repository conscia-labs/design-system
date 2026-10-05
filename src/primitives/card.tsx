import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const cardVariants = cva(
  "flex min-w-0 flex-col gap-[var(--ds-surface-padding)] rounded-[var(--ds-radius-surface)] border border-border-default py-[var(--ds-surface-padding)] text-text-primary",
  {
    variants: {
      variant: {
        default: "bg-surface shadow-none",
        muted: "bg-surface-muted shadow-none",
        elevated: "border-transparent bg-surface-raised shadow-[var(--ds-shadow-floating)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "default"}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  );
}

type CardHeaderProps = React.ComponentProps<"div"> & {
  action?: React.ReactNode;
};

function CardHeader({ action, children, className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min gap-1.5 px-[var(--ds-surface-padding)]",
        action && "grid-cols-[minmax(0,1fr)_auto] items-start gap-4",
        className,
      )}
      {...props}
    >
      {action ? <div className="grid min-w-0 gap-1.5">{children}</div> : children}
      {action ? <div className="justify-self-end">{action}</div> : null}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("ds-type-card-title", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("ds-type-ui text-text-supporting", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-[var(--ds-surface-padding)]", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-[var(--ds-surface-padding)]", className)} {...props} />;
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
export type { CardHeaderProps, CardProps };

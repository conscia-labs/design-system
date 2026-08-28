import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "ds-type-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-accent-hover active:bg-accent-active",
        destructive:
          "bg-danger text-white shadow-xs hover:bg-danger/90 focus-visible:ring-danger/20 dark:bg-danger-background dark:text-danger-foreground dark:hover:bg-danger-border dark:focus-visible:ring-danger/40",
        outline:
          "border border-border-default bg-surface-control text-foreground shadow-xs hover:bg-surface-control-hover hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-surface-muted hover:text-foreground",
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

type ButtonProps = React.ComponentProps<"button">
  & VariantProps<typeof buttonVariants>
  & {
    render?: useRender.ComponentProps<"button">["render"];
  };

function Button({
  className,
  variant,
  size,
  render,
  type,
  ...props
}: ButtonProps) {
  const classNames = buttonVariants({ variant, size, className });
  const defaultProps = {
    "data-slot": "button",
    className: classNames,
    ...(render ? {} : { type: type ?? "button" }),
    ...props,
  } as React.ComponentProps<"button">;

  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(defaultProps, {}),
  });
}

type IconButtonNameProps =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: string; "aria-labelledby": string };

type IconButtonProps = Omit<ButtonProps, "children" | "size" | "aria-label" | "aria-labelledby">
  & IconButtonNameProps
  & {
    children: React.ReactNode;
    size?: "sm" | "default" | "lg";
  };

const iconButtonSizes = {
  sm: "size-[var(--ds-control-height-sm)]",
  default: "size-[var(--ds-control-height)]",
  lg: "size-[var(--ds-control-height-lg)]",
} as const;

function IconButton({
  className,
  size = "default",
  ...props
}: IconButtonProps) {
  return (
    <Button
      size="icon"
      className={cn(iconButtonSizes[size], className)}
      {...props}
    />
  );
}

export { Button, IconButton, buttonVariants };
export type { ButtonProps, IconButtonProps };

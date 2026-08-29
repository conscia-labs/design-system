import * as React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "./utils";

type SpinnerProps = React.ComponentProps<"span"> & {
  label?: string;
  size?: "sm" | "default" | "lg";
};

function Spinner({
  "aria-label": ariaLabel,
  className,
  label,
  size = "default",
  ...props
}: SpinnerProps) {
  const accessibleLabel = ariaLabel ?? label;

  return (
    <span
      data-slot="spinner"
      data-size={size}
      className={cn(
        "inline-flex shrink-0 animate-spin items-center justify-center text-current motion-reduce:animate-none data-[size=default]:size-4 data-[size=lg]:size-5 data-[size=sm]:size-3.5",
        className,
      )}
      role={accessibleLabel ? "status" : undefined}
      aria-hidden={accessibleLabel ? undefined : true}
      aria-label={accessibleLabel}
      {...props}
    >
      <LoaderCircle aria-hidden="true" className="size-full" />
    </span>
  );
}

export { Spinner };
export type { SpinnerProps };

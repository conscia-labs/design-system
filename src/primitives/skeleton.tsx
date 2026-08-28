import * as React from "react";

import { cn } from "./utils";

function Skeleton({ "aria-hidden": ariaHidden, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden={ariaHidden ?? true}
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };

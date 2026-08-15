import * as React from "react";

import { cn } from "../primitives/utils";

type ProviderMarkProps = React.ComponentProps<"div"> & {
  name: string;
  shortName: string;
  description?: React.ReactNode;
  size?: "sm" | "default";
};

function ProviderMark({ name, shortName, description, size = "default", className, ...props }: ProviderMarkProps) {
  return (
    <div data-slot="provider-mark" className={cn("flex min-w-0 items-center gap-3", className)} {...props}>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md border border-border-subtle bg-surface-muted font-semibold tracking-tight text-foreground",
          size === "sm" ? "size-8 text-[10px]" : "size-10 text-xs",
        )}
      >
        {shortName}
      </div>
      <div className="min-w-0">
        <div className="ds-type-ui truncate font-medium text-foreground">{name}</div>
        {description ? <div className="ds-type-metadata mt-0.5 truncate text-muted-foreground">{description}</div> : null}
      </div>
    </div>
  );
}

export { ProviderMark };
export type { ProviderMarkProps };

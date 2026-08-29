import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { cn } from "../primitives/utils";

type DetailBackLinkProps = Omit<React.ComponentProps<"a">, "children"> & {
  label: string;
};

function DetailBackLink({ label, className, ...props }: DetailBackLinkProps) {
  return (
    <a
      data-slot="detail-back-link"
      className={cn(
        "inline-flex h-8 w-fit items-center gap-2 rounded-md px-2 text-sm font-medium text-text-supporting outline-none transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:ring-[3px] focus-visible:ring-focus/45",
        className,
      )}
      {...props}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </a>
  );
}

export { DetailBackLink };
export type { DetailBackLinkProps };

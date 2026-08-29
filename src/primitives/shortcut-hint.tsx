import * as React from "react";

import { cn } from "./utils";

type ShortcutHintProps = React.ComponentProps<"kbd"> & {
  label?: string;
};

function ShortcutHint({
  "aria-label": ariaLabel,
  children,
  className,
  label,
  ...props
}: ShortcutHintProps) {
  const accessibleLabel = ariaLabel ?? label;

  return (
    <kbd
      data-slot="shortcut-hint"
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded border border-border-default bg-surface-muted px-1.5 py-0.5 font-mono text-[0.6875rem] font-medium leading-none text-muted-foreground shadow-xs",
        className,
      )}
      aria-hidden={accessibleLabel ? undefined : true}
      aria-label={accessibleLabel}
      {...props}
    >
      {children}
    </kbd>
  );
}

export { ShortcutHint };
export type { ShortcutHintProps };

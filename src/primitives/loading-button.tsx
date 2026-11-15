import * as React from "react";

import { Button, type ButtonProps } from "./button";

type LoadingButtonProps = Omit<ButtonProps, "children"> & {
  children: React.ReactNode;
};

/**
 * `Button` with `pending` and a default "Working…" label. Kept for existing
 * code; new code can pass `pending` to `Button` directly.
 */
function LoadingButton({ pendingLabel = "Working…", ...props }: LoadingButtonProps) {
  return <Button pendingLabel={pendingLabel} {...props} />;
}

export { LoadingButton };
export type { LoadingButtonProps };

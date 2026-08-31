import * as React from "react";

import { Button, type ButtonProps } from "./button";
import { Spinner } from "./spinner";

type LoadingButtonProps = Omit<ButtonProps, "children"> & {
  children: React.ReactNode;
  pending?: boolean;
  pendingLabel?: React.ReactNode;
};

/**
 * Keeps async actions visually stable and prevents duplicate submissions while
 * the owning mutation is pending.
 */
function LoadingButton({
  children,
  pending = false,
  pendingLabel = "Working…",
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      {pending ? (
        <>
          <Spinner aria-hidden="true" size="sm" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export { LoadingButton };
export type { LoadingButtonProps };

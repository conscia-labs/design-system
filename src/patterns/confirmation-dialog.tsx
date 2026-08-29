"use client";

import * as React from "react";

import { Button } from "../primitives/button";
import { AlertDialog, AlertDialogAction, AlertDialogBody, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../primitives/alert-dialog";

type ConfirmationDialogProps = {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
  pending?: boolean;
  onConfirm: () => unknown | Promise<unknown>;
  onError?: (error: unknown) => void;
};

function ConfirmationDialog({ trigger, title, description, children, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmVariant = "destructive", pending = false, onConfirm, onError }: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const isPending = pending || confirming;

  async function confirm() {
    if (isPending) {
      return;
    }

    setConfirming(true);

    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      onError?.(error);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger as React.ReactElement}>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody>{children}</AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button type="button" variant="outline" disabled={isPending} />}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction render={<Button type="button" variant={confirmVariant} disabled={isPending} onClick={confirm} />}>
            {isPending ? "Working..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmationDialog };
export type { ConfirmationDialogProps };

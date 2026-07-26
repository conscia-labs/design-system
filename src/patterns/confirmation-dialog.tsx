"use client";

import * as React from "react";

import { Button } from "../primitives/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../primitives/dialog";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent size="small">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>{cancelLabel}</Button>
          </DialogClose>
          <Button type="button" variant={confirmVariant} disabled={isPending} onClick={confirm}>
            {isPending ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmationDialog };
export type { ConfirmationDialogProps };

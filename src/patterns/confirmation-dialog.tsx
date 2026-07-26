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
};

function ConfirmationDialog({ trigger, title, description, children, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmVariant = "destructive", pending = false, onConfirm }: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false);

  async function confirm() {
    await onConfirm();
    setOpen(false);
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
            <Button type="button" variant="outline" disabled={pending}>{cancelLabel}</Button>
          </DialogClose>
          <Button type="button" variant={confirmVariant} disabled={pending} onClick={confirm}>
            {pending ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmationDialog };
export type { ConfirmationDialogProps };

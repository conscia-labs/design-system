"use client";
import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

function Dialog({ ...props }: React.ComponentProps<typeof BaseDialog.Root>) { return <BaseDialog.Root data-slot="dialog" {...props} />; }
function DialogTrigger({ ...props }: React.ComponentProps<typeof BaseDialog.Trigger>) { return <BaseDialog.Trigger data-slot="dialog-trigger" {...props} />; }
function DialogClose({ ...props }: React.ComponentProps<typeof BaseDialog.Close>) { return <BaseDialog.Close data-slot="dialog-close" {...props} />; }
function DialogPortal({ ...props }: React.ComponentProps<typeof BaseDialog.Portal>) { return <BaseDialog.Portal data-slot="dialog-portal" {...props} />; }
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof BaseDialog.Backdrop>) { return <BaseDialog.Backdrop data-slot="dialog-overlay" className={cn("fixed inset-0 z-50 bg-black/50 data-open:animate-in data-closed:animate-out", className)} {...props} />; }
function DialogContent({ className, children, showCloseButton = true, size = "default", closeLabel = "Close", ...props }: React.ComponentProps<typeof BaseDialog.Popup> & { showCloseButton?: boolean; size?: "small" | "default" | "large"; closeLabel?: string }) {
  return <DialogPortal><DialogOverlay /><BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4"><BaseDialog.Popup data-slot="dialog-content" data-size={size} className={cn("relative grid max-h-[min(42rem,calc(100vh-2rem))] w-full max-w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-5 overflow-hidden rounded-lg border bg-background p-5 text-foreground shadow-lg outline-none sm:p-6", "data-[size=small]:max-w-sm data-[size=default]:max-w-lg data-[size=large]:max-w-3xl", className)} {...props}>{children}{showCloseButton ? <BaseDialog.Close data-slot="dialog-close" className="absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none [&_svg]:size-4"><XIcon /><span className="sr-only">{closeLabel}</span></BaseDialog.Close> : null}</BaseDialog.Popup></BaseDialog.Viewport></DialogPortal>;
}
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 text-left", className)} {...props} />; }
function DialogTitle({ className, ...props }: React.ComponentProps<typeof BaseDialog.Title>) { return <BaseDialog.Title data-slot="dialog-title" className={cn("text-base font-semibold leading-none", className)} {...props} />; }
function DialogDescription({ className, ...props }: React.ComponentProps<typeof BaseDialog.Description>) { return <BaseDialog.Description data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />; }
function DialogBody({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="dialog-body" className={cn("min-h-0 overflow-y-auto text-sm", className)} {...props} />; }
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />; }
export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };

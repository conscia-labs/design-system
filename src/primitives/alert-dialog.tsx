"use client";
import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { XIcon } from "lucide-react";
import { modalBackdropClasses, modalPopupClasses, modalViewportClasses, overlayCloseClasses } from "./overlay-layers";
import { cn } from "./utils";

function AlertDialog({ ...props }: React.ComponentProps<typeof BaseAlertDialog.Root>) { return <BaseAlertDialog.Root data-slot="alert-dialog" {...props} />; }
function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof BaseAlertDialog.Trigger>) { return <BaseAlertDialog.Trigger data-slot="alert-dialog-trigger" {...props} />; }
function AlertDialogPortal({ ...props }: React.ComponentProps<typeof BaseAlertDialog.Portal>) { return <BaseAlertDialog.Portal data-slot="alert-dialog-portal" {...props} />; }
function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof BaseAlertDialog.Backdrop>) { return <BaseAlertDialog.Backdrop data-slot="alert-dialog-overlay" className={cn(modalBackdropClasses, className)} {...props} />; }
function AlertDialogContent({ className, children, closeLabel = "Close", ...props }: React.ComponentProps<typeof BaseAlertDialog.Popup> & { closeLabel?: string }) { return <AlertDialogPortal><AlertDialogOverlay /><BaseAlertDialog.Viewport className={modalViewportClasses}><BaseAlertDialog.Popup data-slot="alert-dialog-content" className={cn(modalPopupClasses, "sm:max-w-lg", className)} {...props}>{children}<BaseAlertDialog.Close aria-label={closeLabel} className={overlayCloseClasses}><XIcon aria-hidden="true" /></BaseAlertDialog.Close></BaseAlertDialog.Popup></BaseAlertDialog.Viewport></AlertDialogPortal>; }
function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2 text-left", className)} {...props} />; }
function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof BaseAlertDialog.Title>) { return <BaseAlertDialog.Title data-slot="alert-dialog-title" className={cn("text-base font-semibold", className)} {...props} />; }
function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof BaseAlertDialog.Description>) { return <BaseAlertDialog.Description data-slot="alert-dialog-description" className={cn("text-sm text-text-supporting", className)} {...props} />; }
function AlertDialogBody({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="alert-dialog-body" className={cn("-mx-1 min-h-0 overflow-y-auto px-1 text-sm", className)} {...props} />; }
function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />; }
function AlertDialogCancel({ ...props }: React.ComponentProps<typeof BaseAlertDialog.Close>) { return <BaseAlertDialog.Close data-slot="alert-dialog-cancel" {...props} />; }
function AlertDialogAction({ ...props }: React.ComponentProps<typeof BaseAlertDialog.Close>) { return <BaseAlertDialog.Close data-slot="alert-dialog-action" {...props} />; }
function AlertDialogClose({ ...props }: React.ComponentProps<typeof BaseAlertDialog.Close>) { return <BaseAlertDialog.Close data-slot="alert-dialog-close" {...props} />; }
export { AlertDialog, AlertDialogAction, AlertDialogBody, AlertDialogCancel, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger };

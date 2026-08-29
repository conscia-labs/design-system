"use client";

import * as React from "react";
import { Toast as BaseToast, type ToastObject } from "@base-ui/react/toast";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

type ToastVariant = "default" | "error" | "information" | "success" | "warning";
type ToastPriority = "high" | "low";

type ToastActionOptions = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type ToastOptions = {
  action?: ToastActionOptions;
  description?: React.ReactNode;
  id?: string;
  priority?: ToastPriority;
  timeout?: number;
  title: React.ReactNode;
  variant?: ToastVariant;
};

type ToastUpdateOptions = Partial<ToastOptions>;

type ToastPromiseOptions<Value> = {
  error: string | ToastOptions | ((error: unknown) => string | ToastOptions);
  loading: string | ToastOptions;
  success: string | ToastOptions | ((result: Value) => string | ToastOptions);
};

type ToastData = {
  variant: ToastVariant;
};

type ToastProviderProps = {
  children?: React.ReactNode;
  limit?: number;
  timeout?: number;
};

type ToastViewportProps = React.ComponentProps<"div"> & {
  placement?: "bottom-end" | "bottom-start" | "top-end" | "top-start";
};

type ToastRecord = ToastObject<ToastData>;

function toBaseToastOptions(options: ToastOptions | ToastUpdateOptions) {
  const { action, variant, ...rest } = options;
  return {
    ...rest,
    ...(variant !== undefined ? { type: variant, data: { variant } } : {}),
    ...(action !== undefined
      ? {
          actionProps: {
            children: action.label,
            onClick: action.onClick,
          },
        }
      : {}),
  };
}

function toBasePromiseOption(option: string | ToastOptions) {
  return typeof option === "string" ? option : toBaseToastOptions(option);
}

function ToastProvider({ children, limit = 3, timeout = 5000 }: ToastProviderProps) {
  return (
    <BaseToast.Provider limit={limit} timeout={timeout}>
      {children}
    </BaseToast.Provider>
  );
}

function useToast() {
  const manager = BaseToast.useToastManager<ToastData>();

  return React.useMemo(
    () => ({
      add(options: ToastOptions) {
        const variant = options.variant ?? "default";
        return manager.add({
          ...toBaseToastOptions({ ...options, variant }),
          id: options.id,
        });
      },
      close(id?: string) {
        manager.close(id);
      },
      update(id: string, options: ToastUpdateOptions) {
        manager.update(id, toBaseToastOptions(options));
      },
      promise<Value>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) {
        return manager.promise(promise, {
          loading: toBasePromiseOption(options.loading),
          success: (result) => {
            const next = typeof options.success === "function" ? options.success(result) : options.success;
            return toBasePromiseOption(next);
          },
          error: (error) => {
            const next = typeof options.error === "function" ? options.error(error) : options.error;
            return toBasePromiseOption(next);
          },
        });
      },
    }),
    [manager],
  );
}

function ToastViewport({ className, placement = "bottom-end", ...props }: ToastViewportProps) {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        data-slot="toast-viewport"
        className={cn(
          "pointer-events-none fixed z-[100] flex w-[min(24rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col gap-2 p-4 outline-none",
          placement === "bottom-end" && "right-0 bottom-0 items-end",
          placement === "bottom-start" && "bottom-0 left-0 items-start",
          placement === "top-end" && "top-0 right-0 items-end",
          placement === "top-start" && "top-0 left-0 items-start",
          className,
        )}
        {...props}
      >
        {toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

function Toast({
  children,
  className,
  toast,
  ...props
}: React.ComponentProps<"div"> & { toast: ToastRecord }) {
  const variant = toast.data?.variant ?? (toast.type as ToastVariant | undefined) ?? "default";

  return (
    <BaseToast.Root
      toast={toast}
      data-slot="toast"
      data-variant={variant}
      className={cn(
        "pointer-events-auto relative grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-[var(--ds-radius-surface)] border bg-surface p-4 text-sm text-foreground shadow-[var(--ds-shadow-floating)] outline-none data-ending:animate-out data-starting:animate-in data-[variant=error]:border-danger-border data-[variant=error]:bg-danger-background data-[variant=error]:text-danger-foreground data-[variant=information]:border-information-border data-[variant=information]:bg-information-background data-[variant=information]:text-information-foreground data-[variant=success]:border-success-border data-[variant=success]:bg-success-background data-[variant=success]:text-success-foreground data-[variant=warning]:border-warning-border data-[variant=warning]:bg-warning-background data-[variant=warning]:text-warning-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <ToastContent>
          <div className="min-w-0">
            <ToastTitle />
            <ToastDescription />
          </div>
          <div className="flex items-start gap-1">
            <ToastAction />
            <ToastClose />
          </div>
        </ToastContent>
      )}
    </BaseToast.Root>
  );
}

function ToastContent({ className, ...props }: React.ComponentProps<"div">) {
  return <BaseToast.Content data-slot="toast-content" className={cn("contents", className)} {...props} />;
}

function ToastTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <BaseToast.Title data-slot="toast-title" className={cn("font-semibold", className)} {...props} />;
}

function ToastDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <BaseToast.Description data-slot="toast-description" className={cn("mt-1 text-muted-foreground", className)} {...props} />;
}

function ToastAction({ className, ...props }: React.ComponentProps<"button">) {
  return <BaseToast.Action data-slot="toast-action" className={cn("rounded px-2 py-1 text-xs font-medium text-text-link outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring", className)} {...props} />;
}

function ToastClose({ "aria-label": ariaLabel = "Dismiss notification", children, className, ...props }: React.ComponentProps<"button">) {
  return (
    <BaseToast.Close
      data-slot="toast-close"
      aria-label={ariaLabel}
      className={cn("rounded p-1 text-muted-foreground outline-none hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" className="size-4" />}
    </BaseToast.Close>
  );
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
};
export type {
  ToastActionOptions,
  ToastOptions,
  ToastPriority,
  ToastPromiseOptions,
  ToastProviderProps,
  ToastRecord,
  ToastUpdateOptions,
  ToastVariant,
  ToastViewportProps,
};

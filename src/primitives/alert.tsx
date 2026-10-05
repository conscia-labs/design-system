import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

type AlertContextValue = {
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: (id: string) => void;
  registerDescription: (id: string) => void;
};

const AlertContext = React.createContext<AlertContextValue | null>(null);

const alertVariants = cva(
  "relative grid w-full grid-cols-[minmax(0,1fr)] items-start gap-x-3 rounded-[var(--ds-radius-surface)] border px-4 py-3.5 text-sm has-[>svg]:grid-cols-[auto_minmax(0,1fr)] [&>svg]:col-start-1 [&>svg]:row-span-2 [&>svg]:mt-0.5 [&>svg]:size-5 [&:has(>svg)>[data-slot=alert-title]]:col-start-2 [&:has(>svg)>[data-slot=alert-description]]:col-start-2",
  {
    variants: {
      variant: {
        default: "border-border-default bg-surface text-text-primary",
        information:
          "border-information-border bg-information-background text-information-foreground",
        success:
          "border-success-border bg-success-background text-success-foreground",
        warning:
          "border-warning-border bg-warning-background text-warning-foreground",
        danger: "border-danger-border bg-danger-background text-danger-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;

function Alert({
  children,
  className,
  variant,
  role = "group",
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...props
}: AlertProps) {
  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const [registeredTitleId, setRegisteredTitleId] = React.useState<string>();
  const [registeredDescriptionId, setRegisteredDescriptionId] = React.useState<string>();
  const registerTitle = React.useCallback((id: string) => setRegisteredTitleId(id), []);
  const registerDescription = React.useCallback((id: string) => setRegisteredDescriptionId(id), []);

  return (
    <AlertContext.Provider value={{ titleId, descriptionId, hasTitle: Boolean(registeredTitleId), hasDescription: Boolean(registeredDescriptionId), registerTitle, registerDescription }}>
      <div
        data-slot="alert"
        role={role}
        aria-labelledby={ariaLabelledby ?? registeredTitleId}
        aria-describedby={ariaDescribedby ?? registeredDescriptionId}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </AlertContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  const context = React.useContext(AlertContext);
  const id = props.id ?? context?.titleId;
  React.useEffect(() => {
    if (id) context?.registerTitle(id);
  }, [context, id]);

  return (
    <div
      data-slot="alert-title"
      id={id}
      className={cn("col-start-1 min-w-0 break-words font-semibold leading-5", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  const context = React.useContext(AlertContext);
  const id = props.id ?? context?.descriptionId;
  React.useEffect(() => {
    if (id) context?.registerDescription(id);
  }, [context, id]);

  return (
    <div
      data-slot="alert-description"
      id={id}
      className={cn("col-start-1 mt-1 min-w-0 break-words text-sm leading-5", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
export type { AlertProps };

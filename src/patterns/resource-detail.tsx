import * as React from "react";

import { cn } from "../primitives/utils";

type ResourceSummaryProps = React.ComponentProps<"section"> & {
  variant?: "plain" | "surface";
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
};

function ResourceSummary({
  variant = "plain",
  title,
  description,
  status,
  metadata,
  actions,
  className,
  children,
  ...props
}: ResourceSummaryProps) {
  return (
    <section
      data-slot="resource-summary"
      className={cn(
        "px-5 py-4",
        variant === "plain" && "border-b border-border-subtle bg-background",
        variant === "surface" &&
          "rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {title || status ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {title ? (
                <h2 className="truncate text-[var(--ds-section-title)] font-semibold">
                  {title}
                </h2>
              ) : null}
              {status}
            </div>
          ) : null}
          {description ? (
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
          {metadata ? (
            <div className="mt-2 text-[var(--ds-metadata)] text-muted-foreground">
              {metadata}
            </div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

function DetailSections({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-sections"
      className={cn("flex flex-col gap-[var(--ds-space-section)]", className)}
      {...props}
    />
  );
}

type DetailSectionProps = React.ComponentProps<"section"> & {
  variant?: "surface" | "open";
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

function DetailSection({
  variant = "surface",
  title,
  description,
  actions,
  className,
  children,
  ...props
}: DetailSectionProps) {
  return (
    <section
      data-slot="detail-section"
      className={cn(
        variant === "surface" &&
          "rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-[var(--ds-surface-padding)]",
        variant === "open" && "border-b border-border-subtle pb-[var(--ds-space-section)]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[var(--ds-section-title)] font-semibold">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

function KeyValueList({
  className,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="key-value-list"
      className={cn("grid gap-3 text-sm", className)}
      {...props}
    />
  );
}

function KeyValueItem({
  label,
  value,
  breakValue = false,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  breakValue?: boolean;
}) {
  return (
    <div data-slot="key-value-item" className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-right font-medium",
          breakValue && "break-all",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export {
  DetailSection,
  DetailSections,
  KeyValueItem,
  KeyValueList,
  ResourceSummary,
};
export type { DetailSectionProps, ResourceSummaryProps };

import * as React from "react";

import { cn } from "../primitives/utils";

type WorkbenchShellProps = React.ComponentProps<"div">;

function WorkbenchShell({ className, ...props }: WorkbenchShellProps) {
  return <div data-slot="workbench-shell" className={cn("min-w-0", className)} {...props} />;
}

type WorkbenchRailProps = React.ComponentProps<"aside"> & {
  variant?: "global" | "secondary";
  open?: boolean;
};

function WorkbenchRail({ variant = "secondary", open = true, className, ...props }: WorkbenchRailProps) {
  return (
    <aside
      data-slot="workbench-rail"
      data-variant={variant}
      data-open={open ? "true" : "false"}
      className={cn("min-w-0", className)}
      {...props}
    />
  );
}

function WorkbenchMain({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="workbench-main" className={cn("min-w-0", className)} {...props} />;
}

function WorkbenchInspector({ className, ...props }: React.ComponentProps<"aside">) {
  return <aside data-slot="workbench-inspector" className={cn("min-w-0", className)} {...props} />;
}

function WorkbenchMobileToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="workbench-mobile-toolbar" className={cn(className)} {...props} />;
}

function WorkbenchBackdrop({ open = true, className, ...props }: React.ComponentProps<"button"> & { open?: boolean }) {
  return (
    <button
      type="button"
      data-slot="workbench-backdrop"
      data-open={open ? "true" : "false"}
      className={cn(className)}
      {...props}
    />
  );
}

type WorkbenchSectionProps = React.ComponentProps<"section">;

function WorkbenchSection({ className, ...props }: WorkbenchSectionProps) {
  return <section data-slot="workbench-section" className={cn(className)} {...props} />;
}

type WorkbenchSectionHeaderProps = React.ComponentProps<"div"> & {
  title: React.ReactNode;
  metadata?: React.ReactNode;
  action?: React.ReactNode;
};

function WorkbenchSectionHeader({ title, metadata, action, className, ...props }: WorkbenchSectionHeaderProps) {
  return (
    <div data-slot="workbench-section-header" className={cn(className)} {...props}>
      <div data-slot="workbench-section-heading">
        <h2>{title}</h2>
        {metadata ? <span>{metadata}</span> : null}
      </div>
      {action ? <div data-slot="workbench-section-action">{action}</div> : null}
    </div>
  );
}

type ResourceRowProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "a" | "button";
  href?: string;
  selected?: boolean;
};

function ResourceRow({ as = "div", href, selected = false, className, children, ...props }: ResourceRowProps) {
  return React.createElement(
    as,
    {
      ...props,
      ...(as === "a" && href ? { href } : {}),
      ...(as === "button" ? { type: "button" } : {}),
      "data-slot": "resource-row",
      "data-selected": selected ? "true" : "false",
      className: cn(className),
    },
    children,
  );
}

function ResourceRowIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="resource-row-icon" className={cn(className)} {...props} />;
}

function ResourceRowContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="resource-row-content" className={cn(className)} {...props} />;
}

function ResourceRowTitle({ className, ...props }: React.ComponentProps<"strong">) {
  return <strong data-slot="resource-row-title" className={cn(className)} {...props} />;
}

function ResourceRowDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="resource-row-description" className={cn(className)} {...props} />;
}

function ResourceRowMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="resource-row-meta" className={cn(className)} {...props} />;
}

type WorkbenchInspectorSectionProps = React.ComponentProps<"section"> & {
  label: React.ReactNode;
  action?: React.ReactNode;
};

function WorkbenchInspectorSection({ label, action, className, children, ...props }: WorkbenchInspectorSectionProps) {
  return (
    <section data-slot="workbench-inspector-section" className={cn(className)} {...props}>
      <div data-slot="workbench-inspector-label">
        <h3>{label}</h3>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

type IdentityRowProps = React.ComponentProps<"div"> & {
  initials: React.ReactNode;
  name: React.ReactNode;
  detail?: React.ReactNode;
  compact?: boolean;
};

function IdentityRow({ initials, name, detail, compact = false, className, ...props }: IdentityRowProps) {
  return (
    <div data-slot="identity-row" data-compact={compact ? "true" : "false"} className={cn(className)} {...props}>
      <span data-slot="identity-avatar">{initials}</span>
      <span data-slot="identity-copy">
        <strong>{name}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
    </div>
  );
}

export {
  IdentityRow,
  ResourceRow,
  ResourceRowContent,
  ResourceRowDescription,
  ResourceRowIcon,
  ResourceRowMeta,
  ResourceRowTitle,
  WorkbenchBackdrop,
  WorkbenchInspector,
  WorkbenchInspectorSection,
  WorkbenchMain,
  WorkbenchMobileToolbar,
  WorkbenchRail,
  WorkbenchSection,
  WorkbenchSectionHeader,
  WorkbenchShell,
};
export type {
  IdentityRowProps,
  ResourceRowProps,
  WorkbenchInspectorSectionProps,
  WorkbenchRailProps,
  WorkbenchSectionHeaderProps,
  WorkbenchSectionProps,
  WorkbenchShellProps,
};

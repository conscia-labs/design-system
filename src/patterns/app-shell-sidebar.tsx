"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { PanelLeftIcon, Search, X } from "lucide-react";
import { BrandIcon } from "../primitives/brand-icon";
import { Button, IconButton, type IconButtonProps } from "../primitives/button";
import { Input } from "../primitives/input";
import { ShortcutHint } from "../primitives/shortcut-hint";
import { Separator } from "../primitives/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../primitives/sheet";
import { cn } from "../primitives/utils";
import { useAppShell, useSidebarOverflow } from "./app-shell-state";

function AppSidebar({
  side = "left",
  variant = "auto",
  treatment,
  activeStyle = "auto",
  className,
  children,
  title = "Application navigation",
  description = "Primary product navigation.",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<"aside"> & {
  side?: "left" | "right";
  /**
   * Use the appearance-aware sidebar by default; explicit variants remain
   * available. `brand` paints the sidebar Conscia burgundy in both
   * appearances, as on conscia.com.
   */
  variant?: "light" | "dark" | "auto" | "brand";
  /** Apply a low-chroma treatment while preserving the active appearance. */
  treatment?: "quiet";
  /**
   * How the active item stands out. `auto` follows the mood; `tint` is the
   * variant's soft fill in every mood; `solid` inverts the sidebar colors
   * into a pill, in any variant and mood.
   */
  activeStyle?: "auto" | "tint" | "solid";
  title?: string;
  description?: string;
}) {
  const { mobileOpen, setMobileOpen, setSidebarSide } = useAppShell();

  React.useEffect(() => {
    setSidebarSide(side);
  }, [setSidebarSide, side]);

  return (
    <>
      <Sheet side={side} open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side={side}
          data-sidebar-variant={variant}
          data-sidebar-treatment={treatment}
          data-sidebar-active={activeStyle}
          data-chrome={variant === "brand" ? "brand" : undefined}
          className="w-[var(--ds-sidebar-width-mobile)] border-sidebar-border bg-sidebar-canvas p-0 text-sidebar-primary-text [&>[data-slot=sheet-close]]:right-3 [&>[data-slot=sheet-close]]:top-3 [&>[data-slot=sheet-close]]:text-sidebar-secondary-text [&>[data-slot=sheet-close]]:hover:text-sidebar-primary-text"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex h-full min-h-0 flex-col">{children}</div>
        </SheetContent>
      </Sheet>

      <aside
        data-slot="app-sidebar"
        data-side={side}
        data-sidebar-variant={variant}
        data-sidebar-treatment={treatment}
        data-sidebar-active={activeStyle}
        data-chrome={variant === "brand" ? "brand" : undefined}
        aria-label={ariaLabelledBy ? undefined : ariaLabel ?? title}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          // --ds-app-sidebar-inset and -radius are 0 by default; a mood floats the sidebar as a rounded panel.
          "fixed inset-y-[var(--ds-app-sidebar-inset)] z-20 hidden w-[var(--ds-app-sidebar-width)] shrink-0 flex-col rounded-[var(--ds-app-sidebar-radius)] border-sidebar-border bg-sidebar-canvas text-sidebar-primary-text transition-[width] duration-[var(--ds-duration-base)] ease-linear lg:flex",
          side === "left" ? "left-[var(--ds-app-sidebar-inset)] border-r" : "right-[var(--ds-app-sidebar-inset)] border-l",
          "group-data-[sidebar-state=collapsed]/shell:w-[var(--ds-app-sidebar-width)]",
          "group-data-[header-layout=integrated]/shell:top-[calc(var(--ds-topbar-height)+var(--ds-app-sidebar-inset))]",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

function AppSidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-header"
      className={cn(
        "flex min-h-[var(--ds-topbar-height)] min-w-0 shrink-0 items-center overflow-hidden border-b border-sidebar-border bg-sidebar-header px-3",
        className,
      )}
      {...props}
    />
  );
}

function AppSidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { contentRef, hasScrollBefore, hasScrollAfter } = useSidebarOverflow();

  return (
    <div
      data-slot="app-sidebar-content"
      data-scroll-before={hasScrollBefore ? "true" : undefined}
      data-scroll-after={hasScrollAfter ? "true" : undefined}
      ref={contentRef}
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--ds-sidebar-group-gap)] overflow-x-clip overflow-y-auto bg-sidebar-content px-[var(--ds-sidebar-content-padding-x)] py-[var(--ds-sidebar-content-padding-y)]",
        className,
      )}
      {...props}
    />
  );
}

function AppSidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-footer"
      className={cn(
        "mt-auto flex min-w-0 shrink-0 flex-col gap-2 overflow-hidden border-t border-sidebar-border bg-sidebar-footer p-[var(--ds-sidebar-footer-padding)]",
        className,
      )}
      {...props}
    />
  );
}

function ProductIdentity({
  label,
  description,
  icon,
  collapsedLabel,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  collapsedLabel?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="product-identity"
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      {icon ? (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-control)] bg-sidebar-hover text-sidebar-icon">
          {icon}
        </div>
      ) : null}
      {collapsedLabel && !icon ? (
        <div className="hidden shrink-0 items-center justify-center rounded-[var(--ds-radius-control)] bg-sidebar-hover px-2 py-1 text-xs font-semibold text-sidebar-primary-text group-data-[sidebar-state=collapsed]/shell:flex">
          {collapsedLabel}
        </div>
      ) : null}
      <div className="min-w-0 group-data-[sidebar-state=collapsed]/shell:hidden">
        <div className="ds-type-navigation truncate font-semibold text-sidebar-primary-text">
          {label}
        </div>
        {description ? (
          <div className="ds-type-metadata truncate text-sidebar-metadata-text">
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type BrandLockupProps = Omit<React.ComponentProps<"a">, "children" | "render"> & {
  /** The product name set after "Conscia", such as "Beacon". */
  product: string;
  /** Links the lockup home. Without href or render it is plain text. */
  href?: string;
  /** Renders the home link through a router link, such as `<Link href="/" />`. */
  render?: useRender.ComponentProps<"a">["render"];
  /** sm is a 24px mark with 14px text, md 32px with 16px, lg 36px with 18px. */
  size?: "sm" | "md" | "lg";
};

const brandLockupSizes = {
  sm: { root: "gap-2 text-sm", mark: "size-6" },
  md: { root: "gap-2.5 text-base", mark: "size-8" },
  lg: { root: "gap-3 text-lg", mark: "size-9" },
} as const;

/**
 * The Conscia lockup: the mark, then "Conscia" and the product name on one
 * line. Put it in AppSidebarHeader and AppHeaderBrand. Its colors follow the
 * sidebar or header around it, and styles.css reduces it to the mark in a
 * collapsed sidebar and to the mark and product name in a phone header.
 */
function BrandLockup({
  product,
  href,
  render,
  size = "md",
  className,
  ...props
}: BrandLockupProps) {
  const sizes = brandLockupSizes[size];

  return useRender({
    defaultTagName: href || render ? "a" : "div",
    render,
    props: {
      "data-slot": "brand-lockup",
      "data-size": size,
      href,
      className: cn(
        "relative flex min-w-0 shrink-0 items-center rounded-[var(--ds-radius-control)] leading-tight outline-none focus-visible:ring-[3px] focus-visible:ring-(--ds-lockup-focus)/50",
        sizes.root,
        className,
      ),
      ...props,
      children: (
        <>
          <BrandIcon
            data-slot="brand-lockup-mark"
            className={cn(sizes.mark, "text-(--ds-lockup-mark) dark:text-(--ds-lockup-mark)")}
          />
          {/* Inline spans share a baseline; the space keeps the accessible name "Conscia <product>". */}
          <span data-slot="brand-lockup-text" className="min-w-0 truncate">
            <span data-slot="brand-lockup-name" className="font-semibold text-(--ds-lockup-name)">
              Conscia
            </span>{" "}
            <span data-slot="brand-lockup-product" className="font-normal text-(--ds-lockup-product)">
              {product}
            </span>
          </span>
        </>
      ),
    },
  });
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="app-sidebar-separator"
      className={cn("bg-sidebar-border", className)}
      {...props}
    />
  );
}

/**
 * Place this control inside AppHeader or TopBar, not AppSidebar, so it remains available
 * after the sidebar collapses and in the mobile drawer layout.
 */
function SidebarTrigger({
  className,
  "aria-label": ariaLabel,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "aria-labelledby">) {
  const { isMobile, mobileOpen, sidebarOpen, toggleSidebar } = useAppShell();
  const triggerProps = {
    ...props,
    "data-slot": "sidebar-trigger",
    type: "button" as const,
    variant: "ghost" as const,
    className: cn(
      "shrink-0 cursor-pointer text-text-supporting hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus-ring",
      className,
    ),
    "aria-label": ariaLabel ?? "Toggle navigation",
    "aria-expanded": isMobile ? mobileOpen : sidebarOpen,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      toggleSidebar();
    },
  } as IconButtonProps;

  return (
    <IconButton {...triggerProps}>
      <PanelLeftIcon />
      <span className="sr-only">Toggle navigation</span>
    </IconButton>
  );
}

type SidebarSearchProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  triggerLabel?: string;
  shortcut?: string;
};

/**
 * Shared search affordance for sidebars. Applications own query state and
 * filtering; this component owns the compact trigger, focus handoff, and
 * keyboard-accessible expanded field.
 */
function SidebarSearch({
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  triggerLabel = "Search navigation",
  shortcut,
  className,
  onKeyDown,
  ...props
}: SidebarSearchProps) {
  const [expandedState, setExpandedState] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const mountedRef = React.useRef(false);

  const setExpanded = React.useCallback(
    (nextExpanded: boolean) => {
      if (expandedProp === undefined) {
        setExpandedState(nextExpanded);
      }
      onExpandedChange?.(nextExpanded);
    },
    [expandedProp, onExpandedChange],
  );

  React.useEffect(() => {
    if (expanded) {
      queueMicrotask(() => inputRef.current?.focus());
    } else if (mountedRef.current) {
      queueMicrotask(() => triggerRef.current?.focus());
    }

    mountedRef.current = true;
  }, [expanded]);

  if (!expanded) {
    return (
      <button
        ref={triggerRef}
        type="button"
        data-slot="sidebar-search-trigger"
        className={cn(
          "ds-type-navigation flex min-h-[var(--ds-sidebar-item-height-touch)] w-full cursor-pointer items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-left font-normal text-sidebar-group-count outline-none transition-colors hover:bg-sidebar-hover hover:text-sidebar-primary-text focus-visible:ring-[3px] focus-visible:ring-sidebar-focus-ring lg:min-h-[var(--ds-sidebar-item-height)]",
          "group-data-[sidebar-state=collapsed]/shell:justify-center group-data-[sidebar-state=collapsed]/shell:px-0",
          className,
        )}
        onClick={() => setExpanded(true)}
        aria-label={triggerLabel}
      >
        <Search className="size-4 shrink-0 text-sidebar-icon" />
        <span className="truncate group-data-[sidebar-state=collapsed]/shell:hidden">
          {triggerLabel}
        </span>
        {shortcut ? (
          <ShortcutHint className="ds-type-metadata ml-auto border-sidebar-border bg-transparent text-sidebar-metadata-text group-data-[sidebar-state=collapsed]/shell:hidden">
            {shortcut}
          </ShortcutHint>
        ) : null}
      </button>
    );
  }

  return (
    <div
      data-slot="sidebar-search"
      data-expanded="true"
      className={cn(
        "flex min-h-[var(--ds-sidebar-item-height-touch)] items-center gap-2 rounded-[var(--ds-radius-control)] border border-sidebar-border bg-sidebar-search px-2 text-sidebar-primary-text shadow-[var(--ds-shadow-raised)] lg:min-h-[var(--ds-sidebar-item-height)]",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-sidebar-icon" />
      <Input
        ref={inputRef}
        type="search"
        className="ds-type-control h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-1 shadow-none focus-visible:border-0 focus-visible:ring-0"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setExpanded(false);
          }
          onKeyDown?.(event);
        }}
        {...props}
      />
      <button
        type="button"
        data-slot="sidebar-search-close"
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-[var(--ds-radius-control)] text-sidebar-secondary-text outline-none transition-colors hover:bg-sidebar-hover hover:text-sidebar-primary-text focus-visible:ring-2 focus-visible:ring-sidebar-focus-ring"
        onClick={() => {
          setExpanded(false);
        }}
        aria-label="Close search"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export {
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  BrandLockup,
  ProductIdentity,
  SidebarSearch,
  SidebarSeparator,
  SidebarTrigger,
  brandLockupSizes,
};

export type {
  BrandLockupProps,
  SidebarSearchProps,
};

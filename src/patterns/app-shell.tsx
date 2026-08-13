"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeftIcon, Search, X } from "lucide-react";

import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Separator } from "../primitives/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../primitives/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";
import { cn } from "../primitives/utils";

const SIDEBAR_COOKIE_NAME = "conscia_sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SIDEBAR_STORAGE_KEY = "conscia-sidebar-open:v1";
const SIDEBAR_STATE_CHANGE_EVENT = "conscia-sidebar-state-change";

function parseSidebarOpen(value: string | null) {
  return value === "true" ? true : value === "false" ? false : null;
}

function readPersistedSidebarOpen() {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    const storedSidebarOpen = parseSidebarOpen(storedValue);

    if (storedSidebarOpen !== null) {
      return storedSidebarOpen;
    }
  } catch {
    // Fall back to the cookie when storage is unavailable.
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${SIDEBAR_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  const value = cookie.slice(SIDEBAR_COOKIE_NAME.length + 1);

  return parseSidebarOpen(value);
}

function persistSidebarOpen(open: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  } catch {
    // The cookie still preserves the preference when storage is unavailable.
  }

  document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  window.dispatchEvent(new Event(SIDEBAR_STATE_CHANGE_EVENT));
}

function subscribeToSidebarOpen(onStoreChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === SIDEBAR_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener(SIDEBAR_STATE_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(SIDEBAR_STATE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

type AppShellContextValue = {
  sidebarState: "expanded" | "collapsed";
  sidebarSide: "left" | "right";
  setSidebarSide: (side: "left" | "right") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

function useAppShell() {
  const context = React.useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShell must be used within AppShell.");
  }

  return context;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

function AppShell({
  defaultSidebarOpen = true,
  children,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  defaultSidebarOpen?: boolean;
}) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [sidebarOpen, setSidebarOpenState] = React.useState(defaultSidebarOpen);
  const [sidebarSide, setSidebarSide] = React.useState<"left" | "right">("left");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    function syncSidebarOpen() {
      setSidebarOpenState(readPersistedSidebarOpen() ?? defaultSidebarOpen);
    }

    const unsubscribe = subscribeToSidebarOpen(syncSidebarOpen);
    queueMicrotask(syncSidebarOpen);

    return unsubscribe;
  }, [defaultSidebarOpen]);

  const setSidebarOpen = React.useCallback((open: boolean) => {
    persistSidebarOpen(open);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setMobileOpen((current) => !current);
      return;
    }

    persistSidebarOpen(!sidebarOpen);
  }, [isMobile, sidebarOpen]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const contextValue = React.useMemo<AppShellContextValue>(
    () => ({
      sidebarState: sidebarOpen ? "expanded" : "collapsed",
      sidebarSide,
      setSidebarSide,
      sidebarOpen,
      setSidebarOpen,
      mobileOpen,
      setMobileOpen,
      isMobile,
      toggleSidebar,
    }),
    [
      isMobile,
      mobileOpen,
      setSidebarOpen,
      sidebarOpen,
      sidebarSide,
      toggleSidebar,
    ],
  );

  return (
    <AppShellContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={120}>
        <div
          data-slot="app-shell"
          data-sidebar-state={sidebarOpen ? "expanded" : "collapsed"}
          data-sidebar-side={sidebarSide}
          suppressHydrationWarning
          className={cn(
            "group/shell min-h-svh bg-canvas text-foreground",
            "[--ds-app-sidebar-width:var(--ds-sidebar-width)] [--ds-app-sidebar-width-mobile:var(--ds-sidebar-width-mobile)] data-[sidebar-state=collapsed]:[--ds-app-sidebar-width:3.5rem]",
            className,
          )}
          style={style}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </AppShellContext.Provider>
  );
}

function AppSidebar({
  side = "left",
  variant = "dark",
  className,
  children,
  title = "Application navigation",
  description = "Primary product navigation.",
  ...props
}: React.ComponentProps<"aside"> & {
  side?: "left" | "right";
  /** Preserve the historical dark sidebar by default; auto follows appearance. */
  variant?: "light" | "dark" | "auto";
  title?: string;
  description?: string;
}) {
  const { mobileOpen, setMobileOpen, setSidebarSide } = useAppShell();

  React.useEffect(() => {
    setSidebarSide(side);
  }, [setSidebarSide, side]);

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side={side}
          data-sidebar-variant={variant}
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
        className={cn(
          "fixed inset-y-0 z-20 hidden w-[var(--ds-app-sidebar-width)] shrink-0 flex-col border-sidebar-border bg-sidebar-canvas text-sidebar-primary-text transition-[width] duration-200 ease-linear lg:flex",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          "group-data-[sidebar-state=collapsed]/shell:w-[var(--ds-app-sidebar-width)]",
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
  return (
    <div
      data-slot="app-sidebar-content"
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--ds-sidebar-group-gap)] overflow-x-hidden overflow-y-auto bg-sidebar-content px-[var(--ds-sidebar-content-padding-x)] py-[var(--ds-sidebar-content-padding-y)]",
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
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
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
      <div className="min-w-0 group-data-[sidebar-state=collapsed]/shell:hidden">
        <div className="truncate text-sm font-semibold leading-5 text-sidebar-primary-text">
          {label}
        </div>
        {description ? (
          <div className="truncate text-[var(--ds-metadata)] leading-4 text-sidebar-metadata-text">
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
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

function NavigationGroup({
  label,
  count,
  children,
  className,
}: {
  label?: React.ReactNode;
  count?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="navigation-group"
      className={cn("flex min-w-0 flex-col gap-1", className)}
    >
      {label ? (
        <div
          data-slot="navigation-group-label"
          className="flex min-h-6 items-center gap-2 px-2 pb-1 pt-2 text-[length:var(--ds-sidebar-group-label-size)] font-semibold uppercase leading-5 tracking-[0.08em] text-sidebar-group-label group-data-[sidebar-state=collapsed]/shell:hidden"
        >
          {label}
          {count !== undefined ? (
            <span className="ml-auto shrink-0 text-[length:var(--ds-metadata)] font-medium normal-case tracking-normal text-sidebar-group-count">
              {count}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </section>
  );
}

function navigationItemClasses(active?: boolean) {
  return cn(
    "flex min-h-[var(--ds-sidebar-item-height-touch)] min-w-0 cursor-pointer items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-sm font-medium text-sidebar-secondary-text outline-none transition-colors duration-150 lg:h-[var(--ds-sidebar-item-height)] lg:min-h-0",
    "hover:bg-sidebar-hover hover:text-sidebar-primary-text",
    "focus-visible:ring-[3px] focus-visible:ring-sidebar-focus-ring",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    "group-data-[sidebar-state=collapsed]/shell:justify-center group-data-[sidebar-state=collapsed]/shell:px-0",
    "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75] [&>svg]:text-sidebar-icon",
    active &&
      "bg-sidebar-active text-sidebar-active-foreground shadow-[inset_3px_0_0_var(--sidebar-active-indicator)] hover:bg-sidebar-active hover:text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground",
  );
}

function NavigationItem({
  asChild = false,
  active = false,
  tooltip,
  type,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  active?: boolean;
  tooltip?: string;
}) {
  const Comp = asChild ? Slot : "button";
  const { sidebarState, sidebarSide, isMobile } = useAppShell();
  const item = (
    <Comp
      data-slot="navigation-item"
      data-active={active ? "true" : undefined}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(navigationItemClasses(active), className)}
      {...props}
    >
      {children}
    </Comp>
  );

  if (!tooltip) {
    return item;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent
        side={sidebarSide === "left" ? "right" : "left"}
        align="center"
        hidden={sidebarState !== "collapsed" || isMobile}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function NavigationSubItem({
  asChild = false,
  active = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  active?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="navigation-sub-item"
      data-active={active ? "true" : undefined}
      className={cn(
        "flex min-h-[var(--ds-sidebar-item-height-touch)] min-w-0 cursor-pointer items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-sm text-sidebar-secondary-text outline-none transition-colors duration-150 lg:h-[calc(var(--ds-sidebar-item-height)-0.25rem)] lg:min-h-0",
        "hover:bg-sidebar-hover hover:text-sidebar-primary-text focus-visible:ring-[3px] focus-visible:ring-sidebar-focus-ring",
        "group-data-[sidebar-state=collapsed]/shell:hidden [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75] [&>svg]:text-sidebar-icon",
        active &&
          "bg-sidebar-active text-sidebar-active-foreground shadow-[inset_3px_0_0_var(--sidebar-active-indicator)] hover:bg-sidebar-active hover:text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground",
        className,
      )}
      {...props}
    />
  );
}

function NavigationSubList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-sub-list"
      className={cn(
        "ml-4 flex min-w-0 flex-col gap-1 border-l border-sidebar-border pl-2 group-data-[sidebar-state=collapsed]/shell:hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Place this control inside TopBar, not AppSidebar, so it remains available
 * after the sidebar collapses and in the mobile drawer layout.
 */
function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isMobile, mobileOpen, sidebarOpen, toggleSidebar } = useAppShell();

  return (
    <Button
      data-slot="sidebar-trigger"
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "shrink-0 cursor-pointer text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring",
        className,
      )}
      aria-expanded={isMobile ? mobileOpen : sidebarOpen}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle navigation</span>
    </Button>
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
          "flex min-h-[var(--ds-sidebar-item-height-touch)] w-full cursor-pointer items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-left text-sm font-medium text-sidebar-secondary-text outline-none transition-colors hover:bg-sidebar-hover hover:text-sidebar-primary-text focus-visible:ring-[3px] focus-visible:ring-sidebar-focus-ring lg:min-h-[var(--ds-sidebar-item-height)]",
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
          <kbd className="ml-auto rounded border border-sidebar-border px-1.5 py-0.5 text-[length:var(--ds-metadata)] font-medium text-sidebar-metadata-text group-data-[sidebar-state=collapsed]/shell:hidden">
            {shortcut}
          </kbd>
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
        className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0"
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

function MainRegion({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="main-region"
      className={cn(
        "flex min-h-svh min-w-0 w-full flex-1 flex-col transition-[padding] duration-200 ease-linear",
        "group-data-[sidebar-side=left]/shell:lg:pl-[var(--ds-app-sidebar-width)] group-data-[sidebar-side=right]/shell:lg:pr-[var(--ds-app-sidebar-width)]",
        className,
      )}
      {...props}
    />
  );
}

function TopBar({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="top-bar"
      className={cn(
        "sticky top-0 z-10 flex min-h-[var(--ds-topbar-height)] shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-background/96 px-3 backdrop-blur md:px-4",
        "supports-[backdrop-filter]:bg-background/88",
        className,
      )}
      {...props}
    />
  );
}

function PageFrame({
  width = "full",
  className,
  ...props
}: React.ComponentProps<"main"> & {
  width?: "full" | "wide" | "focused" | "reading";
}) {
  return (
    <main
      data-slot="page-frame"
      data-width={width}
      className={cn(
        "min-w-0 w-full flex-1 px-3 py-[var(--ds-space-section)] md:px-[var(--ds-space-page)]",
        width === "wide" && "mx-auto w-full max-w-[86rem]",
        width === "focused" && "mx-auto w-full max-w-[64rem]",
        width === "reading" && "mx-auto w-full max-w-[48rem]",
        className,
      )}
      {...props}
    />
  );
}

function PageContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-content"
      className={cn("flex min-w-0 flex-col gap-[var(--ds-space-section)]", className)}
      {...props}
    />
  );
}

function PageBoundary({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-boundary"
      className={cn(
        "rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-[var(--ds-surface-padding)]",
        className,
      )}
      {...props}
    />
  );
}

function InspectorRegion({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="inspector-region"
      className={cn(
        "w-full border-l border-border-subtle bg-surface md:w-[20rem] xl:w-[24rem]",
        className,
      )}
      {...props}
    />
  );
}

export {
  AppShell,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  InspectorRegion,
  MainRegion,
  NavigationGroup,
  NavigationItem,
  NavigationSubItem,
  NavigationSubList,
  PageBoundary,
  PageContent,
  PageFrame,
  ProductIdentity,
  SidebarSeparator,
  SidebarSearch,
  SidebarTrigger,
  TopBar,
  useAppShell,
};

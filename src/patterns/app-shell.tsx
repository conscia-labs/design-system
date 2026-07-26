"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeftIcon } from "lucide-react";

import { Button } from "../primitives/button";
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
            "[--ds-app-sidebar-width:16rem] [--ds-app-sidebar-width-mobile:18rem] data-[sidebar-state=collapsed]:[--ds-app-sidebar-width:3.5rem]",
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
  className,
  children,
  title = "Application navigation",
  description = "Primary product navigation.",
  ...props
}: React.ComponentProps<"aside"> & {
  side?: "left" | "right";
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
          className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground [&>[data-slot=sheet-close]]:right-3 [&>[data-slot=sheet-close]]:top-3 [&>[data-slot=sheet-close]]:text-sidebar-foreground/64 [&>[data-slot=sheet-close]]:hover:text-sidebar-foreground"
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
        className={cn(
          "fixed inset-y-0 z-20 hidden w-[var(--ds-app-sidebar-width)] shrink-0 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-linear lg:flex",
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
        "flex min-h-14 shrink-0 items-center border-b border-sidebar-border px-3",
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
        "flex min-h-0 flex-1 flex-col gap-[var(--ds-space-control)] overflow-y-auto px-2.5 py-3",
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
        "mt-auto flex shrink-0 flex-col gap-2 border-t border-sidebar-border p-2.5",
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
        <div className="flex size-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-control)] bg-sidebar-accent text-sidebar-foreground">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 group-data-[sidebar-state=collapsed]/shell:hidden">
        <div className="truncate text-sm font-semibold leading-5 text-sidebar-foreground">
          {label}
        </div>
        {description ? (
          <div className="truncate text-[var(--ds-metadata)] leading-4 text-sidebar-foreground/62">
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
  children,
  className,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="navigation-group"
      className={cn("flex min-w-0 flex-col gap-1", className)}
    >
      {label ? (
        <div className="px-2 pb-1 pt-2 text-[0.6875rem] font-medium uppercase tracking-normal text-sidebar-foreground/52 group-data-[sidebar-state=collapsed]/shell:hidden">
          {label}
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </section>
  );
}

function navigationItemClasses(active?: boolean) {
  return cn(
    "flex h-11 min-w-0 items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-sm font-medium text-sidebar-foreground/78 outline-none transition-colors duration-150 lg:h-[var(--ds-sidebar-item-height)]",
    "hover:bg-sidebar-accent hover:text-sidebar-foreground",
    "focus-visible:ring-[3px] focus-visible:ring-ring/35",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "group-data-[sidebar-state=collapsed]/shell:justify-center group-data-[sidebar-state=collapsed]/shell:px-0",
    "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]",
    active &&
      "bg-sidebar-active text-sidebar-active-foreground shadow-[inset_2px_0_0_var(--sidebar-active-indicator)] hover:bg-sidebar-active hover:text-sidebar-active-foreground",
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
        "flex h-11 min-w-0 items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-sm text-sidebar-foreground/72 outline-none transition-colors duration-150 lg:h-[calc(var(--ds-sidebar-item-height)-0.25rem)]",
        "hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35",
        "group-data-[sidebar-state=collapsed]/shell:hidden [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]",
        active &&
          "bg-sidebar-active text-sidebar-active-foreground shadow-[inset_2px_0_0_var(--sidebar-active-indicator)] hover:bg-sidebar-active hover:text-sidebar-active-foreground",
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

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useAppShell();

  return (
    <Button
      data-slot="sidebar-trigger"
      type="button"
      variant="ghost"
      size="icon"
      className={cn("shrink-0", className)}
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
        "sticky top-0 z-10 flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-background/96 px-3 backdrop-blur md:px-4",
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
  SidebarTrigger,
  TopBar,
  useAppShell,
};

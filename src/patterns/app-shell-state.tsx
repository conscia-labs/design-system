"use client";

import * as React from "react";
import { TooltipProvider } from "../primitives/tooltip";
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

type AppShellProps = React.ComponentProps<"div"> & {
  defaultSidebarOpen?: boolean;
  /** Controls the desktop sidebar. The shell then stops persisting the state itself. */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /**
   * `integrated` runs one header across the top with the sidebar below it.
   * `split` runs the sidebar the full height of the window, with the brand
   * in its header, and puts the header in the content column. `auto` is
   * integrated without a mood and split under balanced or airy.
   */
  headerLayout?: "auto" | "split" | "integrated";
  /**
   * `auto` follows the mood: flush without one, a floating rounded panel
   * under balanced or airy. `flush` and `floating` hold in every mood, so
   * each application can pick its own sidebar shape.
   */
  sidebarLayout?: "auto" | "flush" | "floating";
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

function useSidebarOverflow() {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const element = contentRef.current;

    if (!element) {
      return () => undefined;
    }

    const handleScroll = () => onStoreChange();
    element.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(onStoreChange);
    resizeObserver?.observe(element);
    window.addEventListener("resize", onStoreChange);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", onStoreChange);
    };
  }, []);
  const getSnapshot = React.useCallback(() => {
    const element = contentRef.current;

    if (!element) {
      return 0;
    }

    const hasScrollBefore = element.scrollTop > 1;
    const hasScrollAfter =
      element.scrollHeight - element.clientHeight - element.scrollTop > 1;

    return (hasScrollBefore ? 1 : 0) | (hasScrollAfter ? 2 : 0);
  }, []);
  const scrollState = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => 0,
  );

  return {
    contentRef,
    hasScrollBefore: Boolean(scrollState & 1),
    hasScrollAfter: Boolean(scrollState & 2),
  };
}

function AppShell({
  defaultSidebarOpen = true,
  sidebarOpen: controlledSidebarOpen,
  onSidebarOpenChange,
  headerLayout = "split",
  sidebarLayout = "auto",
  children,
  className,
  style,
  ...props
}: AppShellProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [persistedSidebarOpen, setSidebarOpenState] = React.useState(defaultSidebarOpen);
  const sidebarOpen = controlledSidebarOpen ?? persistedSidebarOpen;
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
    if (controlledSidebarOpen === undefined) persistSidebarOpen(open);
    onSidebarOpenChange?.(open);
  }, [controlledSidebarOpen, onSidebarOpenChange]);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setMobileOpen((current) => !current);
      return;
    }

    setSidebarOpen(!sidebarOpen);
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey) &&
        !(event.target instanceof Element && event.target.closest('[contenteditable]:not([contenteditable="false"])'))
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
          data-header-layout={headerLayout}
          data-sidebar-layout={sidebarLayout}
          suppressHydrationWarning
          className={cn(
            "group/shell min-h-svh bg-canvas text-text-primary",
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

export {
  AppShell,
  AppShellContext,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_STATE_CHANGE_EVENT,
  SIDEBAR_STORAGE_KEY,
  parseSidebarOpen,
  persistSidebarOpen,
  readPersistedSidebarOpen,
  subscribeToSidebarOpen,
  useAppShell,
  useMediaQuery,
  useSidebarOverflow,
};

export type {
  AppShellContextValue,
  AppShellProps,
};

"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cn } from "./utils";

type TabsVariant = "underline" | "segmented";
type TabsSize = "default" | "compact";
type ScrollPosition = "none" | "start" | "middle" | "end";

type TabsVisualContextValue = {
  variant: TabsVariant;
  size: TabsSize;
};

const defaultTabsVisualContext: TabsVisualContextValue = {
  variant: "underline",
  size: "default",
};

const TabsRootVisualContext = React.createContext(defaultTabsVisualContext);
const TabsListVisualContext = React.createContext(defaultTabsVisualContext);

const tabRailClasses =
  "flex min-w-0 items-stretch overflow-x-auto overscroll-x-contain border-b border-border-subtle scroll-px-2 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const navigationTabClasses =
  "relative inline-flex h-full shrink-0 snap-start items-center justify-center gap-2 whitespace-nowrap rounded-t-[var(--ds-radius-control)] px-[var(--ds-tab-padding-x)] text-sm font-medium outline-none transition-[background-color,color,box-shadow] duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-transparent after:transition-colors hover:bg-surface-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60 data-[active=false]:text-muted-foreground data-[active=false]:hover:text-foreground data-[active=true]:bg-selection-background data-[active=true]:font-semibold data-[active=true]:text-selection-foreground data-[active=true]:after:bg-selection-indicator";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function useHorizontalScrollRail<T extends HTMLElement>(externalRef?: React.Ref<T>) {
  const internalRef = React.useRef<T | null>(null);
  const [scrollPosition, setScrollPosition] = React.useState<ScrollPosition>("none");

  const updateScrollPosition = React.useCallback(() => {
    const element = internalRef.current;
    if (!element) return;

    const maximumScroll = element.scrollWidth - element.clientWidth;
    const nextPosition: ScrollPosition =
      maximumScroll <= 1
        ? "none"
        : element.scrollLeft <= 1
          ? "start"
          : element.scrollLeft >= maximumScroll - 1
            ? "end"
            : "middle";

    setScrollPosition((current) =>
      current === nextPosition ? current : nextPosition,
    );
  }, []);

  const ref = React.useCallback(
    (node: T | null) => {
      internalRef.current = node;
      assignRef(externalRef, node);
    },
    [externalRef],
  );

  React.useEffect(() => {
    updateScrollPosition();
    const element = internalRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateScrollPosition);
    observer.observe(element);
    return () => observer.disconnect();
  }, [updateScrollPosition]);

  return [scrollPosition, ref, updateScrollPosition] as const;
}

function Tabs({
  className,
  variant = "underline",
  size = "default",
  ...props
}: React.ComponentProps<typeof BaseTabs.Root> & {
  variant?: TabsVariant;
  size?: TabsSize;
}) {
  return (
    <TabsRootVisualContext.Provider value={{ variant, size }}>
      <BaseTabs.Root
        data-slot="tabs"
        data-variant={variant}
        data-size={size}
        className={cn("flex min-w-0 flex-col gap-2", className)}
        {...props}
      />
    </TabsRootVisualContext.Provider>
  );
}

function TabsList({
  className,
  variant,
  size,
  children,
  ref: externalRef,
  onScroll,
  ...props
}: React.ComponentProps<typeof BaseTabs.List> & {
  variant?: TabsVariant;
  size?: TabsSize;
}) {
  const rootVisuals = React.useContext(TabsRootVisualContext);
  const resolvedVariant = variant ?? rootVisuals.variant;
  const resolvedSize = size ?? rootVisuals.size;
  const [scrollPosition, scrollRailRef, updateScrollPosition] =
    useHorizontalScrollRail<HTMLDivElement>(externalRef);

  return (
    <BaseTabs.List
      data-slot="tabs-list"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-scroll-position={
        resolvedVariant === "underline" ? scrollPosition : undefined
      }
      ref={scrollRailRef}
      onScroll={(event) => {
        updateScrollPosition();
        onScroll?.(event);
      }}
      className={cn(
        "text-muted-foreground",
        resolvedVariant === "underline" && tabRailClasses,
        resolvedVariant === "underline" &&
          (resolvedSize === "compact"
            ? "h-[var(--ds-tab-rail-height-compact)]"
            : "h-[var(--ds-tab-rail-height)]"),
        resolvedVariant === "segmented" &&
          "inline-flex h-[var(--ds-control-height)] items-center gap-1 self-start rounded-md bg-surface-muted p-1",
        className,
      )}
      {...props}
    >
      <TabsListVisualContext.Provider
        value={{ variant: resolvedVariant, size: resolvedSize }}
      >
        {children}
      </TabsListVisualContext.Provider>
    </BaseTabs.List>
  );
}

function TabsTrigger({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab> & {
  variant?: TabsVariant;
  size?: TabsSize;
}) {
  const listVisuals = React.useContext(TabsListVisualContext);
  const resolvedVariant = variant ?? listVisuals.variant;
  const resolvedSize = size ?? listVisuals.size;

  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(
        "disabled:pointer-events-none disabled:opacity-50",
        resolvedVariant === "underline" &&
          cn(
            navigationTabClasses,
            "data-active:bg-selection-background data-active:font-semibold data-active:text-selection-foreground data-active:after:bg-selection-indicator",
          ),
        resolvedVariant === "segmented" &&
          "inline-flex h-full items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--ds-radius-control)-2px)] px-3 text-sm font-medium text-muted-foreground outline-none transition-[background-color,color,box-shadow] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 data-active:bg-background data-active:text-foreground data-active:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-content"
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  );
}

function NavigationTabs({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="navigation-tabs"
      className={cn("min-w-0", className)}
      {...props}
    />
  );
}

function NavigationTabsList({
  className,
  ref: externalRef,
  onScroll,
  ...props
}: React.ComponentProps<"div">) {
  const [scrollPosition, scrollRailRef, updateScrollPosition] =
    useHorizontalScrollRail<HTMLDivElement>(externalRef);

  return (
    <div
      data-slot="navigation-tabs-list"
      data-scroll-position={scrollPosition}
      ref={scrollRailRef}
      onScroll={(event) => {
        updateScrollPosition();
        onScroll?.(event);
      }}
      className={cn(
        tabRailClasses,
        "h-[var(--ds-tab-rail-height)]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationTab({
  className,
  active = false,
  ref: externalRef,
  ...props
}: React.ComponentProps<"a"> & {
  active?: boolean;
}) {
  const Comp = "a";
  const internalRef = React.useRef<HTMLAnchorElement | null>(null);
  const ref = React.useCallback(
    (node: HTMLAnchorElement | null) => {
      internalRef.current = node;
      assignRef(externalRef, node);
    },
    [externalRef],
  );

  React.useEffect(() => {
    if (!active) return;
    internalRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "nearest",
    });
  }, [active]);

  return (
    <Comp
      {...props}
      data-slot="navigation-tab"
      data-active={active ? "true" : "false"}
      aria-current={active ? "page" : undefined}
      ref={ref}
      className={cn(
        navigationTabClasses,
        className,
      )}
    />
  );
}

export {
  NavigationTab,
  NavigationTabs,
  NavigationTabsList,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};
export type { TabsSize, TabsVariant };

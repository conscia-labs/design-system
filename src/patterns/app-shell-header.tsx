"use client";

import * as React from "react";
import { cn } from "../primitives/utils";

function MainRegion({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="main-region"
      className={cn(
        "flex min-h-svh min-w-0 w-full flex-1 flex-col transition-[padding] duration-[var(--ds-duration-base)] ease-linear",
        "group-data-[sidebar-side=left]/shell:lg:pl-[calc(var(--ds-app-sidebar-width)+var(--ds-app-sidebar-inset))] group-data-[sidebar-side=right]/shell:lg:pr-[calc(var(--ds-app-sidebar-width)+var(--ds-app-sidebar-inset))]",
        "group-data-[header-layout=integrated]/shell:pt-[var(--ds-topbar-height)]",
        className,
      )}
      {...props}
    />
  );
}

type AppHeaderProps = React.ComponentProps<"header"> & {
  /**
   * `brand` paints the header Conscia burgundy and switches the controls
   * inside it to light-on-burgundy. Pair it with `AppSidebar variant="brand"`.
   */
  tone?: "default" | "brand";
  /**
   * `bar` is the bordered, frosted strip. `transparent` sits on the canvas
   * with no fill or border until content scrolls under it. `auto` is a bar
   * in an integrated shell and transparent in a split one.
   */
  variant?: "auto" | "bar" | "transparent";
};

function subscribeToWindowScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function useWindowScrolled() {
  return React.useSyncExternalStore(
    subscribeToWindowScroll,
    () => window.scrollY > 0,
    () => false,
  );
}

/*
 * Inside MainRegion of a split shell the header is sticky in the content
 * column instead of fixed across the window; styles.css places it and draws
 * its scrolled band from data-scrolled.
 */
function AppHeader({
  className,
  tone = "default",
  variant = "auto",
  ...props
}: AppHeaderProps) {
  const scrolled = useWindowScrolled();

  return (
    <header
      data-slot="app-header"
      data-tone={tone}
      data-variant={variant}
      data-scrolled={scrolled ? "true" : undefined}
      data-chrome={tone === "brand" ? "brand" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex h-[var(--ds-topbar-height)] min-h-[var(--ds-topbar-height)] items-center gap-2 border-b border-border-subtle bg-canvas/96 px-[var(--ds-topbar-padding-x)] backdrop-blur supports-[backdrop-filter]:bg-canvas/88 md:gap-3 md:px-[var(--ds-topbar-padding-x-wide)]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The brand in the header. It shows in an integrated shell, and in a split
 * shell only while the sidebar is a drawer, so the brand appears once.
 */
function AppHeaderBrand({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-header-brand"
      className={cn("flex min-w-0 shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}

function usePageTitleScrolledAway(ref: React.RefObject<HTMLElement | null>, key: unknown) {
  const [scrolledAway, setScrolledAway] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const region = element.closest('[data-slot="main-region"]') ?? document;
      const heading = region.querySelector('[data-slot="page-header"] :is(h1, h2), h1');
      const header = element.closest('[data-slot="app-header"]');

      if (!heading || !header) {
        setScrolledAway(false);
        return;
      }

      setScrolledAway(
        heading.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom,
      );
    };
    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, key]);

  return scrolledAway;
}

type AppHeaderTitleProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The page title, shown once the page's own heading scrolls under the header. */
  title: React.ReactNode;
};

/**
 * Shows its children, such as breadcrumbs, while the page heading is in
 * view, and the page title once the heading scrolls under the header.
 */
function AppHeaderTitle({
  title,
  children,
  className,
  ...props
}: AppHeaderTitleProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const titleVisible = usePageTitleScrolledAway(ref, title);

  return (
    <div
      ref={ref}
      data-slot="app-header-title"
      data-title-visible={titleVisible ? "true" : undefined}
      className={cn(
        "group/header-title grid min-w-0 flex-1 items-center [&>*]:col-start-1 [&>*]:row-start-1",
        className,
      )}
      {...props}
    >
      <div
        inert={titleVisible}
        aria-hidden={titleVisible || undefined}
        className="ds-type-ui flex min-w-0 items-center gap-2 text-text-supporting transition-[opacity,translate] duration-[var(--ds-duration-base)] group-data-[title-visible=true]/header-title:-translate-y-1.5 group-data-[title-visible=true]/header-title:opacity-0"
      >
        {children}
      </div>
      {/* The page heading already names the page for assistive technology. */}
      <div
        aria-hidden="true"
        className="ds-type-header-title pointer-events-none min-w-0 translate-y-1.5 truncate text-text-primary opacity-0 transition-[opacity,translate] duration-[var(--ds-duration-base)] group-data-[title-visible=true]/header-title:translate-y-0 group-data-[title-visible=true]/header-title:opacity-100"
      >
        {title}
      </div>
    </div>
  );
}

function AppHeaderStart({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-header-start"
      className={cn("flex min-w-0 flex-1 items-center gap-2", className)}
      {...props}
    />
  );
}

type AppHeaderSearchProps = React.ComponentProps<"div"> & {
  mobileTrigger: React.ReactNode;
};

function AppHeaderSearch({
  mobileTrigger,
  children,
  className,
  ...props
}: AppHeaderSearchProps) {
  return (
    <div
      data-slot="app-header-search"
      className={cn("ml-auto flex shrink-0 items-center", className)}
      {...props}
    >
      <div className="hidden w-[min(22rem,32vw)] md:block">{children}</div>
      <div className="md:hidden">{mobileTrigger}</div>
    </div>
  );
}

function AppHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-header-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  );
}

type TopBarProps = React.ComponentProps<"header"> & {
  /**
   * `bar` is the bordered, frosted strip. `plain` drops the border and blur
   * so the bar sits on the canvas, for split shells whose brand lives in the
   * sidebar header, such as beside a floating sidebar. New split shells can
   * put AppHeader inside MainRegion instead, which adds the scrolled band.
   */
  variant?: "bar" | "plain";
};

function TopBar({
  variant = "bar",
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      data-slot="top-bar"
      data-variant={variant}
      className={cn(
        "sticky top-0 z-10 flex h-[var(--ds-topbar-height)] min-h-[var(--ds-topbar-height)] shrink-0 items-center justify-between gap-3",
        variant === "bar" && "border-b border-border-subtle bg-canvas/96 px-[var(--ds-topbar-padding-x)] backdrop-blur supports-[backdrop-filter]:bg-canvas/88 md:px-[var(--ds-topbar-padding-x-wide)]",
        // With no edge to mark it, the plain bar lines up with the page frame instead.
        variant === "plain" && "bg-canvas px-[var(--ds-frame-padding-x)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  AppHeader,
  AppHeaderActions,
  AppHeaderBrand,
  AppHeaderSearch,
  AppHeaderStart,
  AppHeaderTitle,
  MainRegion,
  TopBar,
  subscribeToWindowScroll,
  usePageTitleScrolledAway,
  useWindowScrolled,
};

export type {
  AppHeaderProps,
  AppHeaderSearchProps,
  AppHeaderTitleProps,
  TopBarProps,
};

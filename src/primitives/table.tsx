"use client";

import * as React from "react";

import { cn } from "./utils";

type TableProps = React.ComponentProps<"table"> & {
  /**
   * Scrolls wide tables horizontally (the default). Pass `false` only when
   * the caller renders an alternate stacked layout at narrow widths, such as
   * DataTable's `mobileRow`; the table then clips at its container edge.
   */
  scrollable?: boolean;
  /** Accessible name announced when the table requires horizontal scrolling. */
  scrollableLabel?: string;
};

type TableScrollPosition = "none" | "start" | "middle" | "end";

function Table({
  className,
  scrollable = true,
  scrollableLabel = "Scrollable table",
  ...props
}: TableProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] =
    React.useState<TableScrollPosition>("none");
  const isOverflowing = scrollPosition !== "none";

  const updateScrollPosition = React.useCallback(() => {
    const element = containerRef.current;
    if (!element || !scrollable) {
      setScrollPosition("none");
      return;
    }

    const maximumScroll = element.scrollWidth - element.clientWidth;
    const nextPosition: TableScrollPosition =
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
  }, [scrollable]);

  React.useEffect(() => {
    const element = containerRef.current;

    updateScrollPosition();
    if (!element || !scrollable) return;

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollPosition);
    resizeObserver?.observe(element);

    const table = element.querySelector("table");
    if (table) {
      resizeObserver?.observe(table);
    }

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(updateScrollPosition);
    mutationObserver?.observe(element, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    element.addEventListener("scroll", updateScrollPosition, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      element.removeEventListener("scroll", updateScrollPosition);
    };
  }, [scrollable, updateScrollPosition]);

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      data-overflowing={isOverflowing ? "true" : "false"}
      data-scroll-position={scrollable ? scrollPosition : undefined}
      role={isOverflowing ? "region" : undefined}
      aria-label={isOverflowing ? scrollableLabel : undefined}
      tabIndex={isOverflowing ? 0 : undefined}
      className={cn(
        "relative w-full outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset",
        scrollable ? "overflow-x-auto overflow-y-hidden overscroll-x-contain" : "overflow-x-clip",
      )}
    >
      <table data-slot="table" className={cn("w-full caption-top ds-type-ui", className)} {...props} />
    </div>
  );
}

/**
 * Column headers sit on their own band, darker than both the rows and the
 * card around the table, above a stronger divider.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-surface-table-header [&_tr]:border-b [&_tr]:border-border-default [&_tr]:hover:bg-transparent", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t border-border-default bg-surface-table-header font-medium [&_tr]:hover:bg-transparent", className)} {...props} />;
}

type TableRowProps = React.ComponentProps<"tr"> & {
  /**
   * Marks a row that opens or selects something when clicked. It takes a
   * pointer cursor and an action-colored edge rail on hover and focus.
   */
  interactive?: boolean;
};

function TableRow({ className, interactive = false, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-interactive={interactive ? "true" : undefined}
      className={cn("h-[var(--ds-row-height)] border-b border-border-subtle transition-colors duration-[var(--ds-duration-fast)] ease-standard hover:bg-surface-muted/70 focus-within:bg-surface-muted/70 data-[selected=true]:bg-selection-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50", interactive && "cursor-pointer hover:bg-surface-muted [&>td:first-child]:transition-shadow [&>td:first-child]:duration-[var(--ds-duration-fast)] hover:[&>td:first-child]:shadow-[inset_2px_0_0_var(--selection-indicator)] focus-visible:[&>td:first-child]:shadow-[inset_2px_0_0_var(--selection-indicator)]", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("ds-type-table-head h-[var(--ds-table-header-height)] whitespace-nowrap px-3 text-left align-middle uppercase text-text-supporting", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("ds-type-ui whitespace-nowrap px-3 py-2 align-middle", className)} {...props} />;
}

type TableCaptionProps = React.ComponentProps<"caption"> & {
  /**
   * Shows the caption above the table. By default it only names the table
   * for assistive technology, so it never sits between the rows and a
   * pagination footer.
   */
  visible?: boolean;
};

function TableCaption({ className, visible = false, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      data-visible={visible ? "true" : "false"}
      className={cn(visible ? "ds-type-metadata px-3 pb-2 text-left text-text-supporting" : "sr-only", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
};

export type { TableCaptionProps, TableProps, TableRowProps };

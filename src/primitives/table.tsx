"use client";

import * as React from "react";

import { cn } from "./utils";

type TableProps = React.ComponentProps<"table"> & {
  /** Tracks horizontal overflow so the wrapper only enters the tab order when needed. */
  scrollable?: boolean;
  /** Accessible name announced when the table requires horizontal scrolling. */
  scrollableLabel?: string;
};

function Table({
  className,
  scrollable = true,
  scrollableLabel = "Scrollable table",
  ...props
}: TableProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = containerRef.current;

    if (!element || !scrollable) {
      setIsOverflowing(false);
      return;
    }

    const updateOverflow = () => {
      setIsOverflowing(element.scrollWidth > element.clientWidth + 1);
    };

    updateOverflow();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateOverflow);
    resizeObserver?.observe(element);

    const table = element.querySelector("table");
    if (table) {
      resizeObserver?.observe(table);
    }

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(updateOverflow);
    mutationObserver?.observe(element, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [scrollable]);

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      data-overflowing={isOverflowing ? "true" : "false"}
      role={isOverflowing ? "region" : undefined}
      aria-label={isOverflowing ? scrollableLabel : undefined}
      tabIndex={isOverflowing ? 0 : undefined}
      className={cn(
        "relative w-full outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset",
        isOverflowing ? "overflow-x-auto" : "overflow-x-clip",
      )}
    >
      <table data-slot="table" className={cn("w-full caption-bottom ds-type-ui", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b [&_tr]:border-border-subtle", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t border-border-subtle bg-surface-muted/40 font-medium", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("h-[var(--ds-row-height)] border-b border-border-subtle transition-colors hover:bg-surface-muted/70 focus-within:bg-surface-muted/70 data-[selected=true]:bg-selection-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
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

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("ds-type-metadata mt-2 text-left text-text-supporting", className)} {...props} />;
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

export type { TableProps };

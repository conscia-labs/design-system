import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../primitives/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../primitives/select";
import { cn } from "../primitives/utils";

type PaginationControlsProps = React.ComponentProps<"div"> & {
  currentPage: number;
  pageCount: number;
  totalLabel?: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
};

function PaginationControls({
  currentPage,
  pageCount,
  totalLabel,
  onPrevious,
  onNext,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  className,
  ...props
}: PaginationControlsProps) {
  return (
    <div
      data-slot="pagination-controls"
      className={cn("flex flex-col gap-2 border-t border-border-subtle px-5 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span>{totalLabel}</span>
        {pageSize && onPageSizeChange ? (
          <div className="flex items-center gap-2">
            <span className="text-[var(--ds-metadata)]">Rows</span>
            <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger size="sm" className="w-[4.5rem]" aria-label="Rows per page"><SelectValue /></SelectTrigger>
              <SelectContent>{pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="size-8" aria-label="Previous page" onClick={onPrevious ?? (() => onPageChange?.(currentPage - 1))} disabled={currentPage <= 1}><ChevronLeft /></Button>
        {onPageChange ? pageItems(currentPage, pageCount).map((item, index) => item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="flex size-8 items-center justify-center text-muted-foreground" aria-hidden="true">…</span>
        ) : (
          <Button key={item} variant={item === currentPage ? "secondary" : "ghost"} size="icon" className="size-8" aria-label={`Page ${item}`} aria-current={item === currentPage ? "page" : undefined} onClick={() => onPageChange(item)}>{item}</Button>
        )) : <span className="px-2 text-[var(--ds-metadata)]">Page {currentPage} of {pageCount}</span>}
        <Button variant="outline" size="icon" className="size-8" aria-label="Next page" onClick={onNext ?? (() => onPageChange?.(currentPage + 1))} disabled={currentPage >= pageCount}><ChevronRight /></Button>
      </div>
    </div>
  );
}

function pageItems(currentPage: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  const sorted = Array.from(pages).filter((page) => page > 0 && page <= pageCount).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  sorted.forEach((page, index) => {
    if (index && page - sorted[index - 1]! > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

export { PaginationControls };
export type { PaginationControlsProps };

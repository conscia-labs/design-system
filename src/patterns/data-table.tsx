"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "../primitives/button";
import { Checkbox } from "../primitives/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../primitives/table";
import { cn } from "../primitives/utils";
import { PaginationControls } from "./pagination";

type DataTableColumn<TData> = {
  id: string;
  header: React.ReactNode;
  cell: (item: TData) => React.ReactNode;
  accessor?: (item: TData) => string | number | null | undefined;
  sortable?: boolean;
  className?: string;
};

type DataTableProps<TData> = {
  data: TData[];
  columns: DataTableColumn<TData>[];
  getRowId: (item: TData) => string;
  getRowLabel?: (item: TData) => string;
  onRowClick?: (item: TData) => void;
  isRowClickable?: (item: TData) => boolean;
  rowActions?: (item: TData) => React.ReactNode;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  manualSorting?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  manualPagination?: boolean;
  pageCount?: number;
  rowCount?: number;
  pageSizeOptions?: number[];
  totalLabel?: React.ReactNode;
  mobileRow?: (item: TData) => React.ReactNode;
  empty?: React.ReactNode;
  className?: string;
};

function DataTable<TData>({
  data,
  columns,
  getRowId,
  getRowLabel,
  onRowClick,
  isRowClickable,
  rowActions,
  selectedIds,
  onSelectionChange,
  sorting,
  onSortingChange,
  manualSorting = false,
  pagination,
  onPaginationChange,
  manualPagination = false,
  pageCount,
  rowCount,
  pageSizeOptions,
  totalLabel,
  mobileRow,
  empty,
  className,
}: DataTableProps<TData>) {
  const rowSelection = React.useMemo<RowSelectionState>(() => {
    const selection: RowSelectionState = {};
    selectedIds?.forEach((id) => { selection[id] = true; });
    return selection;
  }, [selectedIds]);

  const tableColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    const result: ColumnDef<TData>[] = [];
    if (onSelectionChange) {
      result.push({
        id: "select",
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows on this page"
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select ${getRowLabel?.(row.original) ?? row.id}`}
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
            onClick={(event) => event.stopPropagation()}
          />
        ),
        meta: { className: "w-10" },
      });
    }
    result.push(...columns.map((column): ColumnDef<TData> => ({
      id: column.id,
      ...(column.accessor ? { accessorFn: column.accessor } : {}),
      enableSorting: column.sortable ?? false,
      header: () => column.header,
      cell: ({ row }: { row: Row<TData> }) => column.cell(row.original),
      meta: { className: column.className, label: typeof column.header === "string" ? column.header : column.id },
    })));
    if (rowActions) {
      result.push({
        id: "actions",
        enableSorting: false,
        header: "Actions",
        cell: ({ row }) => rowActions(row.original),
        meta: { className: "w-12 text-right" },
      });
    }
    return result;
  }, [columns, getRowLabel, onSelectionChange, rowActions]);

  // TanStack Table intentionally returns a mutable table instance; React Compiler skips this hook.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId: (row) => getRowId(row),
    state: { rowSelection, ...(sorting ? { sorting } : {}), ...(pagination ? { pagination } : {}) },
    enableRowSelection: Boolean(onSelectionChange),
    onRowSelectionChange: (updater) => {
      if (!onSelectionChange) return;
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      onSelectionChange(new Set(Object.keys(next).filter((id) => next[id])));
    },
    onSortingChange: (updater) => {
      if (!onSortingChange) return;
      onSortingChange(typeof updater === "function" ? updater(sorting ?? []) : updater);
    },
    onPaginationChange: (updater) => {
      if (!onPaginationChange || !pagination) return;
      onPaginationChange(typeof updater === "function" ? updater(pagination) : updater);
    },
    manualSorting,
    manualPagination,
    pageCount,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getPaginationRowModel: pagination && !manualPagination ? getPaginationRowModel() : undefined,
  });

  if (!data.length && empty) return <>{empty}</>;

  const visibleRows = table.getRowModel().rows;
  const showPagination = Boolean(pagination && onPaginationChange);

  return (
    <div data-slot="data-table" className={cn("bg-background", className)}>
      <div className={mobileRow ? "hidden md:block" : undefined}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as { className?: string; label?: string } | undefined;
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id} className={meta?.className}>
                      {header.isPlaceholder ? null : canSort ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-2 h-8 gap-1.5 px-2 text-[var(--ds-metadata)] font-semibold uppercase text-muted-foreground hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={`Sort by ${meta?.label ?? header.column.id}`}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? <ArrowUp className="size-3.5" /> : sorted === "desc" ? <ArrowDown className="size-3.5" /> : <ChevronsUpDown className="size-3.5 opacity-60" />}
                        </Button>
                      ) : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => {
              const rowClickable = Boolean(
                onRowClick && (isRowClickable?.(row.original) ?? true),
              );
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  tabIndex={rowClickable ? 0 : undefined}
                  aria-label={rowClickable ? getRowLabel?.(row.original) ?? row.id : undefined}
                  className={cn(rowClickable && "cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45")}
                  onClick={() => {
                    if (rowClickable) onRowClick?.(row.original);
                  }}
                  onKeyDown={(event) => {
                    if (!rowClickable || (event.key !== "Enter" && event.key !== " ")) return;
                    event.preventDefault();
                    onRowClick?.(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                    return <TableCell key={cell.id} className={meta?.className}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {mobileRow ? (
        <div className="divide-y divide-border-subtle md:hidden" role="list">
          {visibleRows.map((row) => <div key={row.id} role="listitem">{mobileRow(row.original)}</div>)}
        </div>
      ) : null}
      {showPagination ? (
        <PaginationControls
          currentPage={pagination!.pageIndex + 1}
          pageCount={Math.max(1, table.getPageCount())}
          pageSize={pagination!.pageSize}
          pageSizeOptions={pageSizeOptions}
          totalLabel={totalLabel}
          onPageChange={(nextPage) => table.setPageIndex(nextPage - 1)}
          onPageSizeChange={(nextSize) => table.setPageSize(nextSize)}
        />
      ) : null}
    </div>
  );
}

export { DataTable };
export type { DataTableColumn, DataTableProps, PaginationState, SortingState };

import * as React from "react";

import { DataTable, type DataTableColumn } from "./data-table";

type EntityTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  className?: string;
};

type EntityTableProps<T> = {
  items: T[];
  columns: EntityTableColumn<T>[];
  getRowId: (item: T) => string;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  onRowClick?: (item: T) => void;
  getRowLabel?: (item: T) => string;
  rowActions?: (item: T) => React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
};

function EntityTable<T>({
  items,
  columns,
  getRowId,
  selectedIds,
  onSelectionChange,
  onRowClick,
  getRowLabel,
  rowActions,
  caption,
  className
}: EntityTableProps<T>) {
  return (
    <DataTable
      data={items}
      columns={columns.map((column): DataTableColumn<T> => ({ ...column, id: column.key }))}
      getRowId={getRowId}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      onRowClick={onRowClick}
      getRowLabel={getRowLabel}
      rowActions={rowActions}
      caption={caption}
      className={className}
    />
  );
}

export { EntityTable };
export type { EntityTableColumn, EntityTableProps };

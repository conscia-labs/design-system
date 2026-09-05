"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Database, MoreHorizontal, Search } from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  CodeBlock,
  DataTable,
  EntityTable,
  IconButton,
  Input,
  InventoryDesktop,
  InventoryMobile,
  InventorySurface,
  StateView,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type DataTableColumn,
  type PaginationState,
  type SortingState,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

type Connection = {
  id: string;
  name: string;
  provider: string;
  status: "Healthy" | "Attention" | "Paused";
  resources: number;
  updated: string;
};

const connections: Connection[] = [
  { id: "bedrock-prod", name: "Production Bedrock", provider: "Amazon Bedrock", status: "Healthy", resources: 42, updated: "2 min ago" },
  { id: "openai-eu", name: "OpenAI Europe", provider: "OpenAI", status: "Healthy", resources: 18, updated: "8 min ago" },
  { id: "vertex-main", name: "Vertex AI", provider: "Google Cloud", status: "Attention", resources: 31, updated: "21 min ago" },
  { id: "azure-west", name: "Azure West Europe", provider: "Microsoft Azure", status: "Healthy", resources: 26, updated: "1 hr ago" },
  { id: "anthropic-direct", name: "Anthropic Direct", provider: "Anthropic", status: "Paused", resources: 8, updated: "3 hr ago" },
  { id: "bedrock-sandbox", name: "Sandbox Bedrock", provider: "Amazon Bedrock", status: "Healthy", resources: 12, updated: "Yesterday" },
  { id: "vertex-labs", name: "Vertex Labs", provider: "Google Cloud", status: "Attention", resources: 6, updated: "Yesterday" },
  { id: "azure-north", name: "Azure North Europe", provider: "Microsoft Azure", status: "Healthy", resources: 19, updated: "2 days ago" },
];

const statusVariant = {
  Healthy: "success",
  Attention: "warning",
  Paused: "neutral",
} as const;

const dataTableCode = `import { DataTable, type DataTableColumn } from "@conscia-labs/design-system";

const columns: DataTableColumn<Connection>[] = [
  { id: "name", header: "Connection", accessor: (row) => row.name, sortable: true, cell: (row) => row.name },
  { id: "status", header: "Status", accessor: (row) => row.status, sortable: true, cell: (row) => <Badge>{row.status}</Badge> },
];

<DataTable
  data={connections}
  columns={columns}
  getRowId={(row) => row.id}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  sorting={sorting}
  onSortingChange={setSorting}
/>`;

export default function TablesPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState<"All" | Connection["status"]>("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [sorting, setSorting] = useState<SortingState>([{ id: "updated", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [openedRow, setOpenedRow] = useState<string | null>(null);

  const filteredConnections = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    return connections.filter((connection) => {
      const matchesQuery = !normalizedQuery || `${connection.name} ${connection.provider}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (status === "All" || connection.status === status);
    });
  }, [deferredQuery, status]);

  const columns = useMemo<DataTableColumn<Connection>[]>(() => [
    {
      id: "name",
      header: "Connection",
      accessor: (connection) => connection.name,
      sortable: true,
      cell: (connection) => (
        <div>
          <div className="font-medium text-text-primary">{connection.name}</div>
          <div className="ds-type-metadata mt-0.5 text-text-supporting">{connection.id}</div>
        </div>
      ),
    },
    { id: "provider", header: "Provider", accessor: (connection) => connection.provider, sortable: true, cell: (connection) => connection.provider },
    { id: "status", header: "Status", accessor: (connection) => connection.status, sortable: true, cell: (connection) => <Badge variant={statusVariant[connection.status]}>{connection.status}</Badge> },
    { id: "resources", header: "Resources", accessor: (connection) => connection.resources, sortable: true, className: "text-right", cell: (connection) => connection.resources },
    { id: "updated", header: "Last checked", accessor: (connection) => connection.updated, sortable: true, cell: (connection) => <span className="text-text-supporting">{connection.updated}</span> },
  ], []);

  const changeStatus = (nextStatus: "All" | Connection["status"]) => {
    setStatus(nextStatus);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  return (
    <PlaygroundPage
      title="Tables and data tables"
      description="Semantic table anatomy and production-ready data collections with sorting, selection, pagination, responsive rows, and deliberate empty states."
      actions={openedRow ? <Badge variant="information">Opened: {openedRow}</Badge> : undefined}
    >
      <ExampleSection
        title="Interactive data table"
        description="Use DataTable for application-owned collections that need selection, sorting, pagination, row actions, and a compact mobile representation."
      >
        <InventorySurface>
          <div className="flex flex-col gap-3 border-b border-border-subtle p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-supporting" />
              <Input
                aria-label="Search connections"
                className="pl-9"
                placeholder="Search connections or providers"
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter connections by status">
              {(["All", "Healthy", "Attention", "Paused"] as const).map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={status === item ? "secondary" : "ghost"}
                  aria-pressed={status === item}
                  onClick={() => changeStatus(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <DataTable
            data={filteredConnections}
            columns={columns}
            getRowId={(connection) => connection.id}
            getRowLabel={(connection) => connection.name}
            onRowClick={(connection) => setOpenedRow(connection.name)}
            rowActions={(connection) => <IconButton variant="ghost" size="sm" aria-label={`Open actions for ${connection.name}`}><MoreHorizontal /></IconButton>}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            sorting={sorting}
            onSortingChange={setSorting}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageSizeOptions={[5, 10]}
            totalLabel={`${filteredConnections.length} connections`}
            caption="Provider connections and their current operational state."
            empty={<StateView className="min-h-64" icon={<Search />} title="No matching connections" description="Try another search term or clear the status filter." action={<Button variant="outline" size="sm" onClick={() => { changeQuery(""); changeStatus("All"); }}>Clear filters</Button>} />}
            mobileRow={(connection) => (
              <div className="flex items-start gap-3 p-4">
                <Checkbox
                  aria-label={`Select ${connection.name}`}
                  checked={selectedIds.has(connection.id)}
                  onCheckedChange={(checked) => setSelectedIds((current) => {
                    const next = new Set(current);
                    if (checked) next.add(connection.id); else next.delete(connection.id);
                    return next;
                  })}
                />
                <button type="button" className="min-w-0 flex-1 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-focus/50" onClick={() => setOpenedRow(connection.name)}>
                  <span className="block font-medium text-text-primary">{connection.name}</span>
                  <span className="ds-type-metadata mt-0.5 block text-text-supporting">{connection.provider} · {connection.resources} resources</span>
                  <span className="ds-type-metadata mt-2 block text-text-supporting">Checked {connection.updated}</span>
                </button>
                <Badge variant={statusVariant[connection.status]}>{connection.status}</Badge>
              </div>
            )}
          />
        </InventorySurface>
        <p className="ds-type-metadata text-text-supporting" role="status">
          {selectedIds.size ? `${selectedIds.size} ${selectedIds.size === 1 ? "row" : "rows"} selected.` : "No rows selected."}
        </p>
      </ExampleSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExampleSection title="Semantic table primitive" description="Use the primitive anatomy for small, bounded datasets where applications own all behavior.">
          <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface">
            <Table>
              <TableCaption>Current gateway environments.</TableCaption>
              <TableHeader><TableRow><TableHead>Environment</TableHead><TableHead>Region</TableHead><TableHead className="text-right">Routes</TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow data-selected="true"><TableCell className="font-medium">Production</TableCell><TableCell>eu-west-1</TableCell><TableCell className="text-right">128</TableCell></TableRow>
                <TableRow><TableCell className="font-medium">Staging</TableCell><TableCell>eu-central-1</TableCell><TableCell className="text-right">44</TableCell></TableRow>
                <TableRow data-disabled><TableCell className="font-medium">Legacy</TableCell><TableCell>us-east-1</TableCell><TableCell className="text-right">7</TableCell></TableRow>
              </TableBody>
              <TableFooter><TableRow><TableCell colSpan={2}>Total routes</TableCell><TableCell className="text-right">179</TableCell></TableRow></TableFooter>
            </Table>
          </div>
        </ExampleSection>

        <ExampleSection title="Inventory responsive helpers" description="InventorySurface, InventoryDesktop, and InventoryMobile let a product intentionally change representation at its breakpoint.">
          <InventorySurface>
            <InventoryDesktop className="p-5">
              <div className="flex items-center gap-3"><Database className="size-5 text-text-supporting" /><div><div className="font-medium">Desktop table region</div><div className="ds-type-metadata text-text-supporting">Visible at large application widths.</div></div></div>
            </InventoryDesktop>
            <InventoryMobile>
              <div className="flex items-center gap-3 p-4"><Database className="size-5 text-text-supporting" /><div><div className="font-medium">Mobile list region</div><div className="ds-type-metadata text-text-supporting">Visible below the large breakpoint.</div></div></div>
            </InventoryMobile>
          </InventorySurface>
          <div className="rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-4">
            <h3 className="font-semibold">Loading guidance</h3>
            <p className="ds-type-ui mt-1 text-text-supporting">Keep the table frame and column geometry stable. Mark the region busy and replace rows with application-owned skeletons.</p>
            <div className="mt-4 space-y-2" role="status" aria-busy="true">
              <span className="sr-only">Loading connections</span>
              {[1, 2, 3].map((item) => <div key={item} className="h-[var(--ds-row-height)] animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none" />)}
            </div>
          </div>
        </ExampleSection>
      </div>

      <ExampleSection title="EntityTable convenience wrapper" description="EntityTable keeps simple entity collections concise while preserving selection and row actions.">
        <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface">
          <EntityTable
            items={connections.slice(0, 3)}
            columns={[
              { key: "name", header: "Connection", cell: (connection) => connection.name },
              { key: "provider", header: "Provider", cell: (connection) => connection.provider },
              { key: "status", header: "Status", cell: (connection) => <Badge variant={statusVariant[connection.status]}>{connection.status}</Badge> },
            ]}
            getRowId={(connection) => connection.id}
            getRowLabel={(connection) => connection.name}
            caption="A concise entity table without sorting or pagination."
          />
        </div>
      </ExampleSection>

      <ExampleSection title="Package import" description="Start with DataTable for interactive resource collections and the table primitives for fully application-owned markup.">
        <CodeBlock snippets={[{ value: "tsx", label: "React", code: dataTableCode }]} />
      </ExampleSection>
    </PlaygroundPage>
  );
}

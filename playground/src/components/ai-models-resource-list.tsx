"use client";

import { useMemo, useState } from "react";
import { MoreHorizontalIcon, PlusIcon, SearchIcon } from "lucide-react";
import {
  Badge,
  Button,
  IconButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EntityTable,
  ErrorState,
  Input,
  LoadingRows,
  PageHeader,
  PageToolbar,
  PaginationControls,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StateView,
  type EntityTableColumn
} from "@conscia-labs/design-system";

import { aiModelFixtures, type AiModelFixture } from "@/fixtures/ai-models";

type DemoState = "ready" | "empty" | "loading" | "error";

const availabilityVariant = {
  Available: "success",
  Limited: "warning",
  Unavailable: "danger"
} as const;

const statusVariant = {
  Healthy: "success",
  Degraded: "warning",
  Disabled: "danger"
} as const;

export function AiModelsResourceList() {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("name");
  const [demoState, setDemoState] = useState<DemoState>("ready");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredModels = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return aiModelFixtures
      .filter((model) => availability === "all" || model.availability === availability)
      .filter((model) => {
        if (!normalized) {
          return true;
        }
        return [model.name, model.description, model.preferredProvider, model.availableThrough].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      })
      .sort((left, right) => {
        if (sort === "availability") {
          return left.availability.localeCompare(right.availability);
        }
        if (sort === "updated") {
          return left.updatedAt.localeCompare(right.updatedAt);
        }
        return left.name.localeCompare(right.name);
      });
  }, [availability, query, sort]);

  const columns: EntityTableColumn<AiModelFixture>[] = [
    {
      key: "name",
      header: "AI Model",
      cell: (model) => (
        <div className="min-w-72">
          <div className="font-medium text-foreground">{model.name}</div>
          <div className="mt-0.5 max-w-md truncate text-[var(--ds-metadata)] text-muted-foreground">{model.description}</div>
        </div>
      )
    },
    {
      key: "availability",
      header: "Availability",
      cell: (model) => <Badge variant={availabilityVariant[model.availability]}>{model.availability}</Badge>
    },
    {
      key: "availableThrough",
      header: "Available Through",
      cell: (model) => <span className="text-sm text-muted-foreground">{model.availableThrough}</span>
    },
    {
      key: "preferredProvider",
      header: "Preferred Provider",
      cell: (model) => <span className="text-sm">{model.preferredProvider}</span>
    },
    {
      key: "capabilities",
      header: "Capabilities",
      cell: (model) => (
        <div className="flex flex-wrap gap-1">
          {model.capabilities.map((capability) => (
            <Badge key={capability} variant="neutral">{capability}</Badge>
          ))}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      cell: (model) => <Badge variant={statusVariant[model.status]}>{model.status}</Badge>
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="AI Models"
        description="Manage canonical AI models available to organization applications and developers."
        status={<Badge variant="success">Operational</Badge>}
        metadata="Conscia AI Gateway / Organization Administration"
        actions={
          <Button>
            <PlusIcon data-icon="inline-start" />
            Add AI Model
          </Button>
        }
      />
      <PageToolbar
        search={
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search AI Models"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AI Models"
              className="pl-9"
            />
          </div>
        }
        filters={
          <>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger aria-label="Filter by availability" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All availability</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={demoState} onValueChange={(value) => setDemoState(value as DemoState)}>
              <SelectTrigger aria-label="Preview state" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="empty">Empty</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        }
        bulkActions={
          <div
            aria-hidden={selectedIds.size === 0}
            className={
              selectedIds.size > 0
                ? "flex items-center gap-2 rounded-md border border-border-default bg-surface px-2 py-1 shadow-sm"
                : "invisible flex items-center gap-2 rounded-md border border-border-default bg-surface px-2 py-1 shadow-sm"
            }
          >
            {selectedIds.size > 0 ? (
              <>
                <span className="text-[var(--ds-metadata)] text-muted-foreground">
                  {selectedIds.size} selected
                </span>
                <Button variant="outline" size="sm">
                  Grant access
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </Button>
              </>
            ) : (
              <>
                <span className="text-[var(--ds-metadata)] text-muted-foreground">
                  0 selected
                </span>
                <Button variant="outline" size="sm" tabIndex={-1}>
                  Grant access
                </Button>
                <Button variant="ghost" size="sm" tabIndex={-1}>
                  Clear
                </Button>
              </>
            )}
          </div>
        }
        viewControls={
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger aria-label="Sort AI Models" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Sort by name</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="updated">Last updated</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />
      {demoState === "loading" ? <LoadingRows /> : null}
      {demoState === "error" ? (
        <ErrorState
          title="AI Models could not be loaded"
          description="The playground uses a deterministic error state to verify recovery layout and action placement."
        />
      ) : null}
      {demoState === "empty" ? (
        <StateView
          title="No AI Models found"
          description="Change the search or availability filter, or add the first AI Model to the organization catalog."
          action={<Button>Add AI Model</Button>}
        />
      ) : null}
      {demoState === "ready" ? (
        filteredModels.length > 0 ? (
          <EntityTable
            items={filteredModels}
            columns={columns}
            getRowId={(model) => model.id}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowActions={(model) => (
              <DropdownMenu>
                <DropdownMenuTrigger render={<IconButton variant="ghost" aria-label={`Actions for ${model.name}`} aria-labelledby={`actions-${model.id}`}><MoreHorizontalIcon /></IconButton>} />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Review policy access</DropdownMenuItem>
                  <DropdownMenuItem>Open diagnostics</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        ) : (
          <StateView
            title="No matching AI Models"
            description="Search and filters are applied before the entity table. Empty results preserve page context."
            action={<Button variant="outline" onClick={() => { setQuery(""); setAvailability("all"); }}>Clear filters</Button>}
          />
        )
      ) : null}
      <PaginationControls
        currentPage={1}
        pageCount={2}
        totalLabel={`${filteredModels.length} AI Models shown from static fixtures`}
      />
    </div>
  );
}

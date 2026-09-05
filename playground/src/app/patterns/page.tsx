"use client";

import { useState } from "react";
import { Activity, Box, CircleGauge, Database, Search } from "lucide-react";
import {
  ActivityItem, ActivityList, Badge, Button, CodeBlock, ConfirmationDialog,
  DetailSection, DetailSections, FilterBar, FilterChip, Input, KeyValueItem, KeyValueList,
  MetricBand, MetricBandItem, PageHeader, PageToolbar, PaginationControls, ProviderMark,
  ResourceRow, ResourceRowContent, ResourceRowDescription, ResourceRowIcon, ResourceRowMeta,
  ResourceRowTitle, ResourceSummary, StateView, ValueMeter, WorkbenchInspector,
  WorkbenchInspectorSection, WorkbenchMain, WorkbenchRail, WorkbenchSection,
  WorkbenchSectionHeader, WorkbenchShell,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

export default function PatternsPage() {
  const [filters, setFilters] = useState(["Ready", "Amazon Bedrock"]);

  return (
    <PlaygroundPage title="Pattern catalog" description="Reusable compositions for page structure, operational data, resource detail, filters, state, and multi-rail workspaces.">
      <ExampleSection title="Page composition" description="Use page-level patterns to keep title, toolbar, filters, and supporting metadata aligned.">
        <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface">
          <PageHeader title="Connections" description="Manage provider connections and availability." status={<Badge variant="success">Healthy</Badge>} actions={<Button size="sm">Add connection</Button>} />
          <PageToolbar search={<Input aria-label="Search connections" placeholder="Search connections" />} filters={<Button variant="outline" size="sm">All providers</Button>}><Button variant="ghost" size="sm">Sort</Button></PageToolbar>
          <MetricBand columns={3}>
            <MetricBandItem label="Connected" value="12" detail="Across 4 providers" icon={<Database />} />
            <MetricBandItem label="Healthy" value="11" detail="One requires attention" icon={<CircleGauge />} />
            <MetricBandItem label="Requests" value="48k" detail="Last 24 hours" icon={<Activity />} />
          </MetricBand>
        </div>
      </ExampleSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExampleSection title="Resource detail">
          <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-canvas">
            <ResourceSummary variant="plain" title="Amazon Bedrock" description="Organization-wide model provider." status={<Badge variant="success">Connected</Badge>} metadata="Last checked 2 minutes ago" />
            <div className="p-4">
              <DetailSections>
                <DetailSection title="Configuration" description="Shared, read-only operational values.">
                  <KeyValueList><KeyValueItem label="Region" value="eu-west-1" /><KeyValueItem label="Models" value="14 available" /></KeyValueList>
                </DetailSection>
              </DetailSections>
            </div>
          </div>
        </ExampleSection>

        <ExampleSection title="Activity and progress">
          <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
            <ValueMeter label="Monthly request budget" value={68} maximum={100} valueLabel="68%" tone="success" detail="Resets in 12 days" />
            <ActivityList className="mt-4">
              <ActivityItem icon={<Database />} title="Catalog synchronized" description="14 models available" metadata="2 minutes ago" status={<Badge variant="success">Ready</Badge>} />
              <ActivityItem title="Policy updated" description="Developer access" metadata="1 hour ago" />
            </ActivityList>
          </div>
        </ExampleSection>

        <ExampleSection title="Filters and pagination">
          <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface">
            <div className="p-4">
              <FilterBar onClearAll={filters.length ? () => setFilters([]) : undefined}>
                {filters.map((filter) => <FilterChip key={filter} label="Filter" value={filter} onRemove={() => setFilters((current) => current.filter((item) => item !== filter))} />)}
              </FilterBar>
            </div>
            <PaginationControls currentPage={2} pageCount={8} totalLabel="76 resources" onPageChange={() => undefined} />
          </div>
        </ExampleSection>

        <ExampleSection title="State and confirmation">
          <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface">
            <StateView className="min-h-48" icon={<Search />} title="No matching resources" description="Adjust filters or search using a different term." action={<Button variant="outline" size="sm">Clear search</Button>} />
            <div className="border-t p-4">
              <ConfirmationDialog trigger={<Button variant="destructive" size="sm">Disconnect provider</Button>} title="Disconnect provider?" description="Applications will lose access until it is reconnected." confirmLabel="Disconnect" onConfirm={() => undefined} />
            </div>
          </div>
        </ExampleSection>
      </div>

      <ExampleSection title="Workbench" description="Multi-rail patterns retain consistent geometry while applications own data and routing.">
        <WorkbenchShell className="grid min-h-80 overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface md:grid-cols-[4.5rem_16rem_minmax(0,1fr)_16rem]">
          <WorkbenchRail variant="global" className="border-r bg-sidebar-canvas p-3 text-sidebar-primary-text">CS</WorkbenchRail>
          <WorkbenchRail variant="secondary" className="border-r p-3">
            <WorkbenchSection><WorkbenchSectionHeader title="Resources" metadata="3" />
              <ResourceRow selected className="mt-3 flex items-center gap-2 rounded-md bg-selection-background p-2"><ResourceRowIcon><Box className="size-4" /></ResourceRowIcon><ResourceRowContent><ResourceRowTitle className="block text-sm">AI models</ResourceRowTitle><ResourceRowMeta className="text-xs text-text-supporting">5 available</ResourceRowMeta></ResourceRowContent></ResourceRow>
            </WorkbenchSection>
          </WorkbenchRail>
          <WorkbenchMain className="p-5"><h3 className="ds-type-section-title">Primary work area</h3><p className="ds-type-ui mt-2 text-text-supporting">Product-owned tools and content live here.</p></WorkbenchMain>
          <WorkbenchInspector className="border-l p-4"><WorkbenchInspectorSection label="Details"><ResourceRowDescription className="mt-2 block text-sm text-text-supporting">Contextual metadata and actions.</ResourceRowDescription></WorkbenchInspectorSection></WorkbenchInspector>
        </WorkbenchShell>
      </ExampleSection>

      <ExampleSection title="Content helpers" description="Catalog examples include copyable package imports and provider identity.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4"><ProviderMark name="Amazon Bedrock" shortName="AB" description="Connected and ready" /></div>
          <CodeBlock snippets={[{ value: "tsx", label: "React", code: 'import { PageHeader } from "@conscia-labs/design-system";\n\n<PageHeader title="Connections" />' }]} />
        </div>
      </ExampleSection>
    </PlaygroundPage>
  );
}

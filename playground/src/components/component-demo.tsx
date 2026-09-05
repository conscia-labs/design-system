"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Box, ChevronRight, CircleAlert, Search, Settings } from "lucide-react";

import {
  ActivityItem, ActivityList, Alert, AlertDescription, AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertTitle, AppearanceControl,
  AttentionItem, AttentionList, Avatar, AvatarFallback, AvatarGroup, Badge, BrandIcon,
  BrandWordmark, Button, Card, CardContent, CardDescription, CardFooter, CardHeader,
  CardTitle, Checkbox, CodeBlock, Collapsible, CollapsibleContent, CollapsibleTrigger,
  ConsciaButton, DataPanel, DataPanelContent, DataPanelFooter, DataPanelHeader, DataTable,
  DensityControl, Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FilterBar,
  FilterChip, FormSelect, IconButton, IdentityRow, Input, InventoryDesktop, InventoryMobile,
  InventorySurface, LabeledSwitch, LoadingButton, MetricCard, MetricTrend, NavigationTab,
  NavigationTabs, NavigationTabsList, PageHeader, PageToolbar, Popover, PopoverContent,
  PopoverDescription, PopoverTitle, PopoverTrigger, ProviderMark, ResourceRow,
  ResourceRowContent, ResourceRowDescription, ResourceRowIcon, ResourceRowMeta,
  ResourceRowTitle, SearchableSelect, Separator, Sheet, SheetBody, SheetClose, SheetContent,
  SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, ShortcutHint,
  SidebarNavigation, Skeleton, Spinner, StateView, Switch, Table, TableBody, TableCaption,
  TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList,
  TabsTrigger, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  ValueMeter, WorkbenchInspector, WorkbenchInspectorSection, WorkbenchMain, WorkbenchRail,
  WorkbenchSection, WorkbenchSectionHeader, WorkbenchShell,
  type SidebarNavigationEntry,
} from "@conscia-labs/design-system";

const surface = "rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]";

const rows = [
  { id: "bedrock", name: "Amazon Bedrock", status: "Connected", resources: 18 },
  { id: "vertex", name: "Vertex AI", status: "Attention", resources: 7 },
  { id: "openai", name: "OpenAI", status: "Connected", resources: 12 },
];

function ComponentDemo({ slug }: { slug: string }) {
  const [searchValue, setSearchValue] = useState("bedrock");
  const [filters, setFilters] = useState(["Status"]);

  switch (slug) {
    case "alert":
      return <div className="grid gap-3"><Alert variant="information"><AlertTitle>Provider catalog updated</AlertTitle><AlertDescription>Three new models are available for evaluation.</AlertDescription></Alert><Alert variant="warning"><AlertTitle>Credential expires soon</AlertTitle><AlertDescription>Rotate the production credential within seven days.</AlertDescription></Alert><Alert variant="success"><AlertTitle>Connection restored</AlertTitle><AlertDescription>Health checks are passing again.</AlertDescription></Alert></div>;
    case "alert-dialog":
      return <AlertDialog><AlertDialogTrigger render={<Button variant="destructive" />}>Disconnect provider</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Disconnect provider?</AlertDialogTitle><AlertDialogDescription>Applications will lose access until the provider is reconnected.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel render={<Button variant="outline" />}>Cancel</AlertDialogCancel><AlertDialogAction render={<Button variant="destructive" />}>Disconnect</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
    case "avatar":
      return <div className={`${surface} flex items-center gap-6`}><Avatar><AvatarFallback>RC</AvatarFallback></Avatar><AvatarGroup max={3} total={6} aria-label="Six workspace members"><Avatar><AvatarFallback>AK</AvatarFallback></Avatar><Avatar><AvatarFallback>JL</AvatarFallback></Avatar><Avatar><AvatarFallback>MN</AvatarFallback></Avatar><Avatar><AvatarFallback>ST</AvatarFallback></Avatar></AvatarGroup><IdentityRow initials="CS" name="Conscia Support" detail="Service account" /></div>;
    case "badge":
      return <div className={`${surface} flex flex-wrap gap-2`}><Badge variant="accent">Featured</Badge><Badge variant="outline">Draft</Badge><Badge variant="information">Syncing</Badge><Badge variant="success">Available</Badge><Badge variant="warning">Limited</Badge><Badge variant="danger">Unavailable</Badge><Badge variant="neutral">Archived</Badge></div>;
    case "brand":
      return <div className={`${surface} flex flex-wrap items-center gap-8`}><BrandIcon className="size-12" aria-label="Conscia" /><BrandWordmark className="h-9 w-auto" aria-label="Conscia" /></div>;
    case "button":
      return <div className={`${surface} flex flex-wrap items-center gap-2`}><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Delete</Button><LoadingButton pending pendingLabel="Saving…">Save</LoadingButton><IconButton aria-label="Settings"><Settings /></IconButton></div>;
    case "card":
      return <div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardTitle>Default</CardTitle><CardDescription>General content surface.</CardDescription></CardHeader><CardContent className="text-sm">Connected resources: 18</CardContent><CardFooter><Button size="sm" variant="outline">View</Button></CardFooter></Card><Card variant="muted"><CardContent className="p-5">Muted supporting surface</CardContent></Card><Card variant="elevated"><CardContent className="p-5">Elevated layered surface</CardContent></Card></div>;
    case "form-controls":
      return <div className={`${surface} max-w-2xl`}><FieldGroup><Field><FieldLabel htmlFor="docs-name">Connection name</FieldLabel><Input id="docs-name" defaultValue="Production gateway" /><FieldDescription>Shown to workspace members.</FieldDescription></Field><Field><FieldLabel htmlFor="docs-provider">Provider</FieldLabel><FormSelect id="docs-provider" value="bedrock" onValueChange={() => undefined} options={[{ value: "bedrock", label: "Amazon Bedrock" }, { value: "vertex", label: "Vertex AI" }]} /></Field><Field><FieldLabel htmlFor="docs-search-provider">Searchable provider</FieldLabel><SearchableSelect id="docs-search-provider" value={searchValue} onValueChange={setSearchValue} options={[{ value: "bedrock", label: "Amazon Bedrock" }, { value: "vertex", label: "Vertex AI" }]} /></Field><Field data-invalid><FieldLabel htmlFor="docs-alias">Alias</FieldLabel><Input id="docs-alias" aria-invalid defaultValue="model:auto" /><FieldError>This alias is already in use.</FieldError></Field><Field><FieldLabel htmlFor="docs-notes">Notes</FieldLabel><Textarea id="docs-notes" placeholder="Optional context" /></Field><label className="flex items-center gap-2 text-sm"><Checkbox aria-labelledby="docs-preferred-provider-label" defaultChecked /><span id="docs-preferred-provider-label">Use as preferred provider</span></label><label className="flex items-center justify-between gap-4 text-sm"><span id="docs-health-checks-label">Automatic health checks</span><Switch aria-labelledby="docs-health-checks-label" defaultChecked /></label><label className="flex items-center justify-between gap-4 text-sm"><span id="docs-connection-label">Connection</span><LabeledSwitch aria-labelledby="docs-connection-label" defaultChecked onLabel="ON" offLabel="OFF" /></label></FieldGroup></div>;
    case "disclosure":
      return <div className="grid gap-5"><Collapsible className={surface}><CollapsibleTrigger className="font-medium">Show advanced settings</CollapsibleTrigger><CollapsibleContent className="pt-3 text-sm text-text-supporting">Advanced retry and timeout configuration.</CollapsibleContent></Collapsible><Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="usage">Usage</TabsTrigger></TabsList><TabsContent value="overview" className="pt-3 text-sm">Overview content</TabsContent><TabsContent value="usage" className="pt-3 text-sm">Usage content</TabsContent></Tabs><NavigationTabs><NavigationTabsList><NavigationTab href="#overview" active>Overview</NavigationTab><NavigationTab href="#credentials">Credentials</NavigationTab><NavigationTab href="#activity">Activity</NavigationTab></NavigationTabsList></NavigationTabs></div>;
    case "menus-and-overlays":
      return <TooltipProvider><div className={`${surface} flex flex-wrap gap-2`}><Sheet><SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Connection settings</SheetTitle><SheetDescription>Edit supporting configuration.</SheetDescription></SheetHeader><SheetBody>Sheet content</SheetBody><SheetFooter><SheetClose render={<Button variant="outline" />}>Close</SheetClose><Button>Save</Button></SheetFooter></SheetContent></Sheet><Popover><PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger><PopoverContent><PopoverTitle>Provider status</PopoverTitle><PopoverDescription>All health checks are passing.</PopoverDescription></PopoverContent></Popover><Tooltip><TooltipTrigger render={<IconButton aria-label="More information"><CircleAlert /></IconButton>} /><TooltipContent>Credential rotation guidance</TooltipContent></Tooltip></div></TooltipProvider>;
    case "table":
      return <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface"><Table><TableCaption>Provider connections</TableCaption><TableHeader><TableRow><TableHead>Provider</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Resources</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id} data-selected={row.id === "bedrock" ? "true" : undefined}><TableCell className="font-medium">{row.name}</TableCell><TableCell>{row.status}</TableCell><TableCell className="text-right">{row.resources}</TableCell></TableRow>)}</TableBody><TableFooter><TableRow><TableCell colSpan={2}>Total resources</TableCell><TableCell className="text-right">37</TableCell></TableRow></TableFooter></Table></div>;
    case "supporting-primitives":
      return <div className={`${surface} grid gap-5`}><div className="flex flex-wrap items-center gap-4"><Spinner size="sm" label="Loading" /><Spinner label="Loading" /><Spinner size="lg" label="Loading" /><ShortcutHint label="Command K">⌘K</ShortcutHint><FilterChip label="Provider" value="Bedrock" onRemove={() => undefined} /></div><Separator /><div className="grid gap-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div></div>;
    case "application-shell":
      return <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-canvas"><div className="flex h-12 items-center gap-3 border-b bg-surface px-4"><BrandIcon className="size-5" /><span className="font-semibold">Integrated header</span><div className="ml-auto h-7 w-40 rounded border bg-surface-control" /></div><div className="grid min-h-64 grid-cols-[12rem_1fr]"><div className="border-r bg-surface-muted p-3"><div className="ds-type-eyebrow text-text-supporting">Workspace</div><div className="mt-3 rounded-md bg-selection-background px-3 py-2 text-sm font-semibold text-selection-foreground">Overview</div></div><div className="p-5"><div className="ds-type-section-title">Main region</div><p className="mt-2 text-sm text-text-supporting">The real shell also owns collapse, drawer, inspector, and responsive geometry.</p><Button render={<Link href="/shell-navigation" />} variant="outline" size="sm" className="mt-4">Open shell reference</Button></div></div></div>;
    case "sidebar-navigation": {
      const entries: SidebarNavigationEntry[] = [{ type: "group", id: "delivery", label: "Delivery", items: [{ id: "overview", label: "Overview", icon: <Activity />, active: true }, { id: "services", label: "Services", icon: <Box /> }] }, { type: "submenu", id: "settings", label: "Settings", icon: <Settings />, items: [{ id: "members", label: "Members" }, { id: "access", label: "Access control" }] }];
      return <div className="max-w-64 rounded-[var(--ds-radius-surface)] border bg-sidebar-canvas p-3 text-sidebar-primary-text"><SidebarNavigation entries={entries} renderLink={(item, props) => <a href={`#${item.id}`} {...props} />} /></div>;
    }
    case "page-composition":
      return <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface"><PageHeader title="Provider connection" description="Configure routing and credentials." actions={<Button size="sm">Save changes</Button>} /><PageToolbar aria-label="Connection tools"><Button variant="outline" size="sm">Test connection</Button></PageToolbar><div className="grid gap-2 p-5 text-sm"><div className="flex justify-between"><span className="text-text-supporting">Status</span><Badge variant="success">Connected</Badge></div><div className="flex justify-between"><span className="text-text-supporting">Region</span><span>eu-west-1</span></div></div></div>;
    case "inventory-and-tables":
      return <InventorySurface><InventoryDesktop><DataTable data={rows} columns={[{ id: "name", header: "Provider", cell: (row) => <strong>{row.name}</strong>, accessor: (row) => row.name, sortable: true }, { id: "status", header: "Status", cell: (row) => <Badge variant={row.status === "Connected" ? "success" : "warning"}>{row.status}</Badge> }, { id: "resources", header: "Resources", cell: (row) => row.resources, accessor: (row) => row.resources, sortable: true }]} getRowId={(row) => row.id} /></InventoryDesktop><InventoryMobile>{rows.map((row) => <div key={row.id} className="flex items-center justify-between p-4"><div><div className="font-medium">{row.name}</div><div className="text-sm text-text-supporting">{row.resources} resources</div></div><Badge variant={row.status === "Connected" ? "success" : "warning"}>{row.status}</Badge></div>)}</InventoryMobile></InventorySurface>;
    case "metrics-and-data-panels":
      return <div className="grid gap-4 lg:grid-cols-2"><MetricCard label="Deployment frequency" description="Production deploys per week" value="4.4" unit="/ week" trend={<MetricTrend direction="up" sentiment="positive" value="43%" accessibleLabel="Up 43 percent, positive" />} visualization={<div className="h-full bg-[linear-gradient(135deg,transparent_45%,var(--chart-series-1)_46%,var(--chart-series-1)_49%,transparent_50%)] opacity-70" />} visualizationSummary="Deployment frequency rises across the period." /><DataPanel><DataPanelHeader title="Reliability" status={<Badge variant="success">Healthy</Badge>} /><DataPanelContent><div className="divide-y">{[["Success rate", "99.4%"], ["Mean recovery", "39 min"], ["Availability", "99.98%"]].map(([label, value]) => <div key={label} className="flex justify-between p-4"><span>{label}</span><strong>{value}</strong></div>)}</div></DataPanelContent><DataPanelFooter>Updated 2 minutes ago</DataPanelFooter></DataPanel><ValueMeter label="Monthly budget" value={68} /></div>;
    case "activity-and-attention":
      return <div className="grid gap-6 lg:grid-cols-2"><AttentionList><AttentionItem tone="danger" title="Job success rate below SLO" description="99.2% against a 99.5% target" /><AttentionItem tone="warning" title="Recovery time increased" description="Up 54% for 13 days" /></AttentionList><ActivityList><ActivityItem leading={<span className="mt-1 block size-2 rounded-full bg-success" />} title="checkout-api" description="Deployed by r.chen" metadata="12 minutes ago" trailing={<code>a3f9b21</code>} layout="compact" /><ActivityItem leading={<span className="mt-1 block size-2 rounded-full bg-danger" />} title="workers" description="Deployment failed" metadata="2 hours ago" trailing={<Badge variant="danger">Failed</Badge>} layout="compact" /></ActivityList></div>;
    case "state-and-feedback":
      return <StateView className="min-h-64 rounded-[var(--ds-radius-surface)] border bg-surface" icon={<Search />} title="No matching resources" description="Adjust your filters or try another search term." action={<Button variant="outline">Clear search</Button>} />;
    case "filters-and-preferences":
      return <div className={`${surface} grid gap-5`}><FilterBar onClearAll={() => setFilters([])}>{filters.includes("Status") ? <FilterChip label="Status" value="Connected" onRemove={() => setFilters([])} /> : null}</FilterBar><Separator /><div className="flex flex-wrap gap-6"><AppearanceControl /><DensityControl /></div></div>;
    case "workbench":
      return <WorkbenchShell className="grid min-h-72 overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface md:grid-cols-[4rem_13rem_minmax(0,1fr)_13rem]"><WorkbenchRail variant="global" className="border-r bg-sidebar-canvas p-3"><BrandIcon className="size-6" /></WorkbenchRail><WorkbenchRail variant="secondary" className="border-r p-3"><WorkbenchSection><WorkbenchSectionHeader title="Resources" metadata="3" /><ResourceRow selected className="mt-3"><ResourceRowIcon><Box /></ResourceRowIcon><ResourceRowContent><ResourceRowTitle>AI models</ResourceRowTitle><ResourceRowMeta>5 available</ResourceRowMeta></ResourceRowContent></ResourceRow></WorkbenchSection></WorkbenchRail><WorkbenchMain className="p-5"><h3 className="ds-type-section-title">Primary work area</h3><p className="mt-2 text-sm text-text-supporting">Focused tools and content.</p></WorkbenchMain><WorkbenchInspector className="border-l p-4"><WorkbenchInspectorSection label="Details"><ResourceRowDescription>Contextual metadata.</ResourceRowDescription></WorkbenchInspectorSection></WorkbenchInspector></WorkbenchShell>;
    case "content-helpers":
      return <div className="grid gap-4 lg:grid-cols-2"><div className={surface}><ProviderMark name="Amazon Bedrock" shortName="AB" description="Connected and ready" /></div><CodeBlock snippets={[{ value: "tsx", label: "React", code: 'import { ProviderMark } from "@conscia-labs/design-system";\n\n<ProviderMark name="Amazon Bedrock" shortName="AB" />' }]} /></div>;
    case "conscia-aliases":
      return <div className="grid gap-4"><Alert variant="warning"><AlertTitle>Compatibility only</AlertTitle><AlertDescription>Use canonical component names in all new code.</AlertDescription></Alert><div className={`${surface} flex items-center gap-3`}><ConsciaButton>Legacy alias</ConsciaButton><ChevronRight className="text-text-supporting" /><Button>Button</Button></div></div>;
    default:
      return <div className={surface}>Component preview unavailable.</div>;
  }
}

export { ComponentDemo };

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Blocks, Bell, Cable, Gauge, LayoutTemplate, Plus, Search, Server, Settings2, Sparkles, UserPlus, Webhook,
} from "lucide-react";
import {
  ActivityItem,
  ActivityList,
  AppHeader,
  AppHeaderActions,
  AppHeaderBrand,
  AppHeaderStart,
  AppHeaderTitle,
  AppShell,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  Avatar,
  AvatarFallback,
  Badge,
  BrandIcon,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DesignSystemPreferenceSync,
  Eyebrow,
  IconButton,
  MainRegion,
  MetricCard,
  MetricTrend,
  PageFrame,
  ProductIdentity,
  ShortcutHint,
  SidebarNavigation,
  SidebarTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  type SidebarNavigationEntry,
  type SidebarNavigationItem,
  type SidebarNavigationLinkProps,
} from "@conscia-labs/design-system";

/*
 * A full-screen reference: a split shell whose brand lives in the sidebar
 * header, so the floating sidebar can run the full height of the window.
 * The header sits in the content column. The preview panel switches it
 * between none, transparent (a band appears on scroll), and bar.
 */

type HeaderMode = "none" | "transparent" | "bar";
type Mood = "balanced" | "airy";
type Layout = "floating" | "flush";

const navigation = [
  { type: "group", id: "orchestrate", label: "Orchestrate", items: [
    { id: "overview", label: "Overview", icon: <Gauge /> },
    { id: "experiences", label: "Experiences", icon: <Sparkles />, count: 24, countLabel: "24 experiences" },
    { id: "components", label: "Components", icon: <Blocks /> },
    { id: "templates", label: "Templates", icon: <LayoutTemplate /> },
  ] },
  { type: "group", id: "connect", label: "Connect", items: [
    { id: "connections", label: "Connections", icon: <Cable />, count: 11, countLabel: "11 connections" },
    { id: "webhooks", label: "Webhooks", icon: <Webhook /> },
    { id: "environments", label: "Environments", icon: <Server /> },
  ] },
  { type: "group", id: "workspace", label: "Workspace", items: [
    { id: "settings", label: "Settings", icon: <Settings2 /> },
  ] },
] satisfies SidebarNavigationEntry[];

const experiences = [
  ["Homepage hero", "Web", "Live", "1,204,880", "14 min ago"],
  ["Product detail · apparel", "Web, App", "Live", "842,310", "Yesterday"],
  ["Store finder", "App", "Source slow", "96,442", "2 days ago"],
  ["Black Friday PLP", "Web", "Draft", "—", "3 h ago"],
] as const;

const changes = [
  ["MS", "Maja published Homepage hero v12", "14 min ago"],
  ["JL", "Jonas reconnected Commercetools EU", "1 h ago"],
  ["AR", "Aisha drafted Black Friday PLP", "3 h ago"],
  ["KH", "Kent rotated the Algolia API key", "Yesterday"],
] as const;

function PreviewOption<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="ds-type-metadata text-text-supporting">{label}</span>
      <Tabs variant="segmented" value={value} onValueChange={(next) => onChange(next as T)}>
        <TabsList aria-label={label}>
          {options.map((option) => (
            <TabsTrigger key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default function FloatingWorkspacePage() {
  const [active, setActive] = useState("overview");
  const [header, setHeader] = useState<HeaderMode>("none");
  const [mood, setMood] = useState<Mood>("airy");
  const [layout, setLayout] = useState<Layout>("floating");

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mood = mood;
    return () => {
      delete root.dataset.mood;
    };
  }, [mood]);

  const entries = useMemo<SidebarNavigationEntry[]>(
    () => navigation.map((entry) => ({
      ...entry,
      items: entry.items.map((item) => ({ ...item, active: item.id === active })),
    })),
    [active],
  );
  const renderLink = useCallback(
    (item: SidebarNavigationItem, props: SidebarNavigationLinkProps) => (
      <a
        href={`#${item.id}`}
        {...props}
        onClick={(event) => {
          event.preventDefault();
          setActive(item.id);
          props.onClick?.(event);
        }}
      />
    ),
    [],
  );

  const activeLabel = navigation.flatMap((entry) => entry.items).find((item) => item.id === active)?.label ?? "Overview";
  // Shown in the header only while the sidebar is a drawer.
  const brand = (
    <AppHeaderBrand>
      <BrandIcon aria-hidden="true" className="size-6 text-brand dark:text-white" />
      <span className="text-sm font-semibold">Conscia</span>
    </AppHeaderBrand>
  );

  const search = (
    <button type="button" className="ds-type-control flex h-[var(--ds-control-height-sm)] w-full max-w-80 items-center gap-2 rounded-[var(--ds-radius-control)] border border-control-border bg-surface-control px-3 text-left text-text-supporting outline-none transition-colors hover:bg-surface-control-hover focus-visible:ring-[3px] focus-visible:ring-focus/50">
      <Search className="size-4" aria-hidden="true" />
      <span className="flex-1">Search experiences</span>
      <ShortcutHint>⌘K</ShortcutHint>
    </button>
  );

  return (
    <AppShell headerLayout="split" sidebarLayout={layout}>
      <DesignSystemPreferenceSync />
      <AppSidebar variant="auto" title="Conscia navigation">
        <AppSidebarHeader>
          <ProductIdentity icon={<BrandIcon aria-hidden="true" className="size-4" />} label="Conscia" description="Production · eu-west" />
        </AppSidebarHeader>
        <AppSidebarContent>
          <SidebarNavigation entries={entries} renderLink={renderLink} />
        </AppSidebarContent>
        <AppSidebarFooter>
          <div className="flex min-w-0 items-center gap-2 px-1 group-data-[sidebar-state=collapsed]/shell:justify-center group-data-[sidebar-state=collapsed]/shell:px-0">
            <Avatar className="size-7"><AvatarFallback>KH</AvatarFallback></Avatar>
            <div className="min-w-0 group-data-[sidebar-state=collapsed]/shell:hidden">
              <div className="ds-type-ui truncate font-medium text-sidebar-primary-text">Kent Heide</div>
              <div className="ds-type-metadata truncate text-sidebar-metadata-text">Workspace admin</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="justify-start text-sidebar-secondary-text hover:bg-sidebar-hover hover:text-sidebar-primary-text group-data-[sidebar-state=collapsed]/shell:justify-center" render={<Link href="/" aria-label="Back to the design system playground" />}>
            <ArrowLeft aria-hidden="true" /><span className="group-data-[sidebar-state=collapsed]/shell:hidden">Back to playground</span>
          </Button>
        </AppSidebarFooter>
      </AppSidebar>

      <MainRegion>
        {header === "none" ? (
          // Without a header, a transparent one still carries the drawer trigger and brand on small screens.
          <AppHeader variant="transparent" className="lg:hidden">
            <AppHeaderStart>
              <SidebarTrigger aria-label="Open navigation" />
              {brand}
            </AppHeaderStart>
          </AppHeader>
        ) : (
          <AppHeader variant={header}>
            <AppHeaderStart>
              <SidebarTrigger aria-label="Toggle navigation" />
              {brand}
              <AppHeaderTitle title={activeLabel} className="hidden md:grid">
                <span>Orchestrate</span>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-text-primary">{activeLabel}</span>
              </AppHeaderTitle>
            </AppHeaderStart>
            <AppHeaderActions>
              <div className="hidden w-72 md:block">{search}</div>
              <IconButton variant="ghost" aria-label="Search" className="md:hidden"><Search /></IconButton>
              <IconButton variant="ghost" aria-label="Notifications"><Bell /></IconButton>
              <Avatar className="ml-1 size-8"><AvatarFallback>KH</AvatarFallback></Avatar>
            </AppHeaderActions>
          </AppHeader>
        )}

        <PageFrame width="wide">
          <div className="flex flex-col gap-[var(--ds-space-section)]">
            <div className="ds-supergraphic flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid max-w-[56ch] gap-2">
                <div className="flex items-center gap-3">
                  {header === "none" ? <span className="hidden lg:contents"><SidebarTrigger aria-label="Toggle navigation" /></span> : null}
                  <Eyebrow category="Production · eu-west" />
                </div>
                <h1 className="ds-type-page-title">Good morning, Kent</h1>
                <p className="ds-type-body text-text-supporting">Your experiences served 3.1M requests this week. Two connections need a look before Friday&apos;s catalogue drop.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline"><UserPlus />Invite people</Button>
                <Button><Plus />New experience</Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard tone={mood === "airy" ? "highlight" : "default"} label="Requests this week" value="3.1" unit="M"
                trend={<MetricTrend direction="up" sentiment="positive" value="12.4%" accessibleLabel="Up 12.4 percent, a positive change" />} />
              <MetricCard tone={mood === "airy" ? "supporting" : "default"} label="Cache hit rate" value="94.2" unit="%"
                trend={<MetricTrend direction="up" sentiment="positive" value="1.8 pts" accessibleLabel="Up 1.8 points, a positive change" />} />
              <MetricCard tone={mood === "airy" ? "accent" : "default"} label="p95 response" value="86" unit="ms"
                trend={<MetricTrend direction="down" sentiment="positive" value="9 ms" accessibleLabel="Down 9 milliseconds, a positive change" />} />
              <MetricCard tone={mood === "airy" ? "muted" : "default"} label="Live experiences" value={24} description="3 drafts waiting" />
            </div>

            <div className="grid gap-[var(--ds-space-group)] xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <Card>
                <CardHeader>
                  <CardTitle className="ds-type-section-title">Experiences</CardTitle>
                  <CardDescription>Requests in the last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-[var(--ds-surface-padding)]">Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Requests</TableHead>
                        <TableHead className="pr-[var(--ds-surface-padding)] text-right">Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {experiences.map(([name, , status, requests, updated]) => (
                        <TableRow key={name} interactive>
                          <TableCell className="pl-[var(--ds-surface-padding)] font-medium">{name}</TableCell>
                          <TableCell><Badge variant={status === "Live" ? "success" : status === "Draft" ? "neutral" : "warning"}>{status}</Badge></TableCell>
                          <TableCell className="text-right tabular-nums">{requests}</TableCell>
                          <TableCell className="pr-[var(--ds-surface-padding)] text-right">{updated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="ds-type-section-title">Recent changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityList>
                    {changes.map(([initials, title, when]) => (
                      <ActivityItem
                        key={title}
                        leading={<Avatar className="size-8"><AvatarFallback>{initials}</AvatarFallback></Avatar>}
                        title={title}
                        metadata={when}
                      />
                    ))}
                  </ActivityList>
                </CardContent>
              </Card>
            </div>
          </div>
        </PageFrame>
      </MainRegion>

      <aside
        aria-label="Preview options"
        className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 hidden max-w-[calc(100vw-2rem)] flex-wrap gap-4 rounded-[var(--ds-radius-surface)] border bg-surface-floating p-3 shadow-[var(--ds-shadow-floating)] md:flex"
      >
        <PreviewOption label="Header" value={header} options={["none", "transparent", "bar"] as const} onChange={setHeader} />
        <PreviewOption label="Sidebar" value={layout} options={["floating", "flush"] as const} onChange={setLayout} />
        <PreviewOption label="Mood" value={mood} options={["balanced", "airy"] as const} onChange={setMood} />
      </aside>
    </AppShell>
  );
}

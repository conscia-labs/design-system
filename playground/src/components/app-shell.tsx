"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, Boxes, Component, ExternalLink, Gauge, LayoutDashboard, Monitor, Moon, PanelLeft, Rows3, Search, Shapes, Sun, Type } from "lucide-react";

import {
  AppHeader, AppHeaderActions, AppHeaderSearch, AppHeaderStart,
  AppShell as DesignAppShell, AppSidebar, AppSidebarContent, AppSidebarFooter,
  AppearanceControl, Badge, BrandIcon, Button, CommandPalette,
  DensityControl, DesignSystemPreferenceSync, useConsciaPreferences,
  Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger,
  IconButton, MainRegion, PageFrame, ShortcutHint, SidebarNavigation, SidebarTrigger,
  type SidebarNavigationEntry, type SidebarNavigationItem, type SidebarNavigationLinkProps,
} from "@conscia-labs/design-system";

import { componentDocs } from "@/components/component-docs";

const navEntries = [
  { type: "group", id: "explore", label: "Explore", items: [
    { id: "/", label: "Introduction", icon: <LayoutDashboard /> },
    { id: "/components", label: "All components", icon: <Component /> },
    { id: "/patterns", label: "Pattern catalog", icon: <Boxes /> },
  ] },
  { type: "group", id: "foundation", label: "Foundation", items: [
    { id: "/foundation", label: "Tokens and principles", icon: <Shapes /> },
    { id: "/typography", label: "Typography", icon: <Type /> },
  ] },
  { type: "group", id: "examples", label: "Reference examples", items: [
    { id: "/developer-overview", label: "Developer overview", icon: <Gauge /> },
    { id: "/shell-navigation", label: "Shell and navigation", icon: <PanelLeft /> },
    { id: "/tables", label: "Tables showcase", icon: <BarChart3 /> },
    { id: "/reference-patterns", label: "AI Models", icon: <BookOpen /> },
    { id: "/delivery-metrics", label: "Delivery metrics", icon: <BarChart3 /> },
  ] },
] satisfies SidebarNavigationEntry[];

const commandItems = [...navEntries.flatMap((entry) => entry.items.map((item) => ({
  id: item.id,
  label: `Open ${item.label}`,
  description: entry.label,
  group: "Navigate",
  icon: item.icon,
  keywords: [entry.label],
}))), ...componentDocs.map((doc) => ({
  id: doc.route, label: doc.family, description: doc.description,
  group: "Components", icon: <Component />, keywords: [doc.category, ...doc.exports],
})), {
  id: "/components/tabs", label: "Tabs", description: "Compare tab styles and navigation patterns.",
  group: "Components", icon: <Component />, keywords: ["NavigationTabs", "TabsList", "segmented"],
}];

export function AppShell({ children, version }: { children: ReactNode; version: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const { appearance, density } = useConsciaPreferences();
  const AppearanceIcon = appearance === "dark" ? Moon : appearance === "light" ? Sun : Monitor;
  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);
  const entries = useMemo<SidebarNavigationEntry[]>(
    () => navEntries.map((entry) => ({
      ...entry,
      items: entry.items.map((item) => ({
        ...item,
        active: pathname === item.id || (item.id !== "/" && pathname.startsWith(`${item.id}/`)),
      })),
    })),
    [pathname],
  );
  const renderNavigationLink = useCallback(
    (item: SidebarNavigationItem, props: SidebarNavigationLinkProps) => <Link href={item.id} {...props} />,
    [],
  );

  return (
    <DesignAppShell headerLayout="integrated">
      <DesignSystemPreferenceSync />
      <AppHeader>
        <AppHeaderStart>
          <SidebarTrigger aria-label="Toggle navigation" />
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 text-brand dark:text-white" aria-label="Conscia Design System home">
            <BrandIcon aria-hidden="true" className="size-6" />
            <span className="hidden text-sm font-semibold sm:inline">Conscia</span>
          </Link>
          <span className="ds-type-ui hidden border-l pl-3 text-text-supporting lg:inline">Design System</span>
        </AppHeaderStart>
        <AppHeaderSearch mobileTrigger={
          <IconButton variant="ghost" aria-label="Search design system" onClick={() => setCommandOpen(true)}><Search /></IconButton>
        }>
          <button type="button" className="ds-type-control flex h-[var(--ds-control-height-sm)] w-full items-center gap-2 rounded-[var(--ds-radius-control)] border border-control-border bg-surface-control px-3 text-left text-text-supporting outline-none transition-colors hover:bg-surface-control-hover focus-visible:ring-[3px] focus-visible:ring-focus/50" onClick={() => setCommandOpen(true)}>
            <Search className="size-4" aria-hidden="true" />
            <span className="flex-1">Search design system</span>
            <ShortcutHint>⌘K</ShortcutHint>
          </button>
        </AppHeaderSearch>
        <AppHeaderActions>
          <Badge variant="neutral" aria-label={`Design system version ${version}`} className="mr-2 hidden shrink-0 tabular-nums sm:inline-flex">
            v{version}
          </Badge>
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="sm" aria-label={`Appearance: ${appearance}`} />}>
              <AppearanceIcon aria-hidden="true" /><span className="hidden xl:inline">Appearance</span>
            </PopoverTrigger>
            <PopoverContent className="max-w-[calc(100vw-2rem)]">
              <PopoverTitle>Appearance</PopoverTitle>
              <PopoverDescription className="mt-1 mb-4">Preview every component in light or dark mode.</PopoverDescription>
              <AppearanceControl className="[&_legend]:sr-only" />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="sm" aria-label={`Density: ${density}`} />}>
              <Rows3 aria-hidden="true" /><span className="hidden xl:inline">Density</span>
            </PopoverTrigger>
            <PopoverContent className="max-w-[calc(100vw-2rem)]">
              <PopoverTitle>Density</PopoverTitle>
              <PopoverDescription className="mt-1 mb-4">Adjust control sizing and spacing across the examples.</PopoverDescription>
              <DensityControl className="[&_legend]:sr-only" />
            </PopoverContent>
          </Popover>
        </AppHeaderActions>
      </AppHeader>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={commandItems}
        title="Search the design system"
        description="Find components, public exports, and reference examples."
        placeholder="Search components and examples..."
        onSelect={(item) => router.push(item.id)}
      />
      <AppSidebar
        variant="auto"
        treatment="quiet"
      >
        <AppSidebarContent className="playground-navigation">
          <SidebarNavigation entries={entries} renderLink={renderNavigationLink} />
        </AppSidebarContent>
        <AppSidebarFooter>
          <Button variant="ghost" size="sm" className="justify-start group-data-[sidebar-state=collapsed]/shell:justify-center" render={<a href="https://github.com/conscia-labs/design-system" target="_blank" rel="noreferrer" aria-label="Source on GitHub (opens in a new tab)" />}>
            <ExternalLink aria-hidden="true" /><span className="group-data-[sidebar-state=collapsed]/shell:hidden">Source on GitHub</span>
          </Button>
        </AppSidebarFooter>
      </AppSidebar>
      <MainRegion><PageFrame width="full" className="p-0 md:p-0">{children}</PageFrame></MainRegion>
    </DesignAppShell>
  );
}

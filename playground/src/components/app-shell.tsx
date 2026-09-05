"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bell, BookOpen, Boxes, ChevronDown, Component, Gauge, LayoutDashboard, PanelLeft, Search, Shapes, Type } from "lucide-react";

import {
  AppHeader, AppHeaderActions, AppHeaderSearch, AppHeaderStart,
  AppShell as DesignAppShell, AppSidebar, AppSidebarContent, AppSidebarFooter,
  Avatar, AvatarFallback, BrandIcon, Button, CommandPalette,
  DesignPreferenceControls, DesignSystemPreferenceSync,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
  IconButton, MainRegion, PageFrame, ShortcutHint, SidebarNavigation, SidebarTrigger,
  type SidebarNavigationEntry, type SidebarNavigationItem, type SidebarNavigationLinkProps,
} from "@conscia-labs/design-system";

import { componentDocs } from "@/components/component-docs";

const navEntries = [
  { type: "group", id: "overview", label: "Overview", items: [{ id: "/", label: "Introduction", icon: <LayoutDashboard /> }] },
  { type: "group", id: "foundation", label: "Foundation", items: [
    { id: "/foundation", label: "Tokens and principles", icon: <Shapes /> },
    { id: "/typography", label: "Typography", icon: <Type /> },
  ] },
  { type: "group", id: "components", label: "Components", items: [
    { id: "/components", label: "All components", icon: <Component /> },
    ...componentDocs.map((doc) => ({ id: doc.route, label: doc.family, collapsedLabel: doc.family.slice(0, 2).toUpperCase() })),
  ] },
  { type: "group", id: "patterns", label: "Patterns", items: [
    { id: "/patterns", label: "Pattern catalog", icon: <Boxes /> },
    { id: "/shell-navigation", label: "Shell and navigation", icon: <PanelLeft /> },
  ] },
  { type: "group", id: "examples", label: "Reference examples", items: [
    { id: "/tables", label: "Tables showcase", icon: <BarChart3 /> },
    { id: "/reference-patterns", label: "AI Models", icon: <BookOpen /> },
    { id: "/delivery-metrics", label: "Delivery metrics", icon: <BarChart3 /> },
  ] },
] satisfies SidebarNavigationEntry[];

const commandItems = navEntries.flatMap((entry) => entry.items.map((item) => ({
  id: item.id,
  label: `Open ${item.label}`,
  description: entry.label,
  group: "Navigate",
  icon: "icon" in item ? item.icon : undefined,
  keywords: [entry.label],
})));

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const entries = useMemo<SidebarNavigationEntry[]>(
    () => navEntries.map((entry) => ({
      ...entry,
      items: entry.items.map((item) => ({
        ...item,
        active: pathname === item.id || (item.id !== "/" && item.id !== "/components" && pathname.startsWith(`${item.id}/`)),
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
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="Conscia Design System home">
            <BrandIcon aria-hidden="true" className="size-6" />
            <span className="hidden text-sm font-semibold sm:inline">Conscia</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="min-w-0 max-w-44 justify-between" />}>
              <Gauge />
              <span className="truncate">Design System</span>
              <ChevronDown className="text-text-supporting" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-52">
              <DropdownMenuLabel>Current context</DropdownMenuLabel>
              <DropdownMenuItem>Design System</DropdownMenuItem>
              <DropdownMenuItem>Product Administration</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </AppHeaderStart>
        <AppHeaderSearch mobileTrigger={
          <IconButton variant="ghost" aria-label="Search design system" onClick={() => setCommandOpen(true)}><Search /></IconButton>
        }>
          <button type="button" className="ds-type-control flex h-[var(--ds-control-height-sm)] w-full items-center gap-2 rounded-[var(--ds-radius-control)] border border-control-border bg-surface-control px-3 text-left text-text-supporting outline-none transition-colors hover:bg-surface-control-hover focus-visible:ring-[3px] focus-visible:ring-focus/50" onClick={() => setCommandOpen(true)}>
            <Search className="size-4" />
            <span className="flex-1">Search design system</span>
            <ShortcutHint>⌘K</ShortcutHint>
          </button>
        </AppHeaderSearch>
        <AppHeaderActions>
          <IconButton variant="ghost" aria-label="Notifications"><Bell /></IconButton>
          <button type="button" aria-label="Open account menu" className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-focus/50">
            <Avatar className="size-8"><AvatarFallback>CD</AvatarFallback></Avatar>
          </button>
        </AppHeaderActions>
      </AppHeader>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={commandItems}
        title="Search the design system"
        description="Open a catalog or reference example."
        placeholder="Search components and examples..."
        onSelect={(item) => router.push(item.id)}
      />
      <AppSidebar variant="auto">
        <AppSidebarContent>
          <SidebarNavigation entries={entries} renderLink={renderNavigationLink} />
        </AppSidebarContent>
        <AppSidebarFooter><DesignPreferenceControls className="group-data-[sidebar-state=collapsed]/shell:hidden" /></AppSidebarFooter>
      </AppSidebar>
      <MainRegion><PageFrame width="full" className="p-0">{children}</PageFrame></MainRegion>
    </DesignAppShell>
  );
}

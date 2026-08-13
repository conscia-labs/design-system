"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Layers, PanelLeft, Shapes } from "lucide-react";

import {
  AppShell as DesignAppShell,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  Button,
  DesignPreferenceControls,
  DesignSystemPreferenceSync,
  MainRegion,
  PageFrame,
  ProductIdentity,
  SidebarSearch,
  SidebarNavigation,
  SidebarTrigger,
  TopBar,
  type SidebarNavigationEntry,
  type SidebarNavigationItem,
  type SidebarNavigationLinkProps,
} from "@conscia-labs/design-system";

const navEntries = [
  { id: "/", label: "Overview", icon: <BookOpen /> },
  {
    id: "library",
    label: "Library",
    icon: <Layers />,
    items: [
      { id: "/foundation", label: "Foundation", icon: <Layers /> },
      { id: "/primitives", label: "Primitives", icon: <Shapes /> },
      {
        id: "/reference-patterns",
        label: "Reference Patterns",
        icon: <PanelLeft />,
      },
    ],
  },
] satisfies SidebarNavigationEntry[];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const entries = useMemo<SidebarNavigationEntry[]>(
    () =>
      navEntries.map((entry) => {
        if (!("items" in entry) || !entry.items) {
          return { ...entry, active: pathname === entry.id };
        }

        const items = entry.items.map((item) => ({
          ...item,
          active: pathname === item.id || pathname.startsWith(`${item.id}/`),
        }));

        return {
          ...entry,
          active: items.some((item) => item.active),
          items,
        };
      }),
    [pathname],
  );
  const renderNavigationLink = useCallback(
    (item: SidebarNavigationItem, props: SidebarNavigationLinkProps) => (
      <Link href={item.id} {...props} />
    ),
    [],
  );

  return (
    <DesignAppShell>
      <DesignSystemPreferenceSync />
      <AppSidebar variant="auto">
        <AppSidebarHeader>
          <ProductIdentity
            label="Conscia Design System"
            description="Executable reference"
          />
        </AppSidebarHeader>
        <AppSidebarContent>
          <SidebarSearch shortcut="⌘K" />
          <SidebarNavigation
            entries={entries}
            renderLink={renderNavigationLink}
            storageKey="conscia-design-system-playground-sections"
          />
        </AppSidebarContent>
        <AppSidebarFooter>
          <DesignPreferenceControls className="group-data-[sidebar-state=collapsed]/shell:hidden" />
        </AppSidebarFooter>
      </AppSidebar>
      <MainRegion>
        <TopBar>
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger aria-label="Toggle navigation" />
            <div className="truncate text-sm font-medium text-text-primary">
              Conscia Design System
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
        </TopBar>
        <PageFrame width="full" className="p-0">
          {children}
        </PageFrame>
      </MainRegion>
    </DesignAppShell>
  );
}

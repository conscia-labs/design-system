"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../primitives/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { cn } from "../primitives/utils";
import {
  NavigationGroup,
  NavigationItem,
  NavigationSubItem,
  NavigationSubList,
  useAppShell,
} from "./app-shell";

export type SidebarNavigationItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  startsSection?: boolean;
};

export type SidebarNavigationSection = Omit<
  SidebarNavigationItem,
  "active"
> & {
  active?: boolean;
  items: SidebarNavigationItem[];
};

export type SidebarNavigationEntry =
  | SidebarNavigationItem
  | SidebarNavigationSection;

export type SidebarNavigationLinkProps = {
  "aria-current"?: "page";
  "aria-label": string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type SidebarNavigationProps = {
  entries: SidebarNavigationEntry[];
  renderLink: (
    item: SidebarNavigationItem,
    props: SidebarNavigationLinkProps,
  ) => React.ReactElement;
  onNavigate?: () => void;
  storageKey?: string;
  className?: string;
};

function isSection(
  entry: SidebarNavigationEntry,
): entry is SidebarNavigationSection {
  return "items" in entry;
}

function readOpenSections(storageKey?: string) {
  if (!storageKey || typeof window === "undefined") {
    return {};
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return {};
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return typeof parsedValue === "object" && parsedValue !== null
      ? (parsedValue as Record<string, boolean>)
      : {};
  } catch {
    return {};
  }
}

function SidebarNavigation({
  entries,
  renderLink,
  onNavigate,
  storageKey,
  className,
}: SidebarNavigationProps) {
  const { isMobile, sidebarSide, sidebarState } = useAppShell();
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({});
  const storageReady = React.useRef(false);

  React.useEffect(() => {
    storageReady.current = false;
    const storedSections = readOpenSections(storageKey);

    queueMicrotask(() => {
      storageReady.current = true;
      setOpenSections(storedSections);
    });
  }, [storageKey]);

  React.useEffect(() => {
    if (
      !storageReady.current ||
      !storageKey ||
      !entries.some(isSection)
    ) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(openSections));
    } catch {
      // Navigation remains functional when storage is unavailable.
    }
  }, [entries, openSections, storageKey]);

  const handleNavigate = React.useCallback<
    React.MouseEventHandler<HTMLAnchorElement>
  >(() => {
    onNavigate?.();
  }, [onNavigate]);

  return (
    <nav
      data-slot="sidebar-navigation"
      aria-label="Primary navigation"
      className={cn(
        "flex flex-col gap-[var(--ds-sidebar-group-gap)]",
        className,
      )}
    >
      {entries.map((entry) => {
        if (!isSection(entry)) {
          return (
            <NavigationGroup
              key={entry.id}
              className={
                entry.startsSection
                  ? "mt-[var(--ds-sidebar-group-gap)]"
                  : undefined
              }
            >
              <NavigationItem asChild active={entry.active} tooltip={entry.label}>
                {renderLink(entry, {
                  "aria-current": entry.active ? "page" : undefined,
                  "aria-label": entry.label,
                  onClick: handleNavigate,
                  children: (
                    <>
                      {entry.icon}
                      <span className="truncate group-data-[sidebar-state=collapsed]/shell:hidden">
                        {entry.label}
                      </span>
                    </>
                  ),
                })}
              </NavigationItem>
            </NavigationGroup>
          );
        }

        const sectionOpen = (openSections[entry.id] ?? false) || entry.active;

        if (sidebarState === "collapsed" && !isMobile) {
          return (
            <DropdownMenu key={entry.id}>
              <NavigationGroup
                className={
                  entry.startsSection
                    ? "mt-[var(--ds-sidebar-group-gap)]"
                    : undefined
                }
              >
                <DropdownMenuTrigger asChild>
                  <NavigationItem
                    active={entry.active}
                    aria-label={`${entry.label} menu`}
                  >
                    {entry.icon}
                    <span className="sr-only">{entry.label}</span>
                  </NavigationItem>
                </DropdownMenuTrigger>
              </NavigationGroup>
              <DropdownMenuContent
                side={sidebarSide === "left" ? "right" : "left"}
                align="start"
                sideOffset={8}
                className="min-w-56 rounded-[var(--ds-radius-surface)] p-1.5"
              >
                <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-muted-foreground">
                  {entry.label}
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {entry.items.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      asChild
                      className={cn(
                        "min-h-9 cursor-pointer rounded-[var(--ds-radius-control)] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]",
                        item.active &&
                          "bg-selection-background text-selection-foreground shadow-[inset_2px_0_0_var(--selection-indicator)] focus:bg-selection-background focus:text-selection-foreground",
                      )}
                    >
                      {renderLink(item, {
                        "aria-current": item.active ? "page" : undefined,
                        "aria-label": item.label,
                        onClick: handleNavigate,
                        children: (
                          <>
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                          </>
                        ),
                      })}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Collapsible
            key={entry.id}
            open={sectionOpen}
            onOpenChange={(open) =>
              setOpenSections((current) => ({
                ...current,
                [entry.id]: open,
              }))
            }
            className={cn(
              "group/collapsible",
              entry.startsSection && "mt-2",
            )}
          >
            <NavigationGroup>
              <CollapsibleTrigger asChild>
                <NavigationItem
                  active={entry.active}
                  tooltip={entry.label}
                  aria-label={entry.label}
                  aria-expanded={sectionOpen}
                >
                  {entry.icon}
                  <span className="truncate group-data-[sidebar-state=collapsed]/shell:hidden">
                    {entry.label}
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-150 ease-out group-data-[sidebar-state=collapsed]/shell:hidden group-data-[state=open]/collapsible:rotate-90" />
                </NavigationItem>
              </CollapsibleTrigger>
              <CollapsibleContent
                data-slot="sidebar-collapsible-content"
                className="overflow-hidden"
              >
                <NavigationSubList>
                  {entry.items.map((item) => (
                    <NavigationSubItem
                      key={item.id}
                      asChild
                      active={item.active}
                    >
                      {renderLink(item, {
                        "aria-current": item.active ? "page" : undefined,
                        "aria-label": item.label,
                        onClick: handleNavigate,
                        children: (
                          <>
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                          </>
                        ),
                      })}
                    </NavigationSubItem>
                  ))}
                </NavigationSubList>
              </CollapsibleContent>
            </NavigationGroup>
          </Collapsible>
        );
      })}
    </nav>
  );
}

export { SidebarNavigation };

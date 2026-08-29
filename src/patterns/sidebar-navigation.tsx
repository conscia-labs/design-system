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
  DropdownMenuLinkItem,
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
  badge?: React.ReactNode;
  badgeLabel?: string;
  count?: React.ReactNode;
  countLabel?: string;
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

function getNavigationAccessibleLabel(item: SidebarNavigationItem) {
  const metadata = [item.badgeLabel, item.countLabel].filter(Boolean);

  return metadata.length > 0
    ? `${item.label}, ${metadata.join(", ")}`
    : item.label;
}

function NavigationMetadata({
  badge,
  count,
}: Pick<SidebarNavigationItem, "badge" | "count">) {
  if (badge === undefined && count === undefined) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 text-sidebar-metadata-text"
    >
      {badge !== undefined ? (
        <span className="max-w-28 truncate rounded-full bg-sidebar-hover px-1.5 py-0.5 text-[length:var(--ds-metadata)] font-semibold leading-none">
          {badge}
        </span>
      ) : null}
      {count !== undefined ? (
        <span className="ds-type-metadata tabular-nums">{count}</span>
      ) : null}
    </span>
  );
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
  const { isMobile, setMobileOpen, sidebarSide, sidebarState } = useAppShell();
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
    if (isMobile) {
      setMobileOpen(false);
    }
    onNavigate?.();
  }, [isMobile, onNavigate, setMobileOpen]);

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
              <NavigationItem
                active={entry.active}
                tooltip={entry.label}
                render={renderLink(entry, {
                  "aria-current": entry.active ? "page" : undefined,
                  "aria-label": getNavigationAccessibleLabel(entry),
                  onClick: handleNavigate,
                  children: (
                    <>
                      {entry.icon}
                      <span className="truncate group-data-[sidebar-state=collapsed]/shell:hidden">
                        {entry.label}
                      </span>
                      <NavigationMetadata badge={entry.badge} count={entry.count} />
                    </>
                  ),
                })}
              />
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
                <DropdownMenuTrigger
                  render={
                    <NavigationItem
                      active={entry.active}
                      aria-label={`${getNavigationAccessibleLabel(entry)} menu`}
                    >
                      {entry.icon}
                      <span className="sr-only">{entry.label}</span>
                    </NavigationItem>
                  }
                />
              </NavigationGroup>
              <DropdownMenuContent
                side={sidebarSide === "left" ? "right" : "left"}
                align="start"
                sideOffset={8}
                className="min-w-56 rounded-[var(--ds-radius-surface)] p-1.5"
              >
                <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-text-supporting">
                  {entry.label}
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {entry.items.map((item) => (
                    <DropdownMenuLinkItem
                      key={item.id}
                      closeOnClick
                      render={renderLink(item, {
                        "aria-current": item.active ? "page" : undefined,
                        "aria-label": getNavigationAccessibleLabel(item),
                        onClick: handleNavigate,
                        children: (
                          <>
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                            <NavigationMetadata badge={item.badge} count={item.count} />
                          </>
                        ),
                      })}
                      className={cn(
                        "min-h-9 cursor-pointer rounded-[var(--ds-radius-control)] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]",
                        item.active &&
                          "bg-selection-background text-selection-foreground shadow-[inset_2px_0_0_var(--selection-indicator)] focus:bg-selection-background focus:text-selection-foreground",
                      )}
                    />
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
              <CollapsibleTrigger
                render={
                  <NavigationItem
                    active={entry.active}
                    tooltip={entry.label}
                    aria-label={getNavigationAccessibleLabel(entry)}
                  >
                    {entry.icon}
                    <span className="truncate group-data-[sidebar-state=collapsed]/shell:hidden">
                      {entry.label}
                    </span>
                    <NavigationMetadata badge={entry.badge} count={entry.count} />
                    <ChevronRight className="ml-auto transition-transform duration-150 ease-out group-data-[sidebar-state=collapsed]/shell:hidden group-data-[open]/collapsible:rotate-90" />
                  </NavigationItem>
                }
              />
              <CollapsibleContent
                data-slot="sidebar-collapsible-content"
                className="overflow-hidden"
              >
                <NavigationSubList>
                  {entry.items.map((item) => (
                    <NavigationSubItem
                      key={item.id}
                      active={item.active}
                      render={renderLink(item, {
                        "aria-current": item.active ? "page" : undefined,
                        "aria-label": getNavigationAccessibleLabel(item),
                        onClick: handleNavigate,
                        children: (
                          <>
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                            <NavigationMetadata badge={item.badge} count={item.count} />
                          </>
                        ),
                      })}
                    />
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

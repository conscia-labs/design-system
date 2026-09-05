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
  collapsedLabel?: React.ReactNode;
  badge?: React.ReactNode;
  badgeLabel?: string;
  count?: React.ReactNode;
  countLabel?: string;
  active?: boolean;
  startsSection?: boolean;
};

/** @deprecated Prefer an explicit SidebarNavigationGroup or SidebarNavigationSubmenu. */
export type SidebarNavigationSection = Omit<
  SidebarNavigationItem,
  "active"
> & {
  type?: undefined;
  active?: boolean;
  items: SidebarNavigationItem[];
};

export type SidebarNavigationGroup = {
  type: "group";
  id: string;
  label: string;
  count?: React.ReactNode;
  items: SidebarNavigationItem[];
};

export type SidebarNavigationSubmenu = Omit<
  SidebarNavigationSection,
  "active" | "type"
> & {
  type: "submenu";
  defaultOpen?: boolean;
};

export type SidebarNavigationEntry =
  | SidebarNavigationItem
  | SidebarNavigationSection
  | SidebarNavigationGroup
  | SidebarNavigationSubmenu;

export type SidebarNavigationLinkProps = {
  "aria-current"?: "page";
  "aria-label": string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type SidebarNavigationProps = {
  entries: SidebarNavigationEntry[];
  renderLink: (
    item: SidebarNavigationItem,
    props: SidebarNavigationLinkProps,
  ) => React.ReactElement;
  onNavigate?: () => void;
  storageKey?: string;
  className?: string;
};

function hasItems(
  entry: SidebarNavigationEntry,
): entry is SidebarNavigationSection | SidebarNavigationGroup | SidebarNavigationSubmenu {
  return "items" in entry;
}

function isStaticGroup(
  entry: SidebarNavigationEntry,
): entry is SidebarNavigationGroup {
  return hasItems(entry) && entry.type === "group";
}

function isCollapsibleSection(
  entry: SidebarNavigationEntry,
): entry is SidebarNavigationSection | SidebarNavigationSubmenu {
  return hasItems(entry) && entry.type !== "group";
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

function NavigationItemContent({ item }: { item: SidebarNavigationItem }) {
  return (
    <>
      {item.icon}
      {!item.icon && item.collapsedLabel ? (
        <span className="hidden shrink-0 font-semibold group-data-[sidebar-state=collapsed]/shell:inline">
          {item.collapsedLabel}
        </span>
      ) : null}
      <span className="truncate group-data-[sidebar-state=collapsed]/shell:hidden">
        {item.label}
      </span>
      <NavigationMetadata badge={item.badge} count={item.count} />
    </>
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
      !entries.some(isCollapsibleSection)
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
        if (isStaticGroup(entry)) {
          return (
            <NavigationGroup key={entry.id} label={entry.label} count={entry.count}>
              {entry.items.map((item) => (
                <NavigationItem
                  key={item.id}
                  active={item.active}
                  tooltip={item.label}
                  render={renderLink(item, {
                    "aria-current": item.active ? "page" : undefined,
                    "aria-label": getNavigationAccessibleLabel(item),
                    onClick: handleNavigate,
                    children: <NavigationItemContent item={item} />,
                  })}
                />
              ))}
            </NavigationGroup>
          );
        }

        if (!hasItems(entry)) {
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
                  children: <NavigationItemContent item={entry} />,
                })}
              />
            </NavigationGroup>
          );
        }

        const activeChild = entry.items.some((item) => item.active);
        const defaultOpen = entry.type === "submenu" ? entry.defaultOpen : false;
        const legacyActive = entry.type === undefined ? entry.active : false;
        const sectionOpen =
          (openSections[entry.id] ?? defaultOpen) || activeChild || legacyActive;

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
                      aria-label={`${getNavigationAccessibleLabel(entry)} menu`}
                      className={activeChild ? "text-sidebar-primary-text" : undefined}
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
                          "bg-selection-background font-semibold text-selection-foreground focus:bg-selection-background focus:text-selection-foreground",
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
                    tooltip={entry.label}
                    aria-label={getNavigationAccessibleLabel(entry)}
                    className={activeChild ? "text-sidebar-primary-text" : undefined}
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

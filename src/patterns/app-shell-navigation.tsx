"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { Tooltip, TooltipContent, TooltipTrigger } from "../primitives/tooltip";
import { cn } from "../primitives/utils";
import { useAppShell } from "./app-shell-state";

function NavigationGroup({
  label,
  count,
  children,
  className,
}: {
  label?: React.ReactNode;
  count?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const labelId = React.useId();

  return (
    <section
      data-slot="navigation-group"
      aria-labelledby={label ? labelId : undefined}
      className={cn(
        "flex min-w-0 flex-col gap-[var(--ds-sidebar-label-gap)]",
        className,
      )}
    >
      {label ? (
        <div
          data-slot="navigation-group-label"
          id={labelId}
          className="flex min-h-6 items-center gap-2 px-2 pb-0 pt-2 text-[length:var(--ds-sidebar-group-label-size)] font-semibold uppercase leading-[var(--ds-sidebar-group-label-line-height)] tracking-[0.04em] text-sidebar-group-label group-data-[sidebar-state=collapsed]/shell:hidden"
        >
          {label}
          {count !== undefined ? (
            <span className="ds-type-metadata ml-auto shrink-0 font-medium normal-case tracking-normal text-sidebar-group-count">
              {count}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col gap-[var(--ds-sidebar-item-gap)]">
        {children}
      </div>
    </section>
  );
}

function navigationItemClasses(active?: boolean) {
  return cn(
    "ds-type-navigation flex min-h-[var(--ds-sidebar-item-height-touch)] min-w-0 cursor-pointer items-center gap-2 rounded-[var(--ds-radius-control)] px-2 font-medium text-sidebar-secondary-text outline-none transition-colors duration-[var(--ds-duration-fast)] lg:h-[var(--ds-sidebar-item-height)] lg:min-h-0",
    "hover:bg-sidebar-hover hover:text-sidebar-primary-text",
    "focus-visible:ring-[3px] focus-visible:ring-sidebar-focus-ring",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    "group-data-[sidebar-state=collapsed]/shell:justify-center group-data-[sidebar-state=collapsed]/shell:px-0",
    "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75] [&>svg]:text-sidebar-icon",
    active &&
      "bg-sidebar-active-background font-semibold text-sidebar-active-foreground hover:bg-sidebar-active-background hover:text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground",
  );
}

type NavigationItemProps = Omit<
  React.ComponentProps<"button">,
  "render"
> & {
  active?: boolean;
  tooltip?: string;
  render?: useRender.ComponentProps<"button">["render"];
};

const NavigationItem = React.forwardRef<HTMLElement, NavigationItemProps>(
  function NavigationItem(
    {
      active = false,
      tooltip,
      render,
      type,
      "aria-expanded": ariaExpanded,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const { sidebarState, sidebarSide, isMobile } = useAppShell();
    const item = useRender({
      defaultTagName: "button",
      render,
      ref,
      props: {
        "data-slot": "navigation-item",
        "data-active": active ? "true" : undefined,
        "aria-expanded": ariaExpanded,
        type: render ? undefined : type ?? "button",
        className: cn(navigationItemClasses(active), className),
        ...props,
        ...(render ? {} : { children }),
      },
    });

    if (!tooltip) {
      return item;
    }

    return (
      <Tooltip>
        <TooltipTrigger render={item} />
        <TooltipContent
          side={sidebarSide === "left" ? "right" : "left"}
          align="center"
          hidden={sidebarState !== "collapsed" || isMobile}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  },
);

type NavigationSubItemProps = Omit<React.ComponentProps<"a">, "render"> & {
  active?: boolean;
  render?: useRender.ComponentProps<"a">["render"];
};

const NavigationSubItem = React.forwardRef<HTMLElement, NavigationSubItemProps>(
  function NavigationSubItem(
    {
      active = false,
      render,
      className,
      ...props
    },
    ref,
  ) {
    return useRender({
      defaultTagName: "a",
      render,
      ref,
      props: {
        "data-slot": "navigation-sub-item",
        "data-active": active ? "true" : undefined,
        className: cn(
          "ds-type-navigation flex min-h-[var(--ds-sidebar-item-height-touch)] min-w-0 cursor-pointer items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-sidebar-secondary-text outline-none transition-colors duration-[var(--ds-duration-fast)] lg:h-[calc(var(--ds-sidebar-item-height)-0.25rem)] lg:min-h-0",
          "hover:bg-sidebar-hover hover:text-sidebar-primary-text focus-visible:ring-[3px] focus-visible:ring-sidebar-focus-ring",
          "group-data-[sidebar-state=collapsed]/shell:hidden [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-[1.75] [&>svg]:text-sidebar-icon",
          active &&
            "bg-sidebar-active-background font-semibold text-sidebar-active-foreground hover:bg-sidebar-active-background hover:text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground",
          className,
        ),
        ...props,
      },
    });
  },
);

/*
 * NavigationItem and NavigationSubItem intentionally use Base UI's render
 * contract instead of a Slot compatibility layer. This keeps the navigation
 * API small while allowing framework links to own routing.
 */

function NavigationSubList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-sub-list"
      className={cn(
        "ml-4 flex min-w-0 flex-col gap-[var(--ds-sidebar-item-gap)] border-l border-sidebar-border pl-2 group-data-[sidebar-state=collapsed]/shell:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  NavigationGroup,
  NavigationItem,
  NavigationSubItem,
  NavigationSubList,
  navigationItemClasses,
};

export type {
  NavigationItemProps,
  NavigationSubItemProps,
};

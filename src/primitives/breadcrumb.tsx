import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "./utils";

/** The path to the current page. Separators are added between items for you. */
function Breadcrumb({ "aria-label": ariaLabel = "Breadcrumb", className, children, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav data-slot="breadcrumb" aria-label={ariaLabel} className={cn("min-w-0", className)} {...props}>
      <ol className="ds-type-ui flex min-w-0 flex-wrap items-center gap-1.5 text-text-supporting">{children}</ol>
    </nav>
  );
}

function BreadcrumbItem({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-item" className={cn("group/breadcrumb-item inline-flex min-w-0 items-center gap-1.5", className)} {...props}>
      <ChevronRightIcon aria-hidden="true" className="size-3.5 shrink-0 opacity-70 group-first/breadcrumb-item:hidden" />
      {children}
    </li>
  );
}

type BreadcrumbLinkProps = React.ComponentProps<"a"> & {
  /** Render a router link instead of an anchor, for example `render={<Link href="/models" />}`. */
  render?: useRender.ComponentProps<"a">["render"];
};

function BreadcrumbLink({ className, render, ...props }: BreadcrumbLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">({
      "data-slot": "breadcrumb-link",
      className: cn(
        "truncate rounded-sm outline-none transition-colors hover:text-text-primary focus-visible:ring-[3px] focus-visible:ring-focus-ring",
        className,
      ),
      ...props,
    } as React.ComponentProps<"a">, {}),
  });
}

/** The last item: the page the user is on. Not a link. */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("truncate font-medium text-text-primary", className)} {...props} />;
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage };
export type { BreadcrumbLinkProps };

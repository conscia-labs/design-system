import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ArrowLeft } from "lucide-react";

import { cn } from "../primitives/utils";

type DetailBackLinkProps = Omit<React.ComponentProps<"a">, "children"> & {
  label: string;
  /** Render a router link instead of an anchor, for example `render={<Link href="/models" />}`. */
  render?: useRender.ComponentProps<"a">["render"];
};

/**
 * The arrow aligns with the frame's left edge; the hover surface extends into
 * the gutter so the link shares one inset with PageHeader and page content.
 */
function DetailBackLink({ label, className, render, ...props }: DetailBackLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">({
      ...props,
      "data-slot": "detail-back-link",
      className: cn(
        "-ml-2 inline-flex h-8 w-fit items-center gap-2 rounded-md px-2 text-sm font-medium text-text-supporting outline-none transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:ring-[3px] focus-visible:ring-focus-ring",
        className,
      ),
      children: (
        <>
          <ArrowLeft className="size-4" aria-hidden="true" />
          {label}
        </>
      ),
    } as React.ComponentProps<"a">, {}),
  });
}

export { DetailBackLink };
export type { DetailBackLinkProps };

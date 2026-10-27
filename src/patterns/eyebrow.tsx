import * as React from "react";

import { cn } from "../primitives/utils";

type EyebrowProps = React.ComponentProps<"p"> & {
  /** The category, such as "Press release" or "Case". Rendered in uppercase. */
  category: React.ReactNode;
  /** Optional metadata after an em dash, usually a date. */
  meta?: React.ReactNode;
  /** Machine-readable date for `meta`. When set, `meta` renders in a `<time>` element. */
  dateTime?: string;
};

/**
 * The conscia.com metadata line: "PRESS RELEASE — OCTOBER 8, 2026". Place it
 * above a card or article title.
 */
function Eyebrow({ category, meta, dateTime, className, ...props }: EyebrowProps) {
  return (
    <p data-slot="eyebrow" className={cn("ds-type-eyebrow uppercase text-text-supporting", className)} {...props}>
      <span data-slot="eyebrow-category">{category}</span>
      {meta ? (
        <>
          <span aria-hidden="true"> — </span>
          {dateTime ? <time dateTime={dateTime}>{meta}</time> : <span>{meta}</span>}
        </>
      ) : null}
    </p>
  );
}

export { Eyebrow };
export type { EyebrowProps };

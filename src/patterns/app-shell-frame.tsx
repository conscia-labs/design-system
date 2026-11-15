"use client";

import * as React from "react";
import { cn } from "../primitives/utils";

function PageFrame({
  width = "full",
  className,
  ...props
}: React.ComponentProps<"main"> & {
  width?: "full" | "wide" | "focused" | "reading";
}) {
  return (
    <main
      data-slot="page-frame"
      data-width={width}
      className={cn(
        "min-w-0 w-full flex-1 px-[var(--ds-frame-padding-x)] py-[var(--ds-space-section)] [--ds-frame-content-inset:0px]",
        width === "wide" && "mx-auto w-full max-w-[86rem]",
        width === "focused" && "mx-auto w-full max-w-[64rem]",
        width === "reading" && "mx-auto w-full max-w-[48rem]",
        className,
      )}
      {...props}
    />
  );
}

function PageContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-content"
      className={cn("flex min-w-0 flex-col gap-[var(--ds-space-section)]", className)}
      {...props}
    />
  );
}

function PageBoundary({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-boundary"
      className={cn(
        "rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-[var(--ds-surface-padding)]",
        className,
      )}
      {...props}
    />
  );
}

function InspectorRegion({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="inspector-region"
      className={cn(
        "w-full border-l border-border-subtle bg-surface md:w-[20rem] xl:w-[24rem]",
        className,
      )}
      {...props}
    />
  );
}

export {
  InspectorRegion,
  PageBoundary,
  PageContent,
  PageFrame,
};

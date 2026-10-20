"use client";

import * as React from "react";

import { cn } from "./utils";

type DateTimeFieldProps = Omit<React.ComponentProps<"input">, "type"> & {
  /**
   * IANA time zone the value is entered in, such as "UTC" or
   * "Europe/Copenhagen". Defaults to the viewer's zone once mounted. The field
   * states the zone; it does not convert the value.
   */
  timeZone?: string;
  /** Replaces the displayed zone name, for example "UTC" or "Copenhagen time". */
  timeZoneLabel?: React.ReactNode;
  /** Applied to the input; `className` applies to the field frame. */
  inputClassName?: string;
};

function subscribeToTimeZone() {
  return () => {};
}

function getViewerTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getServerTimeZone() {
  return null;
}

function formatTimeZone(timeZone: string) {
  return timeZone === "Etc/UTC" ? "UTC" : timeZone.replace(/_/g, " ");
}

/**
 * A date and time input that states the time zone it is entered in. It
 * matches Input sizing and submits the native `datetime-local` value.
 */
function DateTimeField({
  timeZone,
  timeZoneLabel,
  className,
  inputClassName,
  "aria-describedby": ariaDescribedBy,
  ref,
  ...props
}: DateTimeFieldProps) {
  const zoneId = React.useId();
  // The viewer's zone is only known in the browser; server rendering shows "Local time".
  const viewerTimeZone = React.useSyncExternalStore(
    subscribeToTimeZone,
    getViewerTimeZone,
    getServerTimeZone,
  );

  const resolvedZone = timeZone ?? viewerTimeZone;
  const zoneLabel =
    timeZoneLabel ?? (resolvedZone ? formatTimeZone(resolvedZone) : "Local time");

  return (
    <div
      data-slot="date-time-field"
      className={cn(
        "flex h-[var(--ds-field-control-height)] w-full min-w-0 items-stretch overflow-hidden rounded-[var(--ds-field-control-radius)] border border-control-border bg-surface-control transition-colors",
        "focus-within:border-focus focus-within:ring-[3px] focus-within:ring-focus/50",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
        "has-[input[aria-invalid=true]]:border-danger has-[input[aria-invalid=true]]:ring-danger/20",
        className,
      )}
    >
      <input
        {...props}
        ref={ref}
        type="datetime-local"
        data-slot="date-time-field-input"
        aria-describedby={cn(ariaDescribedBy, zoneId)}
        className={cn(
          "ds-type-control min-w-0 flex-1 bg-transparent px-[var(--ds-field-control-padding-x)] text-text-primary outline-none disabled:cursor-not-allowed",
          inputClassName,
        )}
      />
      <span
        id={zoneId}
        data-slot="date-time-field-zone"
        className="ds-type-metadata flex shrink-0 items-center whitespace-nowrap border-l border-control-border px-3 text-text-supporting"
      >
        <span className="sr-only">Time zone: </span>
        {zoneLabel}
      </span>
    </div>
  );
}

export { DateTimeField };
export type { DateTimeFieldProps };

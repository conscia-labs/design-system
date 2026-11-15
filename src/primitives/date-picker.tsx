"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange, type DayPickerProps } from "react-day-picker";

import { fieldControlClasses } from "./field-control";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

const calendarClassNames: NonNullable<DayPickerProps["classNames"]> = {
  months: "relative flex flex-wrap gap-4",
  month: "grid gap-3",
  month_caption: "flex h-8 items-center justify-center",
  caption_label: "ds-type-ui font-medium",
  nav: "absolute inset-x-0 top-0 flex h-8 items-center justify-between",
  button_previous: "inline-flex size-8 items-center justify-center rounded-md text-text-supporting outline-none hover:bg-surface-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring aria-disabled:opacity-40",
  button_next: "inline-flex size-8 items-center justify-center rounded-md text-text-supporting outline-none hover:bg-surface-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring aria-disabled:opacity-40",
  month_grid: "border-collapse",
  weekday: "ds-type-metadata size-9 font-normal text-text-supporting",
  day: "size-9 p-0 text-center",
  day_button: "inline-flex size-9 cursor-default items-center justify-center rounded-md text-sm tabular-nums outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-focus-ring",
  today: "font-semibold text-text-link",
  selected: "[&>button]:bg-action [&>button]:text-action-foreground [&>button]:hover:bg-action-hover",
  outside: "text-text-supporting",
  disabled: "opacity-40 [&>button]:pointer-events-none",
  range_start: "rounded-l-md bg-selection-background",
  range_end: "rounded-r-md bg-selection-background",
  range_middle: "bg-selection-background [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-selection-foreground [&>button]:hover:bg-selection-background-strong",
  hidden: "invisible",
};

/** A month grid for picking a day or a range. DatePicker and DateRangePicker put it in a popover. */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit", className)}
      classNames={{ ...calendarClassNames, ...classNames }}
      components={{
        Chevron: ({ orientation }) => (orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />),
      }}
      {...props}
    />
  );
}

type PickerProps = {
  id?: string;
  /** Submits the date as `yyyy-mm-dd`. A range submits `<name>-from` and `<name>-to`. */
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Earliest and latest selectable day. */
  min?: Date;
  max?: Date;
  /** BCP 47 locale for the displayed date. Fixed by default so server and client render the same text. */
  locale?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

type DatePickerProps = PickerProps & {
  /** Pass `null` for an empty controlled value. */
  value?: Date | null;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
};

type DateRangeValue = DateRange;

type DateRangePickerProps = PickerProps & {
  /** Pass `null` for an empty controlled value. */
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue;
  onValueChange?: (value: DateRangeValue | undefined) => void;
  numberOfMonths?: number;
};

function toIsoDate(date: Date | undefined) {
  if (!date) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dayLimits(min?: Date, max?: Date) {
  return [...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : [])];
}

function PickerTrigger({ text, placeholder, className, ...props }: Omit<PickerProps, "name" | "min" | "max" | "locale"> & { text: string }) {
  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          data-slot="date-picker"
          data-placeholder={text ? undefined : ""}
          className={cn(fieldControlClasses, "items-center justify-between gap-2 text-left data-[placeholder]:text-text-supporting", className)}
          {...props}
        />
      }
    >
      <span className="truncate">{text || placeholder}</span>
      <CalendarDays className="size-4 shrink-0 text-text-supporting" aria-hidden="true" />
    </PopoverTrigger>
  );
}

/** One day, chosen from a calendar in a popover. */
function DatePicker({ value, defaultValue, onValueChange, name, min, max, locale = "en-US", placeholder = "Pick a date", ...trigger }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const selected = value === undefined ? inner : value ?? undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PickerTrigger text={selected ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(selected) : ""} placeholder={placeholder} {...trigger} />
      {name ? <input type="hidden" name={name} value={toIsoDate(selected)} /> : null}
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          disabled={dayLimits(min, max)}
          onSelect={(next) => {
            setInner(next);
            onValueChange?.(next);
            if (next) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/** A start and end day, chosen from a calendar in a popover. */
function DateRangePicker({ value, defaultValue, onValueChange, name, min, max, locale = "en-US", placeholder = "Pick a date range", numberOfMonths = 2, ...trigger }: DateRangePickerProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const selected = value === undefined ? inner : value ?? undefined;
  const format = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const text = selected?.from ? `${format.format(selected.from)} – ${selected.to ? format.format(selected.to) : "…"}` : "";

  return (
    <Popover>
      <PickerTrigger text={text} placeholder={placeholder} {...trigger} />
      {name ? (
        <>
          <input type="hidden" name={`${name}-from`} value={toIsoDate(selected?.from)} />
          <input type="hidden" name={`${name}-to`} value={toIsoDate(selected?.to)} />
        </>
      ) : null}
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="range"
          selected={selected}
          defaultMonth={selected?.from}
          numberOfMonths={numberOfMonths}
          disabled={dayLimits(min, max)}
          onSelect={(next) => {
            setInner(next);
            onValueChange?.(next);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { Calendar, DatePicker, DateRangePicker };
export type { DatePickerProps, DateRangePickerProps, DateRangeValue };

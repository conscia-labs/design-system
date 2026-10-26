import * as React from "react";

import { Disclosure } from "../primitives/disclosure";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../primitives/table";
import { cn } from "../primitives/utils";

type DailyVolumePoint = {
  /** Calendar day as `YYYY-MM-DD`. */
  date: string;
  /** Total for the day. */
  value: number;
  /** The part of `value` that did not succeed; drawn as a stacked segment. */
  unsuccessful?: number;
};

/**
 * Semantic colour for a series. `success` and `danger` carry outcome meaning,
 * so a successful series matches success badges and trends elsewhere on the
 * page; `accent` is the neutral first chart series for measures with no
 * outcome, such as plain volume.
 */
type DailyVolumeTone = "success" | "danger" | "warning" | "information" | "accent";

const toneClassNames: Record<DailyVolumeTone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  information: "bg-information",
  accent: "bg-chart-series-1",
};

type DailyVolumeChartProps = Omit<React.ComponentProps<"figure">, "children" | "title"> & {
  title: React.ReactNode;
  /** Plain-text name used in the chart's accessible summary. */
  summaryLabel: string;
  data: readonly DailyVolumePoint[];
  /** First calendar day shown (`YYYY-MM-DD`). Defaults to the earliest data point. */
  start?: string;
  /** Last calendar day shown (`YYYY-MM-DD`). Defaults to the latest data point. */
  end?: string;
  /** Plural unit stated with the scale and table, such as "requests". */
  unit: string;
  /** Legend label for the main series. */
  successfulLabel?: string;
  /** Legend and table label for the stacked segment. */
  unsuccessfulLabel?: string;
  /** Colour of the main series. Defaults to the success token so "Successful" matches outcome colours nearby. */
  successfulTone?: DailyVolumeTone;
  /** Colour of the stacked segment. Defaults to the danger token. */
  unsuccessfulTone?: DailyVolumeTone;
  formatValue?: (value: number) => string;
  formatDate?: (date: string) => string;
  tableLabel?: React.ReactNode;
};

const dayInMilliseconds = 86_400_000;
const defaultNumberFormat = new Intl.NumberFormat("en-US");
const defaultDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function parseDay(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year!, month! - 1, day!);
}

function formatDay(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

/** Every calendar day from start to end, inclusive, with missing days as zero. */
function calendarDays(data: readonly DailyVolumePoint[], start?: string, end?: string) {
  const byDate = new Map(data.map((point) => [point.date, point]));
  const sorted = [...byDate.keys()].sort();
  const first = start ?? sorted[0];
  const last = end ?? sorted.at(-1);
  if (!first || !last) return [];

  const days: DailyVolumePoint[] = [];
  for (let time = parseDay(first); time <= parseDay(last); time += dayInMilliseconds) {
    const date = formatDay(time);
    days.push(byDate.get(date) ?? { date, value: 0 });
  }
  return days;
}

/** Rounds a maximum up to 1, 2, 2.5, or 5 times a power of ten. */
function niceScaleMaximum(maximum: number) {
  if (maximum <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(maximum));
  const step = [1, 2, 2.5, 5, 10].find((candidate) => candidate * magnitude >= maximum)!;
  return step * magnitude;
}

/**
 * A per-day measure with calendar-true days, a stated scale, first, middle,
 * and last date labels, an optional stacked "not successful" segment, and an
 * exact-values table.
 */
function DailyVolumeChart({
  title,
  summaryLabel,
  data,
  start,
  end,
  unit,
  successfulLabel = "Successful",
  unsuccessfulLabel = "Not successful",
  successfulTone = "success",
  unsuccessfulTone = "danger",
  formatValue = (value) => defaultNumberFormat.format(value),
  formatDate = (date) => defaultDateFormat.format(new Date(parseDay(date))),
  tableLabel = "View daily data",
  className,
  ...props
}: DailyVolumeChartProps) {
  const days = calendarDays(data, start, end);
  const showUnsuccessful = days.some((day) => (day.unsuccessful ?? 0) > 0);
  const total = days.reduce((sum, day) => sum + day.value, 0);
  const peak = days.reduce<DailyVolumePoint | undefined>(
    (current, day) => (!current || day.value > current.value ? day : current),
    undefined,
  );
  const scaleMaximum = niceScaleMaximum(peak?.value ?? 0);
  const labelIndexes = new Set([0, Math.floor((days.length - 1) / 2), days.length - 1]);
  const summary = days.length
    ? `${summaryLabel}: ${days.length} days from ${formatDate(days[0]!.date)} to ${formatDate(days.at(-1)!.date)}. Total ${formatValue(total)} ${unit}${peak && peak.value > 0 ? `; peak ${formatValue(peak.value)} on ${formatDate(peak.date)}` : ""}.`
    : `${summaryLabel}: no data.`;

  return (
    <figure data-slot="daily-volume-chart" className={cn("grid min-w-0 gap-3", className)} {...props}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="ds-type-card-title">{title}</span>
        <span data-slot="daily-volume-chart-scale" className="ds-type-metadata text-text-supporting">
          Scale 0–{formatValue(scaleMaximum)} {unit}
        </span>
      </figcaption>
      {showUnsuccessful ? (
        <div data-slot="daily-volume-chart-legend" className="ds-type-metadata flex flex-wrap gap-4 text-text-supporting" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-sm", toneClassNames[successfulTone])} />
            {successfulLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-sm", toneClassNames[unsuccessfulTone])} />
            {unsuccessfulLabel}
          </span>
        </div>
      ) : null}
      <div>
        <div
          role="img"
          aria-label={summary}
          data-slot="daily-volume-chart-plot"
          className="flex h-40 items-end gap-px border-b border-t border-dashed border-b-border-default border-t-chart-grid"
        >
          {days.map((day) => {
            const unsuccessful = Math.min(day.unsuccessful ?? 0, day.value);
            return (
              <div
                key={day.date}
                data-slot="daily-volume-chart-day"
                title={`${formatDate(day.date)}: ${formatValue(day.value)} ${unit}${unsuccessful ? `, ${formatValue(unsuccessful)} ${unsuccessfulLabel.toLowerCase()}` : ""}`}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <div
                  className="flex flex-col overflow-hidden rounded-t-[2px]"
                  style={{ height: `${(day.value / scaleMaximum) * 100}%` }}
                >
                  {unsuccessful ? (
                    <div
                      data-slot="daily-volume-chart-unsuccessful"
                      className={toneClassNames[unsuccessfulTone]}
                      style={{ height: `${(unsuccessful / day.value) * 100}%` }}
                    />
                  ) : null}
                  <div data-slot="daily-volume-chart-successful" className={cn("flex-1", toneClassNames[successfulTone])} />
                </div>
              </div>
            );
          })}
        </div>
        <div aria-hidden="true" className="ds-type-metadata mt-1.5 flex text-text-supporting">
          {days.map((day, index) => (
            <span
              key={day.date}
              className={cn(
                "min-w-0 flex-1 whitespace-nowrap",
                index === 0 ? "text-left" : index === days.length - 1 ? "text-right" : "text-center",
              )}
            >
              {labelIndexes.has(index) ? formatDate(day.date) : null}
            </span>
          ))}
        </div>
      </div>
      <Disclosure summary={tableLabel} count={days.length}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total {unit}</TableHead>
              {showUnsuccessful ? <TableHead className="text-right">{unsuccessfulLabel}</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{formatDate(day.date)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatValue(day.value)}</TableCell>
                {showUnsuccessful ? (
                  <TableCell className="text-right tabular-nums">{formatValue(day.unsuccessful ?? 0)}</TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Disclosure>
    </figure>
  );
}

export { DailyVolumeChart };
export type { DailyVolumeChartProps, DailyVolumePoint, DailyVolumeTone };

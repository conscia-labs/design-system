import * as React from "react";
import { ResponsiveContainer } from "recharts";
import type { TooltipContentProps } from "recharts";

import { Disclosure } from "../primitives/disclosure";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../primitives/table";
import { cn } from "../primitives/utils";
import { resolveChartConfig } from "./chart-config";
import type { ChartConfig, ResolvedChartSeries } from "./chart-config";

type ChartValueFormatter = (value: number) => string;
type ChartDatum = Record<string, unknown>;

const defaultNumberFormat = new Intl.NumberFormat("en-US");
const defaultFormatValue: ChartValueFormatter = (value) => defaultNumberFormat.format(value);

type ChartContextValue = {
  series: ResolvedChartSeries[];
  formatValue: ChartValueFormatter;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

/** The resolved series and value format of the nearest `ChartContainer`. */
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("Chart components must be rendered inside a ChartContainer.");
  return context;
}

/** A custom-property-safe name for a series key, exposed as `--series-<key>` on the container. */
function seriesVariable(key: string) {
  return `--series-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/** Shared tick and axis-line styling for Recharts `XAxis` and `YAxis`. */
const chartAxisProps = {
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  tick: { fill: "var(--chart-axis)", fontSize: 12 },
} as const;

/** Horizontal dashed gridlines on the grid token, for Recharts `CartesianGrid`. */
const chartGridProps = {
  stroke: "var(--chart-grid)",
  strokeDasharray: "3 3",
  vertical: false,
} as const;

type ChartContainerProps = Omit<React.ComponentProps<"figure">, "children" | "title"> & {
  title: React.ReactNode;
  /** Secondary caption line on the right, such as the scale or unit. */
  description?: React.ReactNode;
  /** Plain-text description of what the chart shows, announced in place of the plot. */
  summary: string;
  config: ChartConfig;
  /** Plot height in pixels. */
  height?: number;
  /** Show the series legend. Defaults to true when there is more than one series. */
  legend?: boolean;
  /** Trailing legend text per series key, such as each slice's share. */
  legendValues?: Record<string, React.ReactNode>;
  /** Exact values, usually a `ChartDataTable`, shown in a disclosure below the plot. */
  table?: React.ReactNode;
  tableLabel?: React.ReactNode;
  tableCount?: React.ReactNode;
  formatValue?: ChartValueFormatter;
  /** A single Recharts chart element, sized to the plot. */
  children: React.ReactElement;
};

/**
 * The frame for every chart: a caption, a token-coloured legend, a plot that
 * screen readers hear as its text summary, and an optional exact-values table.
 * Each series colour is also exposed as `--series-<key>` for custom marks.
 */
function ChartContainer({
  title,
  description,
  summary,
  config,
  height = 240,
  legend,
  legendValues,
  table,
  tableLabel = "View data",
  tableCount,
  formatValue = defaultFormatValue,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  const series = React.useMemo(() => resolveChartConfig(config), [config]);
  const context = React.useMemo(() => ({ series, formatValue }), [series, formatValue]);
  const seriesStyle = Object.fromEntries(series.map((item) => [seriesVariable(item.key), item.color]));
  const showLegend = legend ?? series.length > 1;

  return (
    <ChartContext.Provider value={context}>
      <figure
        data-slot="chart"
        className={cn("grid min-w-0 gap-3", className)}
        style={{ ...seriesStyle, ...style }}
        {...props}
      >
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="ds-type-card-title">{title}</span>
          {description ? (
            <span data-slot="chart-description" className="ds-type-metadata text-text-supporting">
              {description}
            </span>
          ) : null}
        </figcaption>
        {showLegend ? <ChartLegend values={legendValues} /> : null}
        <div role="img" aria-label={summary} data-slot="chart-plot" className="min-w-0" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height }}>
            {children}
          </ResponsiveContainer>
        </div>
        {table ? (
          <Disclosure summary={tableLabel} count={tableCount}>
            {table}
          </Disclosure>
        ) : null}
      </figure>
    </ChartContext.Provider>
  );
}

type ChartLegendProps = React.ComponentProps<"ul"> & {
  /** Optional trailing text per series key, such as a value or share. */
  values?: Record<string, React.ReactNode>;
};

/**
 * Series swatches and labels from the container config. Hidden from assistive
 * technology, which hears the summary and the data table instead.
 */
function ChartLegend({ values, className, ...props }: ChartLegendProps) {
  const { series } = useChart();
  return (
    <ul
      data-slot="chart-legend"
      aria-hidden="true"
      className={cn("ds-type-metadata flex flex-wrap gap-x-4 gap-y-1 text-text-supporting", className)}
      {...props}
    >
      {series.map((item) => (
        <li key={item.key} className="inline-flex items-center gap-1.5">
          <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label}
          {values?.[item.key] !== undefined ? (
            <span className="text-text-primary tabular-nums">{values[item.key]}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

type ChartTooltipContentProps = Partial<TooltipContentProps<number, string>> & {
  formatLabel?: (label: unknown) => React.ReactNode;
};

/** Token-styled tooltip body for Recharts `<Tooltip content={<ChartTooltipContent />} />`. */
function ChartTooltipContent({ active, payload, label, formatLabel }: ChartTooltipContentProps) {
  const { series, formatValue } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div
      data-slot="chart-tooltip"
      className="ds-type-metadata grid min-w-32 gap-1.5 rounded-md border border-chart-tooltip-border bg-chart-tooltip-background px-3 py-2 text-chart-tooltip-foreground shadow-[var(--ds-shadow-floating)]"
    >
      {label !== undefined && label !== "" ? (
        <div className="font-medium">{formatLabel ? formatLabel(label) : String(label)}</div>
      ) : null}
      {payload.map((entry) => {
        const key = String(entry.dataKey ?? entry.name);
        const item = series.find((candidate) => candidate.key === key || candidate.key === entry.name);
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item?.color ?? entry.color }} />
            <span className="text-text-supporting">{item?.label ?? entry.name}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums">
              {typeof entry.value === "number" ? formatValue(entry.value) : String(entry.value ?? "")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type ChartDataTableProps = {
  data: readonly ChartDatum[];
  /** Field that labels each row, such as the date or category. */
  labelKey: string;
  labelHeading: React.ReactNode;
  formatLabel?: (label: unknown) => React.ReactNode;
  /** Extra columns after the series columns. */
  extraColumns?: { heading: React.ReactNode; render: (row: ChartDatum) => React.ReactNode }[];
};

/** The exact values behind a chart: one row per datum and one column per configured series. */
function ChartDataTable({ data, labelKey, labelHeading, formatLabel, extraColumns = [] }: ChartDataTableProps) {
  const { series, formatValue } = useChart();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labelHeading}</TableHead>
          {series.map((item) => (
            <TableHead key={item.key} className="text-right">{item.label}</TableHead>
          ))}
          {extraColumns.map((column, index) => (
            <TableHead key={index} className="text-right">{column.heading}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={`${String(row[labelKey])}-${rowIndex}`}>
            <TableCell>{formatLabel ? formatLabel(row[labelKey]) : String(row[labelKey] ?? "")}</TableCell>
            {series.map((item) => {
              const value = row[item.key];
              return (
                <TableCell key={item.key} className="text-right tabular-nums">
                  {typeof value === "number" ? formatValue(value) : "—"}
                </TableCell>
              );
            })}
            {extraColumns.map((column, index) => (
              <TableCell key={index} className="text-right tabular-nums">{column.render(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartTooltipContent,
  chartAxisProps,
  chartGridProps,
  defaultFormatValue,
  prefersReducedMotion,
  seriesVariable,
  useChart,
};
export type {
  ChartContainerProps,
  ChartDataTableProps,
  ChartDatum,
  ChartLegendProps,
  ChartTooltipContentProps,
  ChartValueFormatter,
};

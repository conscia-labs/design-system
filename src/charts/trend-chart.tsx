import * as React from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartDataTable,
  ChartTooltipContent,
  chartAxisProps,
  chartGridProps,
  defaultFormatValue,
  prefersReducedMotion,
} from "./chart-container";
import type { ChartContainerProps, ChartDatum } from "./chart-container";
import { resolveChartConfig } from "./chart-config";

type ChartReferenceLine = {
  value: number;
  /** Short label drawn at the right end of the line, such as "Target". */
  label: string;
};

type TrendChartProps = Omit<ChartContainerProps, "children" | "table"> & {
  data: readonly ChartDatum[];
  /** Field on each datum for the x axis, usually a date or period. */
  xKey: string;
  /** Heading for the x column in the data table. */
  xLabel?: React.ReactNode;
  formatX?: (value: unknown) => string;
  /** Horizontal target or threshold lines. */
  referenceLines?: readonly ChartReferenceLine[];
  /** Interpolation between points. Use `linear` when exact steps matter. */
  curve?: "monotone" | "linear" | "step";
  /** Show the exact-values table disclosure. */
  showTable?: boolean;
};

type TrendAreaChartProps = TrendChartProps & {
  /** Stack the series so the top edge is their total. */
  stacked?: boolean;
};

/** Splits trend props into container props and the shared grid, axes, reference lines, tooltip, and table. */
function useTrendParts({ data, xKey, xLabel = "Period", formatX, referenceLines = [], curve = "monotone", showTable = true, ...container }: TrendChartProps) {
  const series = React.useMemo(() => resolveChartConfig(container.config), [container.config]);
  const animate = !prefersReducedMotion();
  const formatLabel = formatX ? (value: unknown) => formatX(value) : undefined;
  const table = showTable ? (
    <ChartDataTable data={data} labelKey={xKey} labelHeading={xLabel} formatLabel={formatLabel} />
  ) : undefined;
  const axes = (
    <>
      <CartesianGrid {...chartGridProps} />
      <XAxis dataKey={xKey} {...chartAxisProps} tickFormatter={formatX} minTickGap={24} />
      <YAxis {...chartAxisProps} width="auto" tickFormatter={container.formatValue ?? defaultFormatValue} />
      {referenceLines.map((line) => (
        <ReferenceLine
          key={`${line.label}-${line.value}`}
          y={line.value}
          stroke="var(--chart-reference)"
          strokeDasharray="4 4"
          label={{ value: line.label, position: "insideTopRight", fill: "var(--chart-reference)", fontSize: 12 }}
        />
      ))}
      <Tooltip
        content={<ChartTooltipContent formatLabel={formatLabel} />}
        cursor={{ stroke: "var(--chart-cursor)" }}
        isAnimationActive={false}
      />
    </>
  );
  return { container, data: [...data], curve, series, animate, table, axes, tableCount: data.length };
}

/** Values over time as lines: one per configured series, with an optional target line. */
function TrendLineChart(props: TrendChartProps) {
  const { container, data, curve, series, animate, table, axes, tableCount } = useTrendParts(props);
  return (
    <ChartContainer data-chart="trend-line" table={table} tableCount={tableCount} {...container}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
        {axes}
        {series.map((item) => (
          <Line
            key={item.key}
            dataKey={item.key}
            name={item.label}
            type={curve}
            stroke={item.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: item.color }}
            isAnimationActive={animate}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

/** Values over time as filled areas that fade toward the baseline; stack them to show a total. */
function TrendAreaChart({ stacked = false, ...props }: TrendAreaChartProps) {
  const { container, data, curve, series, animate, table, axes, tableCount } = useTrendParts(props);
  const gradientId = React.useId().replace(/:/g, "");
  return (
    <ChartContainer data-chart="trend-area" table={table} tableCount={tableCount} {...container}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
        <defs>
          {series.map((item, index) => (
            <linearGradient key={item.key} id={`${gradientId}-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: item.color, stopOpacity: "var(--chart-area-opacity-start)" }} />
              <stop offset="100%" style={{ stopColor: item.color, stopOpacity: "var(--chart-area-opacity-end)" }} />
            </linearGradient>
          ))}
        </defs>
        {axes}
        {series.map((item, index) => (
          <Area
            key={item.key}
            dataKey={item.key}
            name={item.label}
            type={curve}
            stackId={stacked ? "total" : undefined}
            stroke={item.color}
            strokeWidth={2}
            fill={`url(#${gradientId}-${index})`}
            activeDot={{ r: 4, strokeWidth: 0, fill: item.color }}
            isAnimationActive={animate}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

export { TrendAreaChart, TrendLineChart };
export type { ChartReferenceLine, TrendAreaChartProps, TrendChartProps };

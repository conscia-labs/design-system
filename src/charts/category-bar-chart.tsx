import * as React from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";

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
import type { ChartReferenceLine } from "./trend-chart";

type CategoryBarChartProps = Omit<ChartContainerProps, "children" | "table"> & {
  data: readonly ChartDatum[];
  /** Field on each datum that names its category or period. */
  categoryKey: string;
  /** Heading for the category column in the data table. */
  categoryLabel?: React.ReactNode;
  formatCategory?: (value: unknown) => string;
  /** `grouped` places series side by side; `stacked` adds them into one bar. */
  layout?: "grouped" | "stacked";
  /** `vertical` bars rise from the x axis; `horizontal` bars suit long category names. */
  orientation?: "vertical" | "horizontal";
  referenceLines?: readonly ChartReferenceLine[];
  showTable?: boolean;
};

/**
 * Compares values across categories or periods, grouped or stacked. Use the
 * `positive` and `negative` colours for outcome segments so they match the
 * status badges nearby.
 */
function CategoryBarChart({
  data,
  categoryKey,
  categoryLabel = "Category",
  formatCategory,
  layout = "grouped",
  orientation = "vertical",
  referenceLines = [],
  showTable = true,
  config,
  formatValue,
  ...container
}: CategoryBarChartProps) {
  const series = React.useMemo(() => resolveChartConfig(config), [config]);
  const animate = !prefersReducedMotion();
  const horizontal = orientation === "horizontal";
  const stacked = layout === "stacked";
  const formatLabel = formatCategory ? (value: unknown) => formatCategory(value) : undefined;
  const radius = horizontal ? ([0, 2, 2, 0] as [number, number, number, number]) : ([2, 2, 0, 0] as [number, number, number, number]);

  const categoryAxis = { dataKey: categoryKey, ...chartAxisProps, tickFormatter: formatCategory };
  const valueAxis = { ...chartAxisProps, tickFormatter: formatValue ?? defaultFormatValue };

  return (
    <ChartContainer
      data-chart="category-bar"
      config={config}
      formatValue={formatValue}
      table={showTable ? (
        <ChartDataTable data={data} labelKey={categoryKey} labelHeading={categoryLabel} formatLabel={formatLabel} />
      ) : undefined}
      tableCount={data.length}
      {...container}
    >
      <BarChart
        data={[...data]}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        barCategoryGap="20%"
        accessibilityLayer={false}
      >
        <CartesianGrid {...chartGridProps} vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" {...valueAxis} />
            <YAxis type="category" {...categoryAxis} width="auto" />
          </>
        ) : (
          <>
            <XAxis {...categoryAxis} minTickGap={8} />
            <YAxis {...valueAxis} width="auto" />
          </>
        )}
        {referenceLines.map((line) => (
          <ReferenceLine
            key={`${line.label}-${line.value}`}
            {...(horizontal ? { x: line.value } : { y: line.value })}
            stroke="var(--chart-reference)"
            strokeDasharray="4 4"
            label={{ value: line.label, position: horizontal ? "insideTopLeft" : "insideTopRight", fill: "var(--chart-reference)", fontSize: 12 }}
          />
        ))}
        <Tooltip
          content={<ChartTooltipContent formatLabel={formatLabel} />}
          cursor={{ fill: "var(--chart-annotation)" }}
          isAnimationActive={false}
        />
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={item.color}
            stackId={stacked ? "total" : undefined}
            radius={!stacked || index === series.length - 1 ? radius : 0}
            maxBarSize={48}
            isAnimationActive={animate}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export { CategoryBarChart };
export type { CategoryBarChartProps };

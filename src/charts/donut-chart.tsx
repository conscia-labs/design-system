import * as React from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../primitives/table";
import { ChartContainer, ChartTooltipContent, defaultFormatValue, prefersReducedMotion } from "./chart-container";
import type { ChartContainerProps } from "./chart-container";
import { resolveChartConfig } from "./chart-config";

type DonutDatum = {
  /** Matches a key in `config`, which gives the label and colour. */
  key: string;
  value: number;
};

type DonutChartProps = Omit<ChartContainerProps, "children" | "table" | "legendValues"> & {
  data: readonly DonutDatum[];
  /** Large value in the centre. Defaults to the formatted total. */
  centerValue?: string;
  /** Small label under the centre value. */
  centerLabel?: string;
  /** Heading for the category column in the data table. */
  categoryLabel?: React.ReactNode;
  showTable?: boolean;
};

const percentFormat = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

/**
 * Shares of one total, with each share in the legend and table. Keep it to
 * five slices or fewer and group the rest into an "Other" series; compare
 * values across categories with `CategoryBarChart` instead.
 */
function DonutChart({
  data,
  centerValue,
  centerLabel = "Total",
  categoryLabel = "Category",
  showTable = true,
  config,
  formatValue = defaultFormatValue,
  height = 220,
  legend = true,
  ...container
}: DonutChartProps) {
  const series = React.useMemo(() => resolveChartConfig(config), [config]);
  const animate = !prefersReducedMotion();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const share = (value: number) => (total > 0 ? percentFormat.format(value / total) : "—");
  const slices = data.map((item) => {
    const resolved = series.find((entry) => entry.key === item.key);
    return { ...item, label: resolved?.label ?? item.key, color: resolved?.color ?? "var(--chart-series-other)" };
  });

  return (
    <ChartContainer
      data-chart="donut"
      config={config}
      formatValue={formatValue}
      height={height}
      legend={legend}
      legendValues={Object.fromEntries(data.map((item) => [item.key, share(item.value)]))}
      table={showTable ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{categoryLabel}</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slices.map((slice) => (
              <TableRow key={slice.key}>
                <TableCell>{slice.label}</TableCell>
                <TableCell className="text-right tabular-nums">{formatValue(slice.value)}</TableCell>
                <TableCell className="text-right tabular-nums">{share(slice.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : undefined}
      tableCount={data.length}
      {...container}
    >
      <PieChart accessibilityLayer={false}>
        <Tooltip content={<ChartTooltipContent />} isAnimationActive={false} />
        <Pie
          data={slices}
          dataKey="value"
          nameKey="key"
          innerRadius="64%"
          outerRadius="88%"
          paddingAngle={1}
          stroke="var(--surface)"
          strokeWidth={2}
          isAnimationActive={animate}
        >
          {slices.map((slice) => (
            <Cell key={slice.key} fill={slice.color} />
          ))}
        </Pie>
        <text data-slot="donut-chart-center" x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-0.4em" className="fill-text-primary text-xl font-semibold tabular-nums">
            {centerValue ?? formatValue(total)}
          </tspan>
          <tspan x="50%" dy="1.6em" className="fill-text-supporting text-xs">
            {centerLabel}
          </tspan>
        </text>
      </PieChart>
    </ChartContainer>
  );
}

export { DonutChart };
export type { DonutChartProps, DonutDatum };

import * as React from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

import { cn } from "../primitives/utils";
import { chartColor } from "./chart-config";
import type { ChartColor } from "./chart-config";
import { prefersReducedMotion } from "./chart-container";

type SparklineProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Values in order, oldest first. */
  data: readonly number[];
  color?: ChartColor;
  variant?: "line" | "area";
  /** Height in pixels. Width follows the container. */
  height?: number;
  /**
   * Text alternative. Omit it when the sparkline sits in a slot that already
   * has one, such as `MetricCard`'s `visualizationSummary`; the sparkline is
   * then hidden from assistive technology.
   */
  label?: string;
};

/** A compact trend with no axes or tooltip, for metric cards and table cells. */
function Sparkline({ data, color = "series-1", variant = "line", height = 48, label, className, style, ...props }: SparklineProps) {
  const points = data.map((value, index) => ({ index, value }));
  const stroke = chartColor(color);
  const gradientId = React.useId().replace(/:/g, "");
  const animate = !prefersReducedMotion();
  const margin = { top: 2, right: 2, bottom: 2, left: 2 };
  const domain = ["dataMin", "dataMax"] as const;

  return (
    <div
      data-slot="sparkline"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={cn("w-full min-w-0", className)}
      style={{ height, ...style }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 120, height }}>
        {variant === "area" ? (
          <AreaChart data={points} margin={margin} accessibilityLayer={false}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: stroke, stopOpacity: "var(--chart-area-opacity-start)" }} />
                <stop offset="100%" style={{ stopColor: stroke, stopOpacity: "var(--chart-area-opacity-end)" }} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[...domain]} />
            <Area dataKey="value" type="monotone" stroke={stroke} strokeWidth={1.5} fill={`url(#${gradientId})`} isAnimationActive={animate} />
          </AreaChart>
        ) : (
          <LineChart data={points} margin={margin} accessibilityLayer={false}>
            <YAxis hide domain={[...domain]} />
            <Line dataKey="value" type="monotone" stroke={stroke} strokeWidth={1.5} dot={false} isAnimationActive={animate} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export { Sparkline };
export type { SparklineProps };

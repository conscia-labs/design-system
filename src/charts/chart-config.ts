/**
 * A chart colour role. Categorical series take `series-1` to `series-5` in
 * order; `other` is the quiet grey for grouped remaining categories. The
 * outcome roles alias the status tokens, so use them only when a series
 * means good, bad, at risk, or pending.
 */
type ChartColor =
  | "series-1"
  | "series-2"
  | "series-3"
  | "series-4"
  | "series-5"
  | "other"
  | "positive"
  | "negative"
  | "warning"
  | "information"
  | "sequential-1"
  | "sequential-2"
  | "sequential-3"
  | "sequential-4"
  | "sequential-5"
  | "diverging-1"
  | "diverging-2"
  | "diverging-3"
  | "diverging-4"
  | "diverging-5";

type ChartSeriesConfig = {
  /** Plain-text name used in the legend, tooltip, data table, and summaries. */
  label: string;
  /** Colour role. Defaults to the next categorical series in config order. */
  color?: ChartColor;
};

/** Series keyed by the data field they read, in legend order. */
type ChartConfig = Record<string, ChartSeriesConfig>;

type ResolvedChartSeries = {
  key: string;
  label: string;
  /** A CSS `var()` reference that resolves in both themes. */
  color: string;
};

const categoricalColors = ["series-1", "series-2", "series-3", "series-4", "series-5"] as const;

/** The CSS reference for a chart colour role, usable in Recharts props and inline styles. */
function chartColor(color: ChartColor) {
  return `var(--chart-${color === "other" ? "series-other" : color})`;
}

/**
 * Resolves each series to a colour. Series without an explicit colour take the
 * next unused categorical step in order and never cycle: past the fifth, they
 * fall back to `other`. Group long tails into one "Other" series instead.
 */
function resolveChartConfig(config: ChartConfig): ResolvedChartSeries[] {
  const used = new Set(Object.values(config).map((series) => series.color));
  const available = categoricalColors.filter((color) => !used.has(color));
  return Object.entries(config).map(([key, series]) => ({
    key,
    label: series.label,
    color: chartColor(series.color ?? available.shift() ?? "other"),
  }));
}

export { chartColor, resolveChartConfig };
export type { ChartColor, ChartConfig, ChartSeriesConfig, ResolvedChartSeries };

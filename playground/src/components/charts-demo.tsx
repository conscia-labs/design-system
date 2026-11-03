"use client";

import { MetricCard, MetricTrend } from "@conscia-labs/design-system";
import {
  CategoryBarChart,
  DonutChart,
  Sparkline,
  TrendAreaChart,
  TrendLineChart,
  chartColor,
  type ChartColor,
  type ChartConfig,
} from "@conscia-labs/design-system/charts";

const surface = "rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]";

const weekFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const formatWeek = (value: unknown) => weekFormat.format(new Date(`${String(value)}T00:00:00Z`));
const formatMs = (value: number) => `${value} ms`;

const latency = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 7, 10 + index * 7)).toISOString().slice(0, 10);
  return { week: date, p50: 180 + ((index * 37) % 60), p95: 420 + ((index * 53) % 140) - index * 6 };
});

const latencyConfig = {
  p50: { label: "p50" },
  p95: { label: "p95" },
} satisfies ChartConfig;

const tokens = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 7, 10 + index * 7)).toISOString().slice(0, 10);
  return { week: date, bedrock: 32 + index * 3 + (index % 3) * 4, vertex: 18 + ((index * 5) % 14), openai: 24 + index * 2 };
});

const providerConfig = {
  bedrock: { label: "Amazon Bedrock" },
  vertex: { label: "Vertex AI" },
  openai: { label: "OpenAI" },
} satisfies ChartConfig;

const outcomes = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({
  day,
  succeeded: 820 + ((index * 131) % 300) - (index > 4 ? 420 : 0),
  failed: 18 + ((index * 17) % 40),
}));

const outcomeConfig = {
  succeeded: { label: "Succeeded", color: "positive" },
  failed: { label: "Failed", color: "negative" },
} satisfies ChartConfig;

const regions = [
  { region: "Europe West", requests: 48200 },
  { region: "US East", requests: 39100 },
  { region: "Asia Pacific South", requests: 17400 },
  { region: "US West", requests: 12800 },
];

const regionConfig = { requests: { label: "Requests" } } satisfies ChartConfig;

const share = [
  { key: "chat", value: 54 },
  { key: "embeddings", value: 23 },
  { key: "images", value: 12 },
  { key: "other", value: 11 },
];

const shareConfig = {
  chat: { label: "Chat" },
  embeddings: { label: "Embeddings" },
  images: { label: "Images" },
  other: { label: "Other", color: "other" },
} satisfies ChartConfig;

const swatchGroups: { label: string; colors: ChartColor[] }[] = [
  { label: "Categorical", colors: ["series-1", "series-2", "series-3", "series-4", "series-5", "other"] },
  { label: "Outcome", colors: ["positive", "negative", "warning", "information"] },
  { label: "Sequential", colors: ["sequential-1", "sequential-2", "sequential-3", "sequential-4", "sequential-5"] },
  { label: "Diverging", colors: ["diverging-1", "diverging-2", "diverging-3", "diverging-4", "diverging-5"] },
];

function ChartsDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className={`${surface} grid gap-4 lg:col-span-2`} data-slot="chart-token-swatches">
        {swatchGroups.map((group) => (
          <div key={group.label} className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:items-center">
            <span className="ds-type-metadata text-text-supporting">{group.label}</span>
            <div className="flex flex-wrap gap-2">
              {group.colors.map((color) => (
                <span key={color} className="ds-type-metadata inline-flex items-center gap-1.5 text-text-secondary">
                  <span className="size-5 rounded-sm" style={{ backgroundColor: chartColor(color) }} />
                  {color}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={surface}>
        <TrendLineChart
          title="Response latency"
          description="Weekly, milliseconds"
          summary="Response latency over 12 weeks: p50 stays between 180 and 236 ms; p95 ranges from 376 to 515 ms and crosses the 500 ms target in weeks 3 and 6."
          config={latencyConfig}
          data={latency}
          xKey="week"
          xLabel="Week"
          formatX={formatWeek}
          formatValue={formatMs}
          referenceLines={[{ value: 500, label: "Target 500 ms" }]}
        />
      </div>
      <div className={surface}>
        <TrendAreaChart
          stacked
          title="Tokens by provider"
          description="Weekly, millions"
          summary="Tokens by provider over 12 weeks, stacked: the total rises from 74 to 150 million, led by Amazon Bedrock."
          config={providerConfig}
          data={tokens}
          xKey="week"
          xLabel="Week"
          formatX={formatWeek}
        />
      </div>
      <div className={surface}>
        <CategoryBarChart
          layout="stacked"
          title="Requests by outcome"
          description="Last 7 days"
          summary="Requests by outcome for the last 7 days: weekdays carry 820 to 1,082 successful requests and the weekend 455 and 586; failures range from 18 to 52 a day."
          config={outcomeConfig}
          data={outcomes}
          categoryKey="day"
          categoryLabel="Day"
        />
      </div>
      <div className={surface}>
        <CategoryBarChart
          orientation="horizontal"
          title="Requests by region"
          description="Last 30 days"
          summary="Requests by region for the last 30 days: Europe West 48,200, US East 39,100, Asia Pacific South 17,400, US West 12,800."
          config={regionConfig}
          data={regions}
          categoryKey="region"
          categoryLabel="Region"
          height={200}
        />
      </div>
      <div className={surface}>
        <DonutChart
          title="Requests by capability"
          summary="Requests by capability: chat 54%, embeddings 23%, images 12%, other 11%."
          config={shareConfig}
          data={share}
          categoryLabel="Capability"
          formatValue={(value) => `${value}k`}
        />
      </div>
      <MetricCard
        label="Weekly active keys"
        description="Keys with at least one request"
        value="1,284"
        trend={<MetricTrend direction="up" sentiment="positive" value="12%" accessibleLabel="Up 12 percent, positive" />}
        visualization={<Sparkline variant="area" data={[820, 870, 910, 890, 960, 1010, 1080, 1120, 1190, 1284]} />}
        visualizationSummary="Weekly active keys rise steadily from 820 to 1,284 over ten weeks."
      />
    </div>
  );
}

export { ChartsDemo };

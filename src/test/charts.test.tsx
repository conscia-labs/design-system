import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";

import {
  CategoryBarChart,
  ChartContainer,
  DonutChart,
  Sparkline,
  TrendAreaChart,
  TrendLineChart,
  chartColor,
  resolveChartConfig,
} from "../charts";
import { LineChart } from "recharts";

const weeks = [
  { week: "2026-09-07", p50: 180, p95: 420 },
  { week: "2026-09-14", p50: 196, p95: 470 },
  { week: "2026-09-21", p50: 188, p95: 515 },
];

describe("chart colours", () => {
  it("maps roles to chart tokens", () => {
    expect(chartColor("series-1")).toBe("var(--chart-series-1)");
    expect(chartColor("other")).toBe("var(--chart-series-other)");
    expect(chartColor("positive")).toBe("var(--chart-positive)");
  });

  it("assigns unused categorical series in order and never cycles", () => {
    const series = resolveChartConfig({
      a: { label: "A" },
      b: { label: "B", color: "series-1" },
      c: { label: "C" },
      d: { label: "D" },
      e: { label: "E" },
      f: { label: "F" },
      g: { label: "G" },
    });
    expect(series.map((item) => item.color)).toEqual([
      "var(--chart-series-2)",
      "var(--chart-series-1)",
      "var(--chart-series-3)",
      "var(--chart-series-4)",
      "var(--chart-series-5)",
      "var(--chart-series-other)",
      "var(--chart-series-other)",
    ]);
  });
});

describe("ChartContainer", () => {
  it("captions the chart, announces the summary, and exposes series variables", () => {
    const { container } = render(
      <ChartContainer title="Latency" description="Milliseconds" summary="Latency stays under 500 ms." config={{ p50: { label: "p50" }, p95: { label: "p95", color: "warning" } }}>
        <LineChart data={weeks} />
      </ChartContainer>,
    );

    const figure = container.querySelector<HTMLElement>('figure[data-slot="chart"]')!;
    expect(figure.querySelector("figcaption")!.textContent).toContain("Milliseconds");
    expect(screen.getByRole("img", { name: "Latency stays under 500 ms." })).toBeTruthy();
    expect(figure.style.getPropertyValue("--series-p95")).toBe("var(--chart-warning)");
    const legend = figure.querySelector('[data-slot="chart-legend"]')!;
    expect(legend.getAttribute("aria-hidden")).toBe("true");
    expect(legend.textContent).toContain("p50");
  });

  it("omits the legend for a single series unless asked", () => {
    const { container } = render(
      <ChartContainer title="Requests" summary="Requests." config={{ requests: { label: "Requests" } }}>
        <LineChart data={weeks} />
      </ChartContainer>,
    );
    expect(container.querySelector('[data-slot="chart-legend"]')).toBeNull();
  });
});

describe("ready-made charts", () => {
  it("TrendLineChart lists exact values in its data table", async () => {
    const user = userEvent.setup();
    render(
      <TrendLineChart
        title="Response latency"
        summary="Response latency over three weeks."
        config={{ p50: { label: "p50" }, p95: { label: "p95" } }}
        data={weeks}
        xKey="week"
        xLabel="Week"
        formatValue={(value) => `${value} ms`}
        referenceLines={[{ value: 500, label: "Target" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /View data/ }));
    const table = screen.getByRole("table");
    expect(within(table).getByRole("columnheader", { name: "Week" })).toBeTruthy();
    expect(within(table).getByRole("columnheader", { name: "p95" })).toBeTruthy();
    expect(within(table).getByText("515 ms")).toBeTruthy();
  });

  it("charts pass axe with their tables open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <TrendAreaChart stacked title="Tokens" summary="Tokens rise." config={{ p50: { label: "p50" }, p95: { label: "p95" } }} data={weeks} xKey="week" />
        <CategoryBarChart
          layout="stacked"
          title="Outcomes"
          summary="Mostly successful."
          config={{ ok: { label: "Succeeded", color: "positive" }, failed: { label: "Failed", color: "negative" } }}
          data={[{ day: "Mon", ok: 820, failed: 18 }, { day: "Tue", ok: 951, failed: 35 }]}
          categoryKey="day"
        />
        <DonutChart
          title="Capabilities"
          summary="Chat leads."
          config={{ chat: { label: "Chat" }, other: { label: "Other", color: "other" } }}
          data={[{ key: "chat", value: 75 }, { key: "other", value: 25 }]}
        />
      </div>,
    );

    for (const button of screen.getAllByRole("button", { name: /View data/ })) await user.click(button);
    expect(screen.getAllByRole("table")).toHaveLength(3);
    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("DonutChart shows each share in the legend and table", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DonutChart
        title="Capabilities"
        summary="Chat leads."
        config={{ chat: { label: "Chat" }, images: { label: "Images" } }}
        data={[{ key: "chat", value: 60 }, { key: "images", value: 20 }]}
      />,
    );

    expect(container.querySelector('[data-slot="chart-legend"]')!.textContent).toContain("75%");
    await user.click(screen.getByRole("button", { name: /View data/ }));
    const table = screen.getByRole("table");
    expect(within(table).getByText("25%")).toBeTruthy();
    expect(within(table).getByText("60")).toBeTruthy();
  });

  it("Sparkline is decorative unless it has a label", () => {
    const { container, rerender } = render(<Sparkline data={[1, 3, 2, 5]} />);
    expect(container.querySelector('[data-slot="sparkline"]')!.getAttribute("aria-hidden")).toBe("true");
    rerender(<Sparkline data={[1, 3, 2, 5]} label="Rising from 1 to 5" />);
    expect(screen.getByRole("img", { name: "Rising from 1 to 5" })).toBeTruthy();
  });
});

describe("charts entry isolation", () => {
  it("keeps Recharts out of the root, primitives, patterns, and foundation sources", () => {
    for (const directory of ["primitives", "patterns", "foundation"]) {
      const folder = join(process.cwd(), "src", directory);
      for (const file of readdirSync(folder)) {
        if (!/\.tsx?$/.test(file)) continue;
        const source = readFileSync(join(folder, file), "utf8");
        expect(source, `${directory}/${file}`).not.toMatch(/from ["'](?:recharts|\.\.\/charts)/);
      }
    }
    for (const entry of ["index.ts", "client.ts"]) {
      expect(readFileSync(join(process.cwd(), "src", entry), "utf8")).not.toMatch(/charts/);
    }
  });
});

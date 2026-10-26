import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DailyVolumeChart } from "../patterns/daily-volume-chart";
import { MetricBand, MetricBandItem } from "../patterns/metric-band";
import { PageToolbar } from "../patterns/page-toolbar";
import { PaginationControls, paginationPageSizes } from "../patterns/pagination";
import { ErrorState, StateView } from "../patterns/state-views";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import { DateTimeField } from "../primitives/date-time-field";
import { Disclosure } from "../primitives/disclosure";
import { LoadingButton } from "../primitives/loading-button";
import { Stepper } from "../primitives/stepper";
import { Table, TableBody, TableCell, TableRow } from "../primitives/table";
import { Tabs, TabsList, TabsTrigger } from "../primitives/tabs";

describe("Admin UI handoff", () => {
  it("DS-09: scrolls tables by default and clips only on explicit opt-out", () => {
    const table = (scrollable?: boolean) => (
      <Table scrollable={scrollable}>
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const { container, rerender } = render(table());
    const scroller = container.querySelector('[data-slot="table-container"]')!;
    expect(scroller.className).toContain("overflow-x-auto");
    expect(scroller.className).not.toContain("overflow-x-clip");
    expect(scroller.getAttribute("data-scroll-position")).toBe("none");

    rerender(table(false));
    expect(container.querySelector('[data-slot="table-container"]')!.className).toContain("overflow-x-clip");
  });

  it("DS-13: renders state views without a border unless a divider is requested", () => {
    const { container, rerender } = render(<StateView title="No batches" />);
    const view = () => container.querySelector('[data-slot="state-view"]')!;
    expect(view().className).not.toContain("border-b");
    expect(view().className).toContain("min-h-72");

    rerender(<StateView title="No batches" size="compact" divider />);
    expect(view().getAttribute("data-size")).toBe("compact");
    expect(view().className).toContain("border-b");
    expect(view().className).not.toContain("min-h-72");

    rerender(<ErrorState title="Could not load alerts" size="compact" />);
    expect(screen.getByRole("alert").className).not.toContain("border-b");
  });

  it("DS-23: collapses empty toolbar slots", () => {
    const { container, rerender } = render(<PageToolbar />);
    expect(container.querySelector('[data-slot="page-toolbar"]')).toBeNull();

    rerender(<PageToolbar search={<input aria-label="Search" />} />);
    const toolbar = container.querySelector('[data-slot="page-toolbar"]')!;
    expect(toolbar.children).toHaveLength(1);
    expect(toolbar.className).not.toContain("lg:grid-cols");
  });

  it("DS-11 and DS-19: uses a quiet selected page and one control height", () => {
    render(
      <PaginationControls currentPage={2} pageCount={3} pageSize={25} onPageChange={() => {}} onPageSizeChange={() => {}} />,
    );
    const current = screen.getByRole("button", { name: "Page 2" });
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.className).toContain("bg-selection-background");
    expect(current.className).not.toContain("bg-surface-inverse");
    for (const button of screen.getAllByRole("button")) {
      expect(button.className).toContain("size-[var(--ds-control-height-sm)]");
      expect(button.className).not.toMatch(/(^|\s)size-8(\s|$)/);
    }
    expect(paginationPageSizes).toEqual({ inventory: 25, detail: 10, options: [10, 25, 50] });
  });

  it("DS-18: keeps disabled primary buttons readable and pending ones filled", () => {
    render(
      <>
        <Button disabled>Save rule</Button>
        <LoadingButton pending pendingLabel="Saving…">Save backend</LoadingButton>
      </>,
    );
    const disabled = screen.getByRole("button", { name: "Save rule" });
    expect(disabled.className).toContain("disabled:bg-action-background");
    expect(disabled.className).toContain("disabled:text-text-supporting");
    expect(disabled.className).toContain("disabled:opacity-100");
    const pending = screen.getByRole("button", { name: "Saving…" });
    expect(pending.getAttribute("aria-busy")).toBe("true");
    expect(pending.className).toContain("aria-busy:disabled:bg-action");
  });

  it("DS-20: sizes badges to their content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active").className).toContain("w-fit");
    expect(screen.getByText("Active").className).toContain("justify-self-start");
  });

  it("DS-16: reserves the detail line and quiets missing values", () => {
    const { container } = render(
      <MetricBand>
        <MetricBandItem label="Requests" value="1,204" detail="Last 30 days" />
        <MetricBandItem label="Last sign-in" emptyValue="Never" />
        <MetricBandItem label="Errors" value={null} />
      </MetricBand>,
    );
    const items = container.querySelectorAll('[data-slot="metric-band-item"]');
    for (const item of items) expect(item.querySelectorAll(".min-h-\\[1lh\\]")).toHaveLength(1);
    const never = within(items[1] as HTMLElement).getByText("Never");
    expect(never.closest('[data-slot="metric-band-empty-value"]')?.className).toContain("text-text-muted");
    expect(within(items[2] as HTMLElement).getByLabelText("Unavailable").textContent).toBe("—");
  });

  it("DS-12: discloses content from a summary row with a count", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure summary="View daily data" count={30}>
        <p>Daily values</p>
      </Disclosure>,
    );
    const summary = screen.getByRole("button", { name: /View daily data/ });
    expect(summary.getAttribute("aria-expanded")).toBe("false");
    expect(summary.textContent).toContain("30");
    await user.click(summary);
    expect(summary.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Daily values")).toBeTruthy();
  });

  it("DS-12: states the time zone of a date-time field", () => {
    render(
      <>
        <label htmlFor="expiry">Expires</label>
        <DateTimeField id="expiry" timeZone="UTC" aria-describedby="expiry-help" />
        <p id="expiry-help">Leave empty for no expiry.</p>
      </>,
    );
    const input = screen.getByLabelText("Expires");
    expect(input.getAttribute("type")).toBe("datetime-local");
    const described = input.getAttribute("aria-describedby")!.split(" ");
    expect(described).toContain("expiry-help");
    expect(document.getElementById(described[1]!)?.textContent).toBe("Time zone: UTC");
  });

  it("DS-22: marks completed, current, and upcoming steps", () => {
    render(
      <Stepper
        aria-label="Create API key"
        currentStep={1}
        steps={[
          { id: "details", label: "Details" },
          { id: "scope", label: "Scope" },
          { id: "review", label: "Review" },
        ]}
      />,
    );
    const steps = within(screen.getByRole("list", { name: "Create API key" })).getAllByRole("listitem");
    expect(steps.map((step) => step.getAttribute("data-state"))).toEqual(["complete", "current", "upcoming"]);
    expect(steps[1]!.getAttribute("aria-current")).toBe("step");
    expect(steps[0]!.textContent).toContain("completed");
    expect(steps[2]!.textContent).toContain("upcoming");
  });

  it("DS-21: offers a nested tab variant distinct from page tabs", () => {
    render(
      <Tabs variant="nested" defaultValue="rules">
        <TabsList aria-label="Policy sections">
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const list = screen.getByRole("tablist", { name: "Policy sections" });
    expect(list.getAttribute("data-variant")).toBe("nested");
    expect(list.className).toContain("h-[var(--ds-tab-rail-height-compact)]");
    const tab = screen.getByRole("tab", { name: "Rules" });
    expect(tab.className).toContain("data-active:after:bg-brand-emphasis");
    expect(tab.className).not.toContain("bg-selection-background");
  });

  it("DS-08: draws calendar-true days with a stated scale and exact values", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DailyVolumeChart
        title="Daily requests"
        summaryLabel="Daily requests"
        unit="requests"
        start="2026-10-01"
        end="2026-10-05"
        data={[
          { date: "2026-10-01", value: 120, unsuccessful: 10 },
          { date: "2026-10-03", value: 740 },
          { date: "2026-10-05", value: 300, unsuccessful: 25 },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-slot="daily-volume-chart-day"]')).toHaveLength(5);
    expect(screen.getByText("Scale 0–1,000 requests")).toBeTruthy();
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "Daily requests: 5 days from Oct 1 to Oct 5. Total 1,160 requests; peak 740 on Oct 3.",
    );
    expect(screen.getByText("Oct 1")).toBeTruthy();
    expect(screen.getByText("Oct 3")).toBeTruthy();
    expect(screen.getByText("Oct 5")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /View daily data/ }));
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(6);
    expect(within(rows[2]!).getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["Oct 2", "0", "0"]);
  });
});

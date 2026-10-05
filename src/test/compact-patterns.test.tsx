import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell, AppSidebar, AppSidebarContent } from "../patterns/app-shell";
import { MetricBand, MetricBandItem } from "../patterns/metric-band";

describe("optional quiet AppSidebar treatment", () => {
  it("keeps the existing appearance default and omits treatment by default", () => {
    const { container } = render(
      <AppShell>
        <AppSidebar>
          <AppSidebarContent>Navigation</AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    const sidebar = container.querySelector('[data-slot="app-sidebar"]');
    expect(sidebar?.getAttribute("data-sidebar-variant")).toBe("auto");
    expect(sidebar?.hasAttribute("data-sidebar-treatment")).toBe(false);
  });

  it("exposes quiet treatment independently from appearance", () => {
    const { container } = render(
      <AppShell>
        <AppSidebar variant="auto" treatment="quiet">
          <AppSidebarContent>Navigation</AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    const sidebar = container.querySelector('[data-slot="app-sidebar"]');
    expect(sidebar?.getAttribute("data-sidebar-variant")).toBe("auto");
    expect(sidebar?.getAttribute("data-sidebar-treatment")).toBe("quiet");
  });
});

describe("MetricBand presentations", () => {
  it("preserves the default two-column mobile layout and row sizing", () => {
    const { container } = render(
      <MetricBand columns={3}>
        <MetricBandItem label="Requests" value="14" />
        <MetricBandItem label="Not yet loaded" />
      </MetricBand>,
    );

    const band = container.querySelector('[data-slot="metric-band"]');
    const item = container.querySelector('[data-slot="metric-band-item"]');
    expect(band?.getAttribute("data-columns")).toBe("3");
    expect(band?.hasAttribute("data-presentation")).toBe(false);
    expect(band?.className).toContain("grid-cols-2");
    expect(item?.className).toContain("min-h-28");
    expect(item?.className).toContain("sm:flex-row");
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("uses compact rows, preserves linked values, loading slots, and unavailable values", () => {
    const { container } = render(
      <>
        <MetricBand columns={3} presentation="compact">
          <MetricBandItem label="Available models" value={<a href="/models">6</a>} detail="Explore models" />
          <MetricBandItem label="Requests" value="14" loading />
          <MetricBandItem label="Latest observation" value={null} detail="Not supplied" />
        </MetricBand>
      </>,
    );

    const band = container.querySelector('[data-slot="metric-band"]');
    const items = container.querySelectorAll('[data-slot="metric-band-item"]');
    expect(band?.getAttribute("data-presentation")).toBe("compact");
    expect(band?.className).toContain("grid-cols-1");
    expect(band?.className).toContain("lg:grid-cols-3");
    expect(items).toHaveLength(3);
    expect(screen.getByRole("link", { name: "6" }).getAttribute("href")).toBe("/models");
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy();
    expect(screen.getByLabelText("Unavailable").textContent).toBe("—");
  });
});

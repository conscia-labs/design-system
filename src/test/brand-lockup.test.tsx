import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AppHeader,
  AppHeaderBrand,
  AppShell,
  AppSidebar,
  AppSidebarHeader,
  BrandLockup,
} from "../patterns/app-shell";

describe("BrandLockup", () => {
  it("links home with the accessible name Conscia <product> and a decorative mark", () => {
    const { container } = render(<BrandLockup product="Beacon" href="/" />);
    const link = screen.getByRole("link", { name: "Conscia Beacon" });
    expect(link.getAttribute("href")).toBe("/");
    expect(link.hasAttribute("aria-label")).toBe(false);
    expect(container.querySelector('[data-slot="brand-lockup-mark"]')!.getAttribute("aria-hidden")).toBe("true");
  });

  it("sets Conscia in semibold and the product in regular weight on one line", () => {
    const { container } = render(<BrandLockup product="AI Gateway" />);
    const name = container.querySelector('[data-slot="brand-lockup-name"]')!;
    const product = container.querySelector('[data-slot="brand-lockup-product"]')!;
    expect(name.textContent).toBe("Conscia");
    expect(name.className).toContain("font-semibold");
    expect(product.textContent).toBe("AI Gateway");
    expect(product.className).toContain("font-normal");
    expect(name.parentElement).toBe(product.parentElement);
  });

  it("is plain text without href or render", () => {
    const { container } = render(<BrandLockup product="Atlas" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.querySelector('[data-slot="brand-lockup"]')!.tagName).toBe("DIV");
  });

  it("renders the home link through a router link", () => {
    render(<BrandLockup product="Beacon" render={<a href="/home" data-router="true" />} />);
    const link = screen.getByRole("link", { name: "Conscia Beacon" });
    expect(link.getAttribute("href")).toBe("/home");
    expect(link.getAttribute("data-router")).toBe("true");
  });

  it.each([
    ["sm", "size-6", "text-sm"],
    ["md", "size-8", "text-base"],
    ["lg", "size-9", "text-lg"],
  ] as const)("sizes the %s lockup", (size, mark, text) => {
    const { container } = render(<BrandLockup product="Beacon" size={size} />);
    const lockup = container.querySelector('[data-slot="brand-lockup"]')!;
    expect(lockup.getAttribute("data-size")).toBe(size);
    expect(lockup.className).toContain(text);
    expect(container.querySelector('[data-slot="brand-lockup-mark"]')!.getAttribute("class")).toContain(mark);
  });

  it("defaults to the md size", () => {
    const { container } = render(<BrandLockup product="Beacon" />);
    expect(container.querySelector('[data-slot="brand-lockup"]')!.getAttribute("data-size")).toBe("md");
  });

  it("sits in both the sidebar header and the header brand", () => {
    const { container } = render(
      <AppShell>
        <AppSidebar>
          <AppSidebarHeader>
            <BrandLockup product="Beacon" href="/" />
          </AppSidebarHeader>
        </AppSidebar>
        <AppHeader>
          <AppHeaderBrand>
            <BrandLockup product="Beacon" href="/" />
          </AppHeaderBrand>
        </AppHeader>
      </AppShell>,
    );
    expect(container.querySelector('[data-slot="app-sidebar-header"] > [data-slot="brand-lockup"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="app-header-brand"] > [data-slot="brand-lockup"]')).not.toBeNull();
    expect(screen.getAllByRole("link", { name: "Conscia Beacon" })).toHaveLength(2);
  });
});

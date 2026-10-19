import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavigationTab, NavigationTabs, NavigationTabsList } from "../primitives/tabs";

function PersonNavigation({ variant }: { variant?: "underline" | "divider" | "pills" }) {
  return (
    <NavigationTabs aria-label="Person">
      <NavigationTabsList variant={variant}>
        <NavigationTab href="/people/123" active>
          Overview
        </NavigationTab>
        <NavigationTab href="/people/123/access">Access</NavigationTab>
      </NavigationTabsList>
    </NavigationTabs>
  );
}

describe("NavigationTabs", () => {
  it("keeps underline as the default navigation treatment", () => {
    const { container } = render(<PersonNavigation />);
    const list = container.querySelector('[data-slot="navigation-tabs-list"]');
    const active = screen.getByRole("link", { name: "Overview" });

    expect(list?.getAttribute("data-variant")).toBe("underline");
    expect(active.getAttribute("data-variant")).toBe("underline");
    expect(active.className).toContain("data-[active=true]:after:bg-selection-indicator");
    expect(active.className).not.toContain("rounded-full");
  });

  it("renders route links with the pills treatment and page semantics", () => {
    const { container } = render(<PersonNavigation variant="pills" />);
    const list = container.querySelector('[data-slot="navigation-tabs-list"]');
    const active = screen.getByRole("link", { name: "Overview" });
    const inactive = screen.getByRole("link", { name: "Access" });

    expect(list?.getAttribute("data-variant")).toBe("pills");
    expect(list?.className).toContain("gap-1");
    expect(list?.className).toContain("h-[var(--ds-tab-rail-height)]");
    expect(list?.hasAttribute("data-scroll-position")).toBe(true);
    expect(screen.queryAllByRole("tab")).toHaveLength(0);

    expect(active.getAttribute("aria-current")).toBe("page");
    expect(active.getAttribute("data-active")).toBe("true");
    expect(active.getAttribute("data-variant")).toBe("pills");
    expect(active.className).toContain("rounded-full");
    expect(active.className).toContain("data-[active=true]:bg-selection-background");
    expect(active.className).toContain("data-[active=true]:text-selection-foreground");
    expect(active.className).toContain("focus-visible:ring-focus/60");
    expect(active.className).not.toContain("after:bg-selection-indicator");

    expect(inactive.getAttribute("aria-current")).toBeNull();
    expect(inactive.getAttribute("data-active")).toBe("false");
  });
});

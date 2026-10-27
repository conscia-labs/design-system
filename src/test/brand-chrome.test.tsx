import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader, AppShell, AppSidebar, AppSidebarContent } from "../patterns/app-shell";

describe("brand chrome", () => {
  it("scopes the burgundy chrome to a brand sidebar", () => {
    const { container } = render(
      <AppShell>
        <AppSidebar variant="brand">
          <AppSidebarContent>Navigation</AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );
    const sidebar = container.querySelector('[data-slot="app-sidebar"]')!;
    expect(sidebar.getAttribute("data-sidebar-variant")).toBe("brand");
    expect(sidebar.getAttribute("data-chrome")).toBe("brand");
  });

  it("leaves other sidebar variants and the default header outside the scope", () => {
    const { container } = render(
      <AppShell>
        <AppHeader>Header</AppHeader>
        <AppSidebar variant="dark">
          <AppSidebarContent>Navigation</AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );
    expect(container.querySelector('[data-slot="app-sidebar"]')!.hasAttribute("data-chrome")).toBe(false);
    const header = container.querySelector('[data-slot="app-header"]')!;
    expect(header.getAttribute("data-tone")).toBe("default");
    expect(header.hasAttribute("data-chrome")).toBe(false);
  });

  it("paints a brand-tone header with the chrome scope", () => {
    const { container } = render(<AppHeader tone="brand">Header</AppHeader>);
    const header = container.querySelector('[data-slot="app-header"]')!;
    expect(header.getAttribute("data-tone")).toBe("brand");
    expect(header.getAttribute("data-chrome")).toBe("brand");
  });
});

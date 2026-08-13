import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../primitives/button";
import { SearchableSelect } from "../primitives/searchable-select";
import {
  AppShell,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  NavigationGroup,
  NavigationItem,
  SidebarSearch,
  SidebarTrigger,
} from "../patterns/app-shell";
import { SidebarNavigation } from "../patterns/sidebar-navigation";
import { DataTable, type SortingState } from "../patterns/data-table";
import { ValueMeter } from "../patterns/value-meter";

describe("Button", () => {
  it("does not submit a form unless explicitly requested", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button>Safe action</Button>
        <Button type="submit">Submit</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "Safe action" }).getAttribute("type")).toBe(
      "button",
    );

    await user.click(screen.getByRole("button", { name: "Safe action" }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});

describe("ValueMeter", () => {
  it("clamps progress values and exposes a programmatic label", async () => {
    const { container } = render(
      <ValueMeter
        label={<span>Deployment health</span>}
        value={125}
        maximum={100}
      />,
    );
    const meter = screen.getByRole("progressbar", {
      name: "Deployment health",
    });

    expect(meter.getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByText("100 of 100")).toBeTruthy();
    expect((meter.firstElementChild as HTMLElement).style.width).toBe("100%");

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});

describe("DataTable", () => {
  it("announces and updates column sorting without submitting a parent form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    function Example() {
      const [sorting, setSorting] = React.useState<SortingState>([]);

      return (
        <form onSubmit={onSubmit}>
          <DataTable
            data={[{ id: "2", name: "Beta" }, { id: "1", name: "Alpha" }]}
            columns={[
              {
                id: "name",
                header: "Name",
                accessor: (item) => item.name,
                cell: (item) => item.name,
                sortable: true,
              },
            ]}
            getRowId={(item) => item.id}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </form>
      );
    }

    render(<Example />);

    const columnHeader = screen.getByRole("columnheader", { name: /Name/ });
    expect(columnHeader.getAttribute("aria-sort")).toBe("none");

    await user.click(screen.getByRole("button", { name: "Sort by Name" }));
    expect(columnHeader.getAttribute("aria-sort")).toBe("ascending");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("SearchableSelect", () => {
  it("supports keyboard selection, skips disabled options, and integrates with forms", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = React.useState("");

      return (
        <SearchableSelect
          aria-label="Environment"
          name="environment"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "dev", label: "Development" },
            { value: "stage", label: "Staging", disabled: true },
            { value: "prod", label: "Production" },
          ]}
        />
      );
    }

    const { container } = render(<Example />);
    const combobox = screen.getByRole("combobox", { name: "Environment" });

    await user.click(combobox);
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("option", { name: "Staging" }).getAttribute("aria-disabled")).toBe(
      "true",
    );

    await user.keyboard("{End}{Enter}");
    expect((combobox as HTMLInputElement).value).toBe("Production");
    expect(
      (container.querySelector('input[name="environment"]') as HTMLInputElement).value,
    ).toBe("prod");

    await user.click(combobox);
    await user.keyboard("{Escape}");
    expect(combobox.getAttribute("aria-expanded")).toBe("false");

    await user.click(combobox);
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("shared sidebar", () => {
  it("keeps the dark default and exposes an opt-in light semantic variant", () => {
    const { container } = render(
      <AppShell>
        <AppSidebar variant="light">
          <AppSidebarHeader>Brand</AppSidebarHeader>
          <AppSidebarContent>Navigation</AppSidebarContent>
          <AppSidebarFooter>Account</AppSidebarFooter>
        </AppSidebar>
      </AppShell>,
    );

    const sidebar = container.querySelector('[data-slot="app-sidebar"]');
    const header = container.querySelector('[data-slot="app-sidebar-header"]');
    const content = container.querySelector('[data-slot="app-sidebar-content"]');
    const footer = container.querySelector('[data-slot="app-sidebar-footer"]');

    expect(sidebar?.getAttribute("data-sidebar-variant")).toBe("light");
    expect(sidebar?.className).toContain("bg-sidebar-canvas");
    expect(header?.className).toContain("bg-sidebar-header");
    expect(content?.className).toContain("bg-sidebar-content");
    expect(footer?.className).toContain("bg-sidebar-footer");
  });

  it("keeps active, disabled, focusable, and pointer states semantic", async () => {
    const user = userEvent.setup();

    render(
      <AppShell defaultSidebarOpen={false}>
        <AppSidebar>
          <AppSidebarContent>
            <NavigationGroup label="Workspace" count={3}>
              <NavigationItem active tooltip="Overview">
                Overview
              </NavigationItem>
              <NavigationItem disabled>Disabled destination</NavigationItem>
            </NavigationGroup>
          </AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    const groupLabel = screen.getByText("Workspace");
    const activeItem = screen.getByRole("button", { name: "Overview" });
    const disabledItem = screen.getByRole("button", {
      name: "Disabled destination",
    });

    expect(groupLabel.closest('[data-slot="navigation-group-label"]')).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(activeItem.getAttribute("data-active")).toBe("true");
    expect(activeItem.className).toContain("bg-sidebar-active");
    expect(activeItem.className).toContain("focus-visible:ring-sidebar-focus-ring");
    expect(activeItem.className).toContain("cursor-pointer");
    expect(disabledItem.hasAttribute("disabled")).toBe(true);

    await user.tab();
    expect(document.activeElement).toBe(activeItem);
  });

  it("supports keyboard group expansion and collapsed navigation flyouts", async () => {
    const user = userEvent.setup();
    const renderLink = (item: { label: string }, props: Record<string, unknown>) => (
      <a href={`/${item.label.toLowerCase()}`} {...props} />
    );

    const { unmount } = render(
      <AppShell>
        <AppSidebar>
          <AppSidebarContent>
            <SidebarNavigation
              entries={[
                {
                  id: "library",
                  label: "Library",
                  items: [{ id: "overview", label: "Overview" }],
                },
              ]}
              renderLink={renderLink}
            />
          </AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    const groupTrigger = screen.getByRole("button", { name: "Library" });
    expect(groupTrigger.getAttribute("data-state")).toBe("closed");
    groupTrigger.focus();
    await user.keyboard("{Enter}");
    expect(groupTrigger.getAttribute("data-state")).toBe("open");
    expect(screen.getByRole("link", { name: "Overview" })).toBeTruthy();

    unmount();
    render(
      <AppShell defaultSidebarOpen={false}>
        <AppSidebar>
          <AppSidebarContent>
            <SidebarNavigation
              entries={[
                {
                  id: "library",
                  label: "Library",
                  items: [{ id: "overview", label: "Overview" }],
                },
              ]}
              renderLink={renderLink}
            />
          </AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    expect(
      screen.getByRole("button", { name: "Library menu" }).getAttribute("aria-label"),
    ).toBe("Library menu");
  });

  it("opens and closes the shared search field while preserving accessible focus", async () => {
    const user = userEvent.setup();

    render(
      <AppShell>
        <AppSidebar>
          <AppSidebarContent>
            <SidebarSearch aria-label="Search navigation" shortcut="⌘K" />
          </AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    const trigger = screen.getByRole("button", { name: "Search navigation" });
    await user.click(trigger);
    const input = screen.getByRole("searchbox", { name: "Search navigation" });
    expect(document.activeElement).toBe(input);
    expect(screen.getByRole("button", { name: "Close search" })).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Search navigation" }),
    );
  });

  it("reports expanded state and uses the mobile drawer when the viewport is narrow", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(max-width: 1023px)",
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));

    render(
      <AppShell>
        <AppSidebar>
          <AppSidebarContent>Mobile navigation</AppSidebarContent>
        </AppSidebar>
        <SidebarTrigger />
      </AppShell>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle navigation" });
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("dialog").textContent).toContain("Mobile navigation");

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("sidebar contrast contract", () => {
  function relativeLuminance([red, green, blue]: [number, number, number]) {
    const channel = (value: number) => {
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    return (
      0.2126 * channel(red) +
      0.7152 * channel(green) +
      0.0722 * channel(blue)
    );
  }

  function contrastRatio(
    foreground: [number, number, number],
    background: [number, number, number],
  ) {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = relativeLuminance(background);
    return (
      (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
      (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
    );
  }

  it("keeps light and dark primary, metadata, and active roles above WCAG AA", () => {
    const lightCanvas = [243, 244, 245] as [number, number, number];
    const lightActive = [238, 240, 255] as [number, number, number];
    const lightPrimary = [20, 12, 21] as [number, number, number];
    const lightMetadata = [95, 98, 112] as [number, number, number];
    const lightActiveForeground = [36, 42, 68] as [number, number, number];
    const darkCanvas = [21, 17, 22] as [number, number, number];
    const darkActive = [42, 38, 43] as [number, number, number];
    const darkPrimary = [255, 255, 255] as [number, number, number];
    const darkMetadata = [166, 165, 166] as [number, number, number];

    expect(contrastRatio(lightPrimary, lightCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(lightMetadata, lightCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(lightActiveForeground, lightActive)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(darkPrimary, darkCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(darkMetadata, darkCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(darkPrimary, darkActive)).toBeGreaterThanOrEqual(4.5);
  });
});

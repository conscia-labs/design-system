import { expect, test, type Page } from "@playwright/test";

type Appearance = "light" | "dark";
type Density = "comfortable" | "compact" | "operational";

const viewports = [
  { id: "desktop", width: 1440, height: 1100 },
  { id: "mobile", width: 390, height: 844 },
] as const;

const appearances = ["light", "dark"] as const satisfies Appearance[];
const densities = ["comfortable", "compact", "operational"] as const satisfies Density[];

const routes = [
  { id: "foundation", path: "/foundation", heading: "Foundation" },
  { id: "primitives", path: "/primitives", heading: "Primitives" },
  { id: "tables", path: "/tables", heading: "Tables and data tables" },
  { id: "reference-patterns", path: "/reference-patterns", heading: "AI Models" },
  { id: "patterns", path: "/patterns", heading: "Pattern catalog" },
  { id: "shell-navigation", path: "/shell-navigation", heading: "Shell and navigation" },
  { id: "delivery-metrics", path: "/delivery-metrics", heading: "Delivery metrics" },
  { id: "components", path: "/components", heading: "Components" },
  { id: "component-button", path: "/components/button", heading: "Button" },
  { id: "typography", path: "/typography", heading: "Typography" },
] as const;

async function setDeterministicPreferences(
  page: Page,
  appearance: Appearance,
  density: Density,
) {
  await page.addInitScript(({ appearance: nextAppearance, density: nextDensity }) => {
    localStorage.setItem("conscia-appearance", nextAppearance);
    localStorage.setItem("conscia-density", nextDensity);
    localStorage.setItem("conscia-appearance:v1", nextAppearance);
    localStorage.setItem("conscia-density:v1", nextDensity);
  }, { appearance, density });
  await page.emulateMedia({ colorScheme: appearance });
}

async function loadRoute(
  page: Page,
  route: (typeof routes)[number],
  appearance: Appearance,
  density: Density,
) {
  await setDeterministicPreferences(page, appearance, density);
  await page.goto(route.path);
  await expect(page.getByRole("heading", { name: route.heading, exact: true })).toBeVisible();
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.evaluate(() => {
    const removeDevelopmentPortals = () => {
      document.querySelectorAll("nextjs-portal").forEach((portal) => portal.remove());
    };

    removeDevelopmentPortals();
    new MutationObserver(removeDevelopmentPortals).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
  await expect(page.locator("html")).toHaveAttribute("data-appearance", appearance);
  await expect(page.locator("html")).toHaveAttribute("data-density", density);
  if (appearance === "dark") {
    await expect(page.locator("html")).toHaveClass(/dark/);
  } else {
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  }
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("body")).toBeVisible();
}

for (const route of routes) {
  for (const viewport of viewports) {
    for (const appearance of appearances) {
      for (const density of densities) {
        test(`visual baseline: ${route.id} / ${viewport.id} / ${appearance} / ${density}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await loadRoute(page, route, appearance, density);

          await expect(page).toHaveScreenshot(
            `${route.id}-${viewport.id}-${appearance}-${density}.png`,
            { fullPage: true },
          );
        });
      }
    }
  }
}

test.describe("interaction baseline", () => {
  test("primitive overlays restore focus and expose expected content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, routes[1], "light", "comfortable");

    const dialogTrigger = page.getByRole("button", { name: "Open dialog", exact: true });
    await dialogTrigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rotate API key", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(dialogTrigger).toBeFocused();

    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await expect(page.getByRole("menuitem", { name: "View details", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menuitem", { name: "View details", exact: true })).toBeHidden();

    await page.getByRole("button", { name: "Open sheet", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Provider details", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close sheet", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Provider details", exact: true })).toBeHidden();
  });

  test("select, searchable select, tabs, tooltip, and state controls work", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, routes[1], "light", "comfortable");

    const availability = page.getByRole("combobox", { name: "Availability", exact: true });
    await availability.click();
    await page.getByRole("option", { name: "Limited", exact: true }).click();
    await expect(availability).toContainText("Limited");

    const searchableProvider = page.getByRole("combobox", { name: "Searchable provider", exact: true });
    await searchableProvider.click();
    await searchableProvider.fill("vertex");
    await expect(page.getByRole("option", { name: /Vertex AI/ })).toBeVisible();
    await page.getByRole("option", { name: /Vertex AI/ }).click();
    await expect(searchableProvider).toHaveValue("Vertex AI");

    await page.getByRole("tab", { name: "Usage", exact: true }).click();
    await expect(page.getByText("Usage view placeholder.", { exact: true })).toBeVisible();

    const tooltipTrigger = page.getByRole("button", { name: "Tooltip", exact: true });
    await tooltipTrigger.hover();
    await expect(page.getByRole("tooltip")).toBeVisible();

    const checkbox = page.getByRole("checkbox").first();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();

    const diagnostics = page.locator('[data-slot="switch"]').first();
    await expect(diagnostics).toHaveAttribute("aria-checked", "true");
    await diagnostics.click();
    await expect(diagnostics).toHaveAttribute("aria-checked", "false");

    const disclosure = page.getByRole("button", { name: "Show implementation notes", exact: true });
    await disclosure.click();
    await expect(page.getByText(/The baseline captures both/)).toBeVisible();
  });

  test("appearance and density preferences persist and system appearance follows the emulated scheme", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(routes[0].path);
    await expect(page.getByRole("heading", { name: routes[0].heading, exact: true })).toBeVisible();

    await page.evaluate(() => {
      localStorage.setItem("conscia-appearance", "light");
      localStorage.setItem("conscia-density", "comfortable");
      localStorage.setItem("conscia-appearance:v1", "light");
      localStorage.setItem("conscia-density:v1", "comfortable");
    });
    await page.reload();

    await page.getByRole("button", { name: "dark", exact: true }).click();
    await page.getByRole("button", { name: "compact", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-appearance", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-appearance", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-density", "compact");

    await page.evaluate(() => {
      localStorage.setItem("conscia-appearance", "system");
      localStorage.setItem("conscia-density", "comfortable");
      localStorage.setItem("conscia-appearance:v1", "system");
      localStorage.setItem("conscia-density:v1", "comfortable");
    });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-appearance", "system");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("reference pattern controls preserve deterministic states", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, routes[3], "light", "comfortable");

    const search = page.getByRole("textbox", { name: "Search AI Models", exact: true });
    await search.fill("Claude");
    await expect(page.getByText("Claude Sonnet 4", { exact: true })).toBeVisible();

    const previewState = page.getByRole("combobox", { name: "Preview state", exact: true });
    await previewState.click();
    await page.getByRole("option", { name: "Loading", exact: true }).click();
    await expect(page.locator('[data-slot="loading-rows"]')).toBeVisible();

    await previewState.click();
    await page.getByRole("option", { name: "Error", exact: true }).click();
    await expect(page.locator('[data-slot="state-view"][role="alert"]')).toBeVisible();
  });

  test("supporting components filter commands, clear filters, and show toasts", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, routes[1], "light", "comfortable");

    const commandTrigger = page.getByRole("button", { name: "Open command palette", exact: true });
    await expect(commandTrigger).toHaveAttribute("aria-expanded", "false");
    await commandTrigger.click();
    const commandInput = page.getByRole("combobox", { name: "Search commands", exact: true });
    await expect(commandInput).toBeVisible();
    await commandInput.fill("preferences");
    await expect(page.getByRole("option", { name: /Open settings/ })).toBeVisible();
    await expect(page.getByRole("option", { name: /Open AI Models/ })).toHaveCount(0);
    await commandInput.press("ArrowDown");
    await commandInput.press("Enter");
    await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden();
    await expect(page.getByText("Command selected.", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Clear all", exact: true }).click();
    await expect(page.locator('[data-slot="filter-chip"]')).toHaveCount(0);

    await page.getByRole("button", { name: "Show success toast", exact: true }).click();
    await expect(page.getByText("Catalog synced", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("integrated header and static sidebar navigation preserve desktop and mobile behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, routes[0], "light", "comfortable");

    await expect(page.locator('[data-slot="app-header"]')).toBeVisible();
    const shellGeometry = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('[data-slot="app-header"]')?.getBoundingClientRect();
      const sidebar = document.querySelector<HTMLElement>('[data-slot="app-sidebar"]')?.getBoundingClientRect();
      const main = document.querySelector<HTMLElement>("main")?.getBoundingClientRect();
      return { header, sidebar, main };
    });
    expect(shellGeometry.header?.left).toBe(0);
    expect(shellGeometry.header?.right).toBe(1440);
    expect(shellGeometry.sidebar?.top).toBe(shellGeometry.header?.bottom);
    expect(shellGeometry.main?.top).toBe(shellGeometry.header?.bottom);
    await expect(page.getByRole("link", { name: "Tokens and principles", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(page.locator('[data-slot="app-shell"]')).toHaveAttribute(
      "data-sidebar-state",
      "collapsed",
    );
    await expect(
      page.locator('[data-slot="app-sidebar"]').getByText("Foundation", { exact: true }),
    ).toBeHidden();

    await page.getByRole("link", { name: "Button", exact: true }).click();
    await expect(page).toHaveURL(/\/components\/button$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routes[0].path);
    await expect(page.getByRole("heading", { name: routes[0].heading, exact: true })).toBeVisible();
    const mobileSearch = page.getByRole("button", { name: "Search design system", exact: true });
    await expect(mobileSearch).toBeVisible();
    await mobileSearch.click();
    await expect(page.getByRole("combobox", { name: "Search commands", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("combobox", { name: "Search commands", exact: true })).toBeHidden();
    await page.getByRole("button", { name: "Toggle navigation" }).click();

    const mobileNavigation = page.getByRole("dialog", { name: "Application navigation" });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole("link", { name: "Button", exact: true }).click();
    await expect(page).toHaveURL(/\/components\/button$/);
    await expect(mobileNavigation).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("table catalog filters, sorts, selects, and switches to mobile rows", async ({ page }) => {
    const tablesRoute = routes.find((route) => route.id === "tables")!;
    await page.setViewportSize({ width: 1440, height: 1000 });
    await loadRoute(page, tablesRoute, "light", "comfortable");

    const dataTable = page.locator('[data-slot="data-table"]').first();
    await page.getByRole("textbox", { name: "Search connections", exact: true }).fill("vertex");
    await expect(dataTable.locator("tbody tr")).toHaveCount(2);

    await page.getByRole("checkbox", { name: "Select Vertex AI", exact: true }).click();
    await expect(page.getByText("1 row selected.", { exact: true })).toBeVisible();

    const sortResources = page.getByRole("button", { name: "Sort by Resources", exact: true });
    await sortResources.click();
    await expect(sortResources.locator("..")).toHaveAttribute("aria-sort", /ascending|descending/);

    await page.getByRole("textbox", { name: "Search connections", exact: true }).fill("no result");
    await expect(page.getByRole("heading", { name: "No matching connections", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters", exact: true }).click();
    await expect(dataTable.locator("tbody tr")).toHaveCount(5);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(dataTable.locator('[role="list"]')).toBeVisible();
    await expect(dataTable.locator("table")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

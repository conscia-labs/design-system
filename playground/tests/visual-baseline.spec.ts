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
  { id: "reference-patterns", path: "/reference-patterns", heading: "AI Models" },
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
    await loadRoute(page, routes[2], "light", "comfortable");

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

  test("sidebar navigation preserves active, collapsed, flyout, and mobile behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, routes[0], "light", "comfortable");

    await expect(page.getByRole("link", { name: "Foundation", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(page.locator('[data-slot="app-shell"]')).toHaveAttribute(
      "data-sidebar-state",
      "collapsed",
    );

    await page.getByRole("button", { name: "Library, 5 sections menu" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menuitem", { name: "Primitives", exact: true }).click();
    await expect(page).toHaveURL(/\/primitives$/);
    await expect(page.getByRole("menu")).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routes[0].path);
    await expect(page.getByRole("heading", { name: routes[0].heading, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Toggle navigation" }).click();

    const mobileNavigation = page.getByRole("dialog", { name: "Application navigation" });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole("link", { name: "Primitives", exact: true }).click();
    await expect(page).toHaveURL(/\/primitives$/);
    await expect(mobileNavigation).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

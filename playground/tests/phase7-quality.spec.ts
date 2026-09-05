import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const packageManifest = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
) as { version: string };

type Appearance = "light" | "dark";
type Density = "comfortable" | "compact" | "operational";

const routes = [
  { path: "/", heading: "Overview" },
  { path: "/components", heading: "Components" },
  { path: "/components/alert", heading: "Alert" },
  { path: "/components/alert-dialog", heading: "Alert dialog" },
  { path: "/components/avatar", heading: "Avatar" },
  { path: "/components/badge", heading: "Badge" },
  { path: "/components/brand", heading: "Brand" },
  { path: "/components/button", heading: "Button" },
  { path: "/components/card", heading: "Card" },
  { path: "/components/form-controls", heading: "Form controls" },
  { path: "/components/disclosure", heading: "Disclosure" },
  { path: "/components/menus-and-overlays", heading: "Menus and overlays" },
  { path: "/components/table", heading: "Table" },
  { path: "/components/supporting-primitives", heading: "Supporting primitives" },
  { path: "/components/application-shell", heading: "Application shell" },
  { path: "/components/sidebar-navigation", heading: "Sidebar navigation" },
  { path: "/components/page-composition", heading: "Page composition" },
  { path: "/components/inventory-and-tables", heading: "Inventory and tables" },
  { path: "/components/metrics-and-data-panels", heading: "Metrics and data panels" },
  { path: "/components/activity-and-attention", heading: "Activity and attention" },
  { path: "/components/state-and-feedback", heading: "State and feedback" },
  { path: "/components/filters-and-preferences", heading: "Filters and preferences" },
  { path: "/components/workbench", heading: "Workbench" },
  { path: "/components/content-helpers", heading: "Content helpers" },
  { path: "/components/conscia-aliases", heading: "Conscia aliases" },
  { path: "/foundation", heading: "Foundation" },
  { path: "/typography", heading: "Typography" },
  { path: "/primitives", heading: "Primitives" },
  { path: "/tables", heading: "Tables and data tables" },
  { path: "/reference-patterns", heading: "AI Models" },
  { path: "/patterns", heading: "Pattern catalog" },
  { path: "/shell-navigation", heading: "Shell and navigation" },
  { path: "/delivery-metrics", heading: "Delivery metrics" },
] as const;

async function loadRoute(
  page: Page,
  path: string,
  heading: string,
  appearance: Appearance,
  density: Density,
) {
  await page.addInitScript(
    ({ nextAppearance, nextDensity }) => {
      localStorage.setItem("conscia-appearance", nextAppearance);
      localStorage.setItem("conscia-density", nextDensity);
      localStorage.setItem("conscia-appearance:v1", nextAppearance);
      localStorage.setItem("conscia-density:v1", nextDensity);
    },
    { nextAppearance: appearance, nextDensity: density },
  );
  await page.emulateMedia({ colorScheme: appearance });
  await page.goto(path);
  await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((portal) => portal.remove());
  });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("data-appearance", appearance);
  await expect(page.locator("html")).toHaveAttribute("data-density", density);
  await expect(page.locator("body")).toBeVisible();
}

async function installAxe(page: Page) {
  await page.addScriptTag({ content: axeSource });
}

async function scanAxe(page: Page, contextSelector?: string) {
  return page.evaluate(async (selector) => {
    type Axe = {
      run: (
        context: Document | Element,
        options?: {
          resultTypes?: string[];
          runOnly?: { type: "tag"; values: string[] };
        },
      ) => Promise<{
        violations: Array<{
          id: string;
          impact: string | null;
          help: string;
          nodes: Array<{ target: string[] }>;
        }>;
      }>;
    };

    const axe = (window as Window & { axe?: Axe }).axe;
    if (!axe) {
      throw new Error("axe-core was not installed in the page.");
    }

    const context = selector ? document.querySelector(selector) : document;
    if (!context) {
      throw new Error(`Axe context was not found: ${selector}`);
    }

    return axe.run(context, {
      resultTypes: ["violations"],
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
  }, contextSelector);
}

function formatAxeViolations(
  violations: Awaited<ReturnType<typeof scanAxe>>["violations"],
) {
  return violations
    .map(
      (violation) =>
        `${violation.id} (${violation.impact ?? "unknown"}): ${violation.help} — ${violation.nodes
          .map((node) => node.target.join(" "))
          .join(", ")}`,
    )
    .join("\n");
}

async function expectNoAxeViolations(page: Page, state: string, contextSelector?: string) {
  const { violations } = await scanAxe(page, contextSelector);

  expect(
    violations,
    `${state} has accessibility violations:\n${formatAxeViolations(violations)}`,
  ).toEqual([]);
}

async function expectNoDocumentOverflow(page: Page, state: string) {
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(
    overflow.documentWidth,
    `${state} should not create document-level horizontal overflow`,
  ).toBeLessThanOrEqual(overflow.viewportWidth);
}

test.describe("Overview adoption guide", () => {
  test("shows the package version and links into the component catalog", async ({ page }) => {
    await loadRoute(page, "/", "Overview", "light", "comfortable");

    await expect(
      page.locator(`[aria-label="Design system version ${packageManifest.version}"]`),
    ).toBeVisible();
    await expect(
      page.getByText(`Version ${packageManifest.version}`, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Get started", exact: true }),
    ).toBeVisible();

    await page.getByRole("tab", { name: "Styles", exact: true }).click();
    await expect(
      page.getByRole("tabpanel", { name: "Styles", exact: true }),
    ).toContainText("@conscia-labs/design-system/tailwind.css");

    await page.getByRole("link", { name: "Browse components", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Components", exact: true }),
    ).toBeVisible();
  });
});

test.describe("Phase 7 accessibility regression", () => {
  test("representative routes have no automatically detectable violations", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });

    for (const appearance of ["light", "dark"] as const) {
      for (const route of routes) {
        await loadRoute(page, route.path, route.heading, appearance, "comfortable");
        await installAxe(page);
        await expectNoAxeViolations(
          page,
          `${route.path} / ${appearance} / comfortable`,
        );
      }
    }
  });

  test("portaled and revealed component states have no automatically detectable violations", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, "/primitives", "Primitives", "light", "operational");
    await installAxe(page);

    const dialogTrigger = page.getByRole("button", { name: "Open dialog", exact: true });
    await dialogTrigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoAxeViolations(page, "open dialog");
    await page.keyboard.press("Escape");

    const menuTrigger = page.getByRole("button", { name: "Open menu", exact: true });
    await menuTrigger.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expectNoAxeViolations(page, "open dropdown menu");
    await page.keyboard.press("Escape");

    const select = page.getByRole("combobox", { name: "Availability", exact: true });
    await select.click();
    await expect(page.getByRole("option", { name: "Limited", exact: true })).toBeVisible();
    await expectNoAxeViolations(page, "open select");
    await page.keyboard.press("Escape");

    const searchableSelect = page.getByRole("combobox", {
      name: "Searchable provider",
      exact: true,
    });
    await searchableSelect.click();
    await expect(page.getByRole("option", { name: /Vertex AI/ })).toBeVisible();
    await expectNoAxeViolations(page, "open searchable select", '[role="listbox"]');
    await page.keyboard.press("Escape");

    const sheetTrigger = page.getByRole("button", { name: "Open sheet", exact: true });
    await sheetTrigger.click();
    await expect(page.getByRole("heading", { name: "Provider details", exact: true })).toBeVisible();
    await expectNoAxeViolations(page, "open sheet");
    await page.getByRole("button", { name: "Close sheet", exact: true }).click();

    await loadRoute(page, "/primitives", "Primitives", "light", "operational");
    await installAxe(page);
    const tooltipTrigger = page.getByRole("button", { name: "Tooltip", exact: true });
    await tooltipTrigger.focus();
    await expect(page.getByRole("tooltip")).toBeVisible();
    await expectNoAxeViolations(page, "visible tooltip");

    const commandTrigger = page.getByRole("button", {
      name: "Open command palette",
      exact: true,
    });
    await commandTrigger.click();
    await expect(page.getByRole("combobox", { name: "Search commands", exact: true })).toBeVisible();
    await expectNoAxeViolations(page, "open command palette");
  });
});

test.describe("Phase 7 keyboard and focus regression", () => {
  test("dialog body preserves focus-ring clearance for full-width controls", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, "/primitives", "Primitives", "light", "comfortable");

    await page.getByRole("button", { name: "Open dialog", exact: true }).click();
    const input = page.getByRole("textbox", { name: "Rotation note", exact: true });
    await input.focus();

    const clearance = await page.evaluate(() => {
      const body = document.querySelector<HTMLElement>('[data-slot="dialog-body"]');
      const control = document.querySelector<HTMLElement>("#rotation-note");
      if (!body || !control) return null;

      const bodyBounds = body.getBoundingClientRect();
      const controlBounds = control.getBoundingClientRect();
      return {
        left: controlBounds.left - bodyBounds.left,
        right: bodyBounds.right - controlBounds.right,
      };
    });

    expect(clearance).not.toBeNull();
    expect(clearance?.left).toBeGreaterThanOrEqual(3);
    expect(clearance?.right).toBeGreaterThanOrEqual(3);
    await expect(input).toBeFocused();
  });

  test("behavior-heavy primitives retain keyboard selection and focus restoration", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await loadRoute(page, "/primitives", "Primitives", "light", "comfortable");

    const dialogTrigger = page.getByRole("button", { name: "Open dialog", exact: true });
    await dialogTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialogTrigger).toBeFocused();

    const menuTrigger = page.getByRole("button", { name: "Open menu", exact: true });
    await menuTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menu").press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "View details", exact: true })).toHaveAttribute(
      "data-highlighted",
      "",
    );
    await page.keyboard.press("Escape");
    await expect(menuTrigger).toBeFocused();

    const select = page.getByRole("combobox", { name: "Availability", exact: true });
    await select.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(select).toContainText("Limited");

    const searchableSelect = page.locator('[data-slot="searchable-select"] input:not([aria-hidden="true"])');
    await searchableSelect.click();
    await searchableSelect.fill("vertex");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(searchableSelect).toHaveValue("Vertex AI");
    await page.keyboard.press("Escape");

    const tabs = page.getByRole("tab", { name: "Overview", exact: true });
    await tabs.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Usage", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Usage view placeholder.", { exact: true })).toBeVisible();

    const checkbox = page.getByRole("checkbox").first();
    await checkbox.focus();
    const checkedBefore = await checkbox.getAttribute("aria-checked");
    await page.keyboard.press("Space");
    await expect(checkbox).toHaveAttribute(
      "aria-checked",
      checkedBefore === "true" ? "false" : "true",
    );

    const switchControl = page.locator('[data-slot="switch"]').first();
    await expect(switchControl).toHaveAttribute("aria-label", "Automatic diagnostics");
    await switchControl.focus();
    const switchBefore = await switchControl.getAttribute("aria-checked");
    await page.keyboard.press("Space");
    await expect(switchControl).toHaveAttribute(
      "aria-checked",
      switchBefore === "true" ? "false" : "true",
    );

    const disclosure = page.getByRole("button", {
      name: "Show implementation notes",
      exact: true,
    });
    await disclosure.focus();
    await page.keyboard.press("Space");
    await expect(page.getByText(/The baseline captures both/)).toBeVisible();
  });
});

test.describe("Phase 7 responsive regression", () => {
  for (const density of ["comfortable", "compact", "operational"] as const) {
    test(`routes avoid document overflow on mobile in ${density} density`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });

      for (const route of routes) {
        await loadRoute(page, route.path, route.heading, "light", density);
        await expectNoDocumentOverflow(page, `${route.path} / mobile / ${density}`);
      }
    });
  }

  test("mobile navigation opens as an accessible dialog and closes after navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loadRoute(page, "/foundation", "Foundation", "dark", "operational");
    await installAxe(page);

    const toggle = page.getByRole("button", { name: "Toggle navigation", exact: true });
    await toggle.click();
    const navigation = page.getByRole("dialog", { name: "Application navigation" });
    await expect(navigation).toBeVisible();
    await expectNoDocumentOverflow(page, "open mobile navigation");
    await expectNoAxeViolations(page, "open mobile navigation");

    await navigation.getByRole("link", { name: "Button", exact: true }).click();
    await expect(page).toHaveURL(/\/components\/button$/);
    await expect(navigation).toBeHidden();
  });
});

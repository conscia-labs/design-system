import { expect, test } from "@playwright/test";

test("developer overview remains responsive and links directly to diagnostics", async ({ page }) => {
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem("conscia-appearance", "light");
      localStorage.setItem("conscia-density", "comfortable");
      localStorage.setItem("conscia-appearance:v1", "light");
      localStorage.setItem("conscia-density:v1", "comfortable");
    });
    await page.goto("/developer-overview");
    await expect(page.getByRole("heading", { name: "Developer overview example", exact: true })).toBeVisible();

    const documentOverflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(documentOverflows, `document should fit at ${width}px`).toBe(false);

    const requestLink = page.getByRole("link", { name: /Open diagnostics for Claude 3\.7 Sonnet/ });
    await expect(requestLink).toHaveAttribute("href", "/requests/req_illustrative_01");
    expect(await requestLink.evaluate((element) => element instanceof HTMLAnchorElement)).toBe(true);
    await requestLink.focus();
    await expect(requestLink).toBeFocused();

    if (width === 320) {
      const toggle = page.getByRole("button", { name: "Toggle navigation" });
      await toggle.click();
      const drawer = page.locator('[data-slot="sheet-content"][data-sidebar-treatment="quiet"]');
      await expect(drawer).toBeVisible();
      await expect(drawer.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(drawer).toBeHidden();
      await expect(toggle).toBeFocused();
    }

    if (width === 1280) {
      const toggle = page.getByRole("button", { name: "Toggle navigation" });
      const shell = page.locator('[data-slot="app-shell"]');
      await toggle.click();
      await expect(shell).toHaveAttribute("data-sidebar-state", "collapsed");
      await expect(page.locator('[data-slot="sidebar-navigation"] [aria-current="page"]')).toBeVisible();
      await toggle.click();
      await expect(shell).toHaveAttribute("data-sidebar-state", "expanded");
    }
  }
});

test("quiet sidebar keeps its semantic surface and selection roles in both appearances", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const appearanceValues: Array<{ canvas: string; activeBackground: string }> = [];

  for (const appearance of ["light", "dark"] as const) {
    await page.addInitScript((nextAppearance) => {
      localStorage.setItem("conscia-appearance", nextAppearance);
      localStorage.setItem("conscia-appearance:v1", nextAppearance);
    }, appearance);
    await page.emulateMedia({ colorScheme: appearance });
    await page.goto("/developer-overview");

    const sidebar = page.locator('[data-slot="app-sidebar"]');
    await expect(sidebar).toHaveAttribute("data-sidebar-variant", "auto");
    await expect(sidebar).toHaveAttribute("data-sidebar-treatment", "quiet");
    const roles = await sidebar.evaluate((element) => {
      const styles = getComputedStyle(element);
      const rootStyles = getComputedStyle(document.documentElement);
      const activeLink = element.querySelector('[aria-current="page"]');
      const resolveColor = (property: string) => {
        const probe = document.createElement("div");
        probe.style.backgroundColor = `var(${property})`;
        document.body.append(probe);
        const color = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return color;
      };
      return {
        canvas: styles.getPropertyValue("--sidebar-canvas").trim(),
        activeBackground: styles.getPropertyValue("--sidebar-active-background").trim(),
        semanticCanvas: rootStyles.getPropertyValue("--surface-muted").trim(),
        semanticSelection: rootStyles.getPropertyValue("--selection-background").trim(),
        canvasBackgroundColor: styles.backgroundColor,
        semanticCanvasColor: resolveColor("--surface-muted"),
        activeLinkBackgroundColor: activeLink ? getComputedStyle(activeLink).backgroundColor : "",
        semanticSelectionColor: resolveColor("--selection-background"),
      };
    });
    expect(roles.canvas).toBe(roles.semanticCanvas);
    expect(roles.activeBackground).toBe(roles.semanticSelection);
    expect(roles.canvasBackgroundColor).toBe(roles.semanticCanvasColor);
    expect(roles.activeLinkBackgroundColor).toBe(roles.semanticSelectionColor);
    appearanceValues.push(roles);

    const explicitDarkSidebar = await page.evaluate(() => {
      const probe = document.createElement("aside");
      probe.dataset.sidebarVariant = "dark";
      probe.dataset.sidebarTreatment = "quiet";
      document.body.append(probe);
      const styles = getComputedStyle(probe);
      const rootStyles = getComputedStyle(document.documentElement);
      const result = {
        canvas: styles.getPropertyValue("--sidebar-canvas").trim(),
        rootCanvas: rootStyles.getPropertyValue("--sidebar-canvas").trim(),
        activeBackground: styles.getPropertyValue("--sidebar-active-background").trim(),
        rootActiveBackground: rootStyles.getPropertyValue("--sidebar-active-background").trim(),
      };
      probe.remove();
      return result;
    });
    expect(explicitDarkSidebar.canvas).toBe(explicitDarkSidebar.rootCanvas);
    expect(explicitDarkSidebar.activeBackground).toBe(explicitDarkSidebar.rootActiveBackground);
  }

  expect(appearanceValues[0]?.canvas).not.toBe(appearanceValues[1]?.canvas);
  expect(appearanceValues[0]?.activeBackground).not.toBe(appearanceValues[1]?.activeBackground);
});

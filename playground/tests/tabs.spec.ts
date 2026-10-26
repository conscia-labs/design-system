import { expect, test } from "@playwright/test";

test("tab variants retain selection, keyboard access, and quiet rails", async ({ page }) => {
  await page.goto("/components/tabs");
  for (const [name, border] of [["Quiet underline", "0px"], ["Divider", "1px"], ["Pills", "0px"], ["Compact underline", "0px"]] as const) {
    const list = page.getByRole("tablist", { name: `${name} example`, exact: true });
    await expect(list).toHaveCSS("border-bottom-width", border);
    const tabs = list.getByRole("tab");
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");
    if (name !== "Compact underline") {
      await expect(list.getByRole("tab", { name: "Settings" })).toBeDisabled();
      await expect(tabs.nth(1)).toHaveAttribute("data-variant", name === "Quiet underline" ? "underline" : name.toLowerCase());
    }
  }
  const segmented = page.getByRole("tablist", { name: "Display mode example" });
  await expect(segmented).toHaveAttribute("data-variant", "segmented");
  await expect(segmented).toHaveCSS("border-bottom-width", "0px");
  await segmented.getByRole("tab", { name: "List", exact: true }).click();
  await expect(segmented.getByRole("tab", { name: "List", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-slot="navigation-tabs-list"]').first()).toHaveCSS("border-bottom-width", "0px");
});

for (const [appearance, density] of [["light", "comfortable"], ["dark", "comfortable"], ["light", "operational"], ["dark", "operational"]] as const) {
  test(`pills navigation tabs match in-page pills and keep link semantics (${appearance}, ${density})`, async ({ page }) => {
    await page.addInitScript(({ nextAppearance, nextDensity }) => {
      localStorage.setItem("conscia-appearance:v1", nextAppearance);
      localStorage.setItem("conscia-density:v1", nextDensity);
    }, { nextAppearance: appearance, nextDensity: density });
    await page.emulateMedia({ colorScheme: appearance });
    await page.goto("/components/tabs");
    await expect(page.locator("html")).toHaveAttribute("data-appearance", appearance);
    await expect(page.locator("html")).toHaveAttribute("data-density", density);
    const navigation = page.getByRole("navigation", { name: "Pills navigation example" });
    const list = navigation.locator('[data-slot="navigation-tabs-list"]');
    await expect(list).toHaveAttribute("data-variant", "pills");
    await expect(list).toHaveCSS("border-bottom-width", "0px");
    await expect(navigation.getByRole("tab")).toHaveCount(0);

    const active = navigation.getByRole("link", { name: "Overview" });
    await expect(active).toHaveAttribute("aria-current", "page");
    await expect(navigation.getByRole("link", { name: "Access" })).not.toHaveAttribute("aria-current", /.*/);

    const contentPills = page.getByRole("tablist", { name: "Pills example", exact: true });
    const selectedPill = contentPills.getByRole("tab", { selected: true });
    for (const property of ["background-color", "color", "font-weight", "border-radius", "height", "padding-left", "box-shadow"]) {
      const expected = await selectedPill.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);
      await expect(active).toHaveCSS(property, expected);
    }
    await expect(list).toHaveCSS("column-gap", await contentPills.evaluate((element) => getComputedStyle(element).columnGap));
    await expect(list).toHaveCSS("height", await contentPills.evaluate((element) => getComputedStyle(element).height));
    await expect(active).not.toHaveCSS("box-shadow", "none");

    await active.focus();
    await page.keyboard.press("Tab");
    await expect(navigation.getByRole("link", { name: "Business units" })).toBeFocused();
  });
}

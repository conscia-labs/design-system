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

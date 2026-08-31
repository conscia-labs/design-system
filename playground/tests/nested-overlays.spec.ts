import { expect, test } from "@playwright/test";

async function openScenario(page: import("@playwright/test").Page, scenario: string, trigger: string) {
  await page.goto("/overlay-regressions");
  const triggerButton = page.getByTestId(scenario).getByRole("button", { name: trigger });
  await expect(triggerButton).toBeVisible();
  await page.waitForTimeout(100);
  await triggerButton.click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test.describe("nested overlay regressions", () => {
  test("Invite platform user keeps SearchableSelect and Select above the Dialog", async ({ page }) => {
    await openScenario(page, "invite-platform-user-scenario", "Open Invite platform user");

    const dialog = page.getByRole("dialog");
    const searchableInput = dialog.getByRole("combobox", { name: "Conscia identity" });
    await searchableInput.click();
    const searchablePositioner = page.locator('[data-slot="searchable-select-positioner"]');
    await expect(searchablePositioner).toBeVisible();
    expect(await searchablePositioner.evaluate((node) => getComputedStyle(node).zIndex)).toBe("50");
    expect(await searchablePositioner.evaluate((node) => Boolean(node.closest('[data-slot="dialog-content"]')))).toBe(false);
    await searchableInput.press("ArrowDown");
    await searchableInput.press("Enter");
    await expect(searchableInput).toHaveValue("GPT-5");

    await dialog.getByRole("combobox", { name: "Platform role" }).click();
    const selectPositioner = page.locator('[data-slot="select-positioner"]');
    await expect(selectPositioner).toBeVisible();
    expect(await selectPositioner.evaluate((node) => getComputedStyle(node).zIndex)).toBe("50");
    await page.getByRole("option", { name: "Ready" }).click();
    await expect(dialog.getByRole("combobox", { name: "Platform role" })).toContainText("Ready");
    expect(await selectPositioner.locator("..").locator('[data-base-ui-inert=""]').count()).toBe(0);
  });

  test("Review candidate supports mouse selection in a Dialog without a nested inert layer", async ({ page }) => {
    await openScenario(page, "review-candidate-scenario", "Open Review candidate");
    const dialog = page.getByRole("dialog");
    const trigger = dialog.getByRole("combobox", { name: "Review action" });
    await trigger.click();
    const selectPositioner = page.locator('[data-slot="select-positioner"]');
    await expect(selectPositioner).toBeVisible();
    await page.getByRole("option", { name: "Archived" }).click();
    await expect(trigger).toContainText("Archived");
    expect(await selectPositioner.locator("..").locator('[data-base-ui-inert=""]').count()).toBe(0);
  });

  test("Create model FormSelect forwards nested-safe behavior and preserves form submission", async ({ page }) => {
    await openScenario(page, "create-model-scenario", "Open Create model");
    const dialog = page.getByRole("dialog");
    const trigger = dialog.getByRole("combobox", { name: "Model vendor" });
    await trigger.click();
    await expect(page.locator('[data-slot="select-positioner"]')).toBeVisible();
    await page.getByRole("option", { name: "Claude Sonnet" }).click();
    await expect(trigger).toContainText("Claude Sonnet");
    await expect(dialog.locator('input[name="vendor"]')).toHaveValue("claude-sonnet");
  });

  test("Select inside Sheet stays above the Sheet and closes on Escape", async ({ page }) => {
    await page.goto("/overlay-regressions");
    await page.getByRole("button", { name: "Open Sheet overlay test" }).click();
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible();
    await sheet.getByRole("combobox", { name: "Sheet status" }).click();
    const positioner = page.locator('[data-slot="select-positioner"]');
    await expect(positioner).toBeVisible();
    expect(await positioner.evaluate((node) => getComputedStyle(node).zIndex)).toBe("50");
    await page.keyboard.press("Escape");
    await expect(positioner).toBeHidden();
  });

  test("nested Dialog and Sheet keep one popup layer and no select backdrop", async ({ page }) => {
    await page.goto("/overlay-regressions");
    await page.getByRole("button", { name: "Open nested Dialog and Sheet" }).click();
    await expect(page.locator('[data-slot="sheet-content"]')).toBeVisible();
    await page.getByRole("combobox", { name: "Nested status" }).click();
    await expect(page.locator('[data-slot="select-positioner"]')).toBeVisible();
    expect(await page.locator('[data-slot="dialog-overlay"]').count()).toBe(1);
    expect(await page.locator('[data-slot="select-positioner"]').locator("..").locator('[data-base-ui-inert=""]').count()).toBe(0);
    await page.getByRole("option", { name: "Ready" }).click();
  });
});

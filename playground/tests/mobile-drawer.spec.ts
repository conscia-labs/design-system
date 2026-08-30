import { expect, test } from "@playwright/test";

test.describe("Phase 7 mobile drawer gesture regression", () => {
  test("left sidebar drawer dismisses with a leftward touch swipe", async ({ page, context }) => {
    await page.goto("/foundation");
    await expect(page.getByRole("heading", { name: "Foundation", exact: true })).toBeVisible();

    const toggle = page.getByRole("button", { name: "Toggle navigation", exact: true });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const navigation = page.getByRole("dialog", { name: "Application navigation" });
    await expect(navigation).toBeVisible();

    const box = await navigation.boundingBox();
    expect(box).not.toBeNull();
    if (!box) {
      return;
    }

    const client = await context.newCDPSession(page);
    const startX = box.x + box.width * 0.65;
    const endX = Math.max(box.x, startX - box.width * 0.75);
    const y = box.y + box.height * 0.5;

    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: startX, y, id: 1 }],
    });
    await page.waitForTimeout(40);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: startX - box.width * 0.25, y, id: 1 }],
    });
    await page.waitForTimeout(40);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: endX, y, id: 1 }],
    });
    await page.waitForTimeout(40);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });

    await expect(navigation).toBeHidden();
  });
});

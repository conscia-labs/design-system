import { expect, test, type Locator, type Page } from "@playwright/test";

type Appearance = "light" | "dark";
type Density = "comfortable" | "compact" | "operational";

async function loadContentHelpers(
  page: Page,
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
  await page.goto("/components/content-helpers", { timeout: 60_000 });
  await expect(
    page.getByRole("heading", { name: "Content helpers", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-appearance", appearance);
  await expect(page.locator("html")).toHaveAttribute("data-density", density);
}

async function expectNoDocumentOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
}

async function expectContained(child: Locator, parent: Locator) {
  const childBox = await child.boundingBox();
  const parentBox = await parent.boundingBox();
  expect(childBox).not.toBeNull();
  expect(parentBox).not.toBeNull();
  expect(childBox!.x).toBeGreaterThanOrEqual(parentBox!.x - 1);
  expect(childBox!.x + childBox!.width).toBeLessThanOrEqual(
    parentBox!.x + parentBox!.width + 1,
  );
}

test("CodeBlock follows its container across appearances and densities", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });

  for (const appearance of ["light", "dark"] as const) {
    for (const density of ["comfortable", "compact", "operational"] as const) {
      await loadContentHelpers(page, appearance, density);

      const container = page.getByTestId("code-block-constrained-container");
      const block = container.locator('[data-slot="code-block"]');
      const toolbar = block.locator('[data-slot="code-block-toolbar"]');
      const tabList = block.getByRole("tablist", { name: "Request example" });
      const copyButton = block.getByRole("button", {
        name: "Copy complete request with environment details",
        exact: true,
      });

      await expect(block).toHaveCSS("width", "248px");
      await expect(tabList.getByRole("tab")).toHaveCount(3);
      await expect(toolbar).toHaveCSS("flex-direction", "column");
      await expect(copyButton).toBeVisible();
      await expectContained(copyButton, toolbar);
      await expectNoDocumentOverflow(page);
    }
  }

  const expandedContainer = page.getByTestId("code-block-constrained-container");
  await expandedContainer.evaluate((element) => {
    const container = element as HTMLElement;
    container.style.maxWidth = "none";
    container.style.width = "500px";
  });
  const expandedBlock = expandedContainer.locator('[data-slot="code-block"]');
  const expandedToolbar = expandedBlock.locator('[data-slot="code-block-toolbar"]');
  const expandedCopyButton = expandedBlock.getByRole("button", {
    name: "Copy complete request with environment details",
    exact: true,
  });
  await expect(expandedBlock).toHaveCSS("width", "500px");
  await expect(expandedToolbar).toHaveCSS("flex-direction", "row");
  await expectContained(expandedCopyButton, expandedToolbar);
  await expectNoDocumentOverflow(page);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();
  const quickstartTabs = page.getByRole("tablist", { name: "Quickstart section" });
  const wideBlock = page
    .locator('[data-slot="code-block"]')
    .filter({ has: quickstartTabs });
  await expect(quickstartTabs).toBeVisible();
  await expect(
    wideBlock.locator('[data-slot="code-block-toolbar"]'),
  ).toHaveCSS("flex-direction", "row");
});

test("narrow CodeBlock keeps tabs, copy feedback, and body scrolling independent", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    type ClipboardTestWindow = Window & {
      __codeBlockClipboardFailure?: boolean;
      __codeBlockCopiedText?: string;
    };
    const testWindow = window as ClipboardTestWindow;

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          testWindow.__codeBlockCopiedText = value;
          if (testWindow.__codeBlockClipboardFailure) {
            throw new Error("Clipboard access was denied.");
          }
        },
      },
    });
  });
  await loadContentHelpers(page, "light", "comfortable");

  const container = page.getByTestId("code-block-constrained-container");
  const block = container.locator('[data-slot="code-block"]');
  const toolbar = block.locator('[data-slot="code-block-toolbar"]');
  const tabList = block.getByRole("tablist", { name: "Request example" });
  const tabs = tabList.getByRole("tab");
  const copyButton = block.getByRole("button", {
    name: "Copy complete request with environment details",
    exact: true,
  });

  await expect(tabs.nth(0)).toHaveText("TypeScript");
  await expect(tabs.nth(1)).toHaveText("Python");
  await expect(tabs.nth(2)).toHaveText("Environment");

  for (const width of [248, 216, 168]) {
    await container.evaluate((element, nextWidth) => {
      (element as HTMLElement).style.width = String(nextWidth) + "px";
    }, width);
    await expect(block).toHaveCSS("width", String(width) + "px");
    await expect(toolbar).toHaveCSS("flex-direction", "column");
    await expect(copyButton).toBeVisible();
    await expectContained(copyButton, toolbar);
    await expectNoDocumentOverflow(page);
  }

  await tabs.nth(0).focus();
  await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  const pythonBounds = await tabs.nth(1).boundingBox();
  const tabListBounds = await tabList.boundingBox();
  expect(pythonBounds).not.toBeNull();
  expect(tabListBounds).not.toBeNull();
  expect(pythonBounds!.x).toBeGreaterThanOrEqual(tabListBounds!.x - 1);
  expect(pythonBounds!.x + pythonBounds!.width).toBeLessThanOrEqual(
    tabListBounds!.x + tabListBounds!.width + 1,
  );
  expect(
    await tabs.nth(1).evaluate((tab) => getComputedStyle(tab).boxShadow),
  ).not.toBe("none");

  await tabs.nth(1).evaluate((tab) => {
    tab.textContent = "Python with extended request configuration details";
  });
  const tabOverflow = await tabList.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(tabOverflow.scrollWidth).toBeGreaterThan(tabOverflow.clientWidth);
  await expect(copyButton).toBeVisible();
  await expectContained(copyButton, toolbar);
  await expectNoDocumentOverflow(page);

  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(2)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  const activeTab = await tabs.nth(2).boundingBox();
  const activeList = await tabList.boundingBox();
  expect(activeTab).not.toBeNull();
  expect(activeList).not.toBeNull();
  expect(activeTab!.x).toBeGreaterThanOrEqual(activeList!.x - 1);
  expect(activeTab!.x + activeTab!.width).toBeLessThanOrEqual(
    activeList!.x + activeList!.width + 1,
  );

  const codeBody = block.getByLabel("Environment code example");
  await expect(codeBody).toHaveAttribute("tabindex", "0");
  await expect(codeBody).toHaveCSS("overflow-x", "auto");
  await codeBody.focus();
  await expect(codeBody).toBeFocused();
  const scrollState = await codeBody.evaluate((element) => {
    const pre = element as HTMLPreElement;
    return { clientWidth: pre.clientWidth, scrollWidth: pre.scrollWidth };
  });
  expect(scrollState.scrollWidth).toBeGreaterThan(scrollState.clientWidth);
  const tabScrollBefore = await tabList.evaluate((element) => element.scrollLeft);
  await codeBody.evaluate((element) => {
    const pre = element as HTMLPreElement;
    pre.scrollLeft = pre.scrollWidth;
  });
  const independentScroll = await page.evaluate((selector) => {
    const pre = document.querySelector<HTMLPreElement>(selector);
    const tabs = document.querySelector<HTMLElement>(
      '[data-testid="code-block-constrained-container"] [role="tablist"]',
    );
    return { codeLeft: pre?.scrollLeft ?? 0, tabsLeft: tabs?.scrollLeft ?? 0 };
  }, '[data-testid="code-block-constrained-container"] [aria-label="Environment code example"]');
  expect(independentScroll.codeLeft).toBeGreaterThan(0);
  expect(independentScroll.tabsLeft).toBe(tabScrollBefore);

  await copyButton.focus();
  await page.keyboard.press("Enter");
  const copiedButton = block.getByRole("button", { name: "Copied", exact: true });
  await expect(copiedButton).toBeVisible();
  await expectContained(copiedButton, toolbar);
  await expect(block.getByRole("status")).toHaveText("Code copied to clipboard.");
  expect(
    await page.evaluate(
      () => (window as Window & { __codeBlockCopiedText?: string }).__codeBlockCopiedText,
    ),
  ).toContain("CLIENT_REGION");
  await expectNoDocumentOverflow(page);

  await page.evaluate(() => {
    (window as Window & { __codeBlockClipboardFailure?: boolean }).__codeBlockClipboardFailure =
      true;
  });
  await copiedButton.focus();
  await page.keyboard.press("Enter");
  await expect(copyButton).toBeVisible();
  await expect(block.getByRole("status")).toHaveText(
    "Code could not be copied. Select the code and copy it manually.",
  );
  await expectContained(copyButton, toolbar);
  await expectNoDocumentOverflow(page);
});

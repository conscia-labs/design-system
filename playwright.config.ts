import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3020";

export default defineConfig({
  testDir: "./playground/tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  use: {
    baseURL,
    locale: "en-US",
    timezoneId: "UTC",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixelRatio: 0.001,
    },
  },
  webServer: {
    command: "pnpm dev:playground",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use the installed Chromium-based Chrome locally; CI can override this
        // with PLAYWRIGHT_CHANNEL or install Playwright's bundled Chromium.
        channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
      },
    },
  ],
});

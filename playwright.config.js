const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 15000,
  fullyParallel: false,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      },
    },
  ],
  webServer: {
    command: "npx serve . -p 3000 --no-clipboard",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});

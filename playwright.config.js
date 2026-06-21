const { defineConfig, devices } = require("@playwright/test");

// In CI the game repo is checked out to ./game; locally point to ../new-chat
const gameDir = process.env.CI ? "./game" : "../new-chat";

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
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npx serve ${gameDir} -p 3000 --no-clipboard`,
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});

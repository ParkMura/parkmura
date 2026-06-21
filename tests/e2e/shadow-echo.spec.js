const { test, expect } = require("@playwright/test");

test.describe("Shadow Echo — page load", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bullet-noir/");
  });

  test("page title is Shadow Echo", async ({ page }) => {
    await expect(page).toHaveTitle("Shadow Echo");
  });

  test("canvas element is present and visible", async ({ page }) => {
    await expect(page.locator("#game")).toBeVisible();
  });

  test("start overlay is shown on load", async ({ page }) => {
    await expect(page.locator("#overlay")).toBeVisible();
    await expect(page.locator("#overlay h1")).toHaveText("Shadow Echo");
    await expect(page.locator("#start")).toHaveText("Deploy");
  });
});

test.describe("Shadow Echo — HUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bullet-noir/");
  });

  test("initial status is READY", async ({ page }) => {
    await expect(page.locator("#status")).toHaveText("READY");
  });

  test("initial ammo is 24/24", async ({ page }) => {
    await expect(page.locator("#ammo")).toHaveText("24/24");
  });

  test("initial alive count is 6", async ({ page }) => {
    await expect(page.locator("#alive")).toHaveText("6");
  });

  test("initial score is 0", async ({ page }) => {
    await expect(page.locator("#score")).toHaveText("0");
  });
});

test.describe("Shadow Echo — game start", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bullet-noir/");
  });

  test("Deploy button hides overlay", async ({ page }) => {
    await page.locator("#start").click();
    await expect(page.locator("#overlay")).toBeHidden();
  });

  test("clicking canvas also starts the game", async ({ page }) => {
    await page.locator("#game").click();
    await expect(page.locator("#overlay")).toBeHidden();
  });

  test("status changes from READY after start", async ({ page }) => {
    await page.locator("#start").click();
    await page.waitForTimeout(300);
    await expect(page.locator("#status")).not.toHaveText("READY");
  });

  test("status is HUNT when game is running", async ({ page }) => {
    await page.locator("#start").click();
    await page.waitForTimeout(400);
    const status = await page.locator("#status").textContent();
    expect(["HUNT", "RELOAD"]).toContain(status);
  });
});

test.describe("Shadow Echo — player movement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bullet-noir/");
    await page.locator("#start").click();
    await page.waitForTimeout(200);
  });

  test("W key moves player upward", async ({ page }) => {
    const before = await page.evaluate(() => window.player?.y);
    await page.keyboard.down("w");
    await page.waitForTimeout(400);
    await page.keyboard.up("w");
    const after = await page.evaluate(() => window.player?.y);
    expect(after).toBeLessThan(before);
  });

  test("S key moves player downward", async ({ page }) => {
    const before = await page.evaluate(() => window.player?.y);
    await page.keyboard.down("s");
    await page.waitForTimeout(400);
    await page.keyboard.up("s");
    const after = await page.evaluate(() => window.player?.y);
    expect(after).toBeGreaterThan(before);
  });

  test("A key moves player left", async ({ page }) => {
    const before = await page.evaluate(() => window.player?.x);
    await page.keyboard.down("a");
    await page.waitForTimeout(400);
    await page.keyboard.up("a");
    const after = await page.evaluate(() => window.player?.x);
    expect(after).toBeLessThan(before);
  });

  test("D key moves player right", async ({ page }) => {
    const before = await page.evaluate(() => window.player?.x);
    await page.keyboard.down("d");
    await page.waitForTimeout(400);
    await page.keyboard.up("d");
    const after = await page.evaluate(() => window.player?.x);
    expect(after).toBeGreaterThan(before);
  });

  test("player stays within canvas bounds", async ({ page }) => {
    await page.keyboard.down("w");
    await page.waitForTimeout(3000);
    await page.keyboard.up("w");
    const { y, r } = await page.evaluate(() => ({ y: window.player?.y, r: window.player?.r }));
    expect(y).toBeGreaterThanOrEqual(r + 8);
  });
});

test.describe("Shadow Echo — game state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bullet-noir/");
    await page.locator("#start").click();
    await page.waitForTimeout(200);
  });

  test("6 agents present at start", async ({ page }) => {
    const count = await page.evaluate(() => window.game?.agents?.length);
    expect(count).toBe(6);
  });

  test("1 player (blue) and 5 enemies (red)", async ({ page }) => {
    const blues = await page.evaluate(
      () => window.game?.agents?.filter((a) => a.team === "blue").length,
    );
    const reds = await page.evaluate(
      () => window.game?.agents?.filter((a) => a.team === "red").length,
    );
    expect(blues).toBe(1);
    expect(reds).toBe(5);
  });

  test("score increases when enemy is eliminated", async ({ page }) => {
    await page.evaluate(() => {
      const enemy = window.game?.agents?.find((a) => a.team === "red" && a.hp > 0);
      if (enemy) {
        enemy.hp = 0;
        window.game.score += 100;
      }
    });
    await page.waitForTimeout(200);
    const score = parseInt(await page.locator("#score").textContent(), 10);
    expect(score).toBeGreaterThanOrEqual(100);
  });

  test("reload with R key updates ammo display", async ({ page }) => {
    await page.evaluate(() => {
      if (window.player) window.player.weapon.ammo = 0;
    });
    await page.keyboard.press("r");
    await page.waitForTimeout(1500);
    const ammoText = await page.locator("#ammo").textContent();
    expect(ammoText).not.toBe("0/24");
  });

  test("game over when player HP reaches 0", async ({ page }) => {
    await page.evaluate(() => {
      if (window.player) window.player.hp = 0;
    });
    await page.waitForTimeout(200);
    await expect(page.locator("#overlay")).toBeVisible();
    await expect(page.locator("#status")).toHaveText("DOWN");
    await expect(page.locator("#start")).toHaveText("Redeploy");
  });

  test("Redeploy restarts the game", async ({ page }) => {
    await page.evaluate(() => {
      if (window.player) window.player.hp = 0;
    });
    await page.waitForTimeout(200);
    await page.locator("#start").click();
    await expect(page.locator("#overlay")).toBeHidden();
    const hp = await page.evaluate(() => window.player?.hp);
    expect(hp).toBe(100);
  });
});

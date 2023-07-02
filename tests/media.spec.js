import { test, expect } from '@playwright/test';

test('<576px адаптация вёрстки и бургер меню', async ({ page }) => {
    page.setViewportSize({ width: 500, height: 6000 });
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

test('Адаптация вёрстки от 576px до 767px', async ({ page }) => {
    page.setViewportSize({ width: 600, height: 6000 });
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

test('Адаптация вёрстки от 768px до 991px', async ({ page }) => {
    page.setViewportSize({ width: 800, height: 6000 });
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

test('Адаптация вёрстки от 992px до 1199px', async ({ page }) => {
    page.setViewportSize({ width: 1100, height: 6000 });
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

test('Адаптация вёрстки от 1200px до 1399px', async ({ page }) => {
    page.setViewportSize({ width: 1280, height: 6000 });
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

test('Адаптация вёрстки от 1400px', async ({ page }) => {
    page.setViewportSize({ width: 1920, height: 6000 });
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

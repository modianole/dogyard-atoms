import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8080';

test.describe('Release smoke', () => {
  test('home page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/DogYard|דוג יארד|Vite/i);
  });

  test('map route loads shell', async ({ page }) => {
    await page.goto(`${BASE_URL}/map`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
  });

  test('legal routes are reachable', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/privacy|פרטיות/i);

    await page.goto(`${BASE_URL}/terms`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/terms|תנאי/i);
  });
});


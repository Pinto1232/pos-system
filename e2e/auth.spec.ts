import { test, expect } from '@playwright/test';

test('Login with Keycloak', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'testpassword');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(
    'http://localhost:3000/dashboard'
  );
});

import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/bdd-fixtures';

const { Given, When, Then } = createBdd(test);

Given('I navigate to the login view', async ({ page }) => {
  await page.goto('/');
});

When(
  'I execute login with {string} and {string}',
  async ({ page }, username: string, password: string) => {
    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();
  },
);

Then('I see the authentication error message', async ({ page }) => {
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

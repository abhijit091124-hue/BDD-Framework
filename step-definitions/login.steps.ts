import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/bdd-fixtures';
import { config } from '../config/config';
import { LoginPage } from '../pages/LoginPage';

const { Given, When, Then } = createBdd(test);

Given('I navigate to the login page', async ({ page }) => {
  await new LoginPage(page).navigateToLoginPage();
});

When('I enter valid username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterUsername(config.username);
  await loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterUsername(`invalid_${config.username}`);
  await loginPage.enterPassword(`invalid_${config.password}`);
});

When('I click the login button', async ({ page }) => {
  await new LoginPage(page).clickLogin();
});

Then('I should be successfully logged in', async ({ page }) => {
  await new LoginPage(page).verifySuccessfulLogin();
});

Then('I should see an error message', async ({ page }) => {
  await new LoginPage(page).verifyLoginError();
});

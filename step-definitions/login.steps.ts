import { Given, Then, When } from '@cucumber/cucumber';
import { config } from '../config/config';
import { LoginPage } from '../pages/LoginPage';
import type { PlaywrightWorld } from '../hooks/hooks';

function loginPageFor(world: PlaywrightWorld): LoginPage {
  if (!world.page) {
    throw new Error('The browser page was not initialized by the Before hook.');
  }
  return new LoginPage(world.page);
}

// Step definitions connect readable Gherkin sentences to reusable page-object methods.
Given('I navigate to the login page', async function (this: PlaywrightWorld) {
  await loginPageFor(this).navigateToLoginPage();
});

When('I enter valid username and password', async function (this: PlaywrightWorld) {
  const loginPage = loginPageFor(this);
  await loginPage.enterUsername(config.username);
  await loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async function (this: PlaywrightWorld) {
  const loginPage = loginPageFor(this);
  await loginPage.enterUsername(`invalid_${config.username}`);
  await loginPage.enterPassword(`invalid_${config.password}`);
});

When('I click the login button', async function (this: PlaywrightWorld) {
  await loginPageFor(this).clickLogin();
});

Then('I should be successfully logged in', async function (this: PlaywrightWorld) {
  await loginPageFor(this).verifySuccessfulLogin();
});

Then('I should see an error message', async function (this: PlaywrightWorld) {
  await loginPageFor(this).verifyLoginError();
});

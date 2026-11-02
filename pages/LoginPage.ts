import type { Page } from 'playwright';
import { config } from '../config/config';

// The Page Object Model keeps selectors and UI interactions out of step definitions.
export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly inventoryList;
  private readonly loginError;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.inventoryList = page.locator('.inventory_list');
    this.loginError = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(config.baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.inventoryList.waitFor({ state: 'visible', timeout: config.timeout });
    if (!this.page.url().endsWith('/inventory.html')) {
      throw new Error(`Expected the inventory page after login; received ${this.page.url()}.`);
    }
  }

  async verifyLoginError(): Promise<void> {
    await this.loginError.waitFor({ state: 'visible', timeout: config.timeout });
    const message = await this.loginError.textContent();
    if (!message?.trim()) {
      throw new Error('The login error element was visible but contained no message.');
    }
  }
}

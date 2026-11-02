import { defineConfig } from '@playwright/test';
import { config } from './config/config';

// This settings file documents the same browser defaults; Cucumber hooks launch the browser.
export default defineConfig({
  timeout: config.timeout,
  use: {
    baseURL: config.baseUrl,
    browserName: config.browserName,
    headless: config.headless,
  },
});

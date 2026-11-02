import {
  After,
  Before,
  setDefaultTimeout,
  setWorldConstructor,
  Status,
  World,
  type IWorldOptions,
} from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium, firefox, webkit } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { config, type BrowserName } from '../config/config';
import { toSafeFileName } from '../utils/scenarioName';

const browserTypes = { chromium, firefox, webkit };

// A Cucumber World is isolated per scenario and stores its Playwright resources.
export class PlaywrightWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
setDefaultTimeout(config.timeout);

Before(async function (this: PlaywrightWorld) {
  // Browser is the launched engine; BrowserContext isolates scenario cookies and storage.
  const browserType = browserTypes[config.browserName as BrowserName];
  this.browser = await browserType.launch({ headless: config.headless });
  this.context = await this.browser.newContext({ baseURL: config.baseUrl });
  this.page = await this.context.newPage();
});

After(async function (this: PlaywrightWorld, { pickle, result }) {
  const cleanupErrors: string[] = [];

  try {
    if (result?.status === Status.FAILED) {
      if (!this.page) {
        const message = `Unable to capture a screenshot for "${pickle.name}": no page was created.`;
        console.error(message);
        await this.attach(message, 'text/plain');
      } else {
        try {
          const screenshot = await this.page.screenshot({ fullPage: true });
          const screenshotDirectory = join(__dirname, '..', 'screenshots');
          await mkdir(screenshotDirectory, { recursive: true });
          const filename = `${toSafeFileName(pickle.name)}-${Date.now()}.png`;
          await writeFile(join(screenshotDirectory, filename), screenshot);
          await this.attach(screenshot, 'image/png');
        } catch (error) {
          const message = `Failed to capture/attach scenario screenshot: ${errorMessage(error)}`;
          console.error(message);
          await this.attach(message, 'text/plain');
        }
      }
    }
  } finally {
    for (const [resourceName, close] of [
      ['page', () => this.page?.close()],
      ['context', () => this.context?.close()],
      ['browser', () => this.browser?.close()],
    ] as const) {
      try {
        await close();
      } catch (error) {
        const message = `Failed to close ${resourceName}: ${errorMessage(error)}`;
        cleanupErrors.push(message);
        console.error(message);
      }
    }
    this.page = undefined;
    this.context = undefined;
    this.browser = undefined;
  }

  if (cleanupErrors.length > 0) {
    throw new Error(cleanupErrors.join('\n'));
  }
});

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

import dotenv from 'dotenv';
import { resolve } from 'node:path';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

const testEnvironment = process.env.TEST_ENV ?? 'qa';
if (testEnvironment !== 'qa' && testEnvironment !== 'uat') {
  throw new Error(`Unsupported TEST_ENV "${testEnvironment}". Choose "qa" or "uat".`);
}

const envPath = resolve(__dirname, `.env.${testEnvironment}`);
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  throw new Error(`Could not load environment file "${envPath}": ${dotenvResult.error.message}`);
}

function requiredValue(name: 'BASE_URL' | 'USERNAME' | 'PASSWORD'): string {
  const credentialOverride =
    name === 'USERNAME'
      ? process.env.APP_USERNAME
      : name === 'PASSWORD'
        ? process.env.APP_PASSWORD
        : undefined;
  const value = (
    credentialOverride ??
    dotenvResult.parsed?.[name] ??
    process.env[name]
  )?.trim();
  if (!value) {
    throw new Error(`Missing ${name}; set it in ${envPath} or the process environment.`);
  }
  return value;
}

function positiveInteger(name: string, value: string | undefined, defaultValue: number): number {
  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer; received "${value}".`);
  }
  return parsed;
}

function booleanValue(name: string, value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`${name} must be "true" or "false"; received "${value}".`);
}

const browserName = process.env.BROWSER ?? 'chromium';
if (!['chromium', 'firefox', 'webkit'].includes(browserName)) {
  throw new Error(`Unsupported BROWSER "${browserName}". Choose chromium, firefox, or webkit.`);
}

export const config = {
  environment: testEnvironment,
  baseUrl: requiredValue('BASE_URL'),
  username: requiredValue('USERNAME'),
  password: requiredValue('PASSWORD'),
  browserName: browserName as BrowserName,
  headless: booleanValue('HEADLESS', process.env.HEADLESS, true),
  timeout: positiveInteger('TIMEOUT', process.env.TIMEOUT, 30_000),
};

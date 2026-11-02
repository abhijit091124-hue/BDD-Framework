# Playwright + Cucumber BDD Framework

A beginner-friendly BDD automation project for SauceDemo. Cucumber discovers and runs
the Gherkin scenarios; Playwright drives the browser through a Page Object Model.
Playwright Test is not used to execute these scenarios.

## A. Project architecture

```text
playwright-bdd-framework/
├── features/login.feature             # Business-readable Gherkin scenarios and tags
├── step-definitions/login.steps.ts    # Cucumber Given/When/Then implementations
├── pages/LoginPage.ts                 # Page Object Model: selectors and interactions
├── hooks/hooks.ts                     # Scenario World and browser lifecycle
├── config/config.ts                   # Environment loading and validated settings
├── config/.env.qa                     # QA settings and SauceDemo test credentials
├── config/.env.uat                    # UAT settings; replace with the real UAT values
├── test-runner/runner.ts              # Cucumber CLI launcher and optional HTML output
├── utils/scenarioName.ts              # Safe screenshot filename helper
├── reports/                           # Generated HTML report output
├── screenshots/                       # Screenshots for failed scenarios
├── cucumber.js                        # Cucumber feature and TypeScript loading defaults
├── playwright.config.ts               # Matching Playwright browser settings
├── tsconfig.json                      # TypeScript compiler settings
└── package.json                       # Dependencies and npm commands
```

The feature file describes behavior in Gherkin. Step definitions bind each Gherkin
sentence to code. The Page Object Model centralizes the selectors and interactions,
and hooks create and clean up a browser for each scenario.

## B. Installation

Use Node.js 20 or newer and npm:

```sh
npm install
```

## C. Install Playwright browsers

Install Chromium (the default browser):

```sh
npx playwright install chromium
```

For another configured browser, install it with `npx playwright install firefox` or
`npx playwright install webkit`.

## D. Configure environments

The default environment is QA. `config/.env.qa` includes the SauceDemo URL and the
test credentials supplied for this project. The UAT file is runnable against the demo
by default; replace its values with the actual UAT URL and credentials when available.

Select an environment using `TEST_ENV=qa` or `TEST_ENV=uat`. You can also override
`BASE_URL`, `BROWSER`, `HEADLESS`, and `TIMEOUT` through process environment variables.
Override credentials with `APP_USERNAME` and `APP_PASSWORD`. These names avoid
collisions with operating-system variables such as Windows' built-in `USERNAME`.
The dotenv files use the requested `USERNAME` and `PASSWORD` keys.
Supported browsers are `chromium`, `firefox`, and `webkit`; `HEADLESS` must be
`true` or `false`, and `TIMEOUT` is a positive number of milliseconds.

PowerShell examples:

```powershell
$env:TEST_ENV = "qa"
npm run test:bdd

$env:TEST_ENV = "uat"
npm run test:bdd
```

## E. Run all BDD tests

```sh
npm run test:bdd
```

Cucumber uses `cucumber.js` to discover every feature under `features/`, load the
TypeScript hooks and step definitions, and continue to later scenarios when one fails.

## F. Run a specific feature

```sh
npm run test:bdd -- features/login.feature
```

You can also call Cucumber directly because its configuration loads the hooks and
TypeScript definitions:

```sh
npx cucumber-js features/login.feature
```

## G. Run a specific tag or scenario

Run the smoke scenario:

```sh
npx cucumber-js --tags "@smoke"
```

Run the regression scenario:

```sh
npm run test:bdd -- --tags "@regression"
```

To select one scenario by its name:

```sh
npx cucumber-js --name "Successful login with valid credentials"
```

## H. Run in headed mode

```sh
npm run test:bdd:headed
```

Or set `HEADLESS=false` in the selected environment file or process environment.

## I. Generate the HTML report

```sh
npm run test:bdd:html
```

The report is written to `reports/cucumber-report.html` and includes feature/scenario
and step results, timing, failure details, and screenshots attached by the failure hook.
It can be combined with Cucumber filters:

```sh
npm run test:bdd:html -- --tags "@smoke"
```

## J. Failure screenshots

The Cucumber `After` hook checks the scenario result. If it failed and a page exists,
the hook saves a full-page PNG under `screenshots/` and attaches the image to the
Cucumber report. The hook then closes the page, context, and browser even when
screenshot capture or cleanup encounters an error.

## K. End-to-end execution flow

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright Page
     ↓
BrowserContext
     ↓
Browser
     ↓
Application (SauceDemo)
     ↓
Cucumber Report
```

The browser is launched in a Cucumber `Before` hook, and a fresh `BrowserContext` and
`Page` are created for each scenario. Step definitions use the `LoginPage` object to
perform actions and verify outcomes. Cucumber records step status, duration, and
failure details; the `After` hook adds a screenshot for failed scenarios before
releasing browser resources.

import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function run(): Promise<void> {
  const projectRoot = resolve(__dirname, '..');
  const reportDirectory = resolve(projectRoot, 'reports');
  const cucumberCli = resolve(
    projectRoot,
    'node_modules',
    '@cucumber',
    'cucumber',
    'bin',
    'cucumber.js',
  );
  const passedArguments = process.argv.slice(2);
  const generateHtml = passedArguments.includes('--html');
  const cucumberArguments = passedArguments.filter((argument) => argument !== '--html');

  if (generateHtml) {
    await mkdir(reportDirectory, { recursive: true });
    cucumberArguments.push(
      '--format',
      'html:reports/cucumber-report.html',
    );
  }

  // Cucumber runs all configured feature files and keeps running after individual failures.
  const child = spawn(process.execPath, [cucumberCli, ...cucumberArguments], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
  });

  child.on('error', (error) => {
    console.error(`Unable to start Cucumber: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      console.error(`Cucumber was terminated by signal ${signal}.`);
      process.exitCode = 1;
    } else {
      process.exitCode = code ?? 1;
    }
  });
}

void run().catch((error: unknown) => {
  console.error(`BDD runner failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

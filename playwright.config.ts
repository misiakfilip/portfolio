import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
for (const d of ['axe', 'data', 'screenshots', 'lighthouse']) fs.mkdirSync(`test-results/raporty/${d}`, { recursive: true });

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: [['list'], ['json', { outputFile: 'test-results/raporty/data/playwright-results.json' }]],
  outputDir: 'test-results/raporty/data/test-artifacts',
  use: {
    baseURL: 'http://localhost:4399/portfolio/',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4399',
    url: 'http://localhost:4399/portfolio/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
});

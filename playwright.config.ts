import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';

const port = 19006;
const baseURL = `http://localhost:${port}`;

// Playwright 1.64 ships browsers from macOS 14 (Darwin 23) upward. On macOS 13
// the installed Google Chrome is the browser the smoke test can launch.
const darwinMajor = Number.parseInt(os.release().split('.')[0] ?? '', 10);
const legacyMac = process.platform === 'darwin' && darwinMajor < 23;

export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 90_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    ...devices['Desktop Chrome'],
    ...(legacyMac ? { channel: 'chrome' as const } : {}),
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `expo start --web --localhost --port ${port}`,
    url: baseURL,
    timeout: 180_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      ...process.env,
      CI: '1',
      EXPO_NO_TELEMETRY: '1',
      BROWSER: 'none',
    },
  },
});

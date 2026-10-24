/**
 * Unattended web smoke test.
 * Installs Playwright's Chromium where a build exists, then runs the browser test.
 * macOS 13 has no Playwright browser build; the config launches Google Chrome instead.
 */
const { execSync } = require('child_process');
const os = require('os');

const darwinMajor = Number.parseInt(os.release().split('.')[0] ?? '', 10);
const legacyMac = process.platform === 'darwin' && darwinMajor < 23;

if (!legacyMac) {
  execSync('playwright install chromium', { stdio: 'inherit' });
}

execSync('playwright test', { stdio: 'inherit' });

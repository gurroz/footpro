const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const { chromium } = require('@playwright/test');

const darwinMajor = Number.parseInt(os.release().split('.')[0] ?? '', 10);
const legacyMac = process.platform === 'darwin' && darwinMajor < 23;

function chromiumInstalled() {
  try {
    return fs.existsSync(chromium.executablePath());
  } catch {
    return false;
  }
}

if (!legacyMac && !chromiumInstalled()) {
  execSync('playwright install chromium', { stdio: 'inherit' });
}

execSync('playwright test', { stdio: 'inherit' });

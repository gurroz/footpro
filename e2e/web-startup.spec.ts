import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

const IGNORED_CONSOLE_ERROR = [/favicon\.ico/i];

function isIgnoredConsoleError(text: string): boolean {
  return IGNORED_CONSOLE_ERROR.some(pattern => pattern.test(text));
}

function formatConsole(message: ConsoleMessage): string {
  const location = message.location();
  const where = location.url
    ? ` (${location.url}:${location.lineNumber})`
    : '';
  return `${message.text()}${where}`;
}

function watchConsole(page: Page): string[] {
  const errors: string[] = [];

  page.on('pageerror', error => {
    errors.push(`Uncaught exception: ${error.message}`);
  });

  page.on('console', message => {
    if (message.type() !== 'error') {
      return;
    }
    const text = formatConsole(message);
    if (isIgnoredConsoleError(text)) {
      return;
    }
    errors.push(text);
  });

  return errors;
}

test('web app starts and the browser console has no errors', async ({ page }) => {
  const errors = watchConsole(page);

  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response, 'Expo web server did not return a document').not.toBeNull();
  expect(response!.ok(), `Document request failed with ${response!.status()}`).toBeTruthy();

  try {
    await expect(page.getByText('The Pitch')).toBeVisible();
  } catch (error) {
    const detail = errors.length > 0 ? errors.join('\n---\n') : '(none captured)';
    throw new Error(
      `The home screen did not render.\n\nBrowser console errors:\n${detail}\n\n${error}`,
    );
  }

  // Fonts and late effects can log after the first paint.
  await page.waitForTimeout(2000);

  if (errors.length > 0) {
    throw new Error(
      `Browser console reported errors:\n${errors.join('\n---\n')}`,
    );
  }
});

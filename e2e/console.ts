import type { ConsoleMessage, Page } from '@playwright/test';

const IGNORED_CONSOLE_ERROR = [/favicon\.ico/i];

export function isIgnoredConsoleError(text: string): boolean {
  return IGNORED_CONSOLE_ERROR.some(pattern => pattern.test(text));
}

export function formatConsole(message: ConsoleMessage): string {
  const location = message.location();
  const where = location.url
    ? ` (${location.url}:${location.lineNumber})`
    : '';
  return `${message.text()}${where}`;
}

export function watchConsole(page: Page): string[] {
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

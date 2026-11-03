import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test, type Locator, type Page } from '@playwright/test';

import { watchConsole } from './console';

const TEAM_NAME = 'Harbour Athletic';
const LOGO_PATH = path.join(__dirname, 'fixtures', 'team-logo.png');
const LOGO_BYTES = readFileSync(LOGO_PATH);

const PLAYERS = [
  { name: 'Mira Costa', email: 'mira@harbour.test' },
  { name: 'Leo Park', email: 'leo@harbour.test' },
  { name: 'Noor Hale', email: 'noor@harbour.test' },
] as const;

async function openHome(page: Page): Promise<void> {
  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response, 'Expo web server did not return a document').not.toBeNull();
  expect(
    response!.ok(),
    `Document request failed with ${response!.status()}`,
  ).toBeTruthy();
  await expect(page.getByText('The Pitch')).toBeVisible();
}

async function imageBytes(image: Locator): Promise<Buffer | null> {
  const bytes = await image.evaluate(async img => {
    const element = img as HTMLImageElement;
    const url = element.currentSrc || element.src;
    if (!url) {
      return null;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      return [...new Uint8Array(await response.arrayBuffer())];
    } catch {
      return null;
    }
  });
  return bytes == null ? null : Buffer.from(bytes);
}

async function addPlayer(page: Page, name: string, email: string): Promise<void> {
  await page.getByRole('button', { name: 'Add Manually' }).click();
  await page.getByTestId('manual-player-name').fill(name);
  await page.getByTestId('manual-player-email').fill(email);
  await page.getByRole('button', { name: 'Add to squad' }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
}

test('a finished team shows on the pitch with its uploaded logo', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await openHome(page);

  await page.getByRole('button', { name: 'Create team' }).click();
  await page.getByTestId('team-step1-name-input').fill(TEAM_NAME);

  const fileChooserPromise = page.waitForEvent('filechooser', {
    timeout: 15_000,
  });
  await page.getByRole('button', { name: 'Upload team logo' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(LOGO_PATH);

  const preview = page.getByRole('button', { name: 'Upload team logo' }).locator('img');
  await expect(preview).toBeVisible();
  expect(await imageBytes(preview)).toEqual(LOGO_BYTES);

  await page.getByRole('button', { name: 'Confirm & Next' }).click();
  await expect(page.getByText('Step 2/3')).toBeVisible();

  for (const player of PLAYERS) {
    await addPlayer(page, player.name, player.email);
  }
  await expect(
    page.getByText(`Squad (${PLAYERS.length}) — ${TEAM_NAME}`),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Confirm & Next' }).click();
  await expect(page.getByText('The Pitch')).toBeVisible();
  await expect(page.getByText(TEAM_NAME, { exact: true })).toBeVisible();

  const images = page.locator('img');
  const imageCount = await images.count();
  let uploadedLogo: Locator | null = null;
  for (let index = 0; index < imageCount; index += 1) {
    const image = images.nth(index);
    const bytes = await imageBytes(image);
    if (bytes != null && bytes.equals(LOGO_BYTES)) {
      uploadedLogo = image;
      break;
    }
  }

  expect(
    uploadedLogo,
    `${TEAM_NAME} is not shown with the uploaded logo`,
  ).not.toBeNull();

  const teamBlock = uploadedLogo!.locator(
    `xpath=ancestor::div[contains(., "${TEAM_NAME}")][1]`,
  );
  await expect(teamBlock).toContainText(TEAM_NAME);
  await expect(teamBlock).not.toContainText('The Pitch');
  await expect(teamBlock).not.toContainText('North Star Elite');

  expect(errors, errors.join('\n---\n')).toEqual([]);
});

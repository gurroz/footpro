import { expect, test, type Page } from '@playwright/test';

import { watchConsole } from './console';

async function openHome(page: Page): Promise<string[]> {
  const errors = watchConsole(page);
  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response, 'Expo web server did not return a document').not.toBeNull();
  expect(response!.ok(), `Document request failed with ${response!.status()}`).toBeTruthy();
  await expect(page.getByText('The Pitch')).toBeVisible();
  return errors;
}

function expectCleanConsole(errors: string[]): void {
  expect(errors, errors.join('\n---\n')).toEqual([]);
}

test('home screen shows the design kit and team creation entry', async ({
  page,
}) => {
  const errors = await openHome(page);

  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect(page.getByText('Season 2024/25')).toBeVisible();
  await expect(page.getByText('Design kit')).toBeVisible();
  await expect(page.getByText('Total Assets')).toBeVisible();
  await expect(page.getByText('42')).toBeVisible();
  await expect(page.getByText('Avg. Readiness')).toBeVisible();
  await expect(page.getByText('94%')).toBeVisible();
  await expect(page.getByText('North Star Elite')).toBeVisible();
  await expect(page.getByText('Julian Draxler')).toBeVisible();
  await expect(page.getByText('Away')).toBeVisible();
  await expect(page.getByText('Home')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Primary action' }),
  ).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Teams' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tab', { name: 'Players' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create team' })).toBeVisible();

  await page.getByRole('button', { name: 'Primary action' }).click();
  await expect(page.getByText('The Pitch')).toBeVisible();

  expectCleanConsole(errors);
});

test('bottom navigation keeps the pitch visible and only Teams can create', async ({
  page,
}) => {
  const errors = await openHome(page);

  await page.getByRole('tab', { name: 'Players' }).click();
  await expect(page.getByRole('tab', { name: 'Players' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tab', { name: 'Teams' })).toHaveAttribute(
    'aria-selected',
    'false',
  );
  await expect(page.getByText('Design kit')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create team' })).toHaveCount(0);

  await page.getByRole('tab', { name: 'Settings' }).click();
  await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Create team' })).toHaveCount(0);

  await page.getByRole('tab', { name: 'Teams' }).click();
  await expect(page.getByRole('tab', { name: 'Teams' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Create team' })).toBeVisible();

  expectCleanConsole(errors);
});

test('creating a team and adding a player by hand returns to the pitch', async ({
  page,
}) => {
  const errors = await openHome(page);

  await page.getByRole('button', { name: 'Create team' }).click();
  await expect(page.getByText('Team Configuration')).toBeVisible();
  await expect(page.getByText('Step 1/3')).toBeVisible();
  await expect(page.getByText(/IDENTITY\s*&\s*STRUCTURE/)).toBeVisible();

  await page.getByRole('button', { name: 'Go back' }).click();
  await expect(page.getByText('The Pitch')).toBeVisible();

  await page.getByRole('button', { name: 'Create team' }).click();
  await expect(page.getByTestId('team-step1-pitch-players-input')).toHaveValue(
    '11',
  );
  await expect(page.getByTestId('team-step1-subs-input')).toHaveValue('7');

  await page.getByTestId('team-step1-logo-trigger').click();
  await expect(page.getByText(/Image must be at most/)).toHaveCount(0);
  await expect(page.getByText('Team Configuration')).toBeVisible();

  await page.getByTestId('team-step1-name-input').fill('Riverside FC');
  await page.getByTestId('team-step1-city-input').fill('Lisbon');
  await page.getByTestId('team-step1-country-trigger').click();
  await page.getByTestId('team-step1-country-Spain').click();
  await expect(page.getByText('Select country')).toHaveCount(0, { timeout: 10_000 });
  await expect(page.getByTestId('team-step1-country-trigger')).toContainText(
    'Spain',
  );

  await page.getByRole('button', { name: 'Confirm & Next' }).click();
  await expect(page.getByText('Step 2/3')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Manually' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sync Contacts' })).toBeVisible();
  await expect(page.getByText('Coming soon')).toBeVisible();

  await page.getByRole('button', { name: 'Add Manually' }).click();
  await page.getByRole('button', { name: 'Add to squad' }).click();
  await expect(page.getByText('Enter a name and a valid email.')).toBeVisible();

  await page.getByTestId('manual-player-name').fill('Ada Lopes');
  await page.getByTestId('manual-player-email').fill('not-an-email');
  await page.getByRole('button', { name: 'Add to squad' }).click();
  await expect(page.getByText('Enter a name and a valid email.')).toBeVisible();

  await page.getByTestId('manual-player-email').fill('ada@riverside.fc');
  await page.getByTestId('manual-player-phone').fill('+351 555 010');
  await page.getByRole('button', { name: 'Add to squad' }).click();

  await expect(page.getByText('Squad (1) — Riverside FC')).toBeVisible();
  await expect(page.getByText('Ada Lopes')).toBeVisible();
  await expect(page.getByText('ada@riverside.fc')).toBeVisible();
  await expect(page.getByText('+351 555 010')).toBeVisible();

  await page.getByRole('button', { name: 'Remove Ada Lopes' }).click();
  await expect(page.getByText('Ada Lopes')).toHaveCount(0);
  await expect(page.getByText('Squad (1) — Riverside FC')).toHaveCount(0);

  await page.getByRole('button', { name: 'Add Manually' }).click();
  await page.getByTestId('manual-player-name').fill('Ada Lopes');
  await page.getByTestId('manual-player-email').fill('ada@riverside.fc');
  await page.getByRole('button', { name: 'Add to squad' }).click();
  await expect(page.getByText('Squad (1) — Riverside FC')).toBeVisible();

  await page.getByRole('button', { name: 'Confirm & Next' }).click();
  await expect(page.getByText('The Pitch')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create team' })).toBeVisible();

  expectCleanConsole(errors);
});

test('sync contacts on the web stays on import and does not crash', async ({
  page,
}) => {
  const errors = await openHome(page);

  await page.getByRole('button', { name: 'Create team' }).click();
  await page.getByTestId('team-step1-name-input').fill('Riverside FC');
  await page.getByRole('button', { name: 'Confirm & Next' }).click();
  await expect(page.getByText('Step 2/3')).toBeVisible();

  await page.getByRole('button', { name: 'Sync Contacts' }).click();

  await expect(page.getByText('Step 2/3')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Manually' })).toBeVisible();
  await expect(page.getByText('Select contacts')).toHaveCount(0);

  expectCleanConsole(errors);
});

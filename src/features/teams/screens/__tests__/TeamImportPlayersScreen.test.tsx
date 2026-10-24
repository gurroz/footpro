/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createNewTeam } from '../../../../domain/team';
import type {
  ContactRow,
  ContactsDirectoryPort,
} from '../../ports/ContactsDirectoryPort';
import { TeamImportPlayersScreen } from '../TeamImportPlayersScreen';

const safeAreaInitialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function renderWithSafeArea(ui: React.ReactElement) {
  return ReactTestRenderer.create(
    <SafeAreaProvider initialMetrics={safeAreaInitialMetrics}>
      {ui}
    </SafeAreaProvider>,
  );
}

function makeContactsDirectory(rows: ContactRow[]): ContactsDirectoryPort {
  return {
    requestPermission: jest.fn(async () => true),
    listContacts: jest.fn(async () => rows),
  };
}

describe('TeamImportPlayersScreen', () => {
  const team = createNewTeam({ name: 'City FC', id: 't-import' });

  it('renders import step copy and confirm control', async () => {
    const contacts = makeContactsDirectory([]);
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = renderWithSafeArea(
        <TeamImportPlayersScreen
          team={team}
          contactsDirectory={contacts}
          onBack={jest.fn()}
        />,
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Import Squad');
    expect(json).toContain('Coming soon');

    const confirm = tree.root.findByProps({
      testID: 'import-players-confirm',
    });
    expect(confirm).toBeTruthy();
  });

  it('adds a player manually and passes roster on confirm', async () => {
    const contacts = makeContactsDirectory([]);
    const onConfirmNext = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = renderWithSafeArea(
        <TeamImportPlayersScreen
          team={team}
          contactsDirectory={contacts}
          onBack={jest.fn()}
          onConfirmNext={onConfirmNext}
        />,
      );
    });

    const manualTrigger = tree.root.findByProps({
      testID: 'import-manual-trigger',
    });
    await ReactTestRenderer.act(async () => {
      manualTrigger.props.onPress();
    });

    const nameInput = tree.root.findByProps({
      testID: 'manual-player-name',
    });
    const emailInput = tree.root.findByProps({
      testID: 'manual-player-email',
    });

    await ReactTestRenderer.act(async () => {
      nameInput.props.onChangeText('Sam Goal');
      emailInput.props.onChangeText('sam@fc.test');
    });

    const submit = tree.root.findByProps({ testID: 'manual-player-submit' });
    await ReactTestRenderer.act(async () => {
      submit.props.onPress();
    });

    expect(JSON.stringify(tree.toJSON())).toContain('sam@fc.test');

    const confirm = tree.root.findByProps({
      testID: 'import-players-confirm',
    });
    await ReactTestRenderer.act(async () => {
      confirm.props.onPress();
    });

    expect(onConfirmNext).toHaveBeenCalledTimes(1);
    const roster = onConfirmNext.mock.calls[0][0];
    expect(roster).toHaveLength(1);
    expect(roster[0].name).toBe('Sam Goal');
    expect(roster[0].email).toBe('sam@fc.test');
  });

  it('imports selected contacts with email', async () => {
    const contacts = makeContactsDirectory([
      {
        id: 'c1',
        name: 'Pat Field',
        email: 'pat@fc.test',
        phone: null,
      },
    ]);
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = renderWithSafeArea(
        <TeamImportPlayersScreen
          team={team}
          contactsDirectory={contacts}
          onBack={jest.fn()}
        />,
      );
    });

    const syncTrigger = tree.root.findByProps({
      testID: 'import-contacts-trigger',
    });

    await ReactTestRenderer.act(async () => {
      await syncTrigger.props.onPress();
    });

    const row = tree.root.findByProps({ testID: 'contact-row-c1' });
    await ReactTestRenderer.act(async () => {
      row.props.onPress();
    });

    const importConfirm = tree.root.findByProps({
      testID: 'contacts-import-confirm',
    });
    await ReactTestRenderer.act(async () => {
      importConfirm.props.onPress();
    });

    expect(JSON.stringify(tree.toJSON())).toContain('pat@fc.test');
  });
});

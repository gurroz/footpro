/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { Team } from '../../../../domain/team';
import type { ImageLibraryPort } from '../../ports/ImageLibraryPort';
import { TeamConfigurationStep1Screen } from '../TeamConfigurationStep1Screen';

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

function makeImageLibrary(): ImageLibraryPort {
  return {
    pickImage: jest.fn(async () => null),
  };
}

describe('TeamConfigurationStep1Screen', () => {
  it('renders step copy and confirm control', async () => {
    const imageLibrary = makeImageLibrary();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = renderWithSafeArea(
        <TeamConfigurationStep1Screen
          imageLibrary={imageLibrary}
          onBack={jest.fn()}
        />,
      );
    });

    expect(JSON.stringify(tree.toJSON())).toContain('IDENTITY');
    expect(JSON.stringify(tree.toJSON())).toContain('STRUCTURE');

    const confirm = tree.root.findByProps({ testID: 'team-step1-confirm' });
    expect(confirm).toBeTruthy();
  });

  it('calls onConfirmNext with the edited team snapshot', async () => {
    const imageLibrary = makeImageLibrary();
    const onConfirmNext = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = renderWithSafeArea(
        <TeamConfigurationStep1Screen
          imageLibrary={imageLibrary}
          onBack={jest.fn()}
          onConfirmNext={onConfirmNext}
          initialTeam={{ name: 'City FC', id: 't-screen' }}
        />,
      );
    });

    const confirm = tree.root.findByProps({ testID: 'team-step1-confirm' });

    await ReactTestRenderer.act(async () => {
      confirm.props.onPress();
    });

    expect(onConfirmNext).toHaveBeenCalledTimes(1);
    const passed: Team = onConfirmNext.mock.calls[0][0];
    expect(passed.name).toBe('City FC');
    expect(passed.id).toBe('t-screen');
  });

  it('invokes imageLibrary when opening the logo picker', async () => {
    const pickImage = jest.fn(async () => null);
    const imageLibrary: ImageLibraryPort = { pickImage };
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = renderWithSafeArea(
        <TeamConfigurationStep1Screen
          imageLibrary={imageLibrary}
          onBack={jest.fn()}
        />,
      );
    });

    const logoTrigger = tree.root.findByProps({
      testID: 'team-step1-logo-trigger',
    });

    await ReactTestRenderer.act(async () => {
      logoTrigger.props.onPress();
    });

    expect(pickImage).toHaveBeenCalled();
  });
});

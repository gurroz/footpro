/* eslint-env jest */
const path = require('path');

require(path.join(
  __dirname,
  'node_modules/react-native-unistyles/lib/commonjs/mocks.js',
));
require('./src/shared/theme/unistyles');

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(async () => ({ didCancel: true })),
}));

jest.mock('react-native-contacts', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(async () => 'authorized'),
    getAllWithoutPhotos: jest.fn(async () => []),
    getAll: jest.fn(async () => []),
  },
}));

jest.mock(
  'react-native/Libraries/TurboModule/TurboModuleRegistry',
  () => {
    const actual = jest.requireActual(
      'react-native/Libraries/TurboModule/TurboModuleRegistry',
    );
    return {
      ...actual,
      get: jest.fn(name => {
        if (name === 'RCTContacts') {
          return {
            getAllWithoutPhotos: jest.fn(async () => []),
            getAll: jest.fn(async () => []),
            requestPermission: jest.fn(async () => 'authorized'),
          };
        }
        return actual.get(name);
      }),
    };
  },
);

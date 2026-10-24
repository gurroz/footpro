const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-linear-gradient') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/shims/LinearGradient.web.tsx'),
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

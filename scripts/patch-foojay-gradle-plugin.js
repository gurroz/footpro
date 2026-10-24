/**
 * @format
 * RN 0.85's @react-native/gradle-plugin pins foojay-resolver-convention 0.5.0, which
 * crashes on Gradle 9 (JvmVendorSpec.IBM_SEMERU removed). Gradle 9 compatibility
 * requires foojay 1.0.0+ (see github.com/gradle/foojay-toolchains/issues/151).
 * Parent settings.gradle resolutionStrategy does not apply to this included build.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native',
  'gradle-plugin',
  'settings.gradle.kts',
);

const needle =
  'plugins { id("org.gradle.toolchains.foojay-resolver-convention").version("0.5.0") }';
const replacement =
  'plugins { id("org.gradle.toolchains.foojay-resolver-convention").version("1.0.0") }';

try {
  let text = fs.readFileSync(target, 'utf8');
  if (text.includes(needle)) {
    text = text.replace(needle, replacement);
    fs.writeFileSync(target, text, 'utf8');
    process.stdout.write(
      'patch-foojay-gradle-plugin: upgraded foojay-resolver-convention to 1.0.0\n',
    );
  } else if (text.includes('version("1.0.0")') && text.includes('foojay-resolver-convention')) {
    // already patched
  } else {
    process.stderr.write(
      'patch-foojay-gradle-plugin: unexpected settings.gradle.kts — please check manually\n',
    );
  }
} catch (e) {
  if (e.code === 'ENOENT') {
    process.stderr.write(
      'patch-foojay-gradle-plugin: skip (node_modules not installed yet)\n',
    );
  } else {
    throw e;
  }
}

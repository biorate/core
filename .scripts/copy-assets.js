/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const [, , dir, pattern = '*.pug'] = process.argv;
if (!dir) {
  console.error('Usage: node copy-assets.js <dir> [pattern]');
  process.exit(1);
}
const cwd = process.cwd();
const srcDir = cwd;
const destDir = path.resolve(cwd, dir);
const files = fs
  .readdirSync(srcDir)
  .filter((file) => file.endsWith(pattern.replace('*', '')));
files.forEach((file) => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
});

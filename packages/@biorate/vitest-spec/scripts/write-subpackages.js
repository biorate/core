/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, json) {
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

function writeSubpackageType(subdir, type) {
  const targetDir = path.resolve(__dirname, '..', 'dist', subdir);
  ensureDir(targetDir);
  writeJson(path.join(targetDir, 'package.json'), { type });
}

writeSubpackageType('esm', 'module');
writeSubpackageType('cjs', 'commonjs');

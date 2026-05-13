/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const [, , dir, type] = process.argv;
if (!dir || !type) {
  console.error('Usage: node write-package-type.js <dir> <type>');
  process.exit(1);
}
const target = path.join(path.resolve(process.cwd(), dir), 'package.json');
fs.writeFileSync(target, JSON.stringify({ type }, null, '  '), 'utf8');

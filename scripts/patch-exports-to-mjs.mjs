import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const packagesRoot = path.join(repoRoot, 'packages', '@biorate');

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(p) {
  const raw = await fs.readFile(p, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(p, obj) {
  await fs.writeFile(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

async function main() {
  const entries = await fs.readdir(packagesRoot, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => path.join(packagesRoot, e.name));

  let updated = 0;
  for (const dir of dirs) {
    const pkgPath = path.join(dir, 'package.json');
    if (!(await fileExists(pkgPath))) continue;
    const pkg = await readJson(pkgPath);

    if (!isObject(pkg.exports) || !isObject(pkg.exports['.'])) continue;
    const exp = { ...pkg.exports['.'] };
    if (typeof exp.import === 'string') exp.import = exp.import.replace(/\.js$/, '.mjs');
    pkg.exports = { ...pkg.exports, '.': exp };

    const scripts = isObject(pkg.scripts) ? { ...pkg.scripts } : {};
    if (typeof scripts['build:esm'] === 'string' && !scripts['build:esm'].includes('rename-esm-to-mjs')) {
      scripts['build:esm'] = `${scripts['build:esm']} && node ../../../scripts/rename-esm-to-mjs.mjs`;
    }
    pkg.scripts = scripts;

    await writeJson(pkgPath, pkg);
    updated += 1;
  }

  console.log(`Patched ${updated} package.json files`);
}

await main();


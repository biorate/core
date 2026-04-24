import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const packagesRoot = path.join(repoRoot, 'packages', '@biorate');

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

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
  const raw = `${JSON.stringify(obj, null, 2)}\n`;
  await fs.writeFile(p, raw, 'utf8');
}

async function writeTextIfMissing(filePath, content) {
  if (await fileExists(filePath)) return false;
  await fs.writeFile(filePath, content, 'utf8');
  return true;
}

function ensureExports(pkgJson) {
  const typesPath = './dist/types/index.d.ts';
  const importPath = './dist/esm/index.js';
  const requirePath = './dist/cjs/index.js';

  const exportsField = pkgJson.exports;
  const nextExports = isObject(exportsField) ? { ...exportsField } : {};
  nextExports['.'] = {
    types: typesPath,
    import: importPath,
    require: requirePath,
  };
  return nextExports;
}

function ensureFiles(pkgJson) {
  const files = Array.isArray(pkgJson.files) ? pkgJson.files.slice() : [];
  if (!files.includes('dist')) files.push('dist');
  return files;
}

function ensureBuildScripts(pkgJson) {
  const scripts = isObject(pkgJson.scripts) ? { ...pkgJson.scripts } : {};
  scripts['build:cjs'] = 'npx tsc -p ./tsconfig.build.cjs.json';
  scripts['build:esm'] = 'npx tsc -p ./tsconfig.build.esm.json';
  scripts['build:types'] = 'npx tsc -p ./tsconfig.build.types.json';
  scripts.build = 'pnpm run build:cjs && pnpm run build:esm && pnpm run build:types';
  if (typeof scripts.prepublishOnly === 'string') {
    scripts.prepublishOnly = 'pnpm run build';
  }
  return scripts;
}

function buildTsconfig(baseTsconfigBuildPath, compilerOptions) {
  return {
    extends: baseTsconfigBuildPath,
    compilerOptions,
  };
}

async function migratePackage(pkgDir) {
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  const tsconfigBuildPath = path.join(pkgDir, 'tsconfig.build.json');

  if (!(await fileExists(pkgJsonPath))) return { changed: false, reason: 'no package.json' };
  if (!(await fileExists(tsconfigBuildPath))) return { changed: false, reason: 'no tsconfig.build.json' };

  const pkgJson = await readJson(pkgJsonPath);

  const nextPkg = { ...pkgJson };
  nextPkg.main = './dist/cjs/index.js';
  nextPkg.types = nextPkg.types ?? './dist/types/index.d.ts';
  nextPkg.exports = ensureExports(nextPkg);
  nextPkg.files = ensureFiles(nextPkg);
  nextPkg.scripts = ensureBuildScripts(nextPkg);

  await writeJson(pkgJsonPath, nextPkg);

  const created = [];
  if (await writeTextIfMissing(
    path.join(pkgDir, 'tsconfig.build.cjs.json'),
    `${JSON.stringify(buildTsconfig('./tsconfig.build.json', { outDir: './dist/cjs', module: 'commonjs' }), null, 2)}\n`,
  )) created.push('tsconfig.build.cjs.json');

  if (await writeTextIfMissing(
    path.join(pkgDir, 'tsconfig.build.esm.json'),
    `${JSON.stringify(buildTsconfig('./tsconfig.build.json', { outDir: './dist/esm', module: 'esnext' }), null, 2)}\n`,
  )) created.push('tsconfig.build.esm.json');

  if (await writeTextIfMissing(
    path.join(pkgDir, 'tsconfig.build.types.json'),
    `${JSON.stringify(buildTsconfig('./tsconfig.build.json', { outDir: './dist/types', declaration: true, emitDeclarationOnly: true, declarationMap: false }), null, 2)}\n`,
  )) created.push('tsconfig.build.types.json');

  return { changed: true, created };
}

async function main() {
  const entries = await fs.readdir(packagesRoot, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => path.join(packagesRoot, e.name));

  const results = [];
  for (const dir of dirs) {
    results.push({ dir, ...(await migratePackage(dir)) });
  }

  const changed = results.filter((r) => r.changed);
  const skipped = results.filter((r) => !r.changed);

  console.log(`Packages root: ${packagesRoot}`);
  console.log(`Changed: ${changed.length}, skipped: ${skipped.length}`);
  for (const r of skipped) console.log(`- skipped ${path.basename(r.dir)} (${r.reason})`);
}

await main();

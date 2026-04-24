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
  const raw = `${JSON.stringify(obj, null, 2)}\n`;
  await fs.writeFile(p, raw, 'utf8');
}

function buildTsconfig(extendsPath, compilerOptions) {
  return {
    extends: extendsPath,
    compilerOptions,
  };
}

async function main() {
  const entries = await fs.readdir(packagesRoot, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => path.join(packagesRoot, e.name));

  let updated = 0;
  for (const dir of dirs) {
    const buildBase = path.join(dir, 'tsconfig.build.json');
    if (!(await fileExists(buildBase))) continue;

    const cjsPath = path.join(dir, 'tsconfig.build.cjs.json');
    const esmPath = path.join(dir, 'tsconfig.build.esm.json');
    const typesPath = path.join(dir, 'tsconfig.build.types.json');

    await writeJson(
      cjsPath,
      buildTsconfig('./tsconfig.build.json', {
        outDir: './dist/cjs',
        module: 'commonjs',
        moduleResolution: 'node',
      }),
    );

    await writeJson(
      esmPath,
      buildTsconfig('./tsconfig.build.json', {
        outDir: './dist/esm',
        module: 'esnext',
        moduleResolution: 'node',
      }),
    );

    // Keep consistent resolution for declaration emit too.
    await writeJson(
      typesPath,
      buildTsconfig('./tsconfig.build.json', {
        outDir: './dist/types',
        declaration: true,
        emitDeclarationOnly: true,
        declarationMap: false,
        moduleResolution: 'node',
      }),
    );

    updated += 1;
  }

  console.log(`Updated tsconfigs in ${updated} packages`);
}

await main();


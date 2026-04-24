import fs from 'node:fs/promises';
import path from 'node:path';

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function replaceSourceMapUrl(jsContent, newMapName) {
  return jsContent.replace(
    /\/\/# sourceMappingURL=.*$/m,
    `//# sourceMappingURL=${newMapName}`,
  );
}

async function renameOne(jsPath) {
  const mjsPath = jsPath.replace(/\.js$/, '.mjs');

  // Update sourceMappingURL comment if map exists.
  const mapPath = `${jsPath}.map`;
  const mapExists = await fileExists(mapPath);
  if (mapExists) {
    const jsRaw = await fs.readFile(jsPath, 'utf8');
    const newMapName = path.basename(mjsPath) + '.map';
    const updated = replaceSourceMapUrl(jsRaw, newMapName);
    if (updated !== jsRaw) await fs.writeFile(jsPath, updated, 'utf8');
  }

  // Rename .js -> .mjs
  await fs.rename(jsPath, mjsPath);

  // Rename sourcemap and patch "file" field.
  if (mapExists) {
    const newMapPath = `${mjsPath}.map`;
    const mapRaw = await fs.readFile(mapPath, 'utf8');
    const mapJson = JSON.parse(mapRaw);
    mapJson.file = path.basename(mjsPath);
    await fs.writeFile(mapPath, `${JSON.stringify(mapJson)}\n`, 'utf8');
    await fs.rename(mapPath, newMapPath);
  }
}

async function main() {
  const esmDir = path.resolve(process.cwd(), 'dist', 'esm');
  if (!(await fileExists(esmDir))) return;

  const allFiles = await walk(esmDir);
  const jsFiles = allFiles.filter((f) => f.endsWith('.js'));
  // Rename deeper files before index.js to reduce chance of references during walk.
  jsFiles.sort((a, b) => b.length - a.length);

  for (const f of jsFiles) await renameOne(f);
}

await main();


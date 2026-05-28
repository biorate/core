import { existsSync, readFileSync } from 'fs';
import { dirname, isAbsolute, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { SnapshotFile } from './interfaces';
import { resolveSnapshotDir } from './env';

/** @description `__snapshots__` next to the module file (e.g. test `__mocks__/index.ts`). */
export function snapshotDirFromImportMeta(
  meta: ImportMeta,
  ...segments: string[]
): string {
  return join(dirname(fileURLToPath(meta.url)), ...segments);
}

/** @description Whether snapshot file exists and has at least one recorded call. */
export function isReplayableSnapshotFile(
  snapshotPath: string,
  className?: string,
): boolean {
  if (!existsSync(snapshotPath)) return false;
  try {
    const parsed = JSON.parse(readFileSync(snapshotPath, 'utf-8')) as SnapshotFile;
    if (parsed.version !== 1) return false;
    if (className && parsed.className !== className) return false;
    return Object.keys(parsed.calls ?? {}).length > 0;
  } catch {
    return false;
  }
}

/** @description Resolve `<base>/<dir>/<ClassName>.unimock.json`. */
export function resolveSnapshotFilePath(
  className: string,
  options?: { snapshot?: string; snapshotDir?: string; snapshotBaseDir?: string },
  globalSnapshotDir?: string,
): string {
  if (options?.snapshot) {
    return isAbsolute(options.snapshot)
      ? options.snapshot
      : resolve(options.snapshotBaseDir ?? process.cwd(), options.snapshot);
  }
  const dir = resolveSnapshotDir(options?.snapshotDir ?? globalSnapshotDir);
  const base = options?.snapshotBaseDir ?? process.cwd();
  return resolve(base, dir, `${className}.unimock.json`);
}

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const UNIMOCK_CONFIG_FILE_ENV = 'UNIMOCK_CONFIG_FILE';
const UNIMOCK_CONFIG_FILE_NAME = '.unimock.json';

/** @description Cached parsed config; `null` means "not yet loaded". */
let cachedConfig: Record<string, unknown> | null = null;

/**
 * @description Loads the `.unimock.json` file synchronously and validates it. When the
 *   config file path is set explicitly via `UNIMOCK_CONFIG_FILE` but the file is missing,
 *   or when it holds invalid JSON / a non-object root, a warning is logged and the config
 *   is treated as absent. A missing default path is silently accepted.
 */
function loadUnimockFileConfig(): Record<string, unknown> {
  const explicitPath = process.env[UNIMOCK_CONFIG_FILE_ENV];
  const configPath = explicitPath
    ? resolve(process.cwd(), explicitPath)
    : resolve(process.cwd(), UNIMOCK_CONFIG_FILE_NAME);

  if (!existsSync(configPath)) {
    if (explicitPath) {
      // eslint-disable-next-line no-console
      console.warn(`[unimock] config file "${configPath}" is missing; ignoring it`);
    }
    return {};
  }

  let raw: string;
  try {
    raw = readFileSync(configPath, 'utf-8');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[unimock] failed to read config file "${configPath}": ${(error as Error).message}`,
    );
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[unimock] invalid JSON in config file "${configPath}": ${
        (error as Error).message
      }`,
    );
    return {};
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[unimock] config file "${configPath}" must contain a JSON object; ignoring it`,
    );
    return {};
  }

  return parsed as Record<string, unknown>;
}

/**
 * @description Returns the parsed `.unimock.json` config, cached for the life of the process
 *   (an empty object when the file is absent or invalid). Call
 *   {@link resetUnimockFileConfigCache} between test cases to force a re-read.
 */
export function getUnimockFileConfig(): Record<string, unknown> {
  if (cachedConfig === null) cachedConfig = loadUnimockFileConfig();
  return cachedConfig;
}

/** @description Clears the cached file config so the next read re-loads from disk. */
export function resetUnimockFileConfigCache(): void {
  cachedConfig = null;
}

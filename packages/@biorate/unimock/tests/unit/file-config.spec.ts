import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  gzipEnabled,
  valuePoolEnabled,
  valuePoolThreshold,
  valuePoolCountLimit,
  parseUnimockMode,
  resolveSnapshotDir,
  stripRequestEnabled,
  skipProxyArgsEnabled,
  rowPoolEnabled,
  compactEnabled,
  fallbackOnMissEnabled,
} from '../../src/env';
import { MODE_OFF, MODE_RECORD, MODE_REPLAY, getSnapshotExt } from '../../src/constants';
import { resetUnimockFileConfigCache } from '../../src/file-config';

const tmpDir = mkdtempSync(join(tmpdir(), 'unimock-fileconfig-'));
const CONFIG_FILE = join(tmpDir, '.unimock.json');
const ABSENT = join(tmpDir, 'does-not-exist.json');

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

beforeEach(() => {
  resetUnimockFileConfigCache();
});

afterEach(() => {
  resetUnimockFileConfigCache();
  vi.restoreAllMocks();
});

/** Writes the given content to the fixture `.unimock.json` and returns its absolute path. */
const writeConfig = (content: string): string => {
  writeFileSync(CONFIG_FILE, content);
  return CONFIG_FILE;
};

/** Temporarily swaps env values (`undefined` deletes) and restores them afterwards. */
const withEnv = (values: Record<string, string | undefined>, fn: () => void): void => {
  const saved: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(values)) {
    saved[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

/** Sets the env under `fn`, resets the file-config cache, then runs `fn`. */
const activate = (env: Record<string, string | undefined>, fn: () => void): void => {
  withEnv(env, () => {
    resetUnimockFileConfigCache();
    fn();
  });
};

describe('.unimock.json file config', () => {
  it('valid file overrides env for gzip', () => {
    const file = writeConfig('{"gzip": true}');
    activate({ UNIMOCK_CONFIG_FILE: file }, () => {
      expect(gzipEnabled()).toBe(true);
    });
  });

  it('falls back to env when the file is absent', () => {
    activate({ UNIMOCK_CONFIG_FILE: ABSENT, UNIMOCK_GZIP: '1' }, () => {
      expect(gzipEnabled()).toBe(true);
    });
    activate({ UNIMOCK_CONFIG_FILE: ABSENT }, () => {
      expect(gzipEnabled()).toBe(false);
    });
  });

  it('falls back to defaults when both file and env are absent', () => {
    activate({ UNIMOCK_CONFIG_FILE: ABSENT }, () => {
      expect(valuePoolEnabled()).toBe(true);
      expect(valuePoolThreshold()).toBe(100_000);
      expect(valuePoolCountLimit()).toBe(2_000);
    });
  });

  it('warns on invalid JSON and falls back to env', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const file = writeConfig('{not valid json');
    activate({ UNIMOCK_CONFIG_FILE: file, UNIMOCK_GZIP: '1' }, () => {
      expect(gzipEnabled()).toBe(true);
    });
    expect(warn).toHaveBeenCalled();
  });

  it('per-key precedence: mode from file, gzip from env', () => {
    const file = writeConfig('{"mode": "record"}');
    activate({ UNIMOCK_CONFIG_FILE: file, UNIMOCK_GZIP: '1' }, () => {
      expect(parseUnimockMode()).toBe(MODE_RECORD);
      expect(gzipEnabled()).toBe(true);
    });
  });

  it('parses mode strings (off/record/replay) from the file', () => {
    const cases: ReadonlyArray<[string, string]> = [
      ['off', MODE_OFF],
      ['record', MODE_RECORD],
      ['replay', MODE_REPLAY],
    ];
    for (const [mode, expected] of cases) {
      const file = writeConfig(`{"mode": "${mode}"}`);
      activate({ UNIMOCK_CONFIG_FILE: file }, () => {
        expect(parseUnimockMode()).toBe(expected);
      });
    }
  });

  it('warns on an explicit config file that is missing and falls back to env', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    activate({ UNIMOCK_CONFIG_FILE: ABSENT, UNIMOCK_GZIP: '1' }, () => {
      expect(gzipEnabled()).toBe(true);
    });
    expect(warn).toHaveBeenCalled();
  });

  it('reads snapshotExt from the file config', () => {
    const file = writeConfig('{"snapshotExt": ".json"}');
    activate({ UNIMOCK_CONFIG_FILE: file }, () => {
      expect(getSnapshotExt()).toBe('.json');
    });
  });

  it('resolves snapshotExt from SNAPSHOT_EXT when the file is absent', () => {
    activate({ UNIMOCK_CONFIG_FILE: ABSENT, SNAPSHOT_EXT: '.envx' }, () => {
      expect(getSnapshotExt()).toBe('.envx');
    });
  });

  it('defaults snapshotExt to .snap', () => {
    activate({ UNIMOCK_CONFIG_FILE: ABSENT }, () => {
      expect(getSnapshotExt()).toBe('.snap');
    });
  });

  it('file `false` overrides env-on for gzip', () => {
    const file = writeConfig('{"gzip": false}');
    activate({ UNIMOCK_CONFIG_FILE: file, UNIMOCK_GZIP: '1' }, () => {
      expect(gzipEnabled()).toBe(false);
    });
  });

  it('reads numeric values from the file; zero falls through to env', () => {
    const file = writeConfig('{"valuePoolThreshold": 500, "valuePoolCountLimit": 50}');
    activate({ UNIMOCK_CONFIG_FILE: file }, () => {
      expect(valuePoolThreshold()).toBe(500);
      expect(valuePoolCountLimit()).toBe(50);
    });
    const zeroFile = writeConfig('{"valuePoolThreshold": 0}');
    activate(
      { UNIMOCK_CONFIG_FILE: zeroFile, UNIMOCK_VALUE_POOL_THRESHOLD: '777' },
      () => {
        expect(valuePoolThreshold()).toBe(777);
      },
    );
  });

  it('maps remaining file keys to their getters', () => {
    const file = writeConfig(
      '{"snapshotDir": "custom-dir", "valuePool": false, "stripRequest": true, "skipProxyArgs": true, "rowPool": true, "compact": true, "fallbackOnMiss": true}',
    );
    activate({ UNIMOCK_CONFIG_FILE: file }, () => {
      expect(resolveSnapshotDir()).toBe('custom-dir');
      expect(valuePoolEnabled()).toBe(false);
      expect(stripRequestEnabled()).toBe(true);
      expect(skipProxyArgsEnabled()).toBe(true);
      expect(rowPoolEnabled()).toBe(true);
      expect(compactEnabled()).toBe(true);
      expect(fallbackOnMissEnabled()).toBe(true);
    });
  });

  it('treats wrong-typed keys as absent and falls back to env', () => {
    const file = writeConfig('{"gzip": "yes"}');
    activate({ UNIMOCK_CONFIG_FILE: file }, () => {
      expect(gzipEnabled()).toBe(false);
    });
    activate({ UNIMOCK_CONFIG_FILE: file, UNIMOCK_GZIP: '1' }, () => {
      expect(gzipEnabled()).toBe(true);
    });
  });

  it('warns on a non-object JSON root and falls back to env', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const file = writeConfig('[1,2,3]');
    activate({ UNIMOCK_CONFIG_FILE: file, UNIMOCK_GZIP: '1' }, () => {
      expect(gzipEnabled()).toBe(true);
    });
    expect(warn).toHaveBeenCalled();
  });

  it('is silent when the default config path is absent', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalCwd = process.cwd();
    const freshDir = mkdtempSync(join(tmpDir, 'unimock-cwd-'));
    withEnv({ UNIMOCK_CONFIG_FILE: undefined }, () => {
      try {
        process.chdir(freshDir);
        expect(gzipEnabled()).toBe(false);
        expect(warn).not.toHaveBeenCalled();
      } finally {
        process.chdir(originalCwd);
        rmSync(freshDir, { recursive: true, force: true });
      }
    });
  });
});

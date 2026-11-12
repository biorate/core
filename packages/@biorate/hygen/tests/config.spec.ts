import { vi } from 'vitest';
import path from 'path';
import { configLookup, ConfigResolver, reversePathsToWalk } from '../src/config';

const { sep } = path;
describe(`config lookup with separator '${sep}'`, () => {
  if (process.platform !== 'win32') {
    it('sanitizes bad "from" path', () => {
      const p = configLookup('.myconfig', 'foo').find((f) => f.match(/foo\/\.myconfig/));
      expect(p).toBeDefined();
    });

    it('looks up configuration upwards', () => {
      expect(configLookup('.myconfig', '/')).toEqual(['/.myconfig']);
      expect(configLookup('.myconfig', '/one')).toEqual(['/one/.myconfig', '/.myconfig']);
      expect(configLookup('.myconfig', '/one/one/one')).toEqual([
        '/one/one/one/.myconfig',
        '/one/one/.myconfig',
        '/one/.myconfig',
        '/.myconfig',
      ]);
      expect(configLookup('.myconfig', '/users/foo/bar/baz')).toEqual([
        '/users/foo/bar/baz/.myconfig',
        '/users/foo/bar/.myconfig',
        '/users/foo/.myconfig',
        '/users/.myconfig',
        '/.myconfig',
      ]);
    });
  }
  it('looks up windows folders', () => {
    expect(configLookup('.myconfig', 'C:\\foo\\bar\\baz', path.win32)).toEqual([
      'C:\\foo\\bar\\baz\\.myconfig',
      'C:\\foo\\bar\\.myconfig',
      'C:\\foo\\.myconfig',
      'C:\\.myconfig',
    ]);
    expect(configLookup('.myconfig', 'C:\\', path.win32)).toEqual(['C:\\.myconfig']);
  });
});

describe('resolver', () => {
  it('resolves closest file', async () => {
    const exists = vi.fn();
    exists.mockReturnValue(Promise.resolve(true));

    const load = vi.fn();
    load.mockReturnValue(Promise.resolve({ param: 1 }));

    const resolver = new ConfigResolver(['.hygen.js'], {
      none: (_) => ({}),
      exists,
      load,
    });
    const config = await resolver.resolve(path.join('foo', 'bar'));

    expect(config).toEqual({ param: 1 });
  });

  it('resolves a file in the walk path', async () => {
    const exists = vi.fn((f) => {
      console.log('f', f);

      return Promise.resolve(f.includes(path.join('foo', '.hygen.js')));
    });

    const load = vi.fn();
    load.mockReturnValue(Promise.resolve({ param: 1 }));

    const resolver = new ConfigResolver(['.hygen.js'], {
      none: (_) => ({}),
      exists,
      load,
    });
    const config = await resolver.resolve(path.join('foo', 'bar'));

    expect(config).toEqual({ param: 1 });
  });
});

describe('config-file family resolution', () => {
  const files = ['.hygen.js', '.hygen.cjs', '.hygen.mjs', '.hygen.ts'];

  it('prefers the first candidate by priority within a directory', async () => {
    const exists = vi.fn((f: string) =>
      Promise.resolve(files.some((file) => f.endsWith(file))),
    );
    const load = vi.fn();
    load.mockReturnValue(Promise.resolve({ priority: 1 }));

    const resolver = new ConfigResolver(files, { none: (_) => ({}), exists, load });
    const config = await resolver.resolve(path.join('project', 'sub'));

    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(
      path.join(path.resolve('project', 'sub'), '.hygen.js'),
    );
    expect(config).toEqual({ priority: 1 });
  });

  it('nearest directory wins for a lower-priority candidate', async () => {
    const near = path.resolve('project', 'sub', '.hygen.cjs'); // lower priority, nearer
    const up = path.resolve('project', '.hygen.js'); // higher priority, farther
    const exists = vi.fn((f: string) => Promise.resolve(f === near || f === up));
    const load = vi.fn();
    load.mockReturnValue(Promise.resolve({ from: 'near' }));

    const resolver = new ConfigResolver(files, { none: (_) => ({}), exists, load });
    const config = await resolver.resolve(path.join('project', 'sub'));

    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(near);
    expect(config).toEqual({ from: 'near' });
  });

  it('returns the fallback when no config exists anywhere', async () => {
    const exists = vi.fn(() => Promise.resolve(false));
    const none = vi.fn((f: string) => ({ fallback: f }));
    const load = vi.fn();

    const resolver = new ConfigResolver(files, { none, exists, load });
    const from = path.join('project', 'sub');
    const config = await resolver.resolve(from);

    expect(none).toHaveBeenCalledTimes(1);
    expect(config).toEqual({ fallback: from });
  });

  it('routes the .ts candidate to load', async () => {
    const tsPath = path.resolve('project', '.hygen.ts');
    const exists = vi.fn((f: string) => Promise.resolve(f === tsPath));
    const load = vi.fn();
    load.mockReturnValue(Promise.resolve({ from: 'ts' }));

    const resolver = new ConfigResolver(files, { none: (_) => ({}), exists, load });
    const config = await resolver.resolve(path.join('project', 'sub'));

    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(tsPath);
    expect(config).toEqual({ from: 'ts' });
  });

  it('keeps single .hygen.js resolution unchanged (backward compatible)', async () => {
    const jsPath = path.resolve('project', '.hygen.js');
    const exists = vi.fn((f: string) => Promise.resolve(f === jsPath));
    const load = vi.fn();
    load.mockReturnValue(Promise.resolve({ legacy: true }));

    const resolver = new ConfigResolver(files, { none: (_) => ({}), exists, load });
    const config = await resolver.resolve(path.join('project', 'sub'));

    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(jsPath);
    expect(config).toEqual({ legacy: true });
  });
});

describe('reversePathsToWalk({folder, path})', () => {
  it('should return an array of paths', () => {
    const folder = '/where/the/code/lives';
    const result = reversePathsToWalk({ folder, path });
    expect(result.length).toEqual(5);
    expect(result[2]).toContain(path.join('where', 'the'));
  });
});

import path from 'path';
import Logger from '../src/logger';
import params from '../src/params';
import { isVersionFlag } from '../src/help';
import { CliArgumentError, TemplateNotFoundError } from '../src/errors';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'templates', ...segments);

const testConfig = (templates: string) => ({
  templates,
  exec: () => undefined,
  cwd: process.cwd(),
  logger: new Logger(console.log), // eslint-disable-line no-console
  createPrompter: () => require('enquirer'),
});

describe('params', () => {
  process.env.HYGEN_TS = '1337';
  beforeEach(() => {
    delete process.env.HYGEN_TMPLS;
  });
  it('dont take template folder in template', async () => {
    const args = await params(
      testConfig(fixture('template-folder-in-templates', '_templates')),
      ['dont-take-this', 'foo', 'bar', 'baz'],
    );
    expect(args).toEqual({
      _: ['dont-take-this', 'foo', 'bar', 'baz'],
      actions: ['foo'],
      names: ['bar'],
      cleanArgv: {},
      generator: 'dont-take-this',
      templates: fixture('template-folder-in-templates', '_templates'),
      ts: '1337',
    });
  });

  it('env var overrides local templates but still take explicitly given templates', async () => {
    process.env.HYGEN_TMPLS = fixture('templates-override', 'tmpls');
    const args = await params(testConfig(fixture('templates-override', '_templates')), [
      'dont-take-this',
      'foo',
      'bar',
      'baz',
    ]);
    expect(args).toEqual({
      _: ['dont-take-this', 'foo', 'bar', 'baz'],
      actions: ['foo'],
      names: ['bar'],
      cleanArgv: {},
      generator: 'dont-take-this',
      templates: fixture('templates-override', '_templates'),
      ts: '1337',
    });
  });

  // Upstream bug #450 fixed: `--version`/`-v` is parsed in bin.ts before runner() and
  // exits 0 without generator resolution, so params() never sees the flag. The detection
  // lives in help.ts alongside VERSION and is unit-tested here.
  it('detects the --version flag (bug #450)', () => {
    expect(isVersionFlag(['--version'])).toBe(true);
  });

  it('detects the -v flag (bug #450)', () => {
    expect(isVersionFlag(['-v'])).toBe(true);
  });

  it('does not treat ordinary args as a version flag (bug #450)', () => {
    expect(isVersionFlag(['sink', 'new', '--name', 'Foo'])).toBe(false);
    expect(isVersionFlag([])).toBe(false);
  });
});

describe('params: positional lists (1.1)', () => {
  process.env.HYGEN_TS = '1337';
  const listsFixture = fixture('lists', '_templates');

  it('splits the action and name positionals on comma into arrays', async () => {
    const args = await params(testConfig(listsFixture), [
      'gen',
      'model,controller',
      'a,b',
    ]);
    expect(args.actions).toEqual(['model', 'controller']);
    expect(args.names).toEqual(['a', 'b']);
  });

  it('preserves the bare variant: a comma positional with no matching folder is names', async () => {
    // no gen/a,b directory and no gen/a or gen/b actions → names for the _default action
    const args = await params(testConfig(listsFixture), ['gen', 'a,b']);
    expect(args.actions).toEqual(['_default']);
    expect(args.names).toEqual(['a', 'b']);
  });

  it('names the specific missing element for an action list', async () => {
    await expect(params(testConfig(listsFixture), ['gen', 'model,bad'])).rejects.toThrow(
      TemplateNotFoundError,
    );
    await expect(params(testConfig(listsFixture), ['gen', 'model,bad'])).rejects.toThrow(
      /bad/,
    );
  });

  it('rejects a repeated --name flag, pointing at the positional list', async () => {
    await expect(
      params(testConfig(listsFixture), ['gen', 'new', '--name', 'a', '--name', 'b']),
    ).rejects.toThrow(CliArgumentError);
    await expect(
      params(testConfig(listsFixture), ['gen', 'new', '--name', 'a', '--name', 'b']),
    ).rejects.toThrow(/comma-separated positional name list/);
  });

  it('passes a single-element action/name through untouched', async () => {
    const args = await params(testConfig(listsFixture), ['gen', 'new', 'myname']);
    expect(args.actions).toEqual(['new']);
    expect(args.names).toEqual(['myname']);
  });
});

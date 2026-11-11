import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'kitchen-sink');
const templatesSrc = path.join(fixtureRoot, '_templates');

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  // config-resolver falls back to <cwd>/_templates once the fixture is copied there
  templates: undefined,
  logger: new Logger(console.log), // eslint-disable-line no-console
  debug: false,
  exec: (sh, body) =>
    execa.command(sh, {
      shell: true,
      cwd,
      ...(body ? { input: body } : {}),
    }),
  createPrompter: () => require('enquirer'),
});

describe('kitchen-sink runner', () => {
  let dir: string;
  let config: RunnerConfig;

  // `--expr` carries markup characters; `--author` makes prompt.js return early so
  // enquirer never prompts in the TTY-less test runner.
  const argv = [
    'sink',
    'new',
    '--name',
    'HelloWorld',
    '--expr',
    'a > b && c < d',
    '--author',
    'llevkin',
  ];

  beforeAll(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-sink-'));
    await fs.copy(templatesSrc, path.join(dir, '_templates'));

    // Injection targets must pre-exist; created here, never into the repository.
    await fs.ensureDir(path.join(dir, 'sink'));
    await fs.writeFile(
      path.join(dir, 'sink', 'package.json'),
      `{\n  "name": "sink",\n  "main": "index.js"\n}\n`,
    );
    await fs.writeFile(
      path.join(dir, 'sink', 'config.js'),
      `// config\nmodule.exports = {};\n`,
    );
    // 08-inject-skip-not needs the skip_if text present so the inverted guard runs.
    await fs.writeFile(
      path.join(dir, 'sink', 'skip-not.js'),
      `// guard\ncustom-feature = true;\n`,
    );

    config = makeConfig(dir);
    const result = await runner(argv, config);
    expect(result.success).toBe(true);
  });

  it('01-add renders `to` with case helpers and creates a nested folder', async () => {
    const target = path.join(dir, 'sink', 'hello-world.js');
    expect(await fs.pathExists(target)).toBe(true);
    const content = (await fs.readFile(target)).toString();
    expect(content).toContain('HelloWorld');
    expect(content).toContain('llevkin');
  });

  // Fixes upstream bug #387: ejs.render no longer HTML-escapes `<%= %>` values,
  // so source-code output is verbatim (`>`→`>`, `&`→`&`, `<`→`<`).
  it('02-escape renders the expression verbatim (bug #387 fixed)', async () => {
    const content = (await fs.readFile(path.join(dir, 'sink', 'escape.js'))).toString();
    expect(content).toContain('const cmp = a > b && c < d;');
    expect(content).not.toContain('&gt;');
    expect(content).not.toContain('&amp;');
    expect(content).not.toContain('&lt;');
  });

  it('03-inject inserts the body after the anchor with eof_last', async () => {
    const content = (
      await fs.readFile(path.join(dir, 'sink', 'package.json'))
    ).toString();
    expect(content).toContain('"custom": "node custom.js"');
  });

  it('04-inject-skip is idempotent across a second runner() run', async () => {
    const target = path.join(dir, 'sink', 'config.js');
    const before = (await fs.readFile(target)).toString();
    expect(before).toContain('custom-feature = true;');

    // On the second run the `add` ops (01/02) would prompt for overwrite; force them so
    // the skip_if probe stays non-interactive.
    process.env.HYGEN_OVERWRITE = '1';
    try {
      await runner(argv, config);
    } finally {
      delete process.env.HYGEN_OVERWRITE;
    }

    const after = (await fs.readFile(target)).toString();
    expect(after).toBe(before);
  });

  it('05-shell runs a local node -e command writing a marker', async () => {
    const marker = path.join(dir, 'sink', 'shell-marker.txt');
    expect(await fs.pathExists(marker)).toBe(true);
    expect((await fs.readFile(marker)).toString()).toBe('done');
  });

  it('06-inject-create creates a missing target with the body (create_if_missing)', async () => {
    const target = path.join(dir, 'sink', 'new-file.txt');
    expect(await fs.pathExists(target)).toBe(true);
    expect((await fs.readFile(target)).toString()).toContain(
      'create-missing-marker = true;',
    );
  });

  it('07-replace replaces the first anchor match with the body (replace)', async () => {
    const target = path.join(dir, 'sink', 'package.json');
    expect((await fs.readFile(target)).toString()).toContain('"replace-marker": "ok"');
  });

  it('08-inject-skip-not inverts skip_if (runs when the text is present)', async () => {
    const target = path.join(dir, 'sink', 'skip-not.js');
    expect((await fs.readFile(target)).toString()).toContain(
      'custom-feature-inverted = true;',
    );
  });
});

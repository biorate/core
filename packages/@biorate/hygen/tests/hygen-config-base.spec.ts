import { describe, expect, it, vi } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import execa from 'execa';
import { HygenConfig, resolve, runner } from '../src';
import Logger from '../src/logger';
import type { HookContext, ProjectConfig, RunnerConfig } from '../src/types';

describe('HygenConfig base class', () => {
  it('constructor initializes neutral defaults', () => {
    class Config extends HygenConfig {}
    const cfg = new Config();
    expect(cfg.templates).toBeUndefined();
    expect(cfg.localsDefaults).toBeUndefined();
    expect(cfg.helpers).toBeUndefined();
    expect(cfg.argCase).toBe('keep');
  });

  it('toRunnerConfig omits non-overridden hooks and binds overridden ones', () => {
    class Config extends HygenConfig {
      count = 0;
      beforeEach(ctx: HookContext) {
        this.count += 1;
        ctx.logger.log(`pair #${this.count}`);
      }
    }
    const cfg = new Config();
    const resolved = cfg.toRunnerConfig();
    const hooks = resolved.hooks as ProjectHooks;
    expect(hooks.beforeAll).toBeUndefined();
    expect(hooks.beforeEach).toBeInstanceOf(Function);
    expect(hooks.afterEach).toBeUndefined();
    expect(hooks.afterAll).toBeUndefined();
    // `this` binding: the hook mutates instance state.
    const logger = { log: vi.fn() };
    (hooks.beforeEach as (ctx: unknown) => unknown)({ logger });
    (hooks.beforeEach as (ctx: unknown) => unknown)({ logger });
    expect(cfg.count).toBe(2);
    expect(logger.log).toHaveBeenNthCalledWith(1, 'pair #1');
    expect(logger.log).toHaveBeenNthCalledWith(2, 'pair #2');
  });

  it('helpers forms: property, getter and factory method all produce a map', () => {
    class PropertyForm extends HygenConfig {
      helpers = { fromProp: (s: unknown) => `prop:${s}` };
    }
    class GetterForm extends HygenConfig {
      get helpers() {
        return { fromGetter: (s: unknown) => `getter:${s}` };
      }
    }
    class MethodForm extends HygenConfig {
      // Factory method: reads instance state through `this`.
      suffix = 'method';
      helpers() {
        return { fromMethod: (s: unknown) => `${this.suffix}:${s}` };
      }
    }
    expect(
      (new PropertyForm().toRunnerConfig().helpers as Record<string, unknown>).fromProp,
    ).toBeDefined();
    expect(
      (new GetterForm().toRunnerConfig().helpers as Record<string, unknown>).fromGetter,
    ).toBeDefined();
    // The method form IS the factory form: toRunnerConfig hands over the
    // bound factory; the runner invokes it per render with (locals, config).
    const factory = new MethodForm().toRunnerConfig().helpers as (
      locals: Record<string, unknown>,
      config: unknown,
    ) => Record<string, (s: unknown) => string>;
    expect(factory({}, {}).fromMethod('x')).toBe('method:x');
  });

  it('extra internal state fields leak nothing into the config', () => {
    class Config extends HygenConfig {
      internalState = 'secret';
    }
    const resolved = new Config().toRunnerConfig() as Record<string, unknown>;
    expect(resolved).toEqual({ argCase: 'keep' });
    expect(resolved.internalState).toBeUndefined();
  });
});

describe('base-class project config end-to-end', () => {
  const runInTemp = async (
    configBody: string,
    args: string[],
    templatesDir = '_templates',
    renderBody?: string,
  ) => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-config-base-'));
    await fs.copy(
      path.join(__dirname, 'fixtures', 'config-class', '_templates'),
      path.join(dir, templatesDir),
    );
    if (renderBody) {
      await fs.writeFile(
        path.join(dir, templatesDir, 'klass', 'new', '01-render.ejs.t'),
        renderBody,
      );
    }
    await fs.writeFile(path.join(dir, '.hygen.ts'), configBody);
    const logs: string[] = [];
    const config: RunnerConfig = {
      cwd: dir,
      templates: undefined,
      logger: new Logger((msg) => logs.push(msg)),
      debug: false,
      exec: (sh, body) =>
        execa.command(sh, {
          shell: true,
          cwd: dir,
          ...(body ? { input: body } : {}),
        }),
      createPrompter: () => require('enquirer'),
    };
    const result = await runner(args, config);
    return { dir, logs, result };
  };

  it('resolves a HygenConfig subclass: prototype hooks with live this, helpers factory method', async () => {
    const { dir, logs, result } = await runInTemp(
      `import { HygenConfig } from '${path
        .join(__dirname, '..', 'src')
        .replace(/\\/g, '/')}';
export default class Config extends HygenConfig {
  seen: string[] = [];
  helpers(locals: Record<string, unknown>) {
    return { fromClass: (s: string) => \`base:\${s}:\${this.seen.length}\` };
  }
  beforeAll(ctx: { logger: { log: (m: string) => void } }) {
    ctx.logger.log('BASE_BEFORE_ALL');
  }
  beforeEach(ctx: { args: Record<string, unknown> }) {
    this.seen.push(String(ctx.args.name));
  }
}
`,
      ['klass', 'new', 'value'],
    );
    expect(result.success).toBe(true);
    const content = (await fs.readFile(path.join(dir, 'klass', 'result.txt'))).toString();
    // Helpers factory method with live `this`: `seen` was filled by beforeEach.
    expect(content).toContain('base:value:1');
    expect(logs.join('\n')).toContain('BASE_BEFORE_ALL');
    // No unknown-property warnings for base-class instances.
    expect(logs.join('\n')).not.toContain('unknown project config property');
  });

  it('legacy class config keeps own-props resolution with unknown-key warning', async () => {
    const { logs, result } = await runInTemp(
      `class Config {
  helpers = { fromClass: (s: string) => \`legacy:\${s}\` };
  bogus = 1;
}
export default Config;
`,
      ['klass', 'new', 'value'],
    );
    expect(result.success).toBe(true);
    expect(logs.join('\n')).toContain("unknown project config property 'bogus'");
  });

  it('fires the full hook lifecycle in order and passes action results to afterEach/afterAll', async () => {
    const { dir, logs, result } = await runInTemp(
      `import { HygenConfig } from '${path
        .join(__dirname, '..', 'src')
        .replace(/\\\\/g, '/')}';
export default class Config extends HygenConfig {
  helpers() {
    return { fromClass: (s: string) => \`ok:\${s}\` };
  }
  beforeAll(ctx: { logger: { log: (m: string) => void } }) {
    ctx.logger.log('H:beforeAll');
  }
  beforeEach(ctx: { logger: { log: (m: string) => void } }) {
    ctx.logger.log('H:beforeEach');
  }
  afterEach(ctx: { logger: { log: (m: string) => void } }, results: unknown[]) {
    ctx.logger.log(\`H:afterEach:\${results.length}\`);
  }
  afterAll(ctx: { logger: { log: (m: string) => void } }, results: unknown[]) {
    ctx.logger.log(\`H:afterAll:\${results.length}\`);
  }
}
`,
      ['klass', 'new', 'value'],
    );
    expect(result.success).toBe(true);
    const joined = logs.join('\n');
    const order = ['H:beforeAll', 'H:beforeEach', 'H:afterEach:', 'H:afterAll:'].map(
      (m) => joined.indexOf(m),
    );
    order.forEach((i) => expect(i).toBeGreaterThanOrEqual(0));
    expect([...order]).toEqual([...order].sort((a, b) => a - b));
    // afterEach/afterAll receive the pair's action results.
    expect(joined).toMatch(/H:afterEach:[1-9]/);
    expect(joined).toMatch(/H:afterAll:[1-9]/);
    // helpers from the factory method render in the template.
    const content = (await fs.readFile(path.join(dir, 'klass', 'result.txt'))).toString();
    expect(content).toContain('ok:value');
  });

  it('honors the templates field and merges localsDefaults into the render', async () => {
    const { dir, result } = await runInTemp(
      `import { HygenConfig } from '${path
        .join(__dirname, '..', 'src')
        .replace(/\\\\/g, '/')}';
export default class Config extends HygenConfig {
  constructor() {
    super();
    this.templates = '_tpl';
    this.localsDefaults = { greeting: 'from-defaults' };
  }
}
`,
      ['klass', 'new', 'value'],
      '_tpl',
      // Replace the fixture template (it needs a helper) with one that renders
      // the localsDefaults-provided local directly.
      `---
to: klass/result.txt
---
<%= greeting %>
`,
    );
    expect(result.success).toBe(true);
    const content = (await fs.readFile(path.join(dir, 'klass', 'result.txt'))).toString();
    expect(content).toContain('from-defaults');
  });
});

// Type-level: the exported class is abstract and satisfies ProjectConfig keys.
type _BaseIsAbstract = InstanceType<typeof HygenConfig> extends ProjectConfig
  ? true
  : never;

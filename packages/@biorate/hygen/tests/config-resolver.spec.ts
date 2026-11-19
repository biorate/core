import { vi } from 'vitest';
import path from 'path';
import templateResolver, { normalizeProjectConfig } from '../src/config-resolver';
import Logger from '../src/logger';

const tsNodeState = vi.hoisted(() => ({ registered: false }));

// Mock the lazily-registered ts-node so a `.hygen.ts` config can be resolved
// without real ts-node; the flag proves the registration code path is reached.
vi.mock('ts-node/register/transpile-only', () => {
  tsNodeState.registered = true;
  return {};
});

const fixture = (dir: string) => path.join(__dirname, 'fixtures/templates', dir);
const templateParams = ({
  cwd,
  templates,
  templatesOverride,
}: {
  cwd: string;
  templates: string;
  templatesOverride?: string | undefined;
}) => {
  return {
    cwd,
    templates,
    templatesOverride,
    exec: () => {},
    logger: new Logger(console.log), // eslint-disable-line no-console
    debug: false,
    helpers: {},
    createPrompter: () => require('enquirer'),
  };
};
describe('resolve', () => {
  it('template overrides takes over all', async () => {
    expect(
      (
        await templateResolver(
          templateParams({
            cwd: '/1',
            templates: fixture('app'),
            templatesOverride: fixture('app-custom/other-templates'),
          }),
        )
      ).templates,
    ).toEqual(fixture('app-custom/other-templates'));
  });

  it('templates explicitly given via config, so take it if it exists', async () => {
    expect(
      (
        await templateResolver(
          templateParams({
            cwd: '/1',
            templates: fixture('app-custom/other-templates'),
          }),
        )
      ).templates,
    ).toEqual(fixture('app-custom/other-templates'));
  });

  it('when templates exist', async () => {
    expect(
      (await templateResolver(templateParams({ cwd: fixture('app'), templates: '2' })))
        .templates,
    ).toEqual(fixture('/app/_templates'));
  });

  it('take other_templates if explicitly given', async () => {
    process.env.HYGEN_TMPLS = fixture('app-custom/other-templates');
    expect(
      (
        await templateResolver(
          templateParams({ cwd: fixture('app-custom'), templates: '2' }),
        )
      ).templates,
    ).toEqual(fixture('app-custom/other-templates'));
    process.env.HYGEN_TMPLS = undefined;
  });

  it('resolves a .hygen.ts config and registers ts-node on the fly', async () => {
    const result = await templateResolver(
      templateParams({
        cwd: path.join(__dirname, 'fixtures/config-ts'),
        templates: '2',
      }),
    );
    expect(tsNodeState.registered).toBe(true);
    expect(result.templates).toBe('from-ts');
  });
});

describe('project config export normalization', () => {
  const logger = { warn: vi.fn() } as unknown as Logger;
  const file = path.join('project', '.hygen.ts');
  const normalize = (mod: Record<string, unknown>) =>
    normalizeProjectConfig(mod, file, logger);

  beforeEach(() => vi.clearAllMocks());

  it('prefers named exports over a default export', () => {
    expect(
      normalize({ default: { templates: 'from-default' }, templates: 'named' }),
    ).toEqual({ templates: 'named' });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('resolves a default-exported plain object as-is', () => {
    const cfg = { templates: 'from-default', hooks: {} };
    expect(normalize({ default: cfg })).toEqual(cfg);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('resolves a default-exported class to the instance own enumerable properties', () => {
    class Config {
      templates = 'from-class';
      helpers = { up: (s: string) => s.toUpperCase() };
      method() {
        return 'not-a-helper';
      }
      get protoGetter() {
        return 'not-read';
      }
    }
    const cfg = normalize({ default: Config });
    expect(cfg).toEqual({
      templates: 'from-class',
      helpers: { up: expect.any(Function) },
    });
    expect(cfg.helpers).not.toHaveProperty('protoGetter');
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('warns and ignores unknown own properties on a class-resolved config', () => {
    class Config {
      templates = 'from-class';
      bogus = 1;
    }
    expect(normalize({ default: Config })).toEqual({ templates: 'from-class' });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("unknown project config property 'bogus'"),
    );
  });

  it('throws the standardized error when the class cannot be instantiated', () => {
    class Config {
      constructor(required: string) {
        if (!required) throw new Error('required');
      }
    }
    expect(() => normalize({ default: Config })).toThrow(/could not be instantiated/);
  });

  it('warns and ignores unsupported default export types', () => {
    expect(normalize({ default: 'nope' })).toEqual({});
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('unsupported default export'),
    );
  });
});

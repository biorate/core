import { vi } from 'vitest';
import path from 'path';
import templateResolver from '../src/config-resolver';
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

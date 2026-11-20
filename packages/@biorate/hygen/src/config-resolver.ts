import path from 'path';
import fs from 'fs-extra';
import type { Logger, RunnerConfig } from './types';
import { ConfigResolver } from './config';
import { ConfigClassError, ConfigTsNodeError } from './errors';
import registerTsNode from './ts-node-register';
import { validateParamsSchema } from './prompt';
import { CONFIG_FILES } from './constants';

let resolvedConfigFile: string | undefined;

const configResolver = new ConfigResolver(CONFIG_FILES, {
  exists: (f) => fs.pathExists(f),
  load: async (f) => {
    // Lazily register ts-node so `.hygen.ts` configs transpile on the fly — the same
    // pattern as prompt hook files, keeping zero startup cost for non-TS configs.
    await registerTsNode(f, ConfigTsNodeError);
    resolvedConfigFile = f;
    return await import(f);
  },
  none: (_) => ({}),
});

/**
 * @description Keys a project configuration file may declare (the `ProjectConfig`
 * shape). Own enumerable properties outside this set on a class-resolved config
 * are ignored with a warning. */
const PROJECT_CONFIG_KEYS = ['templates', 'argCase', 'helpers', 'hooks', 'params'];

/**
 * @description Module keys produced by TypeScript/CJS interop that carry no
 * configuration meaning and must not be mistaken for named exports. */
const INTEROP_KEYS = ['__esModule'];

/**
 * @description Normalizes a loaded configuration module into a plain config
 * object. Named exports take priority; otherwise the default export applies —
 * a plain object as-is, or a class instantiated with no arguments. A class
 * extending {@link HygenConfig} is resolved through the base class conversion
 * (`toRunnerConfig()`: fields plus bound prototype hook methods); any other
 * class is resolved to the instance's own enumerable properties (prototype
 * members are not read; class methods never become helpers). Unknown own
 * properties on a non-base class config are ignored with a warning. */
const normalizeProjectConfig = (
  mod: Record<string, unknown>,
  file: string,
  logger: Logger,
): Record<string, unknown> => {
  const named = Object.keys(mod).filter(
    (key) => key !== 'default' && !INTEROP_KEYS.includes(key),
  );
  if (named.length > 0) {
    return Object.fromEntries(named.map((key) => [key, mod[key]]));
  }
  const raw = mod.default;
  if (raw === undefined || raw === null) return {};
  if (typeof raw === 'object' && !Array.isArray(raw))
    return raw as Record<string, unknown>;
  if (typeof raw !== 'function') {
    logger.warn(
      `Ignoring unsupported default export of project config '${file}': expected an object or a class.`,
    );
    return {};
  }
  let instance: Record<string, unknown>;
  try {
    instance = new (raw as new () => Record<string, unknown>)();
  } catch (cause) {
    throw new ConfigClassError(file, cause);
  }
  // Base-class configs own their conversion: prototype hook methods and the
  // configured helpers member participate; extra fields stay class-internal.
  // Duck-typed on `toRunnerConfig` (not `instanceof`): a project may resolve a
  // different copy of `@biorate/hygen` than the running CLI, which would make
  // an instanceof check falsely fall into the legacy own-props branch.
  if (typeof (instance as { toRunnerConfig?: unknown }).toRunnerConfig === 'function') {
    return (
      instance as { toRunnerConfig: () => Record<string, unknown> }
    ).toRunnerConfig() as Record<string, unknown>;
  }
  const own = Object.keys(instance);
  for (const key of own) {
    if (!PROJECT_CONFIG_KEYS.includes(key)) {
      logger.warn(
        `Ignoring unknown project config property '${key}' in '${file}' (known: ${PROJECT_CONFIG_KEYS.join(
          ', ',
        )}).`,
      );
    }
  }
  return Object.fromEntries(
    own
      .filter((key) => PROJECT_CONFIG_KEYS.includes(key))
      .map((key) => [key, instance[key]]),
  );
};

const resolve = (
  cwd: string,
  defaultTemplates: string | undefined,
  templatesOverride: string | undefined,
) => {
  return [
    templatesOverride && path.resolve(cwd, templatesOverride),
    process.env.HYGEN_TMPLS,
    path.resolve(cwd, '_templates'),
    defaultTemplates && path.resolve(cwd, defaultTemplates),
  ].find((_) => _ && fs.existsSync(_));
};

/**
 * @description Resolves the effective `RunnerConfig`: computes the templates
 * directory (honouring `templatesOverride`, `HYGEN_TMPLS`, the default
 * `_templates` folder and `templates`) and merges any nearest project config.
 * @param config - The user-supplied runner configuration.
 * @returns A fully resolved runner configuration ready for the engine.
 * */
export { normalizeProjectConfig };

export default async (config: RunnerConfig): Promise<RunnerConfig> => {
  const { cwd, templates: defaultTemplates, templatesOverride } = config;

  const resolvedTemplates = resolve(cwd, defaultTemplates, templatesOverride);

  const project = normalizeProjectConfig(
    (await configResolver.resolve(cwd)) as Record<string, unknown>,
    resolvedConfigFile ?? path.join(cwd, CONFIG_FILES[0]),
    config.logger,
  );
  // A project-config `templates` field is cwd-relative (like the default
  // `_templates` folder); non-existent values (e.g. named-export markers in
  // tests) are kept as-is.
  if (
    typeof project.templates === 'string' &&
    project.templates !== '' &&
    !path.isAbsolute(project.templates)
  ) {
    const resolved = path.resolve(cwd, project.templates);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      project.templates = resolved;
    }
  }

  // A global parameter schema is validated at resolution time (the same
  // contract as an action's `static params`): a schema mistake fails before
  // any pair runs.
  if (project.params !== undefined) {
    project.params = validateParamsSchema(
      project.params as import('./types/params-schema').ParamsSchema,
    );
  }

  return {
    ...config,
    templates: resolvedTemplates,
    ...project,
  };
};

import type { RunnerConfig, Helpers } from './types';
import helpers from './helpers';

const localsToCapitalize = ['name'];
const localsToPluralize = ['name'];
const localsDefaults = {
  name: 'unnamed',
};

const processLocals = (hsh: Record<string, any>, [key, value]: [string, any]) => {
  hsh[key] = value;

  if (localsToCapitalize.includes(key)) {
    hsh[helpers.capitalize(key)] = helpers.capitalize(value);
  }

  if (localsToPluralize.includes(key)) {
    hsh[helpers.inflection.pluralize(key)] = helpers.inflection.pluralize(value);
    hsh[helpers.capitalize(helpers.inflection.pluralize(key))] = helpers.capitalize(
      helpers.inflection.pluralize(value),
    );
  }

  return hsh;
};

const processedLocals = (locals: Record<string, any>) =>
  Object.entries(locals).reduce(processLocals, {} as Record<string, any>);

/**
 * @description Builds the template context object: `locals` merged with the
 * configured defaults and derive{{}}-style derived keys (capitalized and
 * pluralized `name`), plus an `h` namespace binding built-in and configured
 * helpers together.
 * @param locals - The key/value locals supplied to the template.
 * @param config - A (partial) runner configuration used for helpers/defaults.
 * @returns The merged context object handed to EJS/templates.
 * */
const context = (locals: Record<string, any>, config: Partial<RunnerConfig> = {}) => {
  const localsWithDefaults = {
    ...localsDefaults,
    ...config.localsDefaults,
    ...locals,
  };
  const configHelpers: Helpers =
    typeof config.helpers === 'function'
      ? config.helpers(locals, config)
      : config.helpers ?? {};
  return Object.assign(localsWithDefaults, processedLocals(localsWithDefaults), {
    h: { ...helpers, ...configHelpers },
  });
};

export default context;

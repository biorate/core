import type { RunnerConfig } from './types';
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

const context = (locals: Record<string, any>, config: Partial<RunnerConfig> = {}) => {
  const localsWithDefaults = {
    ...localsDefaults,
    ...config.localsDefaults,
    ...locals,
  };
  const configHelpers =
    (typeof config.helpers === 'function'
      ? config.helpers(locals, config)
      : config.helpers) || {};
  return Object.assign(localsWithDefaults, processedLocals(localsWithDefaults), {
    h: { ...helpers, ...configHelpers },
  });
};

export default context;

import path from 'path';
import inflection from 'inflection';
import changeCase from 'change-case';

// @types/inflection declares its interface as a module-local, non-exported type
// that cannot be named from emitted declaration files, so we model the local
// surface we port (plus the fork's extra undasherize) instead.
interface Inflection {
  pluralize(str: string, plural?: string): string;
  singularize(str: string, singular?: string): string;
  inflect(str: string, count: number, singular?: string, plural?: string): string;
  camelize(str: string, low_first_letter?: boolean): string;
  underscore(str: string, all_upper_case?: boolean): string;
  humanize(str: string, low_first_letter?: boolean): string;
  capitalize(str: string): string;
  dasherize(str: string): string;
  titleize(str: string): string;
  undasherize(str: string): string;
}

// supports kebab-case to KebabCase
const undasherize = (str: string) =>
  str
    .split(/[-_]/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join('');

// registers the fork's extension onto the inflection instance
type ForkedInflection = typeof inflection & { undasherize: (str: string) => string };
(inflection as ForkedInflection).undasherize = undasherize;

export { Inflection };

const inflected = inflection as unknown as Inflection;

/**
 * @description The built-in helpers made available to templates via the `h`
 * context value: `capitalize`, `inflection` (with the fork's `undasherize`),
 * `changeCase` and the `path` module.
 * */
const helpers = {
  /**
   * @description Uppercases the first character of a string.
   * @param str - The string to capitalize.
   * @returns The capitalized string.
   * */
  capitalize(str: string) {
    const toBeCapitalized = String(str);
    return toBeCapitalized.charAt(0).toUpperCase() + toBeCapitalized.slice(1);
  },
  inflection: inflected,
  changeCase,
  path,
};

export default helpers;

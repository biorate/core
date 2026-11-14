import path from 'path';
import inflection from 'inflection';
import changeCase from 'change-case';
import type { Inflection } from './types';

// supports kebab-case to KebabCase
const undasherize = (str: string) =>
  str
    .split(/[-_]/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join('');

// registers the fork's extension onto the inflection instance
type ForkedInflection = typeof inflection & { undasherize: (str: string) => string };
(inflection as ForkedInflection).undasherize = undasherize;

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

/**
 * @description The `inflection` module surface the fork relies on.
 * `@types/inflection` declares its interface as a module-local, non-exported
 * type that cannot be named from emitted declaration files, so the local
 * surface we port (plus the fork's extra `undasherize`) is modeled here. */
export interface Inflection {
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

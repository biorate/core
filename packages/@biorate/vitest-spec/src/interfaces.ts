import type { ValidatorOptions } from 'class-validator';

/**
 * @description Options for unit-testing a method on a context object with snapshot support.
 */
export type IUnitOptions = {
  context: any;
  method: string;
  args?: unknown[];
  id?: string | number;
  ext?: 'ts' | 'json';
  expects?: {
    args: string | string[] | boolean;
    return: string | string[] | boolean;
    context: string | string[] | boolean;
  };
  catch?: (e: Error) => boolean;
};

/**
 * @description Options for data validation using class-validator schemas or validator functions.
 */
export type IValidatorOptions = {
  schema: any;
  data?: any;
  field?: string;
  array?: boolean;
  validatorOptions?: ValidatorOptions;
  catch?: (e: Error) => boolean;
};

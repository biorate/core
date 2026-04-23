import type { ValidatorOptions } from 'class-validator';

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

export type IValidatorOptions = {
  schema: any;
  data?: any;
  field?: string;
  array?: boolean;
  validatorOptions?: ValidatorOptions;
  catch?: (e: Error) => boolean;
};

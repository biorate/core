import { get, merge } from 'lodash';
import { validate as val } from 'class-validator';
import { ValidationError } from './errors';
import { IValidatorOptions } from './interfaces';

export class Validator {
  protected static instance: Validator;

  public static validate(options: IValidatorOptions) {
    if (!this.instance) this.instance = new this();
    return this.instance.validate(options);
  }

  protected constructor() {}

  public validate(options: IValidatorOptions) {
    let isSchema: boolean;
    options.data = options.field ? get(options.data, options.field) : options.data;
    if (typeof options.schema !== 'function') throw new Error();
    isSchema =
      typeof options.schema === 'function' &&
      /^\s*class\s+/.test(options.schema.toString());
    return isSchema ? this.validateBySchema(options) : this.validateByFunction(options);
  }

  protected async validateBySchema(options: IValidatorOptions) {
    const schemas: any[] = [];
    if (!options.array) schemas.push(merge(new options.schema(), options.data));
    else
      schemas.push(...options.data.map((item: any) => merge(new options.schema(), item)));
    for (const schema of schemas) {
      const results = await val(schema, options.validatorOptions);
      if (!results.length) continue;
      const errors: string[] = [];
      for (const result of results)
        errors.push(...Object.values(result.constraints ?? {}));
      const err = new ValidationError('schema', options.schema, errors);
      if (!options?.catch?.(err)) throw err;
    }
    return options.data;
  }

  protected async validateByFunction(options: IValidatorOptions) {
    const results: any[] = [];
    if (!options.array) results.push([options.schema(options.data), options.data]);
    else results.push(...options.data.map((item: any) => [options.schema(item), item]));
    for (const [result, value] of results) {
      if (result) continue;
      const err = new ValidationError('function', options.schema, [value]);
      if (!options?.catch?.(err)) throw err;
    }
    return options.data;
  }
}

export const validate =
  (schema: any, options?: Omit<IValidatorOptions, 'data' | 'schema'>) => (data: any) =>
    Validator.validate({ data, schema, field: 'body', ...options });

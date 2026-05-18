import { get, merge } from 'lodash-es';
import { validate as val } from 'class-validator';
import { ValidationError, ValidationSchemaWrongTypeError } from './errors';
import { IValidatorOptions } from './interfaces';

/**
 * @description
 * Validates data against class-validator schemas or custom validator functions.
 *
 * Supports two modes:
 * - **Schema mode**: accepts a class constructor decorated with class-validator decorators.
 * - **Function mode**: accepts a predicate `(data) => boolean`.
 */
export class Validator {
  protected static instance: Validator;

  /**
   * @description Validate data using a shared singleton instance.
   */
  public static validate(options: IValidatorOptions) {
    if (!this.instance) this.instance = new this();
    return this.instance.validate(options);
  }

  protected constructor() {}

  /**
   * @description
   * Run validation. Automatically detects whether the schema is a class (constructor)
   * or a plain function and dispatches accordingly.
   */
  public validate(options: IValidatorOptions) {
    const type = typeof options.schema;
    if (type !== 'function') throw new ValidationSchemaWrongTypeError(type);
    const data = options.field ? get(options.data, options.field) : options.data;
    const isSchema = /^\s*class\s+/.test(options.schema.toString());
    return isSchema
      ? this.validateBySchema(data, options)
      : this.validateByFunction(data, options);
  }

  /**
   * @description Validate data using a class-validator decorated class.
   */
  protected async validateBySchema(data: any, options: IValidatorOptions) {
    const schemas: any[] = [];
    if (!options.array) schemas.push(merge(new options.schema(), data));
    else schemas.push(...data.map((item: any) => merge(new options.schema(), item)));
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

  /**
   * @description Validate data using a predicate function.
   */
  protected async validateByFunction(data: any, options: IValidatorOptions) {
    const results: any[] = [];
    if (!options.array) results.push([options.schema(data), data]);
    else results.push(...data.map((item: any) => [options.schema(item), item]));
    for (const [result, value] of results) {
      if (result) continue;
      const err = new ValidationError('function', options.schema, [value]);
      if (!options?.catch?.(err)) throw err;
    }
    return options.data;
  }
}

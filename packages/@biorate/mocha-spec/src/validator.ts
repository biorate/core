import { get, merge } from 'lodash';
import { validate } from 'class-validator';
import { ValidationError } from '../errors';
import { IValidatorOptions } from '../interfaces';

export class Validator {
  public validate(options: IValidatorOptions) {
    let isSchema: boolean;
    options.data = options.field ? get(options.data, options.field) : options.data;
    try {
      options.schema();
      isSchema = false;
    } catch (e: any) {
      if (!e?.message?.includes?.("cannot be invoked without 'new'")) throw e;
      isSchema = true;
    }
    return isSchema ? this.validateBySchema(options) : this.validateByFunction(options);
  }

  protected async validateBySchema(options: IValidatorOptions) {
    const schemas: any[] = [];
    if (!options.array) schemas.push(merge(new options.schema(), options.data));
    else
      schemas.push(...options.data.map((item: any) => merge(new options.schema(), item)));
    for (const schema of schemas) {
      const results = await validate(schema, options.validatorOptions);
      if (!results.length) continue;
      const errors: string[] = [];
      for (const result of results)
        errors.push(...Object.values(result.constraints ?? {}));
      throw new ValidationError('schema', options.schema, errors);
    }
  }

  protected async validateByFunction(options: IValidatorOptions) {
    const results: any[] = [];
    if (!options.array) results.push([options.schema(options.data), options.data]);
    else results.push(...options.data.map((item: any) => [options.schema(item), item]));
    for (const [result, value] of results) {
      if (result) continue;
      throw new ValidationError('function', options.schema, [value]);
    }
  }
}

import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CommonFactoryValidationError } from './errors';
import { merge } from 'lodash-es';

let validateEnabled = true;

/** @description Validates an object using class-validator synchronously. Throws CommonFactoryValidationError if constraints are violated. */
export const validate = (object: any) => {
  if (!validateEnabled) return;
  const validations = validateSync(object);
  const errors: string[] = [];
  for (const validation of validations)
    errors.push(...Object.values(validation.constraints ?? {}));
  if (errors.length)
    throw new CommonFactoryValidationError(object.constructor.name, errors);
};

/** @description Executes a callback with validation temporarily disabled. Re-enables validation after completion. */
export const transaction = <T>(callback: () => T) => {
  try {
    validateEnabled = false;
    return callback();
  } finally {
    validateEnabled = true;
  }
};

/** @description Merges plain data into a class instance using class-transformer, applies custom transforms, and validates the result. */
export const auto = <T>(ctx: any, data: T) => {
  if (!data) return;
  merge(ctx, plainToInstance(ctx.constructor, data, { enableImplicitConversion: true }));
  const metadata = Reflect.getMetadata('custom_transforms', ctx) || {};
  for (const key of Object.keys(metadata)) {
    const transformFn = metadata[key];
    if (typeof transformFn === 'function' && ctx[key]) {
      ctx[key] = transformFn(ctx[key]);
    }
  }
  validate(ctx);
  return ctx;
};

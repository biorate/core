import { validateSync } from 'class-validator';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CommonFactoryValidationError } from './errors';
import { IMetadata } from './interfaces';
import { merge } from 'lodash';

let validateEnabled = true;

export const validate = (object: any) => {
  if (!validateEnabled) return;
  const validations = validateSync(object);
  const errors: string[] = [];
  for (const validation of validations)
    errors.push(...Object.values(validation.constraints ?? {}));
  if (errors.length)
    throw new CommonFactoryValidationError(object.constructor.name, errors);
};

export const transaction = <T>(callback: () => T) => {
  try {
    validateEnabled = false;
    return callback();
  } finally {
    validateEnabled = true;
  }
};

export const auto = <T>(ctx: any, data: T) => {
  if (!data) return;
  merge(ctx, plainToInstance(ctx.constructor, data));
  validate(ctx);
};

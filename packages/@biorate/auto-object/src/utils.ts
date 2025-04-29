import { validateSync } from 'class-validator';
import { CommonFactoryValidationError } from './errors';
import { IMetadata } from './interfaces';

export const validate = (object: any) => {
  const validations = validateSync(object);
  const errors: string[] = [];
  for (const validation of validations)
    errors.push(...Object.values(validation.constraints ?? {}));
  if (errors.length)
    throw new CommonFactoryValidationError(object.constructor.name, errors);
};

export const walkMetadataKeys = (
  object: any,
  callback: (metadata: IMetadata) => void,
) => {
  const prototype = Object.getPrototypeOf(object);
  const keys = Reflect.getOwnMetadataKeys(prototype);
  for (const key of keys) callback(Reflect.getOwnMetadata(key, prototype));
};

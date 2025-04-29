import 'reflect-metadata';
import { merge } from 'lodash';
import { validate, walkMetadataKeys } from './utils';
import { IMetadata, PropertiesOnly } from './interfaces';

export { Getter, Setter } from './interfaces';
export * from './decorators';

export abstract class AutoObject<T = Record<string, unknown>> {
  public constructor(data: PropertiesOnly<T>) {
    walkMetadataKeys(this, (metadata: IMetadata) => {
      this[<keyof typeof this>metadata.name] = new metadata.Class(
        data[<keyof typeof data>metadata.name],
      );
      delete data[<keyof typeof data>metadata.name];
    });
    merge(this, data);
    validate(this);
  }
}

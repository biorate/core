import { BaseError } from '@biorate/errors';

export class CollectionListItemAlreadyExistsError extends BaseError {
  public constructor(name: string, key: string) {
    super('Item [%s] with key [%s] already exists!', [name, key]);
  }
}

import { BaseError } from '@biorate/errors';

/**
 * @description Error thrown when a list item with the same key already exists.
 */
export class CollectionListItemAlreadyExistsError extends BaseError {
  public constructor(name: string, key: string) {
    super('Item [%s] with key [%s] already exists!', [name, key]);
  }
}

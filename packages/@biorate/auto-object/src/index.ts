import 'reflect-metadata';
import { merge } from 'lodash';
import { validate, walkMetadataKeys } from './utils';
import { IMetadata, PropertiesOnly } from './interfaces';

export { Getter, Setter } from './interfaces';
export * from './decorators';
/**
 * @description
 * Auto initialized object
 *
 * @example
 * ```ts
 * class Geo extends Array<number> {}
 *
 * class Address extends AutoObject<Address> {
 *   @IsString()
 *   public city: string;
 *
 *   @IsString()
 *   public street: string;
 *
 *   @IsNumber()
 *   public flat: number;
 *
 *   @IsNumber()
 *   public index: number;
 *
 *   @IsArray()
 *   public geo: Geo;
 *
 *   public get inline() {
 *     return <Getter<string>>`${this.index}, ${this.city}, ${this.street} №${this.flat}`;
 *   }
 * }
 *
 * class User extends AutoObject<User> {
 *   @IsInt()
 *   public id: number;
 *
 *   @IsString()
 *   public firstName: string;
 *
 *   @IsString()
 *   public lastName: string;
 *
 *   @IsObject()
 *   @ValueObject(Address)
 *   public address: Address;
 * }
 *
 * const user = new User({
 *   id: 1,
 *   firstName: 'Vasya',
 *   lastName: 'Pupkin',
 *   address: {
 *     city: 'Moscow',
 *     street: 'Gogolya',
 *     index: 123321,
 *     flat: 74,
 *     geo: [12321, 32123],
 *   },
 * });
 *
 * console.log(user);  // User {
 *                     //   "address": Address {
 *                     //     "city": "Moscow",
 *                     //     "flat": 74,
 *                     //     "geo": Array [
 *                     //       12321,
 *                     //       32123,
 *                     //     ],
 *                     //     "index": 123321,
 *                     //     "street": "Gogolya",
 *                     //   },
 *                     //   "firstName": "Vasya",
 *                     //   "id": 1,
 *                     //   "lastName": "Pupkin",
 *                     // }
 * ```
 */
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

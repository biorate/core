import 'reflect-metadata';
import { auto } from './utils';
import { PropertiesOnly } from './interfaces';

export { Getter, Setter, PropertiesOnly } from './interfaces';
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
 *   public apartment: number;
 *
 *   @IsNumber()
 *   public postal: number;
 *
 *   @IsArray()
 *   public geo: Geo;
 *
 *   public get inline() {
 *     return <Getter<string>>(
 *       `${this.postal}, ${this.city}, ${this.street} №${this.apartment}`
 *     );
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
 *     postal: 123321,
 *     apartment: 74,
 *     geo: [12321, 32123],
 *   },
 * });
 *
 * console.log(user); // User {
 * //   "address": Address {
 * //     "city": "Moscow",
 * //     "apartment": 74,
 * //     "geo": Array [
 * //       12321,
 * //       32123,
 * //     ],
 * //     "postal": 123321,
 * //     "street": "Gogolya",
 * //   },
 * //   "firstName": "Vasya",
 * //   "id": 1,
 * //   "lastName": "Pupkin",
 * // }
 * ```
 */
export abstract class AutoObject<T = Record<string, any>> {
  public static extends<C extends new (...args: any[]) => any, T = Record<string, any>>(
    Class: C,
  ) {
    Class = Class ? Class : (class {} as unknown as C);
    return class AutoObject extends Class {
      public constructor(...args: any[]) {
        super(...args.slice(1));
        auto<PropertiesOnly<T>>(this, args[0]);
      }
    };
  }

  public constructor(data: PropertiesOnly<T>) {
    auto<PropertiesOnly<T>>(this, data);
  }
}

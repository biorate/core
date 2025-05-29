import 'reflect-metadata';
import { flattenDeep } from 'lodash';
import { auto, transaction } from './utils';
import { PropertiesOnly } from './interfaces';

export * from './decorators';
export { Getter, Setter, PropertiesOnly } from './interfaces';
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
    return class AutoObject extends (Class ? Class : <C>class {}) {
      public constructor(...args: any[]) {
        super(...args.slice(1));
        return auto<PropertiesOnly<T>>(this, args[0]);
      }
    };
  }

  public constructor(data: PropertiesOnly<T>) {
    return auto<PropertiesOnly<T>>(this, data);
  }
}

export abstract class AutoArray<T> extends Array<PropertiesOnly<T>> {
  #transform = (data: PropertiesOnly<T>) => new this.Class(data);

  protected abstract get Class(): new (...args: any[]) => any;

  public constructor(...args: PropertiesOnly<T>[]) {
    super();
    this.push(...args.map(this.#transform));
  }

  public push(...args: PropertiesOnly<T>[]) {
    return super.push(...args.map(this.#transform));
  }

  public unshift(...args: PropertiesOnly<T>[]) {
    return super.unshift(...args.map(this.#transform));
  }

  public slice(start: number, deleteCount?: number): this {
    return <typeof this>transaction(() => super.slice(start, deleteCount));
  }

  public splice(start: number, deleteCount: number, ...args: PropertiesOnly<T>[]): this {
    return <typeof this>(
      transaction(() => super.splice(start, deleteCount, ...args.map(this.#transform)))
    );
  }

  public concat(...args: (PropertiesOnly<T> | ConcatArray<PropertiesOnly<T>>)[]): this {
    return <typeof this>(
      transaction(() =>
        super.concat((<PropertiesOnly<T>[]>flattenDeep(<any>args)).map(this.#transform)),
      )
    );
  }
}

import 'reflect-metadata';
import { flattenDeep } from 'lodash';
import { auto, transaction } from './utils';
import { PropertiesOnly } from './interfaces';
import { CommonFactoryTypeError } from './errors';

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

export abstract class AutoArray<T> extends Array<T> {
  #transform = (data: PropertiesOnly<T> | T) => {
    if (data instanceof this.Class) return data;
    // Guard against accidentally passing arrays as an element.
    if (Array.isArray(data)) {
      throw new CommonFactoryTypeError(
        this.constructor.name,
        'AutoArray item must be an object or class instance, received Array',
      );
    }
    return new this.Class(data);
  };

  protected abstract get Class(): new (...args: any[]) => any;

  public constructor(...args: (PropertiesOnly<T> | T | (PropertiesOnly<T> | T)[])[]) {
    const isLengthCtor = args.length === 1 && typeof args[0] === 'number';
    super(isLengthCtor ? (args[0] as number) : 0);
    if (!isLengthCtor) super.push(...flattenDeep(args).map(this.#transform));
  }

  public push(...args: (PropertiesOnly<T> | T | (PropertiesOnly<T> | T)[])[]) {
    return super.push(...flattenDeep(args).map(this.#transform));
  }

  public unshift(...args: (PropertiesOnly<T> | T | (PropertiesOnly<T> | T)[])[]) {
    return super.unshift(...flattenDeep(args).map(this.#transform));
  }

  public slice(start: number, deleteCount?: number): this {
    return <typeof this>transaction(() => super.slice(start, deleteCount));
  }

  public splice(
    start: number,
    deleteCount: number,
    ...args: (PropertiesOnly<T> | T | (PropertiesOnly<T> | T)[])[]
  ): this {
    return <typeof this>(
      transaction(() =>
        super.splice(start, deleteCount, ...flattenDeep(args).map(this.#transform)),
      )
    );
  }

  public concat(
    ...args: (
      | PropertiesOnly<T>
      | T
      | (PropertiesOnly<T> | T)[]
      | ConcatArray<PropertiesOnly<T> | T>
    )[]
  ): this {
    return <typeof this>(
      transaction(() =>
        super.concat(
          (<(PropertiesOnly<T> | T)[]>flattenDeep(<any>args)).map(this.#transform),
        ),
      )
    );
  }
}

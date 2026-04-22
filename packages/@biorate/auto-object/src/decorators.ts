import { Expose, Transform } from 'class-transformer';
import { AutoArray } from './index';

export const Default =
  <T = any>(value: T) =>
  (target: any, propertyName: string) => {
    Expose()(target, propertyName);
    Transform(({ obj }) => obj[propertyName] ?? value)(target, propertyName);
  };

/**
 * @description
 * Decorator for AutoArray fields transformation.
 * Automatically transforms plain arrays to AutoArray instances.
 *
 * @example
 * ```ts
 * class Pet extends AutoObject<Pet> {
 *   @IsString()
 *   public type: string;
 * }
 *
 * class PetArray extends AutoArray<Pet> {
 *   protected get Class() {
 *     return Pet;
 *   }
 * }
 *
 * class UserPets extends AutoObject<UserPets> {
 *   @IsArray()
 *   @AutoArrayType(() => PetArray)
 *   public pets: PetArray;
 * }
 * ```
 */
export const AutoArrayType =
  <T extends new (...args: any[]) => AutoArray<any>>(typeFn: () => T) =>
  (target: any, propertyName: string) => {
    const metadataKey = 'custom_transforms';
    const existingMetadata = Reflect.getMetadata(metadataKey, target) || {};
    const transformFn = (value: any) => {
      if (!value || !Array.isArray(value)) return value;
      const TargetClass = typeFn();
      return new TargetClass(value);
    };
    Reflect.defineMetadata(
      metadataKey,
      { ...existingMetadata, [propertyName]: transformFn },
      target,
    );
    Transform(({ value }) => transformFn(value))(target, propertyName);
  };

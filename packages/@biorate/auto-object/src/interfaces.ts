/** @description Metadata record associating a class constructor with its string identifier. */
export type IMetadata = { Class: any; name: string };

declare const brand: unique symbol;

/** @description Branded type that marks a property as a getter-only accessor. */
export type Getter<T> = T & {
  readonly [brand]: 'Getter';
};

/** @description Branded type that marks a property as a setter-only accessor. */
export type Setter<T> = T & {
  readonly [brand]: 'Setter';
};

/** @description Recursively extracts only data properties from T, excluding methods, getters, and setters. */
export type PropertiesOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function
    ? never
    : T[K] extends Getter<infer _>
    ? never
    : T[K] extends Setter<infer _>
    ? never
    : K]: T[K] extends object ? PropertiesOnly<T[K]> : T[K];
};

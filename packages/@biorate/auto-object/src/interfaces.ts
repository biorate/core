export type IMetadata = { Class: any; name: string };

declare const brand: unique symbol;

export type Getter<T> = T & {
  readonly [brand]: 'Getter';
};

export type Setter<T> = T & {
  readonly [brand]: 'Setter';
};

export type PropertiesOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function
    ? never // Исключаем методы
    : T[K] extends Getter<infer _>
    ? never // Исключаем геттеры
    : T[K] extends Setter<infer _>
    ? never // Исключаем сеттеры
    : K]: T[K] extends object ? PropertiesOnly<T[K]> : T[K];
};

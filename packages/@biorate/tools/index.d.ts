import { IDefine } from './interfaces';

declare module '@biorate/tools' {
  export namespace path {
    export function dirname(filepath: string, full?: boolean): string;

    export function basename(filepath: string, ext?: string): string;

    export function extname(filepath: string): string;

    export function create(...args: string[]): string;
  }

  export namespace object {
    export function isGetOrSet(object: any, field: string): boolean;

    export function walkProto(object: any, callback?: (object: any) => void): void;

    export function kSort(object: {}): {};

    export function isAccessor(object: any, field: string): boolean;
  }

  export namespace define {
    export function prop<T>(
      context: T,
      field?: PropertyKey,
      value?: unknown,
      mods?: IDefine.Mods,
    ): (
      field: PropertyKey,
      value: unknown,
      mods?: IDefine.Mods,
    ) => (field: PropertyKey, value: unknown, mods?: IDefine.Mods) => any;

    export function accessor<T>(
      context: T,
      field?: PropertyKey,
      accessor?: IDefine.Accessor,
      mods?: IDefine.Mods,
    ): (
      field: PropertyKey,
      accessor: IDefine.Accessor,
      mods?: IDefine.Mods,
    ) => (field: PropertyKey, accessor: IDefine.Accessor, mods?: IDefine.Mods) => any;
  }
}

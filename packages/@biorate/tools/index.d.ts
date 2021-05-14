import { ITools } from './interfaces';

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
  }

  export namespace define {
    export function prop(
      context: {},
      field?: string,
      value?: any,
      mods?: ITools.IDefine.IMods,
    ): (
      field: string,
      value: any,
      mods?: string,
    ) => (field: string, value: any, mods?: ITools.IDefine.IMods) => any;

    export function accessor(
      context: {},
      field?: string,
      accessor?: ITools.IDefine.IAccessor,
      mods?: ITools.IDefine.IMods,
    ): (
      field: string,
      accessor: ITools.IDefine.IAccessor,
      mods?: string,
    ) => (field: string, accessor: ITools.IDefine.IAccessor, mods?: ITools.IDefine.IMods) => any;
  }
}

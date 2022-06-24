import { IDefine } from './interfaces';
import { globalThis, isServer } from './src/env';

declare module '@biorate/tools' {
  export namespace buffer {
    export const MAX_UINT29: number;

    export const MIN_UINT29: number;

    export function writeUInt29(buffer: Buffer, value: number, offset?: number): number;

    export function readUInt29(buffer: Buffer, offset?: number): number;

    export function uInt29BytesLength(value: number): number;
  }

  export namespace events {
    export function once(
      object: { once: (event: string, callback: (...args: unknown[]) => void) => void },
      event: string,
    ): Promise<unknown>;
  }

  export namespace env {
    export const globalThis: any;

    export const isServer: boolean;
  }

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

  export namespace timer {
    export function wait(timeout?: number): Promise<void>;

    export function tick(): Promise<void>;

    export function immediate(): Promise<void>;
  }
}

export namespace IReactTable {
  export type Headers = { field: string; title?: string; width?: number }[];

  export type Items = Record<string, any>[];

  export interface Bounds {
    offsetWidth: number;
    offsetHeight: number;
  }

  export interface Store {
    headers: Headers;
    items: Items;
    bounds: Bounds;
  }
}

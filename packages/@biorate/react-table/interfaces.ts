export namespace IReactTable {
  export type Cols = {
    field: string;
    title?: string;
    width?: number;
    fixed?: string;
  }[];

  export type Rows = Record<string, any>[];

  export interface Bounds {
    width: number;
    height: number;
  }

  export interface Store {
    // headers: Headers;
    // items: Items;
    bounds: Bounds;
  }
}

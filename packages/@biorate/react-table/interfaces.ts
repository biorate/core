export namespace IReactTable {
  export type Columns = {
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

  export interface Cols {}

  export interface Store {
    bounds: Bounds;
    rows: Rows;
    cols: Cols;
    colWidth: number;
    rowHeight: number;
    scrollLeft: number;
    scrollTop: number;
  }
}

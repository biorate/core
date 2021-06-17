export namespace IReactTable {
  export type Column = {
    field: string;
    title?: string;
    width?: number;
    fixed?: string;
  };

  export type Columns = Column[];

  export type Row = Record<string, any>;

  export type Rows = Row[];

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
    border: number;

    getColWidth(cols: Column): number
  }
}

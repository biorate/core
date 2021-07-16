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

  export type PaginationProps = {
    count?: number;
  };

  export interface Bounds {
    width: number;
    height: number;
  }

  export interface Pagination {}

  export interface Cols {}

  export interface Store {
    bounds: Bounds;
    rawRows: Rows;
    rows: Rows;
    cols: Cols;
    pagination: Pagination;
    width: number;
    height: number;
    colWidth: number;
    rowHeight: number;
    scrollLeft: number;
    scrollTop: number;
    border: number;
    scrollBarWidth: number;
    header: boolean;
    footer: boolean;

    getColWidth(cols: Column): number;
  }
}

export namespace IReactVirtualTable {
  /**
   * @description An object defining how to render column
   */
  export type Column = {
    /**
     * @description Column field
     */
    field: string;
    /**
     * @description Column title for header
     */
    title?: string;
    /**
     * @description Column width
     */
    width?: number;
    /**
     * @description Make column - fixed left or right
     */
    fixed?: 'left' | 'right';
  };

  export type Columns = Column[];

  /**
   * @description Object with props for render
   */
  export type Row = Record<string, any>;

  export type Rows = Row[];

  export type PaginationProps = {
    /**
     * @description Max count of page buttons in paginator
     */
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

import { IReactTable } from '../../interfaces';
import { Base, embed, observable, action, computed } from './base';
import { Bounds } from './bounds';
import { Cols } from './cols';
// import { Rows } from './rows';
// import { Table } from './table';

export class Store extends Base implements IReactTable.Store {
  // @embed(Headers) public headers: Headers = null;
  @embed(Bounds) public bounds: Bounds = null;
  @embed(Cols) public cols: Cols = null;
  @embed(Store.Array) public rows: IReactTable.Rows = [];

  @observable() @embed(Store.Int) public scrollLeft = 0;
  @observable() @embed(Store.Int) public scrollTop = 0;
  @observable() @embed(Store.Int) public width = 0;
  @observable() @embed(Store.Int) public height = 0;
  @observable() public colWidth = 100;
  @observable() public rowHeight = 40;

  // @observable() @embed(Table.Int) public width = 0;
  // @observable() @embed(Table.Int) public height = 0;
  // @observable() @embed(Table.Int) public leftWidth = 0;
  // @observable() @embed(Table.Int) public rightWidth = 0;

  // @observable() @embed(Store.Array) public headers: IReactTable.Headers = [];
  // @observable() @embed(Store.Array) public items: IReactTable.Items = [];
  // @observable() @embed(Store.Array) public items: IReactTable.Items = [];

  @action() public load(
    cols: IReactTable.Columns,
    rows: IReactTable.Rows,
    bounds: { width: number; height: number },
  ) {
    this.bounds.set(bounds);
    this.cols.load(cols);
    this.rows = rows;
    this.calcSize();
    // this.headers.load(headers);
    // this.items.load(items);
    // this.table.calculate();
  }

  @action() public scroll(scrollLeft, scrollTop) {
    this.set({ scrollLeft, scrollTop });
    // this.headers.load(headers);
    // this.items.load(items);
    // this.table.calculate();
  }

  @action() protected calcSize() {
    this.width = this.cols._center.reduce(
      (memo, item) => ((memo += item.width ?? this.colWidth), memo),
      0,
    );
    this.height = this.rows.length * this.rowHeight;
  }

  @computed() public get gapLeft() {
    let sumWidth = 0;
    for (let i = 0; i < this.cols._center.length; i++) {
      const header = this.cols._center[i],
        width = header.width ?? this.colWidth;
      sumWidth += width;
      if (sumWidth >= this.scrollLeft) return sumWidth - this.scrollLeft - width;
    }
    return sumWidth;
  }

  // @action() protected calculateTableWidth() {
  //   this.cols.reduce((memo, item) => {
  //     memo += !item.fixed ? item.width ?? this.defaultWidth : 0;
  //     return memo;
  //   }, 0);
  // }
}

import { IReactTable } from '../../interfaces';
import { Base, embed, observable, action, computed } from './base';
import { Bounds } from './bounds';
import { Cols } from './cols';

export class Store extends Base implements IReactTable.Store {
  @embed(Bounds) public bounds: Bounds = null;
  @embed(Cols) public cols: Cols = null;
  @embed(Store.Array) public _rows: IReactTable.Rows = [];

  @observable() @embed(Store.Int) public clientWidth = 0;
  @observable() @embed(Store.Int) public scrollLeft = 0;
  @observable() @embed(Store.Int) public scrollTop = 0;
  @observable() @embed(Store.Int) public width = 0;
  @observable() @embed(Store.Int) public height = 0;
  @observable() @embed(Store.Int) public border = 0;
  @observable() public colWidth = 100;
  @observable() public rowHeight = 40;

  public scrollBarWidth = this.getScrollBarWidth();

  public getColWidth(col: IReactTable.Column) {
    return (col.width ?? this.colWidth) + this.border;
  }

  @action() public load(
    cols: IReactTable.Columns,
    rows: IReactTable.Rows,
    bounds: { width: number; height: number },
    border: number,
  ) {
    this.bounds.set(bounds);
    this.cols.load(cols);
    this._rows = rows;
    this.border = border ?? 1;
    this.calcSize();
  }

  @action() public scroll(scrollLeft, scrollTop, clientWidth) {
    this.set({ scrollLeft, scrollTop, clientWidth });
  }

  @action() public calcSize() {
    this.width = [...this.cols._center, ...this.cols.right, ...this.cols.left].reduce(
      (memo, item) => ((memo += this.getColWidth(item)), memo),
      0,
    );
    this.height = this._rows.length * this.rowHeight;
  }

  @computed() public get leftScrollReached() {
    return this.scrollLeft === 0;
  }

  @computed() public get rightScrollReached() {
    return this.width - this.scrollLeft - this.clientWidth === 0;
  }

  @computed() public get marginLeft() {
    return this.cols.left.reduce(
      (memo, item) => ((memo += this.getColWidth(item)), memo),
      0,
    );
  }

  @computed() public get gapTop() {
    return Math.floor(this.scrollTop / this.rowHeight) * this.rowHeight - this.scrollTop;
  }

  @computed() public get gapLeft() {
    let sumWidth = 0;
    for (let i = 0; i < this.cols._center.length; i++) {
      const header = this.cols._center[i],
        width = this.getColWidth(header);
      sumWidth += width;
      if (sumWidth >= this.scrollLeft) return sumWidth - this.scrollLeft - width;
    }
    return sumWidth;
  }

  @computed() public get rows() {
    const from = Math.floor(this.scrollTop / this.rowHeight);
    const to = from + Math.ceil(this.bounds.height / this.rowHeight);
    return this._rows.slice(from, to);
  }

  protected getScrollBarWidth() {
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style['msOverflowStyle'] = 'scrollbar';
    document.body.appendChild(outer);
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }
}

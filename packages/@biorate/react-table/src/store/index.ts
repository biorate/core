import { IReactTable } from '../../interfaces';
import { Base, embed, observable, action, computed } from './base';
import { Bounds } from './bounds';
import { Cols } from './cols';

export class Store extends Base implements IReactTable.Store {
  @embed(Bounds) public bounds: Bounds = null;
  @embed(Cols) public cols: Cols = null;
  @embed(Store.Array) public rows: IReactTable.Rows = [];

  @observable() @embed(Store.Int) public scrollLeft = 0;
  @observable() @embed(Store.Int) public scrollTop = 0;
  @observable() @embed(Store.Int) public width = 0;
  @observable() @embed(Store.Int) public height = 0;
  @observable() public colWidth = 100;
  @observable() public rowHeight = 40;

  public scrollBarWidth = this.getScrollbarWidth();

  @action() public load(
    cols: IReactTable.Columns,
    rows: IReactTable.Rows,
    bounds: { width: number; height: number },
  ) {
    this.bounds.set(bounds);
    this.cols.load(cols);
    this.rows = rows;
    this.calcSize();
  }

  @action() public scroll(scrollLeft, scrollTop) {
    this.set({ scrollLeft, scrollTop });
  }

  @action() public calcSize() {
    this.width = [...this.cols._center, ...this.cols.right, ...this.cols.left].reduce(
      (memo, item) => ((memo += item.width ?? this.colWidth), memo),
      0,
    );
    this.height = this.rows.length * this.rowHeight;
  }

  @computed() public get marginLeft() {
    return this.cols.left.reduce(
      (memo, item) => ((memo += item.width ?? this.colWidth), memo),
      0,
    );
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

  protected getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style['msOverflowStyle'] = 'scrollbar';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }
}

import { Base, embed, observable, action, computed } from './base';
import { IReactTable } from '../../interfaces';

export class Cols extends Base<IReactTable.Store> {
  @observable() @embed(Cols.Array) public _center: IReactTable.Columns = [];
  @observable() @embed(Cols.Array) public left: IReactTable.Columns = [];
  @observable() @embed(Cols.Array) public right: IReactTable.Columns = [];

  @action() public load(cols: IReactTable.Columns) {
    this._center.length = 0;
    this.left.length = 0;
    this.right.length = 0;
    for (const col of cols) this[col.fixed in this ? col.fixed : '_center'].push(col);
  }

  @computed() public get center() {
    let result = [],
      sumWidth = 0;
    for (let i = 0; i < this._center.length; i++) {
      const header = this._center[i],
        width = this.parent.getColWidth(header);
      sumWidth += width;
      if (sumWidth >= this.parent.scrollLeft) result.push(header);
      if (sumWidth > this.parent.scrollLeft + this.parent.bounds.width) break;
    }
    return result;
  }
}

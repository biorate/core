import { Base, embed, observable, action, computed } from './base';
import { IReactTable } from '../../interfaces';

export class Cols extends Base<IReactTable.Store> {
  @observable() @embed(Cols.Array) public _center = [];
  @observable() @embed(Cols.Array) public left = [];
  @observable() @embed(Cols.Array) public right = [];

  @action() public load(cols: IReactTable.Columns) {
    for (const col of cols)
      this[col.fixed in this ? col.fixed : '_center'].push(col);
  }

  @computed() public get center() {
    let result = [],
      sumWidth = 0;
    for (let i = 0; i < this._center.length; i++) {
      const header = this._center[i],
        width = header.width ?? this.parent.colWidth;
      sumWidth += width;
      if (sumWidth >= this.parent.scrollLeft) result.push(header);
      if (sumWidth > this.parent.scrollLeft + this.parent.bounds.width) break;
    }
    return result;
  }
}

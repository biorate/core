import { Base, embed, observable, action } from './base';
import { IReactTable } from '../../interfaces';

export class Cols extends Base {
  @observable() @embed(Cols.Array) public center = [];
  @observable() @embed(Cols.Array) public left = [];
  @observable() @embed(Cols.Array) public right = [];

  @action() public load(cols: IReactTable.Cols) {
    for (const col of cols)
      this[col.fixed in this ? col.fixed : 'center'].push(col);
  }
}

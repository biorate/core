import { IReactTable } from '../../interfaces';
import { Base, embed, observable, action } from './base';
import { Bounds } from './bounds';
import { Table } from './table';

export class Store extends Base implements IReactTable.Store {
  @observable() @embed(Store.Array) public headers: IReactTable.Headers = [];
  @observable() @embed(Store.Array) public items: IReactTable.Items = [];
  @embed(Bounds) public bounds: Bounds = null;
  @embed(Table) public table: Table = null;

  @action() public load(headers: IReactTable.Headers, items: IReactTable.Items) {
    this.headers = headers;
    this.items = items;
    this.table.calculate();
  }
}

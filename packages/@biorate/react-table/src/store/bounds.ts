import { Base, embed, observable, action } from './base';
import { IReactTable } from '../../interfaces';

export class Bounds extends Base implements IReactTable.Bounds {
  @observable() @embed(Bounds.Int) public offsetWidth = 0;
  @observable() @embed(Bounds.Int) public offsetHeight = 0;
}

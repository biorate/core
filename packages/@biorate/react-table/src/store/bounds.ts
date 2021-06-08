import { Base, embed, observable, action } from './base';
import { IReactTable } from '../../interfaces';

export class Bounds extends Base implements IReactTable.Bounds {
  @observable() @embed(Bounds.Int) public width = 0;
  @observable() @embed(Bounds.Int) public height = 0;
}

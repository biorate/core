import { Base, embed, observable } from './base';
import { IReactVirtualTable } from '../../interfaces';

/**
 * @description Store for container width and height.
 */
export class Bounds extends Base implements IReactVirtualTable.Bounds {
  @observable() @embed(Bounds.Int) public width = 0;
  @observable() @embed(Bounds.Int) public height = 0;
}

import { Base, observable, computed } from './base';
import { IReactVirtualTable } from '../../interfaces';

export class Pagination
  extends Base<IReactVirtualTable.Store>
  implements IReactVirtualTable.Pagination
{
  @observable() public count = 5;

  @computed() public get rows() {
    return (
      Math.floor(
        (this.parent.bounds.height -
          this.parent.scrollBarWidth -
          (this.parent.header ? this.parent.rowHeight : 0) -
          (this.parent.footer ? this.parent.rowHeight : 0)) /
          this.parent.rowHeight,
      ) - 1
    ); //TODO:
  }

  @computed() public get pages() {
    const result: number[] = [];
    const halfCount = Math.round(this.count / 2);
    if (this.rightSideReached)
      for (let i = this.total - this.count; i < this.total; i++) result.push(i + 1);
    else if (this.leftSideReached)
      for (let i = 0; i < this.count; i++) result.push(i + 1);
    else
      for (
        let i = this.page - halfCount + 1;
        i < this.total && result.length < this.count;
        i++
      )
        result.push(i + 1);
    return result.filter((i) => i > 0);
  }

  @computed() public get leftSideReached() {
    return this.page < Math.round(this.count / 2);
  }

  @computed() public get rightSideReached() {
    return this.page >= this.total - Math.round(this.count / 2);
  }

  @computed() public get page() {
    return Math.floor(this.from / this.rows);
  }

  @computed() public get total() {
    return Math.floor(this.parent.rawRows.length / this.rows);
  }

  @computed() public get from() {
    return Math.floor(this.parent.scrollTop / this.parent.rowHeight);
  }

  @computed() public get to() {
    return this.from + Math.ceil(this.parent.bounds.height / this.parent.rowHeight);
  }
}

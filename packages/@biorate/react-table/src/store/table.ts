import { IReactTable } from '../../interfaces';
import { Base, embed, observable, action, computed } from './base';

export class Table extends Base<IReactTable.Store> {
  @observable() @embed(Table.Int) public width = 0;
  @observable() @embed(Table.Int) public height = 0;
  @observable() @embed(Table.Int) public scrollLeft = 0;
  @observable() @embed(Table.Int) public scrollTop = 0;

  #defaultWidth = 100;
  #defaultHeight = 40;
  #deltaLeft = null;

  #width = () =>
    this.parent.headers.reduce(
      (memo, item) => ((memo += item.width ?? this.#defaultWidth), memo),
      0,
    );

  #height = () => this.parent.items.length * this.#defaultHeight;

  @computed() public get deltaLeft() {
    let sumWidth = 0;
    for (let i = 0; i < this.parent.headers.length; i++) {
      const header = this.parent.headers[i],
        width = header.width ?? this.#defaultWidth;
      sumWidth += width;
      if (sumWidth >= this.scrollLeft) return width - (sumWidth - this.scrollLeft);
    }
    return 0;
  }

  @computed() public get deltaTop() {
    const from = Math.ceil(this.scrollTop / this.#defaultHeight) * this.#defaultHeight;
    return from - this.scrollTop;
  }

  @computed() public get cols() {
    let result = [],
      sumWidth = 0;
    this.#deltaLeft = null;
    for (let i = 0; i < this.parent.headers.length; i++) {
      const header = this.parent.headers[i],
        width = header.width ?? this.#defaultWidth;
      sumWidth += width;
      if (sumWidth >= this.scrollLeft) {
        result.push(header);
        if (this.#deltaLeft === null)
          this.#deltaLeft = width - (sumWidth - this.scrollLeft);
      }
      if (sumWidth > this.scrollLeft + this.parent.bounds.offsetWidth) {
        break;
      }
    }
    return result;
  }

  @computed() public get rows() {
    const from = Math.floor(this.scrollTop / this.#defaultHeight);
    const to = Math.ceil(
      (this.scrollTop + this.parent.bounds.offsetHeight) / this.#defaultHeight,
    );
    return this.parent.items.slice(from, to + 2);
  }

  @action() public calculate() {
    this.width = this.#width();
    this.height = this.#height();
  }
}

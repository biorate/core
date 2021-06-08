// import { IReactTable } from '../../interfaces';
// import { Base, embed, observable, action, computed } from './base';
//
// export class Table extends Base<IReactTable.Store> {
//   @observable() @embed(Table.Int) public width = 0;
//   @observable() @embed(Table.Int) public height = 0;
//   @observable() @embed(Table.Int) public leftWidth = 0;
//   @observable() @embed(Table.Int) public rightWidth = 0;
//   @observable() @embed(Table.Int) public scrollLeft = 0;
//   @observable() @embed(Table.Int) public scrollTop = 0;
//
//   defaultWidth = 100;
//   defaultHeight = 52;
//
//   #width = () =>
//     this.parent.headers.reduce((memo, item) => {
//       memo += !item.fixed ? item.width ?? this.defaultWidth : 0;
//       return memo;
//     }, 0);
//
//   #fixedWidth = (position: 'left' | 'right') =>
//     this.parent.headers.reduce((memo, item) => {
//       memo += item.fixed === position ? item.width ?? this.defaultWidth : 0;
//       return memo;
//     }, 0);
//
//   #height = () => this.parent.items.length * this.defaultHeight;
//
//   @computed() public get deltaLeft() {
//     let sumWidth = this.leftWidth;
//     for (let i = 0; i < this.parent.headers.length; i++) {
//       const header = this.parent.headers[i],
//         width = header.width ?? this.defaultWidth;
//       if (header.fixed) continue;
//       sumWidth += width;
//       if (sumWidth >= this.scrollLeft) return sumWidth - this.scrollLeft - width;
//     }
//     return sumWidth;
//   }
//
//   @computed() public get deltaTop() {
//     return (
//       Math.floor(this.scrollTop / this.defaultHeight) * this.defaultHeight -
//       this.scrollTop
//     );
//   }
//
//   @computed() public get cols() {
//     let result = [],
//       sumWidth = 0;
//     for (let i = 0; i < this.parent.headers.length; i++) {
//       const header = this.parent.headers[i],
//         width = header.width ?? this.defaultWidth;
//       if (header.fixed) continue;
//       sumWidth += width;
//       if (sumWidth >= this.scrollLeft) result.push(header);
//       if (sumWidth > this.scrollLeft + this.parent.bounds.offsetWidth) break;
//     }
//     return result;
//   }
//
//   @computed() public get leftCols() {
//     let result = [];
//     for (let i = 0; i < this.parent.headers.length; i++) {
//       const header = this.parent.headers[i];
//       if (header.fixed === 'left') result.push(header);
//     }
//     return result;
//   }
//
//   @computed() public get rightCols() {
//     let result = [];
//     for (let i = 0; i < this.parent.headers.length; i++) {
//       const header = this.parent.headers[i];
//       if (header.fixed === 'right') result.push(header);
//     }
//     return result;
//   }
//
//   @computed() public get rows() {
//     const from = Math.floor(this.scrollTop / this.defaultHeight);
//     const to = from + Math.ceil(this.parent.bounds.offsetHeight / this.defaultHeight);
//     return this.parent.items.slice(from, to);
//   }
//
//   @action() public calculate() {
//     this.height = this.#height();
//     this.width = this.#width();
//     this.leftWidth = this.#fixedWidth('left');
//     this.rightWidth = this.#fixedWidth('right');
//   }
// }

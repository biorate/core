import $ from './row.module.less';
import * as React from 'react';
import { Store } from './store';
import { observer } from 'mobx-react';
import { Component } from './component';

@observer
export class Row extends Component {
  props: {
    store: Store;
    value?: any;
    offsetX?: number;
    offsetY?: number;
    deltaX?: number;
    deltaY?: number;
  };

  public get offsetX() {
    return this.props.offsetX ?? 0;
  }

  public get offsetY() {
    return this.props.offsetY ?? 0;
  }

  public get deltaX() {
    return this.props.deltaX ?? 0;
  }

  public get deltaY() {
    return this.props.deltaY ?? 0;
  }

  public render() {
    return (
      <div
        className={$.row}
        style={{
          transform: `translate3d(${-this.deltaX}px, ${this.deltaY}px, 0px)`,
          width: this.store.bounds.offsetWidth,
        }}
      >
        <div
          style={{ transform: `translate3d(${this.offsetX}px, 0px, 0px)` }}
          className={$.left}
        ></div>
        <div
          className={$.center}
          style={{
            transform: `translate3d(${this.store.table.scrollLeft}px, ${this.offsetY}px, 0px)`,
          }}
        >
          {this.store.table.cols.map((item, index) => (
            <div className={$.col} style={{ width: item.width ?? 100 }} key={item.field}>
              {item.field} - {this.props.value?.[item.field]}
            </div>
          ))}
        </div>
        <div
          style={{ transform: `translate3d(${this.offsetX}px, 0px, 0px)` }}
          className={$.right}
        ></div>
      </div>
    );
  }
}

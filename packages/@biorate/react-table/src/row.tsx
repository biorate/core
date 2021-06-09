import $ from './row.module.less';
import * as React from 'react';
import { Store } from './store';
import { observer } from 'mobx-react';
import { Component } from './component';

@observer
export class Row extends Component {
  #transform = (x = 0, y = 0, z = 0) => {
    return { transform: `translate3d(${x}px, ${y}px, ${z}px)` };
  };

  public props: {
    store: Store;
    render?: (...args: any) => any;
    rootOffsetX?: number;
    rootOffsetY?: number;
    centerOffsetX?: number;
    centerOffsetY?: number;
  };

  public render() {
    return (
      <div
        className={$.row}
        style={{
          ...this.#transform(this.props.rootOffsetX, this.props.rootOffsetY),
          // width: this.store.bounds.width,
        }}
      >
        <div
          style={{
            height: this.store.rowHeight,
            // ...this.#transform(this.offsetX),
          }}
          className={$.left}
        >
          {this.store.cols.left.map((item, index) => (
            <div className={$.col} style={{ width: item.width ?? 100 }} key={item.field}>
              {item.field}
            </div>
          ))}
        </div>
        <div
          className={$.center}
          style={{
            ...this.#transform(this.props.centerOffsetX, this.props.centerOffsetY),
            height: this.store.rowHeight,
            // ...this.#transform(this.offsetX),
          }}
        >
          {this.store.cols.center.map((item, index) => (
            <div className={$.col} style={{ width: item.width ?? 100 }} key={item.field}>
              {this.props.render?.(item) ?? item.field}
            </div>
          ))}
        </div>
        <div
          style={{
            height: this.store.rowHeight,
            // ...this.#transform(this.offsetX),
          }}
          className={$.right}
        >
          {this.store.cols.right.map((item, index) => (
            <div className={$.col} style={{ width: item.width ?? 100 }} key={item.field}>
              {item.field}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

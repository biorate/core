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
    last?: boolean;
    render?: (...args: any) => any;
    rootOffsetX?: number;
    rootOffsetY?: number;
    centerOffsetX?: number;
    centerOffsetY?: number;
    rightRowGap?: number;
  };

  protected border(index: number) {
    // return index === 0
    //   ? `1px ${this.store.border}px ${this.props.last ? 1 : 0}px ${this.store.border}px`
    //   : `1px ${this.store.border}px ${this.props.last ? 1 : 0}px 0`;
    return index === 0
      ? `0 ${this.store.border}px 0 ${this.store.border}px`
      : `0 ${this.store.border}px 0 0`;
  }

  public render() {
    return (
      <div
        className={$.row}
        style={{
          borderWidth: `1px 0 ${this.props.last ? 1 : 0}px 0`,
          ...this.#transform(this.props.rootOffsetX, this.props.rootOffsetY),
        }}
      >
        <div
          style={{
            height: this.store.rowHeight,
          }}
          className={$.left}
        >
          {this.store.cols.left.map((item, index) => (
            <div
              className={$.col}
              style={{
                borderWidth: this.border(index),
                width: item.width ?? 100,
              }}
              key={item.field}
            >
              {item.field}
            </div>
          ))}
        </div>
        <div
          className={$.center}
          style={{
            marginLeft: this.store.marginLeft,
            height: this.store.rowHeight,
            ...this.#transform(this.props.centerOffsetX, this.props.centerOffsetY),
          }}
        >
          {this.store.cols.center.map((item, index) => (
            <div
              className={$.col}
              style={{
                borderWidth: this.border(index),
                width: item.width ?? 100,
              }}
              key={item.field}
            >
              {this.props.render?.(item) ?? item.field}
            </div>
          ))}
        </div>
        <div
          style={{
            height: this.store.rowHeight,
          }}
          className={$.right}
        >
          {this.store.cols.right.map((item, index) => (
            <div
              className={$.col}
              style={{
                borderWidth: this.border(index),
                width:
                  (item.width ?? 100) +
                  (this.store.cols.right.length - 1 === index
                    ? this.props.rightRowGap ?? 0
                    : 0),
              }}
              key={item.field}
            >
              {item.field}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

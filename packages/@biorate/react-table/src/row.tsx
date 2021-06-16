import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Component } from './component';
import { Col } from './col';

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

  public render() {
    return (
      <div
        className="virtual-table__row"
        style={{
          borderWidth: `${this.store.border}px 0 ${
            this.props.last ? this.store.border : 0
          }px 0`,
          ...this.#transform(this.props.rootOffsetX, this.props.rootOffsetY),
        }}
      >
        <div
          style={{
            height: this.store.rowHeight,
            boxShadow:
              this.store.scrollLeft > 0 ? '6px 0 6px -4px rgb(0 0 0 / 15%)' : null,
          }}
          className="virtual-table__left"
        >
          {this.store.cols.left.map((item, index) => (
            <Col key={index} store={this.store} column={item} index={index} />
          ))}
        </div>
        <div
          className="virtual-table__center"
          style={{
            marginLeft: this.store.marginLeft,
            height: this.store.rowHeight,
            ...this.#transform(this.props.centerOffsetX, this.props.centerOffsetY),
          }}
        >
          {this.store.cols.center.map((item, index) => (
            <Col key={index} store={this.store} column={item} index={index} />
          ))}
        </div>
        <div
          style={{
            height: this.store.rowHeight,
            boxShadow: '-6px 0 6px -4px rgb(0 0 0 / 15%)',
          }}
          className="virtual-table__right"
        >
          {this.store.cols.right.map((item, index) => (
            <Col
              key={index}
              store={this.store}
              column={item}
              index={index}
              width={
                (item.width ?? this.store.colWidth) +
                (this.store.cols.right.length - 1 === index
                  ? this.props.rightRowGap ?? 0
                  : 0)
              }
              render={this.props.render}
            />
          ))}
        </div>
      </div>
    );
  }
}

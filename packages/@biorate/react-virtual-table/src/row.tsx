import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Component } from './component';
import { Col } from './col';

@observer
export class Row extends Component {
  #transform = (x = 0, y = 0) => {
    return { transform: `translate(${x}px, ${y}px)` };
  };

  #over = (hover: boolean) => this.props.hover && this.setState({ hover });

  public props: {
    store: Store;
    last?: boolean;
    render?: (...args: unknown[]) => unknown;
    rootOffsetX?: number;
    rootOffsetY?: number;
    centerOffsetX?: number;
    centerOffsetY?: number;
    rightRowGap?: number;
    hover?: boolean;
  };

  public state = { hover: false };

  public render() {
    return (
      <div
        className="virtual-table__row"
        onPointerOver={() => this.#over(true)}
        onPointerOut={() => this.#over(false)}
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
            boxShadow: this.store.leftScrollReached
              ? null
              : '6px 0 6px -4px rgb(0 0 0 / 15%)',
          }}
          className={classNames('virtual-table__left', { hover: this.state.hover })}
        >
          {this.store.cols.left.map((item, index) => (
            <Col
              key={index}
              store={this.store}
              column={item}
              index={index}
              render={this.props.render}
            />
          ))}
        </div>
        <div
          className={classNames('virtual-table__center', { hover: this.state.hover })}
          style={{
            height: this.store.rowHeight,
            marginLeft: this.store.marginLeft,
            ...this.#transform(this.props.centerOffsetX, this.props.centerOffsetY),
          }}
        >
          {this.store.cols.center.map((item, index) => (
            <Col
              key={index}
              store={this.store}
              column={item}
              index={index}
              render={this.props.render}
            />
          ))}
        </div>
        <div
          style={{
            height: this.store.rowHeight,
            boxShadow: this.store.rightScrollReached
              ? null
              : '-6px 0 6px -4px rgb(0 0 0 / 15%)',
          }}
          className={classNames('virtual-table__right', { hover: this.state.hover })}
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

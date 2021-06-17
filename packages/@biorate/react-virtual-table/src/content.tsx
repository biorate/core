import * as React from 'react';
import { Component } from './component';
import { Body } from './body';
import { Store } from './store';
import { IReactTable } from '../interfaces';

export class Content extends Component {
  public props: {
    store: Store;
    render?: (
      row: IReactTable.Row,
      col: IReactTable.Column,
      index: number,
      rows: IReactTable.Rows,
    ) => any;
  };

  #onScroll = (e) => {
    const { scrollLeft, scrollTop, clientWidth } = e.target;
    this.store.scroll(scrollLeft, scrollTop, clientWidth);
  };

  public render() {
    return (
      <div className="virtual-table__content" onScroll={this.#onScroll}>
        <Body store={this.store} render={this.props.render} />
      </div>
    );
  }
}

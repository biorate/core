import * as React from 'react';
import { Component } from './component';
import { Body } from './body';

export class Content extends Component {
  #onScroll = (e) => {
    const { scrollLeft, scrollTop } = e.target;
    this.store.scroll(scrollLeft, scrollTop);
  };

  public render() {
    return (
      <div className="virtual-table__content" onScroll={this.#onScroll}>
        <Body store={this.store} />
      </div>
    );
  }
}

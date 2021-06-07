import $ from './content.module.less';
import * as React from 'react';
import { Component } from './component';
import { Body } from './body';

export class Content extends Component {
  #onScroll = (e) => {
    const { scrollLeft, scrollTop } = e.target;
    this.store.table.set({ scrollLeft, scrollTop });
  };

  public render() {
    return (
      <div className={$.content} onScroll={this.#onScroll}>
        <Body store={this.store} />
      </div>
    );
  }
}

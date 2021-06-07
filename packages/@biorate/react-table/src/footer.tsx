import $ from './footer.module.less';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';
import { Row } from './row';

@observer
export class Footer extends Component {
  public render() {
    return (
      <div
        className={$.footer}
        style={{ transform: `translate3d(${-this.store.table.scrollLeft}px, 0px, 0px)` }}
      >
        <Row store={this.store} deltaX={this.store.table.deltaLeft} />
      </div>
    );
  }
}

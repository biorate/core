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
        // style={{ transform: `translate3d(${-this.store.table.scrollLeft}px, 0px, 0px)` }}
      >
        <Row
          store={this.store}
          centerOffsetX={this.store.gapLeft}
          rightRowGap={this.store.scrollBarWidth}
          // offsetX={this.store.scrollLeft}
        />
      </div>
    );
  }
}

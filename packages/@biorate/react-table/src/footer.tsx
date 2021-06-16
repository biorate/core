import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';
import { Row } from './row';

@observer
export class Footer extends Component {
  public render() {
    return (
      <div className="virtual-table__footer">
        <Row
          store={this.store}
          last={true}
          centerOffsetX={this.store.gapLeft}
          rightRowGap={this.store.scrollBarWidth}
        />
      </div>
    );
  }
}

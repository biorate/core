import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';
import { Row } from './row';
import { Store } from './store';
import { IReactVirtualTable } from '../interfaces';

@observer
export class Footer extends Component {
  public props: {
    store: Store;
    render?: (col: IReactVirtualTable.Column) => unknown;
  };

  public render() {
    return (
      <div className="virtual-table__footer">
        <Row
          render={this.props.render}
          store={this.store}
          last={true}
          centerOffsetX={this.store.gapLeft}
          rightRowGap={this.store.scrollBarWidth}
        />
      </div>
    );
  }
}

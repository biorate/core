import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';
import { Row } from './row';
import { Store } from './store';
import { IReactTable } from '../interfaces';

@observer
export class Header extends Component {
  public props: {
    store: Store;
    render?: (col: IReactTable.Column) => any;
  };

  public render() {
    return (
      <div className="virtual-table__header">
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

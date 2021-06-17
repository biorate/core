import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';
import { Row } from './row';
import { Store } from './store';
import { IReactTable } from '../interfaces';

@observer
export class Body extends Component {
  public props: {
    store: Store;
    render?: (
      row: IReactTable.Row,
      col: IReactTable.Column,
      index: number,
      rows: IReactTable.Rows,
    ) => any;
  };

  public render() {
    return (
      <div className="virtual-table__body" style={{ height: this.store.height }}>
        <div style={{ height: 1, width: this.store.width }} />
        {this.store.rows.map((row, index) => (
          <Row
            render={(col: IReactTable.Column) =>
              this.props.render?.(row, col, index, this.store.rows) ?? row[col.field]
            }
            last={index === this.store.rows.length - 1}
            key={index}
            store={this.store}
            rootOffsetX={this.store.scrollLeft}
            rootOffsetY={this.store.scrollTop + this.store.gapTop}
            centerOffsetX={this.store.gapLeft}
          />
        ))}
      </div>
    );
  }
}

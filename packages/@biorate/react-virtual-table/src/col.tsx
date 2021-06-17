import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Component } from './component';
import { IReactTable } from '../interfaces';

@observer
export class Col extends Component {
  public props: {
    store: Store;
    index: number;
    column: IReactTable.Column;
    width?: number;
    render?: (col: IReactTable.Column) => unknown;
  };

  protected get border() {
    return this.props.index === 0
      ? `0 ${this.store.border}px 0 ${this.store.border}px`
      : `0 ${this.store.border}px 0 0`;
  }

  public render() {
    return (
      <div
        className="virtual-table__col"
        style={{
          borderWidth: this.border,
          width: this.props.width ?? this.props.column.width ?? this.store.colWidth,
        }}
      >
        {this.props.render?.(this.props.column) ?? this.props.column.field}
      </div>
    );
  }
}

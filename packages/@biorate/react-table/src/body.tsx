import $ from './body.module.less';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';
import { Row } from './row';

@observer
export class Body extends Component {
  public render() {
    return (
      <div className={$.body} style={{ height: this.store.height }}>
        <div style={{ height: 1, width: this.store.width }} />
        {this.store.rows.map((item, index) => (
          <Row
            render={(header) => item[header.field]}
            key={index}
            store={this.store}
            // offsetX={this.store.scrollLeft}
            // deltaX={this.store.table.scrollLeft}
            // offsetY={this.store.table.scrollTop}
            // deltaX={this.store.table.deltaLeft}
          />
        ))}
      </div>
    );
  }
}

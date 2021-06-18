import * as React from 'react';
import { observer } from 'mobx-react';
import { Component } from './component';

@observer
export class Pagination extends Component {
  // public props: {
  //   store: Store;
  // };

  public render() {
    return (
      <div className="virtual-table__pagination">
        <ul className="virtual-table__pagination-ul">
          <li className="virtual-table__pagination-li border">{'<'}</li>
          <li className="virtual-table__pagination-li">...</li>
          <li className="virtual-table__pagination-li border">1</li>
          <li className="virtual-table__pagination-li border">2</li>
          <li className="virtual-table__pagination-li border">3</li>
          <li className="virtual-table__pagination-li">...</li>
          <li className="virtual-table__pagination-li border">{'>'}</li>
        </ul>
      </div>
    );
  }
}

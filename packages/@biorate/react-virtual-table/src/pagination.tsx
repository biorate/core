import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Component } from './component';

@observer
export class Pagination extends Component {
  public render() {
    return (
      <div className="virtual-table__pagination">
        <ul className="virtual-table__pagination-ul">
          <li
            className="virtual-table__pagination-li border"
            onClick={() => this.store.paginate(0)}
          >
            {'<<'}
          </li>
          <li
            className="virtual-table__pagination-li border"
            onClick={() => this.store.paginate(this.store.pagination.page - 1)}
          >
            {'<'}
          </li>
          <li className="virtual-table__pagination-li">...</li>
          {this.store.pagination.pages.map((item) => (
            <li
              key={item}
              className={classNames('virtual-table__pagination-li', 'border', {
                selected: item - 1 === this.store.pagination.page,
              })}
              onClick={() => this.store.paginate(item - 1)}
            >
              {item}
            </li>
          ))}
          <li className="virtual-table__pagination-li">...</li>
          <li
            className="virtual-table__pagination-li border"
            onClick={() => this.store.paginate(this.store.pagination.page + 1)}
          >
            {'>'}
          </li>
          <li
            className="virtual-table__pagination-li border"
            onClick={() => this.store.paginate(this.store.pagination.total - 1)}
          >
            {'>>'}
          </li>
        </ul>
      </div>
    );
  }
}

import './style.less';
import * as React from 'react';
import { Store } from './store';
import { Header } from './header';
import { Content } from './content';
import { Footer } from './footer';
import { Pagination } from './pagination';
import { IReactTable } from '../interfaces';

export class Table extends React.Component {
  props: {
    headers: IReactTable.Columns;
    items: IReactTable.Rows;
    border?: number;
    render?: {
      content?: (
        row: IReactTable.Row,
        col: IReactTable.Column,
        index: number,
        rows: IReactTable.Rows,
      ) => unknown;
      header?: (col: IReactTable.Column) => unknown;
      footer?: (col: IReactTable.Column) => unknown;
    };
    'no-header'?: boolean;
    'no-footer'?: boolean;
  };

  #bounds = React.createRef<HTMLDivElement>();
  #store = new Store().initialize();

  #load = () => {
    const { offsetWidth: width, offsetHeight: height } = this.#bounds.current;
    this.#store.load(
      this.props.headers,
      this.props.items,
      { width, height },
      this.props.border,
      !this.props['no-header'],
      !this.props['no-footer'],
    );
  };

  public componentDidMount() {
    window.addEventListener('resize', this.#load);
    this.#load();
  }

  public componentDidUpdate() {
    this.#load();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.#load);
  }

  public render() {
    return (
      <div ref={this.#bounds} className="virtual-table">
        {this.props['no-header'] ?? (
          <Header store={this.#store} render={this.props.render?.header} />
        )}
        <Content store={this.#store} render={this.props.render?.content} />
        {this.props['no-footer'] ?? (
          <Footer store={this.#store} render={this.props.render?.footer} />
        )}
        {this.props['no-paginator'] ?? (
          <Pagination store={this.#store} />
        )}
      </div>
    );
  }
}

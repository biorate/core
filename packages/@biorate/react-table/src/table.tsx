import './table.less';
import * as React from 'react';
import { Store } from './store';
import { Header } from './header';
import { Content } from './content';
import { Footer } from './footer';
import { IReactTable } from '../interfaces';

export class Table extends React.Component {
  props: { headers: IReactTable.Columns; items: IReactTable.Rows; border?: number };

  #bounds = React.createRef<HTMLDivElement>();
  #store = new Store().initialize();

  #load = () => {
    const { offsetWidth: width, offsetHeight: height } = this.#bounds.current;
    this.#store.load(
      this.props.headers,
      this.props.items,
      { width, height },
      this.props.border,
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
        <Header store={this.#store} />
        <Content store={this.#store} />
        <Footer store={this.#store} />
      </div>
    );
  }
}

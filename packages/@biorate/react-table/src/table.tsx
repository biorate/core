import $ from './table.module.less';
import * as React from 'react';
import { Store } from './store';
import { Header } from './header';
import { Content } from './content';
import { Footer } from './footer';
import { IReactTable } from '../interfaces';

export class Table extends React.Component {
  props: { headers: IReactTable.Headers; items: IReactTable.Items };

  #bounds = React.createRef<HTMLDivElement>();
  #store = new Store().initialize();

  #onResize = () => {
    const { offsetWidth, offsetHeight } = this.#bounds.current;
    this.#store.bounds.set({ offsetWidth, offsetHeight });
  };

  public componentDidMount() {
    this.#store.load(this.props.headers, this.props.items);
    window.addEventListener('resize', this.#onResize);
    this.#onResize();
  }

  public componentDidUpdate() {
    this.#store.load(this.props.headers, this.props.items);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.#onResize);
  }

  public render() {
    return (
      <div ref={this.#bounds} className={$.table}>
        <Header store={this.#store} />
        <Content store={this.#store} />
        <Footer store={this.#store} />
      </div>
    );
  }
}

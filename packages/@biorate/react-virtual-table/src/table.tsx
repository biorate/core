import './style.less';
import * as React from 'react';
import { Store } from './store';
import { Header } from './header';
import { Content } from './content';
import { Footer } from './footer';
import { Pagination } from './pagination';
import { IReactVirtualTable } from '../interfaces';

/**
 * @description
 * Table with full rows and columns virtualization
 *
 * Demo [here](https://biorate.github.io/core/demo/@biorate/react-virtual-table/index.html)
 *
 * ### Simple example:
 * @example
 * ```ts
 * import * as React from 'react';
 * import { render } from 'react-dom';
 * import { Table } from '@biorate/react-virtual-table';
 *
 * render(
 *   <Table
 *     width={800}
 *     height={375}
 *     headers={[
 *       {
 *         title: `Field 1`,
 *         field: `field_1`,
 *         width: 400,
 *       },
 *       {
 *         title: `Field 2`,
 *         field: `field_2`,
 *         width: 400,
 *       },
 *       {
 *         title: `Field 3`,
 *         field: `field_3`,
 *         width: 400,
 *       },
 *     ]}
 *     items={[
 *       {
 *         field_1: 0,
 *         field_2: 0,
 *         field_3: 0,
 *       },
 *       {
 *         field_1: 1,
 *         field_2: 1,
 *         field_3: 1,
 *       },
 *       {
 *         field_1: 2,
 *         field_2: 2,
 *         field_3: 2,
 *       },
 *       {
 *         field_1: 3,
 *         field_2: 3,
 *         field_3: 3,
 *       },
 *       {
 *         field_1: 4,
 *         field_2: 4,
 *         field_3: 4,
 *       },
 *     ]}
 *   />,
 *   document.getElementById('root'),
 * );
 * ```
 *
 * ### Huge data example:
 * @example
 * ```ts
 * import * as React from 'react';
 * import { render } from 'react-dom';
 * import { range, random } from 'lodash';
 * import { Table } from '@biorate/react-virtual-table';
 * let j = 0;
 *
 * render(
 *   <Table
 *     style={{
 *       position: 'absolute',
 *       top: '50%',
 *       left: '50%',
 *       transform: 'translate(-50%, -50%)',
 *       width: 1500,
 *       height: 600,
 *     }}
 *     headers={range(0, 1000).map((item) => ({
 *       fixed: [0, 1].includes(item) ? 'left' : [3, 5].includes(item) ? 'right' : undefined,
 *       title: `Field ${item}`,
 *       field: `field_${item}`,
 *       width: random(100, 200),
 *     }))}
 *     items={range(0, 10000).map(() => {
 *       const item = {};
 *       for (const i of range(0, 1000)) item[`field_${i}`] = j++;
 *       return item;
 *     })}
 *   />,
 *   document.getElementById('root'),
 * );
 * ```
 */
export class Table extends React.Component {
  props: {
    /**
     * @description Declaring headers
     */
    headers: IReactVirtualTable.Columns;
    /**
     * @description Array of objects for render
     */
    items: IReactVirtualTable.Rows;
    /**
     * @description Table width
     */
    width?: number;
    /**
     * @description Table height
     */
    height?: number;
    /**
     * @description Css styles of table wrapper
     */
    style?: Record<string, any>;
    /**
     * @description Table borders width
     */
    border?: number;
    /**
     * @description Render functions for override
     */
    render?: {
      /**
       * @description Content render function, returns row value by **default**
       */
      content?: (
        row: IReactVirtualTable.Row,
        col: IReactVirtualTable.Column,
        index: number,
        rows: IReactVirtualTable.Rows,
      ) => unknown;
      /**
       * @description Header render function, returns header title (or header field, if title not exists) by **default**
       */
      header?: (col: IReactVirtualTable.Column) => unknown;
      /**
       * @description Header render function, returns row field name by **default**
       */
      footer?: (col: IReactVirtualTable.Column) => unknown;
    };
    /**
     * @description Paginator settings
     */
    pagination?: IReactVirtualTable.PaginationProps;
    /**
     * @description Don't render header, **false** by default
     */
    'no-header'?: boolean;
    /**
     * @description Don't render footer, **false** by default
     */
    'no-footer'?: boolean;
    /**
     * @description Don't render paginator, **false** by default
     */
    'no-paginator'?: boolean;
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
      this.props.pagination,
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
      <div
        ref={this.#bounds}
        className="virtual-table"
        style={{
          width: this.props.width,
          height: this.props.height,
          ...this.props.style,
        }}
      >
        {this.props['no-header'] ?? (
          <Header store={this.#store} render={this.props.render?.header} />
        )}
        <Content store={this.#store} render={this.props.render?.content} />
        {this.props['no-footer'] ?? (
          <Footer store={this.#store} render={this.props.render?.footer} />
        )}
        {this.props['no-paginator'] ?? <Pagination store={this.#store} />}
      </div>
    );
  }
}

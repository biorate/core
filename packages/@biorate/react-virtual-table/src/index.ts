/**
 * @description
 * Table with full rows and columns virtualization.
 *
 * @example
 * ```tsx
 * import * as React from 'react';
 * import { render } from 'react-dom';
 * import { Table } from '@biorate/react-virtual-table';
 * import '@biorate/react-virtual-table/dist/style.css';
 *
 * render(
 *   <Table
 *     width={800}
 *     height={375}
 *     headers={[
 *       { title: 'Field 1', field: 'field_1', width: 400 },
 *       { title: 'Field 2', field: 'field_2', width: 400 },
 *     ]}
 *     items={[
 *       { field_1: 0, field_2: 0 },
 *       { field_1: 1, field_2: 1 },
 *     ]}
 *   />,
 *   document.getElementById('root'),
 * );
 * ```
 */
export { Table } from './table';

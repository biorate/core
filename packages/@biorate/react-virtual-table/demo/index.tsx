import * as React from 'react';
import { render } from 'react-dom';
import { range, random } from 'lodash';
import { Table } from '../src';
let j = 0;

render(
  <Table
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 1500,
      height: 600,
    }}
    render={
      {
        // header(col) {
        //   console.log(col);
        //   return 1;
        // },
        // footer(col) {
        //   console.log(col);
        //   return 1;
        // },
        // content(row, col, index, rows) {
        //   console.log(row, col, index, rows);
        //   return 1;
        // },
      }
    }
    // no-footer
    // no-header
    // no-paginator
    headers={range(0, 1000).map((item) => ({
      fixed: [0, 1].includes(item) ? 'left' : [3, 5].includes(item) ? 'right' : undefined,
      title: `Field ${item}`,
      field: `field_${item}`,
      width: random(100, 200),
      // width: 200, //sum: 1600 x 4000
    }))}
    items={range(0, 10000).map(() => {
      const item = {};
      for (const i of range(0, 1000)) item[`field_${i}`] = j++;
      return item;
    })}
    // pagination={{ count: 10 }}
  />,
  document.getElementById('root'),
);

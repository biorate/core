import * as React from 'react';
import { render } from 'react-dom';
import { range, random } from 'lodash';
import { Table } from '../src';
let j = 0;

render(
  <div className="container">
    <Table
      headers={range(0, 100).map((item) => ({
        title: `Field ${item}`,
        field: `field_${item}`,
        width: random(100, 500),
      }))}
      items={range(0, 100).map(() => {
        const item = {};
        for (const i of range(0, 100)) item[`field_${i}`] = j++;
        return item;
      })}
    />
  </div>,
  document.getElementById('root'),
);

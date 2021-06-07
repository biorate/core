import * as React from 'react';
import { render } from 'react-dom';
import { range, random } from 'lodash';
import { Table } from '../src';

render(
  <div className="container">
    <Table
      headers={range(0, 100).map((item) => ({
        title: `Field ${item}`,
        field: `field_${item}`,
        width: random(100, 500),
      }))}
      items={range(0, 100).map((index) => {
        const item = {};
        for (const i of range(0, 100)) item[`field_${i}`] = index * i;
        return item;
      })}
    />
  </div>,
  document.getElementById('root'),
);

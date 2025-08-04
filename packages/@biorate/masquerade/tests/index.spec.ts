import { expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import './__mocks__';
import { mask } from '../src';

use(jestSnapshotPlugin());

describe('@biorate/masquerade', function () {
  it('process', () => {
    expect(mask.processJSON({ email: 'test@email.com' })).toMatchSnapshot();
  });
});

import { expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import './__mocks__';
import { Masquerade } from '../src';

use(jestSnapshotPlugin());

describe('@biorate/masquerade', function () {
  it('process', () => {
    expect(Masquerade.processJSON({ email: 'test@email.com' })).toMatchSnapshot();
  });
});

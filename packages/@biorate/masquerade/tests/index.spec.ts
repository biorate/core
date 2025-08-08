import { expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { text } from './__mocks__';
import { Masquerade } from '../src';

use(jestSnapshotPlugin());

describe('@biorate/masquerade', function () {
  it('processJSON', () => {
    expect(
      Masquerade.processJSON({ email: 'test@email.com' }, { emailFields: ['email'] }),
    ).toMatchSnapshot();
  });

  it('processString', () => {
    expect(Masquerade.processString(text)).toMatchSnapshot();
  });
});

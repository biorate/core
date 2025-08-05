import { expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import './__mocks__';
import { Masquerade } from '../src';

use(jestSnapshotPlugin());

describe('@biorate/masquerade', function () {
  it('processJSON', () => {
    expect(
      Masquerade.processJSON({ email: 'test@email.com' }, { emailFields: ['email'] }),
    ).toMatchSnapshot();
  });

  it('processString (email)', () => {
    expect(
      Masquerade.processString('Contact: user@example.com or support@company.co!'),
    ).toMatchSnapshot();
  });

  it('processString (phone)', () => {
    expect(
      Masquerade.processString(
        'Contact us at +1 (800) 555-1234, 555-1234, or 1234567890. 79261536163',
      ),
    ).toMatchSnapshot();
  });

  it('processString (card)', () => {
    expect(
      Masquerade.processString(
        'Карты: 4111 1111 1111 1111 (Visa), 5500-0000-0000-0004 (MC), 340000000000009 (Amex)',
      ),
    ).toMatchSnapshot();
  });

  it('processString (common)', () => {
    expect(
      Masquerade.processString(
        `Contact: user@example.com or support@company.co!
        Contact us at +1 (800) 555-1234, 555-1234, or 1234567890. 79231231224,
        Карты: 4111 1111 1111 1111 (Visa), 5500-0000-0000-0004 (MC), 340000000000009 (Amex),`,
      ),
    ).toMatchSnapshot();
  });
});

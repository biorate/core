import { expect } from 'vitest';
import { text } from './__mocks__';
import { Masquerade } from '../src';

describe('@biorate/masquerade', () => {
  it('processJSON', () => {
    expect(
      Masquerade.processJSON({ email: 'test@email.com' }, { emailFields: ['email'] }),
    ).toMatchSnapshot();
  });

  it('processString', () => {
    expect(Masquerade.processString(text)).toMatchSnapshot();
  });
});

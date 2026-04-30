import { expect } from 'vitest';
import { getRequire } from '../src/require';

describe('node-tools', () => {
  it('getRequire', () => expect(getRequire()).toMatchSnapshot());
});

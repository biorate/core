import { expect } from 'chai';
import { encode, decode } from '../../src';

export const check = (data: unknown) => expect(data).to.deep.equal(decode(encode(data)));

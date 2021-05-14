import { assert } from 'chai';
import { IDefine } from '../interfaces';
// import { define } from '../src';
import { prop } from './__mocks__/define';

describe('define', () => {
  for (const property of ['configurable', 'enumerable', 'writable'])
    it(`define prop [${property}]`, () =>
      assert(prop(property[0] as unknown as IDefine.Mods)[property]));

  it('define prop [configurable & writable]', () => {
    const descriptor = prop('ce');
    assert(descriptor.configurable);
    assert(descriptor.enumerable);
  });

  it('define prop [enumerable & writable]', () => {
    const descriptor = prop('we');
    assert(descriptor.writable);
    assert(descriptor.enumerable);
  });

  it('define prop [configurable & enumerable]', () => {
    const descriptor = prop('ce');
    assert(descriptor.configurable);
    assert(descriptor.enumerable);
  });

  it('define prop [configurable & enumerable & writable]', () => {
    const descriptor = prop('cwe');
    assert(descriptor.configurable);
    assert(descriptor.enumerable);
    assert(descriptor.writable);
  });
});

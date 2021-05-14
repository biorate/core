import { assert } from 'chai';
// import { define } from '../src';
import { prop } from './__mocks__/define';

describe('define', () => {
  it('define prop [configurable]', () => {
    assert(Object.getOwnPropertyDescriptor(prop('c'), 'a').configurable);
  });

  it('define prop [enumerable]', () => {
    assert(Object.getOwnPropertyDescriptor(prop('e'), 'a').enumerable);
  });

  it('define prop [writable]', () => {
    assert(Object.getOwnPropertyDescriptor(prop('w'), 'a').writable);
  });

  it('define prop [configurable & writable]', () => {
    const object = prop('ce');
    assert(Object.getOwnPropertyDescriptor(object, 'a').configurable);
    assert(Object.getOwnPropertyDescriptor(object, 'a').enumerable);
  });

  it('define prop [enumerable & writable]', () => {
    const object = prop('we');
    assert(Object.getOwnPropertyDescriptor(object, 'a').writable);
    assert(Object.getOwnPropertyDescriptor(object, 'a').enumerable);
  });

  it('define prop [configurable & enumerable]', () => {
    const object = prop('ce');
    assert(Object.getOwnPropertyDescriptor(object, 'a').configurable);
    assert(Object.getOwnPropertyDescriptor(object, 'a').enumerable);
  });

  it('define prop [configurable & enumerable & writable]', () => {
    const object = prop('cwe');
    assert(Object.getOwnPropertyDescriptor(object, 'a').configurable);
    assert(Object.getOwnPropertyDescriptor(object, 'a').enumerable);
    assert(Object.getOwnPropertyDescriptor(object, 'a').writable);
  });
});

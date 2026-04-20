import { expect } from 'vitest';
import { writeValue, readValue, checkLength } from './__mocks__/buffer';
import { UInt29OutOfBoundsError } from '../src';

describe('buffer', function () {
  describe('writeUInt29', function () {
    it('write uInt29 1 byte length', () => writeValue(1, 127));
    it('write uInt29 2 byte length', () => writeValue(2, 16383));
    it('write uInt29 3 byte length', () => writeValue(3, 2097151));
    it('write uInt29 4 byte length', () => writeValue(4, 536870911));
    it('overflow MAX_UINT29', () => expect(() => writeValue(4, 536870912)).to.throw(UInt29OutOfBoundsError));
    it('overflow MIN_UINT29', () => expect(() => writeValue(1, -1)).to.throw(UInt29OutOfBoundsError));
  });

  describe('readUInt29', function () {
    it('read uInt29 1 byte length', () => readValue(1, 127));
    it('read uInt29 2 byte length', () => readValue(2, 16383));
    it('read uInt29 3 byte length', () => readValue(3, 2097151));
    it('read uInt29 4 byte length', () => readValue(4, 536870911));
  });

  describe('uInt29BytesLength', function () {
    it('get length of uInt29 1 byte length', () => checkLength(1, 127));
    it('get length of uInt29 2 byte length', () => checkLength(2, 16383));
    it('get length of uInt29 3 byte length', () => checkLength(3, 2097151));
    it('get length of uInt29 4 byte length', () => checkLength(4, 536870911));
    it('overflow MAX_UINT29', () => expect(() => checkLength(4, 536870912)).to.throw(UInt29OutOfBoundsError));
    it('overflow MIN_UINT29', () => expect(() => checkLength(1, -1)).to.throw(UInt29OutOfBoundsError));
  });
});

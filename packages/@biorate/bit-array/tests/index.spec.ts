import { assert } from 'chai';
import { BitArray } from '../src';

describe('@biorate/bit-array', function () {
  it('get, set, remove', () => {
    const bits = new BitArray();
    for (let i = 31; i--; )
      assert.equal(
        bits.get(i),
        0,
        `${i} index has value '${bits.get(i)}' in empty BitArray`,
      );
    for (let i = 31; i--; ) {
      bits.set(i);
      assert.equal(
        bits.get(i),
        1,
        `${i} index has value '${bits.get(i)}', but 'set' is called`,
      );
    }
    for (let i = 31; i--; ) {
      bits.remove(i);
      assert.equal(
        bits.get(i),
        0,
        `${i} index has value '${bits.get(i)}', but 'remove' is called`,
      );
    }
  });

  it('value', () => {
    const bits = new BitArray();
    bits.set(0);
    bits.set(1);
    assert.equal(bits.value(0, 1), 3);
    bits.set(4);
    bits.set(5);
    assert.equal(bits.value(4, 5), 3);
    assert.equal(bits.value(0, 4), 3);
    assert.equal(bits.value(2, 6), 0);
  });

  it('define', () => {
    const bitArr = new BitArray();
    bitArr.define(3);
    assert.equal(bitArr.toInt(), 3);
  });

  it('bits', () => {
    let res;
    const bitArr = new BitArray();
    bitArr.set(0);
    bitArr.set(1);
    res = BitArray.bits(bitArr.toInt());
    assert.equal(bitArr.toInt(), bitArr.value(...res));
    res = bitArr.bits(bitArr.toInt());
    assert.equal(bitArr.toInt(), bitArr.value(...res));
  });

  it('overflow', () => {
    const bitArr = new BitArray();
    assert.throws(() => {
      bitArr.set(31);
    });
  });

  it('empty remove', () => {
    const bitArr = new BitArray();
    bitArr.remove(0);
  });

  it('toInt, valueOf', () => {
    const bitArr = new BitArray();
    bitArr.set(0);
    assert.equal(bitArr.toInt(), 1);
    assert.equal(bitArr.valueOf(), 1);
  });

  it('toBinary', () => {
    let string = '';
    const bitArr = new BitArray();
    for (let i = 0; i < 31; i++) {
      bitArr.set(i);
      string += '1';
      assert.equal(bitArr.toBinary(), string);
    }
  });

  it('clear', () => {
    const bitArr = new BitArray();
    for (let i = 31; i--; ) bitArr.set(i);
    bitArr.clear();
    assert.equal(bitArr.toInt(), 0);
  });
});

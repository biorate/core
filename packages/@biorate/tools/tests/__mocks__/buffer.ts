import { expect } from 'vitest';
import { buffer as b } from '../../src';

export function writeValue(length: number, value: number) {
  const buffer = Buffer.allocUnsafe(length);
  b.writeUInt29(buffer, value);
  expect(buffer.length).to.be.equal(length);
}

export function readValue(length: number, value: number) {
  const buffer = Buffer.allocUnsafe(length);
  b.writeUInt29(buffer, value);
  expect(b.readUInt29(buffer)).to.be.equal(value);
}

export function checkLength(length: number, value: number) {
  expect(b.uInt29BytesLength(value)).to.be.equal(length);
}

export const uInt29BytesLength = b.uInt29BytesLength;

import { UInt29OutOfBoundsError } from './errors';

/**
 * @description Max uInt29 value
 */
export const MAX_UINT29 = 536870911;

/**
 * @description Min uInt29 value
 */
export const MIN_UINT29 = 0;

/**
 * @description Write uInt29 to buffer
 * @param buffer - Buffer to write
 * @param value - Value to write into buffer
 * @param offset - Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 1.
 * @return - offset plus the number of bytes written.
 */
export function writeUInt29(buffer: Buffer, value: number, offset = 0) {
  if (value > MAX_UINT29 || value < MIN_UINT29)
    throw new UInt29OutOfBoundsError(value, MAX_UINT29, MIN_UINT29);
  if (value < 0x80) {
    offset = buffer.writeUInt8(value, offset);
    return offset;
  }
  if (value < 0x4000) {
    offset = buffer.writeUInt8(0x80 | ((value >> 7) & 0x7f), offset);
    offset = buffer.writeUInt8(value & 0x7f, offset);
    return offset;
  }
  if (value < 0x200000) {
    offset = buffer.writeUInt8(0x80 | ((value >> 14) & 0x7f), offset);
    offset = buffer.writeUInt8(0x80 | ((value >> 7) & 0x7f), offset);
    offset = buffer.writeUInt8(value & 0x7f, offset);
    return offset;
  }
  offset = buffer.writeUInt8(0x80 | ((value >> 22) & 0x7f), offset);
  offset = buffer.writeUInt8(0x80 | ((value >> 15) & 0x7f), offset);
  offset = buffer.writeUInt8(0x80 | ((value >> 8) & 0x7f), offset);
  offset = buffer.writeUInt8(value & 0xff, offset);
  return offset;
}

/**
 * @description Read uInt29 from buffer
 * @param buffer - Buffer to read
 * @param offset - Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 1.
 */
export function readUInt29(buffer: Buffer, offset = 0) {
  let value: number, byte: number;
  byte = buffer.readUInt8(offset);
  if (byte < 0x80) return byte;
  value = (byte & 0x7f) << 7;
  byte = buffer.readUInt8(++offset);
  if (byte < 0x80) return value | byte;
  value = (value | (byte & 0x7f)) << 7;
  byte = buffer.readUInt8(++offset);
  if (byte < 0x80) return value | byte;
  value = (value | (byte & 0x7f)) << 8;
  byte = buffer.readUInt8(++offset);
  return value | byte;
}

/**
 * @description Get UInt29 bytes length
 */
export function uInt29BytesLength(value: number) {
  if (value > MAX_UINT29 || value < MIN_UINT29)
    throw new UInt29OutOfBoundsError(value, MAX_UINT29, MIN_UINT29);
  if (value < 0x80) return 1;
  if (value < 0x4000) return 2;
  if (value < 0x200000) return 3;
  return 4;
}

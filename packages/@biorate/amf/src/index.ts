// Internal buffer for encoding
let tempBuffer = Buffer.allocUnsafe(1024);

// Internal buffer current offset
let tempPos = 0;

// Index for string reference encoding
let encodeCounter = 0;

// Storage for string reference encoding
let encodeCache: Record<string, number> = {};

// Storage for string reference decoding
let decodeCache: string[] = [];

/**
 * @description Resize buffer twice
 * @param {number} byte
 */
function resize(byte: number) {
  tempBuffer = Buffer.concat([tempBuffer, Buffer.allocUnsafe(byte)]);
}

/**
 * @description Write data to buffer
 * @param {*} data - Data to serialize and write
 */
function write(data: any) {
  tempPos = 0;
  encodeCounter = 0;
  encodeCache = {};
  writeValue(data);
  return tempBuffer.slice(0, tempPos);
}

/**
 * @description Check type of data and write recursive
 * @param {*} data - Data to serialize and write
 */
function writeValue(data: any) {
  if (data === undefined) return writeByte(0);
  if (data === null) return writeByte(1);
  if (data === false) return writeByte(2);
  if (data === true) return writeByte(3);

  var type = typeof data;

  if (type === 'number') {
    if (data >= 0 && data < 0x10000000 && data % 1 === 0) writeInt(data);
    else writeFloat(data);
  } else if (type === 'string') {
    writeString(data);
  } else if (Array.isArray(data)) {
    writeArray(data);
  } else if (type === 'object') {
    if (data instanceof Date) writeDate(data);
    else writeObject(data);
  } else {
    throw new Error(`${type} types not supported. Please check input data.`);
  }
}

/**
 * @description Write Date to internal buffer
 * @param {Number} value - Value to write
 */
function writeDate(value: Date) {
  writeByte(8);
  writeFloat(value.getTime(), false);
}

/**
 * @description Write byte to internal buffer
 * @param {Number} value - Value to write
 */
function writeByte(value: number) {
  if (tempBuffer.length <= tempPos) resize(1);
  tempBuffer.writeUInt8(value, tempPos);
  tempPos += 1;
}

/**
 * @description Write float64 to internal buffer
 * @param {Number} value - Value to write
 * @param {Boolean} [marker=true] - False if float marker should not be written
 */
function writeFloat(value: number, marker = true) {
  if (marker !== false) writeByte(5);
  if (tempBuffer.length <= tempPos + 8) resize(8);
  tempBuffer.writeDoubleBE(value, tempPos);
  tempPos += 8;
}

/**
 * @description Write uInt29 to internal buffer
 * @param {Number} value - Value to write
 * @param {Boolean} [marker=true] - False if int marker should not be written
 */
function writeInt(value: number, marker = true) {
  if (marker !== false) writeByte(4);
  if (value < 0x80) {
    writeByte(value);
    return;
  }
  if (value < 0x4000) {
    writeByte(0x80 | ((value >> 7) & 0x7f));
    writeByte(value & 0x7f);
    return;
  }
  if (value < 0x200000) {
    writeByte(0x80 | ((value >> 14) & 0x7f));
    writeByte(0x80 | ((value >> 7) & 0x7f));
    writeByte(value & 0x7f);
    return;
  }
  writeByte(0x80 | ((value >> 22) & 0x7f));
  writeByte(0x80 | ((value >> 15) & 0x7f));
  writeByte(0x80 | ((value >> 8) & 0x7f));
  writeByte(value & 0xff);
}

/**
 * @description Write string to internal buffer
 * @param {String} value - String to write
 * @param {Boolean} [marker=true] - False if int marker should not be wrote
 */
function writeString(value: string, marker = true) {
  let index = encodeCache[value];

  if (marker !== false) writeByte(6);

  if (index !== undefined) {
    writeInt(index << 1, false);
    return;
  }

  index = Buffer.byteLength(value);
  writeInt((index << 1) + 1, false);

  if (index) {
    encodeCache[value] = encodeCounter;
    ++encodeCounter;
    if (tempBuffer.length <= tempPos + index) resize(index);
    tempBuffer.write(value, tempPos);
    tempPos += index;
  }
}

/**
 * @description Write array to internal buffer
 * @param {Array} value - Array to write
 */
function writeArray(value: unknown[]) {
  let len = value.length;

  writeByte(9);
  writeInt((len << 1) + 1, false);
  writeString('', false);

  for (let i = 0; i < len; ++i) {
    // Should we check for function type?
    // We write size of array before, and should add one more loop for check
    // It will be expensive
    writeValue(value[i]);
  }
}

/**
 * @description Write object to internal buffer
 * @param {Object} value - Object to write
 */
function writeObject(value: Record<string, unknown>) {
  writeByte(10);
  writeInt(11, false);
  writeString('', false);

  let keys = Object.keys(value);

  for (let i = 0, l = keys.length; i < l; ++i) {
    let name = keys[i];
    let item = value[name];

    // For consistency, we should remove this check
    // But objects frequently have methods
    if (typeof item === 'function')
      throw new Error(`Function types not supported. Please check input data.`);

    writeString(name, false);
    writeValue(item);
  }

  writeString('', false);
}

/**
 * @description Deserialize AMF3 byte buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function read<T = any>(buffer: Buffer): T {
  tempPos = 0;
  decodeCache.length = 0;

  return readValue(buffer);
}

/**
 * @description Check flag type and read unserialized value
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readValue(buffer: Buffer): any {
  switch (readByte(buffer)) {
    case 0:
      return undefined;
    case 1:
      return null;
    case 2:
      return false;
    case 3:
      return true;
    case 4:
      return readInt(buffer);
    case 5:
      return readFloat(buffer);
    case 6:
      return readString(buffer);
    case 8:
      return readDate(buffer);
    case 9:
      return readArray(buffer);
    case 10:
      return readObject(buffer);
  }
}

/**
 * @description Read byte from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readByte(buffer: Buffer) {
  tempPos += 1;
  return buffer.readUInt8(tempPos - 1);
}

/**
 * @description Read Date object from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readDate(buffer: Buffer) {
  tempPos += 8;
  return new Date(buffer.readDoubleBE(tempPos - 8));
}

/**
 * @description Read float64 from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readFloat(buffer: Buffer) {
  tempPos += 8;
  return buffer.readDoubleBE(tempPos - 8);
}

/**
 * @description Read int29 from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readInt(buffer: Buffer) {
  let value: number;
  let byte: number;

  byte = readByte(buffer);
  if (byte < 0x80) return byte;

  value = (byte & 0x7f) << 7;
  byte = readByte(buffer);
  if (byte < 0x80) return value | byte;

  value = (value | (byte & 0x7f)) << 7;
  byte = readByte(buffer);
  if (byte < 0x80) return value | byte;

  value = (value | (byte & 0x7f)) << 8;
  byte = readByte(buffer);
  return value | byte;
}

/**
 * @description Read string from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readString(buffer: Buffer) {
  let len = readInt(buffer);

  if ((len & 1) === 0) return decodeCache[len >> 1];

  len = len >> 1;

  let string = '';

  if (len) {
    string = buffer.toString('utf8', tempPos, tempPos + len);
    decodeCache.push(string);
    tempPos += len;
  }

  return string;
}

/**
 * @description Read array from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readArray(buffer: Buffer) {
  let len = readInt(buffer);
  len = len >> 1;

  readString(buffer);

  let result = [];

  for (let i = 0; i < len; ++i) result.push(readValue(buffer));

  return result;
}

/**
 * @description Read object from buffer
 * @param {Buffer} buffer - AMF3 bytes buffer
 */
function readObject(buffer: Buffer) {
  let name;
  readInt(buffer);
  readString(buffer);

  let result: Record<string, unknown> = {};

  while ((name = readString(buffer))) result[name] = readValue(buffer);

  return result;
}

/**
 * @description AMF3 encode function
 *
 * Links:
 * - [wikipedia](https://en.wikipedia.org/wiki/Action_Message_Format)
 * - [specification] https://www.adobe.com/content/dam/acom/en/devnet/pdf/amf-file-format-spec.pdf
 *
 * Limitations:
 * - Function is not supported
 * - XML is not supported
 * - ByteArray is not supported
 * - Dictionary is not supported
 * - Vectors is not supported
 *
 * @example
 * ```ts
 * import { encode } from '@biorate/amf';
 *
 * const buffer = encode({ test: 1 });
 *
 * console.log(buffer); // <Buffer 0a 0b 01 09 74 65 73 74 04 01 01>
 * ```
 */
export const encode = write;

/**
 * @description AMF3 decode function
 *
 * Limitations:
 *   - see encode description section
 *
 * @example
 * ```ts
 * import { encode, decode } from '@biorate/amf';
 *
 * const buffer = encode({ test: 1 });
 *
 * console.log(decode(buffer)); // { test: 1 }
 * ```
 */
export const decode = read;

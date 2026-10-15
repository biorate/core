# @biorate/bit-array

Bit array class — compact 31-bit storage with bit-level set/remove/get operations and value packing.

## Features

- **31-bit storage** — supported index range 0–30 (avoids JS signed 32-bit sign bit).
- **`set` / `remove` / `get`** — individual bit manipulation.
- **`value()`** — pack selected bits into a compact number by position.
- **`bits()`** — extract indices of set bits from a number.
- **`toBinary()` / `toInt()` / `valueOf()`** — conversion helpers.
- **Static helper** — `BitArray.bits(value)` — extract set bit indices without an instance.
- **Zero dependencies** — pure JS, no runtime libraries.

## Installation

```bash
pnpm add @biorate/bit-array
```

No runtime dependencies.

## Quick start

```ts
import { BitArray } from '@biorate/bit-array';

const bits = new BitArray();

bits.set(0);
bits.set(3);
bits.set(5);

console.log(bits.get(0)); // 1
console.log(bits.get(1)); // 0
console.log(bits.toInt()); // 41  (2^0 + 2^3 + 2^5)

bits.remove(3);
console.log(bits.toInt()); // 33  (2^0 + 2^5)

console.log(bits.toBinary()); // '100001'
```

## Module reference

### `BitArray` — Main class

```ts
import { BitArray } from '@biorate/bit-array';
```

#### Constructor

| Constructor            | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `new BitArray(value?)` | Initialise with optional starting value (default `0`). |

#### Static members

| Member          | Signature                     | Description                                                             |
| --------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `BitArray.bits` | `(value: number) => number[]` | Given a number, returns array of indices where bits are 1 (range 0–30). |

#### Instance members

| Member     | Signature                                | Description                                                            |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `set`      | `(index: number, offset?: number): void` | Set bit at index (optionally shifted by offset). Throws if index > 30. |
| `remove`   | `(index: number): void`                  | Clear bit at index. No-op if already 0.                                |
| `get`      | `(index: number): 0 \| 1`                | Read bit value. Throws if index > 30.                                  |
| `value`    | `(...bits: number[]): number`            | Pack multiple bits into a number: each bit at position `i`.            |
| `bits`     | `(value: number): number[]`              | Instance wrapper around `BitArray.bits()`.                             |
| `define`   | `(value: number): void`                  | Overwrite internal storage.                                            |
| `clear`    | `(): void`                               | Reset to 0.                                                            |
| `toBinary` | `(): string`                             | Binary string representation.                                          |
| `toInt`    | `(): number`                             | Raw integer value.                                                     |
| `valueOf`  | `(): number`                             | JS coercion hook — delegates to `toInt()`.                             |

## Usage patterns

### Flag management

```ts
const READ = 0,
  WRITE = 1,
  EXECUTE = 2,
  DELETE = 3;

const permissions = new BitArray();
permissions.set(READ);
permissions.set(WRITE);
permissions.set(EXECUTE);

console.log(permissions.get(DELETE)); // 0
```

### Packing bits into a compact value

```ts
// Extract bits 0 and 2, pack into result: bit0→pos0, bit2→pos1
const result = bits.value(0, 2);
// result = (get(0) << 0) | (get(2) << 1)
```

## Architecture

```
BitArray
│
├── #value: number             Internal 32-bit storage (bits 0-30)
│
├── #checkIndex(index)         Guard: throw if index > 30
├── #get(index)                Raw read: (value & (1 << index)) ? 1 : 0
│
├── set(i, offset)             value |= 1 << (i + offset)
├── remove(i)                  if #get(i): value ^= 1 << i
├── get(i)                     #get(i)
├── value(...bits)             result |= (get(bit) << i) for each
├── bits(value)                 loop 0-30 (i <= 30), push if value & (1 << i)
└── toBinary()                 value.toString(2)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/bit_array.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/bit-array/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/bit-array/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

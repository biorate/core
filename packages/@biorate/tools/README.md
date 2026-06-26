# @biorate/tools

Collection of low‑level JavaScript/TypeScript utilities used across the `@biorate` monorepo.

## Features

- **`define`** — `Object.defineProperty` shorthand with `cwe` modifier strings.
- **`object`** — accessor detection, prototype walking, key sorting.
- **`path`** — file path utilities built on Node `path` module.
- **`env`** — runtime environment detection (`isServer`, `globalThis` polyfill).
- **`timer`** — promise-wrapped `setTimeout`, `process.nextTick`, `setImmediate`.
- **`time`** — `process.hrtime`-based diff and unit conversion.
- **`events`** — promisified `.once()` for `EventEmitter`.
- **`buffer`** — UInt29 variable-length integer encode/decode (AMF protocol).
- **`stream`** — load a readable stream into a `Buffer`.
- **`import`** — CJS‑to‑ESM default export unwrapping.
- **`errors`** — typed error classes: `UInt29OutOfBoundsError`, `TimeIncorrectFormatError`.

## Installation

```bash
pnpm add @biorate/tools
```

## Module reference

### `env` — Runtime environment

```ts
import { env } from '@biorate/tools';
```

| Export       | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| `globalThis` | `any`     | Polyfill — resolved via `Function('return this')()`.                        |
| `isServer`   | `boolean` | `true` if `globalThis.window !== globalThis` (i.e. not a browser).          |

**Example:**

```ts
import { env } from '@biorate/tools';

if (env.isServer) {
  console.log('Running on Node.js');
}
```

---

### `define` — Property / accessor definition

```ts
import { define } from '@biorate/tools';
```

Shorthand for `Object.defineProperty`. Both `prop` and `accessor` accept a **`cwe` modifier string**:

| Char | Flag           |
|------|----------------|
| `c`  | `configurable` |
| `w`  | `writable`     |
| `e`  | `enumerable`   |

#### `define.prop(context, field?, value?, mods?)`

Returns a chainable function when partially applied.

```ts
const obj = {};

define.prop(obj, 'a', 1, 'cwe')  // configurable + writable + enumerable
       ('b', 2, 'c')             // configurable only
       ('c', 3, '');             // none

console.log(obj); // { a: 1 }

Object.getOwnPropertyDescriptor(obj, 'a');
// { value: 1, writable: true, enumerable: true, configurable: true }

Object.getOwnPropertyDescriptor(obj, 'b');
// { value: 2, writable: false, enumerable: false, configurable: true }

Object.getOwnPropertyDescriptor(obj, 'c');
// { value: 3, writable: false, enumerable: false, configurable: false }
```

#### `define.accessor(context, field?, accessor?, mods?)`

Same curried pattern for getters/setters.

```ts
const obj = { _value: 0 };

define.accessor(obj, 'value', {
  get() { return this._value; },
  set(v: number) { this._value = v; },
}, 'cw');

Object.getOwnPropertyDescriptor(obj, 'value');
// { get: [Function], set: [Function], enumerable: false, configurable: true }
```

---

### `object` — Object helpers

```ts
import { object } from '@biorate/tools';
```

#### `object.isAccessor(obj, field): boolean`

Checks if a property is defined via getter/setter.

```ts
const obj = { get x() { return 1; } };
console.log(object.isAccessor(obj, 'x')); // true
console.log(object.isAccessor(obj, 'y')); // false
```

#### `object.walkProto(obj, callback?)`

Walks the prototype chain, invoking `callback` for each prototype (stops before `Object`).

```ts
class A {}
class B extends A {}
class C extends B {}

object.walkProto(new C(), console.log);
// B {}
// A {}
```

#### `object.kSort(obj): Record<string, unknown>`

Returns a new object with keys sorted alphabetically.

```ts
console.log(object.kSort({ b: 1, a: 2, d: 3, c: 4 }));
// { a: 2, b: 1, c: 3, d: 4 }
```

---

### `path` — File path utilities

```ts
import { path } from '@biorate/tools';
```

| Function    | Signature                        | Description                                    |
|-------------|----------------------------------|------------------------------------------------|
| `dirname`   | `(filepath, full?)`              | Last directory component (`full=true` → full path). |
| `basename`  | `(filepath, ext?)`               | File name, strips `.js` by default.            |
| `extname`   | `(filepath)`                     | File extension (e.g. `.html`).                 |
| `create`    | `(...args)`                      | `path.join` + `normalize`.                     |

```ts
console.log(path.dirname('/www/root/index.html'));        // root
console.log(path.dirname('/www/root/index.html', true));  // /www/root
console.log(path.basename('/www/root/index.js'));         // index
console.log(path.basename('/www/root/index.html'));       // index.html  (no .html to strip)
console.log(path.basename('/www/root/index.html', '.html')); // index
console.log(path.extname('/www/root/index.html'));        // .html
console.log(path.create('www', 'root/a/b/', '/c/', '', '/index.js'));
// www/root/a/b/c/index.js
```

---

### `timer` — Promise-based delays

```ts
import { timer } from '@biorate/tools';
```

| Export      | Signature             | Description                                  |
|-------------|-----------------------|----------------------------------------------|
| `wait`      | `(timeout?)`          | Resolves after `timeout` ms (`setTimeout`).  |
| `tick`      | `()`                  | Resolves on next tick (`process.nextTick`).  |
| `immediate` | `()`                  | Resolves via `setImmediate`.                 |

```ts
await timer.wait(1000);   // wait 1 second
await timer.tick();       // yield to next tick
await timer.immediate();  // yield to check phase
```

---

### `time` — Elapsed time & unit conversion

```ts
import { time } from '@biorate/tools';
```

#### `time.diff(): () => number`

Returns a closure that captures `process.hrtime()` start. Each call returns elapsed milliseconds (microsecond precision).

```ts
const elapsed = time.diff();
// ... do work ...
console.log(elapsed()); // e.g. 12.345
console.log(elapsed()); // cumulative, growing
```

#### `time.msTo(ms, format?, digits?): number`

Converts milliseconds to another unit. Round if `digits >= 0`.

| Format | Unit         |
|--------|--------------|
| `'µs'` | Microseconds |
| `'ms'` | Milliseconds |
| `'s'`  | Seconds      |
| `'m'`  | Minutes      |
| `'h'`  | Hours        |
| `'d'`  | Days         |

```ts
console.log(time.msTo(1500, 's'));       // 1.5
console.log(time.msTo(86400000, 'd'));   // 1
console.log(time.msTo(1234, 's', 2));    // 1.23
```

Throws `TimeIncorrectFormatError` on unknown format.

---

### `events` — EventEmitter promisified

```ts
import { events } from '@biorate/tools';
```

#### `events.once(object, event): Promise<unknown[]>`

Returns a Promise that resolves with the event arguments the next time `event` is emitted.

```ts
import { EventEmitter } from 'events';
import { events } from '@biorate/tools';

const emitter = new EventEmitter();
const promise = events.once(emitter, 'data');
emitter.emit('data', 1, 2, 3);
const args = await promise;
console.log(args); // [1, 2, 3]
```

Accepts any object with `on` / `once` signature (`IEventLike`).

---

### `buffer` — UInt29 variable-length integer encoding

```ts
import { buffer } from '@biorate/tools';
```

Implements the AMF0/AMF3 UInt29 wire format (used in Adobe Flash protocols).

| Export                 | Type         | Description                                       |
|------------------------|--------------|---------------------------------------------------|
| `MAX_UINT29`           | `536870911`  | `(1 << 29) - 1`                                   |
| `MIN_UINT29`           | `0`          | Minimum value.                                    |
| `writeUInt29`          | `(buf, val, offset?) => number` | Encodes `val` at `offset`, returns new offset. |
| `readUInt29`           | `(buf, offset?) => number`      | Decodes value from `offset`.              |
| `uInt29BytesLength`    | `(val) => number`               | Bytes needed to encode (1–4).             |

**Encoding** produces 1–4 bytes depending on value range:

| Range             | Bytes |
|-------------------|-------|
| `0`–`0x7F`        | 1     |
| `0x80`–`0x3FFF`   | 2     |
| `0x4000`–`0x1FFFFF` | 3   |
| `0x200000`–`0x1FFFFFFF` | 4 |

**Throws** `UInt29OutOfBoundsError` if value is outside `[0, 536870911]`.

```ts
import { buffer } from '@biorate/tools';

const buf = Buffer.alloc(4);
const end = buffer.writeUInt29(buf, 300);
console.log(end);        // 2
console.log(buf);        // <82 ac>  (two bytes)

const val = buffer.readUInt29(buf);
console.log(val);        // 300

console.log(buffer.uInt29BytesLength(300));   // 2
console.log(buffer.uInt29BytesLength(0x7F));  // 1
console.log(buffer.uInt29BytesLength(536870911)); // 4
```

---

### `stream` — Stream to Buffer

```ts
import { stream } from '@biorate/tools';
```

#### `stream.load(readable): Promise<Buffer>`

Reads all data from a readable stream into a single `Buffer`. Listens to `data`, `error`, and `end` events.

```ts
import { createReadStream } from 'fs';
import { stream } from '@biorate/tools';

const data = await stream.load(createReadStream('/path/to/file'));
console.log(data.length);
```

---

### `import` — CJS default-export unwrapping

```ts
import { unwrapCjsDefaultExport } from '@biorate/tools';
```

#### `unwrapCjsDefaultExport<T>(mod, moduleLabel?, maxDepth?): T`

Recursively unwraps `{ default: ... }` wrappers produced when ESM `import` consumes a CJS module with `__esModule + exports.default` (common in packages like `inversify-inject-decorators`).

```ts
const getDecorators = unwrapCjsDefaultExport(importedModule, 'my-pkg');
```

Throws `TypeError` if a function is not resolved within `maxDepth` iterations (default 4).

---

### `errors` — Typed error classes

```ts
import { UInt29OutOfBoundsError, TimeIncorrectFormatError } from '@biorate/tools';
```

| Error                       | Thrown by                        | Message                                           |
|-----------------------------|----------------------------------|---------------------------------------------------|
| `UInt29OutOfBoundsError`    | `buffer.writeUInt29`, `uInt29BytesLength` | `UInt29 value is out of bounds [0], shoud be >= [0], and <= [536870911]` |
| `TimeIncorrectFormatError`  | `time.msTo`                      | `Time incorrect format: [xyz]`                    |

Both extend `BaseError` from `@biorate/errors`.

---

## Module index

| Export          | Source        | Description                             |
|-----------------|---------------|-----------------------------------------|
| **Flat**        |               |                                         |
| `unwrapCjsDefaultExport` | `import.ts` | CJS default‑export unwrapping.        |
| `UInt29OutOfBoundsError` | `errors.ts` | Buffer range error.                   |
| `TimeIncorrectFormatError` | `errors.ts` | Time format error.                   |
| `IDefine`       | `interfaces.ts` | `Mods` union & `Accessor` descriptor. |
| `IEventLike`    | `interfaces.ts` | EventEmitter duck-type.               |
| **Namespaced**  |               |                                         |
| `env`           | `env.ts`      | `globalThis`, `isServer`.               |
| `define`        | `define.ts`   | `prop`, `accessor`.                     |
| `object`        | `object.ts`   | `isAccessor`, `walkProto`, `kSort`.     |
| `path`          | `path.ts`     | `dirname`, `basename`, `extname`, `create`. |
| `timer`         | `timer.ts`    | `wait`, `tick`, `immediate`.            |
| `time`          | `time.ts`     | `diff`, `msTo`.                         |
| `events`        | `events.ts`   | `once`.                                 |
| `buffer`        | `buffer.ts`   | `MAX_UINT29`, `MIN_UINT29`, `writeUInt29`, `readUInt29`, `uInt29BytesLength`. |
| `stream`        | `stream.ts`   | `load`.                                 |

## Architecture

```
@biorate/tools
│
├── env                          Runtime detection
│   ├── globalThis               globalThis polyfill
│   └── isServer                 Server vs browser
│
├── define                       Object.defineProperty shorthand
│   ├── prop                     Data property (cwe string)
│   └── accessor                 Getter/setter (ce string)
│
├── object                       Object introspection
│   ├── isAccessor               Getter/setter check
│   ├── walkProto                Prototype chain walk
│   └── kSort                    Key-sorted clone
│
├── path                         File path utilities
│   ├── dirname                  Short/full directory
│   ├── basename                 Name without ext
│   ├── extname                  Extension
│   └── create                   Normalised join
│
├── timer                        Promise-based scheduling
│   ├── wait                     setTimeout wrapper
│   ├── tick                     nextTick wrapper
│   └── immediate                setImmediate wrapper
│
├── time                         High-res timing
│   ├── diff                     hrtime closure
│   └── msTo                     Unit conversion
│
├── events                       EventEmitter helpers
│   └── once                     Promisified .once()
│
├── buffer                       UInt29 (variable-length int)
│   ├── MAX_UINT29               Max value (2^29 - 1)
│   ├── MIN_UINT29               Min value (0)
│   ├── writeUInt29              Encode to buffer
│   ├── readUInt29               Decode from buffer
│   └── uInt29BytesLength        Bytes needed for encode
│
├── stream                       Stream utilities
│   └── load                     Stream → Buffer
│
├── import                       CJS/ESM interop
│   └── unwrapCjsDefaultExport   Recursive default unwrap
│
└── errors                       Error classes
    ├── UInt29OutOfBoundsError
    └── TimeIncorrectFormatError
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/tools.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/tools/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/tools/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

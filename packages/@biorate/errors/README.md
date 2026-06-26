# @biorate/errors

Base class for creating typed, code‑based error classes with structured metadata and `util.format`‑style message templates.

## Features

- **Error code** — auto‑derived from the constructor name (`e.code === 'MyError'`).
- **Templated message** — uses `util.format` `%s` / `%d` / `%j` placeholders.
- **Structured metadata** — any extra payload attached via the `meta` getter.
- **Zero dependencies** in runtime — only built‑in `util` module.
- **Full Error contract** — preserves `stack`, `message`, `name`, and `captureStackTrace`.

## Installation

```bash
pnpm add @biorate/errors
```

## Quick start

```ts
import { BaseError } from '@biorate/errors';

class MyError extends BaseError {
  constructor(args?: unknown[], meta?: unknown) {
    super('Something happened at %s, code %d', args, meta);
  }
}

const err = new MyError([new Date(), 42], { userId: 1 });

console.log(err.code);    // "MyError"
console.log(err.message); // "Something happened at Sun Jun ... 2025, code 42"
console.log(err.meta);    // { userId: 1 }
console.log(err.stack);   // Full stack trace
```

## API Reference

### `BaseError`

| Member             | Type                         | Description                                              |
|--------------------|------------------------------|----------------------------------------------------------|
| `constructor`      | `(message, args?, meta?, ...options?)` | Template string with positional `util.format` args.      |
| `.message`         | `string`                     | Formatted message (inherited from `Error`).              |
| `.code`            | `string`                     | Returns `this.constructor.name`.                         |
| `.meta`            | `unknown`                    | Arbitrary metadata payload (second constructor arg).     |
| `.stack`           | `string \| undefined`        | Stack trace (V8 `captureStackTrace` when available).     |

### Constructor signature

```ts
new BaseError(message: string, args?: unknown[], meta?: unknown, ...options: unknown[]);
```

- **`message`** — template using `%s`, `%d`, `%j`, `%%` etc. (Node.js `util.format`).
- **`args`** — array of values injected into the template.
- **`meta`** — any extra data stored on `this.meta`.
- **`...options`** — additional arguments forwarded to `Error` constructor (e.g. `options.cause`).

## Usage patterns

### Basic typed errors

```ts
class NotFoundError extends BaseError {
  constructor(id: string) {
    super('Resource not found: %s', [id]);
  }
}

throw new NotFoundError('user_42');
// NotFoundError: Resource not found: user_42
```

### Errors with structured metadata

```ts
class ValidationError extends BaseError {
  constructor(field: string, value: unknown) {
    super('Validation failed for [%s]', [field], { field, value });
  }
}

const e = new ValidationError('email', 'invalid');
console.log(e.meta); // { field: 'email', value: 'invalid' }
```

### Overriding HTTP status via `meta`

```ts
class PaymentError extends BaseError {
  constructor(msg: string) {
    super(msg, undefined, { status: 402 });
  }
}

const e = new PaymentError('Insufficient funds');
console.log(e.meta); // { status: 402 }
```

This pattern is used by `AllExceptionsFilter` from `@biorate/nestjs-tools` to return proper HTTP status codes.

### Serialization with `toJSON`

```ts
class ApiError extends BaseError {
  constructor(code: number, message: string) {
    super('%s', [message], { status: code });
  }

  toJSON() {
    return { code: this.code, message: this.message, meta: this.meta };
  }
}

console.log(JSON.stringify(new ApiError(400, 'bad request')));
// {"code":"ApiError","message":"bad request","meta":{"status":400}}
```

## Architecture

```
┌─────────────────┐
│   BaseError     │  extends  Error
├─────────────────┤
│  #meta: any     │
│  .code          │  → constructor.name
│  .message       │  → util.format(template, ...args)
│  .meta          │  → #meta getter
│  .stack         │  → Error.captureStackTrace
└─────────────────┘
        ▲
        │ extends
┌───────────────────┐
│   MyAwesomeError  │  ← custom error per domain
│   super(msg,args, │
│     meta)         │
└───────────────────┘
```

## Best practices

1. **One class per error type** — allows `instanceof` checks and `catch` filtering.
2. **Use `%s` placeholders** for dynamic values, never string concatenation in the template.
3. **Add `meta.status`** for HTTP errors to propagate status codes to NestJS filters.
4. **Keep class names descriptive** — they become `e.code`, visible in logs.

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/errors.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/errors/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/errors/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

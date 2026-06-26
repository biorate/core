# @biorate/masquerade

Redact sensitive information in strings and JSON objects via configurable masking pipelines.

## Features

- **JSON masking** — mask field values by field name patterns via `maskdata` (`maskJSON2`).
- **String masking** — chainable regex‑based masks (`EmailMask`, `PhoneMask`, `CardMask`).
- **Configurable** — mask character, enabled/disabled, per‑mask options.
- **DI‑aware** — integrates with `@biorate/inversion`; reads config from `Masquerade` key.
- **Extensible** — extend `CommonMask` to add custom regex‑based masks.

## Installation

```bash
pnpm add @biorate/masquerade
```

Requires `maskdata`, `@biorate/config`, `@biorate/inversion`, `@biorate/tools`.

## Quick start

### JSON masking

```ts
import { Masquerade } from '@biorate/masquerade';

Masquerade.configure({ maskJSON2: { emailFields: ['email'] } });

const result = Masquerade.processJSON({ email: 'test@email.com' });
console.log(result); // { email: 'tes*@*******om' }
```

### String masking

```ts
import { Masquerade, EmailMask, PhoneMask, CardMask } from '@biorate/masquerade';

Masquerade.use(EmailMask).use(PhoneMask).use(CardMask);

const result = Masquerade.processString(
  `user@example.com, +79231231224, 4111 1111 1111 1111 (Visa)`,
);
console.log(result);
// u***@**********m, +*******1224, **** **** **** 1111 (Visa)
```

## API Reference

### `Masquerade` class

| Method              | Description                                          |
|---------------------|------------------------------------------------------|
| `configure(config)` | Merge global config (accepts `null` to no‑op).       |
| `use(Mask)`         | Register a string mask (chainable).                  |
| `unuse(Mask)`       | Remove a string mask.                                |
| `processJSON(data)` | Apply `maskdata.maskJSON2` on an object.             |
| `processString(str)`| Run all registered string masks on text.             |

### Built‑in masks

| Mask         | Pattern                                          | Default behaviour                          |
|--------------|--------------------------------------------------|---------------------------------------------|
| `EmailMask`  | `/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/gi`         | Preserves first 1 + last 1 char of domain.  |
| `PhoneMask`  | Russian phone number patterns (`+7`/`8`)        | Preserves last 4 digits.                    |
| `CardMask`   | 13–19 digit sequences                           | Preserves first 6 + last 4 digits.          |

### Mask options

All masks accept these common options via `IMaskOptions`:

```ts
interface IMaskOptions {
  maskChar?: string;  // default '*'
  enabled?: boolean;  // default true
}
```

Per‑mask options:

```ts
interface IEmailMaskOptions extends IMaskOptions {
  unmaskedStartChars?: number;  // default 1 — visible chars before @ in local part
  unmaskedEndChars?: number;    // default 1 — visible chars at end of domain
}

interface IPhoneMaskOptions extends IMaskOptions {
  minDigits?: number;           // default 7 — min digits to mask
  preserveCount?: number;       // default 4 — visible trailing digits
}

interface ICardMaskOptions extends IMaskOptions {
  firstDigits?: number;         // default 6 — visible leading digits
  lastDigits?: number;          // default 4 — visible trailing digits
}
```

## Usage patterns

### Mask data via config

```ts
// config (e.g. via @biorate/config)
{
  Masquerade: {
    EmailMask: { maskChar: '#', unmaskedStartChars: 2 },
    PhoneMask: { preserveCount: 3 },
    maskJSON2: { emailFields: ['email'], phoneFields: ['phone'] },
  }
}
```

With DI, `Masquerade.configure()` is called automatically on `@init()`:

```ts
import { Core, container, Types, inject } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { Masquerade } from '@biorate/masquerade';

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(Masquerade).toSelf().inSingletonScope();
// configure and then:
// Masquerade.processJSON(data) and Masquerade.processString(str) are ready
```

### Custom mask

```ts
import { CommonMask, IMaskOptions } from '@biorate/masquerade';

class SsnMask extends CommonMask {
  protected options?: IMaskOptions;
  protected regexp = /\b\d{3}-\d{2}-\d{4}\b/g;

  protected parse(text: string) {
    return text.replace(this.regexp, (match) =>
      '***-**-' + match.slice(-4),
    );
  }
}

Masquerade.use(SsnMask);
console.log(Masquerade.processString('My SSN is 123-45-6789'));
// My SSN is ***-**-6789
```

### Chaining with both modes

```ts
Masquerade
  .use(EmailMask)
  .use(PhoneMask)
  .use(CardMask)
  .configure({
    maskJSON2: {
      emailFields: ['email', 'sender'],
      cardFields: ['cardNumber', 'cc'],
    },
  });

// Mask string logs
const log = Masquerade.processString('user@site.com, card: 4111-1111-1111-1111');

// Mask JSON responses
const body = Masquerade.processJSON(req.body);
```

## Architecture

```
                    ┌──────────────────┐
                    │   Masquerade     │  (static registry + DI service)
                    ├──────────────────┤
                    │  config          │  ← IMasqueradeConfig merged via configure()
                    │  maskers: Map    │  ← registered CommonMask instances
                    │  maskdataEnabled │  ← true if maskJSON2 config present
                    ├──────────────────┤
                    │  processJSON()   │  → MaskData.maskJSON2(data, opts)
                    │  processString() │  → for each masker: text = mask.process(text)
                    │  configure()     │  → deep merge config
                    │  use() / unuse() │  → manage masker registry
                    └──────────────────┘
                            │
              ┌─────────────┴──────────────┐
              │        CommonMask          │  abstract base
              ├────────────────────────────┤
              │  regexp: RegExp            │  → override in subclass
              │  options: IMaskOptions     │  → maskChar, enabled
              │  process(text)             │  → calls parse() if enabled
              └────────────────────────────┘
                    ▲         ▲         ▲
                    │         │         │
             EmailMask  PhoneMask  CardMask
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/masquerade.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/masquerade/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/masquerade/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

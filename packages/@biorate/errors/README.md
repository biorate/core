# Errors factory

This module provides a base class for creating error classes
with **error code** (class name), **message template**, **meta data** support out of the box.

#### Example:
```ts
import { BaseError } from '@biorate/errors';

export class MyAwesomeError extends BaseError {
  constructor(args?: any[], meta?: any) {
    super(`Oops... Some error happen, at [%s], in [%s]`, args, meta);
  }
}

const e = new MyAwesomeError([new Date(), 'core'], { hello: 'world!' });

console.log(e.meta); // { hello: 'world!' }
console.log(e.code); // MyAwesomeError

throw e;
          ^
MyAwesomeError: Oops... Some error happen, at [2021-05-13T09:19:22.511Z], in [core]
    at Object.<anonymous> (..core/packages/@biorate/errors/index.ts:28:11)
    at Module._compile (internal/modules/cjs/loader.js:1138:30)
```

### Learn
* Docs: Checking out the [docs](https://biorate.github.io/core/modules/errors.html).

# Mocha

Mocha OOP tests based on @testdeck/core
This is a mocha OOP wrap based on https://www.npmjs.com/package/@testdeck/mocha package,
documentation should be almost the same

---

[![Donate on Boosty](https://img.shields.io/badge/Boosty-donate-orange)](https://boosty.to/llevkin)

Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.

# Reason

- Some types fixes

# Feature

- Parallel tests execution in case of one class

### Examples:

```ts
import { suite, parallel, test } from '@biorate/mocha';
import { expect } from 'chai';

@suite
@parallel(true)
class Test {
  @test
  first() {
    expect(false).to.be.true;
  }

  @test
  second() {
    expect(false).to.be.true;
  }
}
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/mocha.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/mocha/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/mocha/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

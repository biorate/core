# Mocha

Mocha OOP tests based on @testdeck/core
This is a mocha OOP wrap based on https://www.npmjs.com/package/@testdeck/mocha package,
documentation should be almost the same

# Reason

- Some types fixes

# Feature

- Parallel tests execution in case of one class

### Examples:

```ts
import { suite, parallel, test } from '@biorate/mocha';

@suite
@parallel(true)
class Test {
  @test
  first() {
    expect(false).toBe(true);
  }

  @test
  second() {
    expect(false).toBe(true);
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

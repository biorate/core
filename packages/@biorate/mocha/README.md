# Mocha

Mocha OOP tests based on @testdeck/core
This is a fork of https://www.npmjs.com/package/@testdeck/mocha package,
documentation should be identical

# Reason

Some types fixes

### Examples:

```ts
import { suite, test } from "@testdeck/jasmine";

@suite
class Hello {

  @test
  world() {
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

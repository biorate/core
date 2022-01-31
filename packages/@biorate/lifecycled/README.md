# Lifecircle

Decorators pack for bring lifecycle control in you application

#### Example:

```ts
import { lifecycled, init, kill } from '../../src';

class Uno {
  @init() public initialize() {
    console.log('Uno init');
  }

  @kill() public destructor() {
    console.log('Uno kill');
  }
}

class Dos {
  @init() public initialize() {
    console.log('Dos init');
  }

  @kill() public destructor() {
    console.log('Dos kill');
  }
}

class Tres {
  @init() public initialize() {
    console.log('Tres init');
  }

  @kill() public destructor() {
    console.log('Tres kill');
  }
}

class Root {
  uno = new Uno();
  dos = new Dos();
  tres = new Tres();
}

lifecycled(new Root());

// Uno init
// Dos init
// Tres init
// Uno kill
// Dos kill
// Tres kill
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/lifecycled.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/lifecycled/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/lifecycled/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

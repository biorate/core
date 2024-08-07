# Config

Application configurator

### Examples:

#### Get / Set:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.set('a', 1);

console.log(config.get('a')); // 1
```

#### Has:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.set('a', 1);

console.log(config.has('a')); // true
console.log(config.has('b')); // false
```

#### Merge:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  a: { b: { c: 1 } },
});

config.merge({
  a: { b: { d: 2 } },
});

console.log(config.has('a')); // true
console.log(config.has('a.b')); // true
console.log(config.get('a.b.c')); // 1
console.log(config.get('a.b.d')); // 2
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

# Config

Application configurator

### Examples:

#### Get / Set:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.set('a', 1);

console.log(config.get<number>('a')); // 1
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
console.log(config.get<number>('a.b.c')); // 1
console.log(config.get<number>('a.b.d')); // 2
```

#### String template:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  url: '${protocol}${host}/${path}',
  protocol: 'https://',
  host: 'hostname.ru',
  path: 'main',
});

console.log(config.get<string>('url')); // https://hostname.ru/main
```

#### Link template:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  obj1: { a: 1, b: 2 },
  obj2: '#{obj1}',
});

console.log(config.get<{ a: number; b: number }>('obj2')); // { "a": 1, "b": 2 }
```

#### RegExp template:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  regexp: 'R{/^test$/igm}',
});

const regexp = config.get<RegExp>('regexp');

console.log(regexp.test('test')); // true
```

#### Function template:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({
  sum: 'F{a, b => return a + b;}',
});

const sum = config.get<(a: number, b: number) => number>('sum');

console.log(sum(1, 2)); // 3
```

#### Empty template:

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.merge({ data: '!{object}' });
console.log(config.get('data')); // {}

config.merge({ data: '!{array}' });
console.log(config.get('data')); // []

config.merge({ data: '!{void}' });
console.log(config.get('data')); // undefined

config.merge({ data: '!{null}' });
console.log(config.get('data')); // null

config.merge({ data: '!{string}' });
console.log(config.get('data')); // ""

config.merge({ data: '!{ }' });
console.log(config.get('data')); // null
```

If you want to disable templates, you can turn off it in static `Config.Template` variable:

```ts
import { Config } from '@biorate/config';

Config.Template.string = false;
Config.Template.empty = false;
Config.Template.regexp = false;
Config.Template.function = false;
Config.Template.link = false;
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

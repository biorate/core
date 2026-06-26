# Tasks batcher

Tasks batcher

### Features:

- Group single tasks into batch request

### API

```ts
new Batcher<O, M>(count?: number, timeout?: number);
```

| Param     | Type     | Default | Description                               |
|-----------|----------|---------|-------------------------------------------|
| `count`   | `number` | `100`   | Max tasks per batch before flush.         |
| `timeout` | `number` | `100`   | Max wait (ms) before flush when count not reached. |

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IBatcher, Batcher } from '@biorate/batcher';

const batcher: IBatcher = new Batcher<{ data: string }, { test: string }>();

batcher.register((tasks) => {
  console.log(tasks);
  // [
  //   [
  //     { data: 'one' },
  //     {
  //       resolve: [Function (anonymous)],
  //       reject: [Function (anonymous)],
  //       metadata: { test: 'one' }
  //     }
  //   ],
  //   [
  //     { data: 'two' },
  //     {
  //       resolve: [Function (anonymous)],
  //       reject: [Function (anonymous)],
  //       metadata: { test: 'two' }
  //     }
  //   ],
  //   [
  //     { data: 'three' },
  //     {
  //       resolve: [Function (anonymous)],
  //       reject: [Function (anonymous)],
  //       metadata: { test: 'three' }
  //     }
  //   ]
  // ]
});
batcher.add({ data: 'one' }, { test: 'one' });
batcher.add({ data: 'two' }, { test: 'two' });
batcher.add({ data: 'three' }, { test: 'three' });
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/batcher.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/batcher/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/batcher/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

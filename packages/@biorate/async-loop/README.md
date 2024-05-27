# Async loop

Async loop implementation

### Examples:

```ts
import { AsyncLoop } from '@biorate/async-loop';

(async () => {
  let i = 0;
  const loop = new AsyncLoop(
    () => {
      console.log(++i); // 1, 2, 3 ... e.t.c
    },
    console.error,
    1000,
  );
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/async_loop.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/async-loop/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/axios/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

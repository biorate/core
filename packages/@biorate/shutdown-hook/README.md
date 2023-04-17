# Shutdown hook

Shutdown hook implementation for Node.JS

#### Example:

```ts
import { ShutdownHook } from '@biorate/shutdown-hook';
import { timer } from '@biorate/tools';

ShutdownHook.subscribe(async (reason) => {
  await timer.wait(100);
  console.log(reason); // 'SIGINT'
});

process.kill(process.pid, 'SIGINT');
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/shutdown_hook.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/shutdown-hook/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/shutdown-hook/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

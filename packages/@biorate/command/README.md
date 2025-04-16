# Command executor

Command executor common interface

### Example:

```ts
import { CommonCommandSync, CommonCommandAsync } from '@biorate/command';

export class EchoSyncCommand extends CommonCommandSync {
  protected command = [`echo #{value}`];

  protected override options = { cwd: '/tmp' };

  public static override execute(options: { value: string | number }) {
    return super.execute(options);
  }
}

export class EchoAsyncCommand extends CommonCommandAsync {
  protected command = [`echo #{value}`];

  protected override options = { cwd: '/tmp' };

  public static override execute(options: { value: string | number }) {
    return super.execute(options);
  }
}
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/command.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/command/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/command/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

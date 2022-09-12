# Tasks batcher

Tasks batcher

### Features:

- Group single tasks into batch request

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IBatcher, Batcher } from '@biorate/batcher';

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.Batcher) public batcher: IBatcher<{ data: string }, { test: string }>;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IBatcher<{ data: string }, { test: string }>>(Types.Batcher)
  .to(Batcher<{ data: string }, { test: string }>)
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = <Root>container.get<Root>(Root);
  root.batcher.register(async (tasks) => {
    for (const task of tasks) task[1].resolve();
  });
  root.batcher.add({ data: 'one' }, { test: 'one' }).then(() => console.log('resolve 1')); // resolve 3
  root.batcher.add({ data: 'two' }, { test: 'two' }).then(() => console.log('resolve 2')); // resolve 3
  root.batcher
    .add({ data: 'three' }, { test: 'three' })
    .then(() => console.log('resolve 3')); // resolve 3
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/batcher.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/batcher/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/batcher/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

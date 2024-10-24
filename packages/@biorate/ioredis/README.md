# IORedis

IORedis connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IORedisConnector, IORedisConfig } from '@biorate/ioredis';

class Root extends Core() {
  @inject(IORedisConnector) public connector: IORedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IORedisConnector>(IORedisConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  IORedis: [
    {
      name: 'connection',
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  await root.connector.current!.set('key', 'value');
  console.log(await root.connector.current!.get('key')); // value
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/ioredis.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/ioredis/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/ioredis/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

# Redis

Redis connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RedisConnector, RedisConfig } from '@biorate/redis';

class Root extends Core() {
  @inject(RedisConnector) public connector: RedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RedisConnector>(RedisConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Redis: [
    {
      name: 'connection',
      options: {
        url: 'redis://localhost:6379'
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

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/redis.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/redis/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/redis/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

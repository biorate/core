# Connector

Connector interface

### Examples:

```ts
import { Connector, IConnector } from '../..';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

export class Connection {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }
}

export class TestConnector extends Connector<{ name: string }, Connection> {
  protected namespace = 'TestConnector';

  protected async connect(config) {
    return new Connection(config.name);
  }
}

export class Root extends Core() {
  @inject(TestConnector) public connector: IConnector<{ name: string }, Connection>;
}

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(TestConnector).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  TestConnector: [{ name: 'test-connection' }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(root.connector.connection('test-connection')); // Connection { name: 'test-connection' }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/connector.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/connector/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/connector/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

# Schema registry

Schema registry connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IConnector } from '@biorate/connector';
import {
  SchemaRegistryConnector,
  ISchemaRegistryConnector,
} from '@biorate/schema-registry';

export class Root extends Core() {
  @inject(SchemaRegistryConnector) public connector: ISchemaRegistryConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ISchemaRegistryConnector>(SchemaRegistryConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  const { PostSubjectsVersions } = root.connector.connection('connection');
  const { data } = await PostSubjectsVersions.fetch({
    subject: 'test',
    schema: {
      type: 'record',
      name: 'Test',
      namespace: 'test',
      fields: [
        {
          name: 'firstName',
          type: 'string',
        },
        {
          name: 'lastName',
          type: 'string',
        },
        {
          name: 'age',
          type: 'int',
        },
      ],
    },
  });
  console.log(data); // { id: 1 }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/schema_registry.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/schema-registry/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/schema-registry/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

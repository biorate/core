# @biorate/opensearch

OpenSearch connector — connection manager for the official `@opensearch-project/opensearch` client.

## Features

- **Auto-connect** — creates OpenSearch `Client` on `@init()` via config namespace `OpenSearch`.
- **Connection verification** — calls `ping()` to verify server reachability.
- **Full OpenSearch API** — indices, documents, search, aggregations via the client.
- **Typed errors** — `OpenSearchCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/opensearch
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@opensearch-project/opensearch`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { OpenSearchConnector } from '@biorate/opensearch';

class Root extends Core() {
  @inject(OpenSearchConnector) public connector: OpenSearchConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<OpenSearchConnector>(OpenSearchConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  OpenSearch: [{
    name: 'dev',
    options: {
      node: 'https://admin:admin_pass@localhost:9200',
      ssl: { rejectUnauthorized: false },
    },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.indices.create({
    index: 'test_index',
    body: {
      settings: { index: { number_of_shards: 1, number_of_replicas: 1 } },
    },
  });
})();
```

## API Reference

### `OpenSearchConnector`

| Member           | Type                                        | Description                              |
|------------------|---------------------------------------------|------------------------------------------|
| `namespace`      | `'OpenSearch'`                              | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<IOpenSearchConnection>` | Creates `Client` and calls `ping()`.    |

### Config

```ts
interface IOpenSearchConfig extends IConnectorConfig {
  options: ClientOptions;  // node, ssl, auth, etc.
}
```

### Errors

| Error                          | Condition                                    |
|--------------------------------|----------------------------------------------|
| `OpenSearchCantConnectError`   | `new Client()` or `ping()` fails.           |

## Architecture

```
OpenSearchConnector extends Connector<IOpenSearchConfig, IOpenSearchConnection>
│
├── namespace = 'OpenSearch'
├── connect(config) → new Client(config.options)
│   └── await connection.ping() // verify
└── connection is an @opensearch-project/opensearch Client
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/opensearch.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/opensearch/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/opensearch/LICENSE)

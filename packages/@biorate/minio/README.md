# @biorate/minio

MinIO (S3-compatible) connector — connection manager for the official `minio` JavaScript client.

## Features

- **Auto-connect** — creates `Client` instance on `@init()` via config namespace `Minio`.
- **Connection verification** — calls `listBuckets()` to verify credentials and connectivity.
- **Typed errors** — `MinioCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/minio
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `minio`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MinioConnector } from '@biorate/minio';

class Root extends Core() {
  @inject(MinioConnector) public connector: MinioConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<MinioConnector>(MinioConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Minio: [
    {
      name: 'storage',
      options: {
        endPoint: 'localhost',
        port: 9000,
        accessKey: 'admin',
        secretKey: 'minioadmin',
        useSSL: false,
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.makeBucket('test', 'test');
  await root.connector.current!.putObject(
    'test', 'hello.txt', Buffer.from('Hello world!'),
  );
  root.connector.current!.getObject('test', 'hello.txt', (_e, stream) => {
    let data = '';
    stream.on('data', (chunk) => (data += chunk.toString()));
    stream.on('end', () => console.log(data)); // 'Hello world!'
  });
})();
```

## API Reference

### `MinioConnector`

| Member           | Type                                      | Description                              |
|------------------|-------------------------------------------|------------------------------------------|
| `namespace`      | `'Minio'`                                 | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<IMinioConnection>`   | Creates `Client` and verifies connectivity. |

### Config

```ts
interface IMinioConfig extends IConnectorConfig {
  options: ClientOptions;  // endPoint, port, accessKey, secretKey, useSSL, region, etc.
}
```

### Errors

| Error                        | Condition                                    |
|------------------------------|----------------------------------------------|
| `MinioCantConnectError`      | `new Client()` or `listBuckets()` fails.     |

## Architecture

```
MinioConnector extends Connector<IMinioConfig, IMinioConnection>
│
├── namespace = 'Minio'
├── connect(config) → new Client(config.options)
│   └── await connection.listBuckets() // verify
└── connection is a minio.Client
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/minio.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/minio/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/minio/LICENSE)

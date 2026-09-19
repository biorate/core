# Мокирование коннектора (ClickHouse и другие)

Коннектор — класс, который возвращает connection-объект через `.get()` (или геттер). Connection автоматически оборачивается в `MockHandler` (Proxy), поэтому `query()`, `json()` и другие методы на нём тоже записываются/воспроизводятся.

Стандартный паттерн: **DI через `@biorate/inversion`** + мок-подкласс + setup/teardown.

## Что добавить

- **vitest setup**: базовый каркас + биндинг DI Config из [setup.md](setup.md).
- **`tests/__mocks__/clickhouse.ts`**: мок-наследник + конфиг + setup/teardown.
- **spec**: `setup()` → record/replay → `teardown()`.

## `tests/__mocks__/clickhouse.ts`

```ts
import { ClickhouseConnector as ChConnector } from '@biorate/clickhouse';
import { container, inject, Types, Core } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Mockable } from '@biorate/unimock';

@Mockable({})
export class ClickhouseConnector extends ChConnector {}

class Root extends Core() {
  @inject(ClickhouseConnector) public connector: ClickhouseConnector;
}

const config = {
  Clickhouse: [{ name: 'connection', options: {} }],
};

export async function setup() {
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(ClickhouseConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run(); // @init() → реальный connect
  return root;
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(ClickhouseConnector)) container.unbind(ClickhouseConnector);
}
```

> `@Mockable({})` без `importMeta` → снапшот идёт в пакетный дефолт `tests/__snapshots__/`. Для снапшота рядом с моком передайте `importMeta: import.meta`.

## Использование в спеке

```ts
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { SnapshotStore, flushAllSnapshots } from '@biorate/unimock';
import { setup, teardown } from '../__mocks__/clickhouse';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('clickhouse', () => {
  it('query + json', async () => {
    const cursor = await root.connector.get().query({
      query: 'SELECT 1 AS result;',
      format: 'JSON',
    });
    const { data } = await cursor.json<{ result: number }>();
    expect(data[0].result).toBe(1);
  });
});
```

Запись/воспроизведение управляется модом:

```ts
// рекорд (нужен живой ClickHouse): UNIMOCK=record pnpm test
// либо в рантайме:
SnapshotStore.setMode('record');
// ... вызовы реально ходят в БД ...
flushAllSnapshots(); // (или авто-flush через vitest setup)

// реплей (без ClickHouse): UNIMOCK=replay pnpm test
SnapshotStore.setMode('replay');
// ... вызовы возвращаются из снапшота ...
```

## Другие коннекторы

Паттерн одинаковый — меняется коннектор и его конфиг-секция:

| Коннектор | Пакет | Конфиг-секция |
| --------- | ----- | ------------- |
| PostgreSQL | `@biorate/pg` | `Pg: [{ name: 'connection', options: { user, host, database, password, port } }]` |
| MongoDB | `@biorate/mongodb` | `MongoDB: [{ name: 'connection', host: 'mongodb://localhost:27017/', options: { dbName } }]` |
| MSSQL | `@biorate/mssql` | `Mssql: [{ name: 'connection', options: { server, user, password, database, options: { trustServerCertificate } } }]` |
| Redis / ioredis | `@biorate/redis` / `@biorate/ioredis` | `Redis: [{ name: 'connection', options: { url } }]` |
| Schema Registry | `@biorate/schema-registry` | `SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }]` |
| OpenSearch | `@biorate/opensearch` | `OpenSearch: [{ name: 'dev', options: { node, ssl } }]` |
| Kafka (rdkafka) | `@biorate/rdkafka` | `RDKafkaAdmin/RDKafkaProducer/RDKafkaConsumer` секции (global + topic настройки) |
| Proxy | `@biorate/proxy` | `Proxy: [{ name: 'connection', server, clients }]` |

Всё это — обычные классы, возвращающие connection. Ключевая точка мокирования — `@Mockable()` на наследнике.

## Важно

- **`@init()` из `@biorate/lifecycled` выполняется реально даже в replay** (ограничение №1) — коннектор коннектится к сервису до обращения к снапшоту. Поэтому e2e-моки **требуют живую инфраструктуру и в record, и в replay**.
- Connection-объект должен быть **получен из `.get()`/геттера один раз и переиспользован** — повторные `.get()` создают новые `MockHandler` с разными refId (фикс: сохранить результат в переменную).
- При использовании `@biorate/inversion` контейнер биндится на run-уровне теста, чтобы не конфликтовать между спсками — обязательно `teardown()` в `afterAll`.
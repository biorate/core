# Мокирование статических методов (Sequelize)

Некоторые ORM/фреймворки выносят операции в **статические** методы (например `Model.findByPk()`, `Model.findAll()`). Для них нужна опция `statics`. В replay-режиме инстансы моделей **реконструируются** оригинальным статик-`build` модели — отсюда особый хак на стадии setup.

## Что добавить

- **vitest setup**: базовый каркас + DI Config из [setup.md](setup.md).
- **`tests/__mocks__/sequelize.ts`**: модель с `@Mockable({ statics: [...] })`, коннектор, setup/teardown.
- **spec**: **хак** — offline-биндинг моделей к `Sequelize` в replay.

## `tests/__mocks__/sequelize.ts`

```ts
import {
  SequelizeConnector as RawSequelizeConnector,
  Model,
  Table,
  Column,
  DataType,
} from '@biorate/sequelize';
import { container, inject, Types, Core } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Mockable, SEQUELIZE_STATICS } from '@biorate/unimock';

export const PG = {
  logging: false,
  host: 'localhost',
  port: 5432,
  dialect: 'postgres' as const,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
};

@Mockable({ statics: [SEQUELIZE_STATICS] })
@Table({ tableName: 'mock_models', timestamps: false })
export class TestModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true }) id: number;
  @Column(DataType.STRING) title: string;
  @Column(DataType.INTEGER) value: number;
}

@Mockable({})
export class SequelizeConnector extends RawSequelizeConnector {
  protected readonly models = { connection: [TestModel] };
}

class Root extends Core() {
  @inject(SequelizeConnector) public connector: SequelizeConnector;
}

const config = { Sequelize: [{ name: 'connection', options: { ...PG } }] };

export async function setup() {
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(SequelizeConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root;
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(SequelizeConnector)) container.unbind(SequelizeConnector);
}
```

> `SEQUELIZE_STATICS` — готовый список статик-методов Sequelize (`create`, `findOne`, `findAll`, `findByPk`, `findOrCreate`, `findAndCountAll`, `bulkCreate`, `build`, `update`, `upsert` и др.). Кастомные: `@Mockable({ statics: [SEQUELIZE_STATICS, ['myMethod']] })`.

## Биндинг моделей в replay: `bindReplaySequelizeModels`

**Проблема.** В replay `connect()` не выполняется (воспроизводится из снапшота) → модель никогда не привязывается к инстансу `Sequelize` → флаг `isInitialized` остаётся `false` → оригинальный статик `build()` бросил бы `ModelNotInitializedError` при реконструкции.

**Решение.** Хелпер [`bindReplaySequelizeModels`](../../src/sequelize.ts) в `@biorate/unimock` связывает модели с **offline** `Sequelize`-инстансом (конструктор не выполняет I/O). Вся «магия» внутри:

- вне replay — no-op (возвращает `undefined`), хелпер можно вызывать безусловно;
- в replay — перед биндингом глобальный режим временно переключается в `off` и восстанавливается после (`Model.init()` внутри вызывает wrapped-статики вроде `getTableName`, которые не должны уходить в replay-lookup);
- принимает вариадик-список моделей; последний аргумент-объект трактуется как опции конструктора `Sequelize` (кастомный `dialect` и т.д.);
- возвращает созданный `Sequelize`-инстанс.

```ts
import { bindReplaySequelizeModels } from '@biorate/unimock';
import { TestModel, setup, teardown } from '../__mocks__/sequelize';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
  bindReplaySequelizeModels(TestModel); // offline-биндинг, без I/O; вне replay — no-op
});

afterAll(() => teardown());
```

> Это и есть пример того, что setup для vitest **различается в зависимости от вида мока**: коннектору из [connector.md](connector.md) такой хелпер не нужен, статикам — нужен.

## Использование в спеке

```ts
it('model mock connector', async () => {
  root.connector.use('connection');

  await TestModel.sync();
  await TestModel.create({ id: 10, title: 'via-mockable-model', value: 777 });
  const found = await TestModel.findOne({ where: { id: 10 } });
  expect(found).toMatchObject({ id: 10, title: 'via-mockable-model', value: 777 });
});
```

## Шейпы результата в replay

| Статик-и | Replay-результат |
| -------- | ---------------- |
| `create`, `findOne`, `findByPk`, `build` | один инстанс модели |
| `findAll`, `bulkCreate`, `bulkBuild` | массив инстансов |
| `findOrCreate`, `findOrBuild`, `findCreateFind`, `upsert` | `[instance, created]` |
| `update` | `[count, instances]` |
| `findAndCountAll` | `{ count, rows: instances }` |
| `scope`, `unscoped`, `schema` | сам класс (работает чейнинг) |
| прочие (`destroy`, `count`, `truncate`…) | deserialized data as-is |

## Важно

- Реконструкция использует **оригинальный** `build` модели (схвачен до оборачивания) — модель должна быть импортируема и инициализирована в replay-среде.
- Внутренние вызовы конструктора при реконструкции **pass-through** (не ищутся в снапшоте) — опции конструирования record/replay не обязаны совпадать.
- Невызванный в record instance-метод → `UnimockReplayMissError` в replay (by design).
- Вложенные include/association-объекты в строках остаются plain-объектами в replay.
# Настройки мокирования (options)

Опции, доступные в `@Mockable()` и `mock()`, и их влияние на снапшоты.

| Опция | Тип | По умолчанию | Описание |
| ----- | --- | ------------ | -------- |
| `importMeta` | `ImportMeta` | — | `__snapshots__/` рядом с вызывающим файлом. Игнорирует `snapshotDir` |
| `snapshotDir` | `string` | `tests/__snapshots__` | Папка снапшота (явный путь) |
| `name` | `string` | авто | Имя снапшота для `mock()`: `constructor.name` / `Object_<hash>` |
| `symbols` | `boolean` | `false` | Сериализация symbol-значений |
| `depth` | `number` | `Infinity` | Максимальная глубина рекурсивной обёртки результатов |
| `statics` | `string[][]` | — | Оборачивание статических методов (см. [static-methods.md](static-methods.md)) |

## Где живёт снапшот

```ts
import { Mockable } from '@biorate/unimock';

// 1) рядом с этим файлом
@Mockable({ importMeta: import.meta })
class A extends RealService {}

// 2) явная папка
@Mockable({ snapshotDir: 'snapshots/special' })
class B extends RealService {}

// 3) пакетный дефолт tests/__snapshots__ (или UNIMOCK_SNAPSHOT_DIR)
@Mockable({})
class C extends RealService {}
```

> Имя файла: `{ClassName}.unimock.snap`. Расширение меняется через `SNAPSHOT_EXT`.

## Имя снапшота для mock()

```ts
import { mock } from '@biorate/unimock';

// class-инстанс → constructor.name
mock(new Connection(), { importMeta: import.meta }); // Connection

// литерал → Object_<hash>
mock({ query: async () => ({}) }, { importMeta: import.meta }); // Object_<hash>

// явное имя
mock(service, { name: 'MyService', importMeta: import.meta });
```

## symbol-сериализация

По умолчанию symbol'ы сериализуются как `'<symbol>'`. Для сохранения идентичности при record/replay — включите `symbols`:

```ts
@Mockable({ symbols: true })
class MockedService extends RealService {}
```

> Меняет формат снапшота — существующие снапшоты придётся перезаписать (`UNIMOCK=record`).

## Глубина оборачивания

По умолчанию `MockHandler` рекурсивно оборачивает любой результат с методами (например connection из `.get()`) бесконечно. Опция `depth` ограничивает вложенность — по достижении лимита результат сериализуется напрямую:

```ts
// декоратор
@Mockable({ depth: 2 })
class ShallowService extends RealService {}

// функциональный стиль
const ShallowService = mock(RealService, { depth: 2 });
```

Полезно для глубоких цепочек вызовов, где не нужна полная вложенная обёртка.
# Мокирование plain-объекта / инстанса

`mock()` принимает не только классы, но и **plain-объекты** (литералы) и **инстансы классов**. Возвращается копия с тем же прототипом — оригинал не мутируется.

## Что добавить

- **vitest setup**: базовый каркас из [setup.md](setup.md).
- **`__mocks__/`**: не нужен — мок создаётся прямо в спеке через `mock()`.
- **spec**: `mock()` → record → `flushAllSnapshots()` → replay.

## Литерал

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

const obj = mock(
  { query: async (sql: string) => ({ data: [1, 2, 3] }) },
  { importMeta: import.meta },
);

// Record
SnapshotStore.setMode('record');
console.log(await obj.query('SELECT 1')); // { data: [1, 2, 3] } — реальный вызов
flushAllSnapshots();

// Replay
SnapshotStore.setMode('replay');
console.log(await obj.query('SELECT 1')); // { data: [1, 2, 3] } — из снапшота
```

Имя снапшота для литерала авто-деривируется как `Object_<hash>` (хеш от имён методов).

## Инстанс класса

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

class Connection {
  public async query(sql: string) {
    return { data: [1, 2, 3] };
  }
}

const conn = mock(new Connection(), { importMeta: import.meta });

SnapshotStore.setMode('record');
await conn.query('SELECT 1'); // реальный вызов
flushAllSnapshots();

SnapshotStore.setMode('replay');
await conn.query('SELECT 1'); // из снапшота
```

Имя снапшота для инстанса — `constructor.name` (`Connection`), прототип сохраняется.

## Явное имя (override)

```ts
const obj = mock(service, { name: 'MyService', importMeta: import.meta });
```

## Важно

- Оригинальный объект **не мутируется** — возвращается копия.
- Методы и геттеры оборачиваются так же, как в [service-class.md](service-class.md).
- Опции `importMeta`, `snapshotDir`, `depth`, `symbols` работают как в `@Mockable()` — см. [options.md](options.md).
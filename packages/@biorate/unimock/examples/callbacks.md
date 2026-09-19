# Мокирование callback-аргументов

Unimock перехватывает **функции-аргументы**, переданные в обёрнутый метод. В record-режиме вызовы callback'а собираются и сериализуются (`t: 'callback'`), в replay — воспроизводятся из записи.

## Что добавить

- **vitest setup**: базовый каркас из [setup.md](setup.md).
- **`__mocks__/`**: не нужен — мок создаётся в спеке.
- **spec**: record → replay (см. ниже).

## Пример

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

class QueryService {
  public async run(sql: string, onRow: (row: number) => void) {
    // реальная реализация вызывает callback'и
    onRow(1);
    onRow(2);
    return true;
  }
}

const Mocked = mock(QueryService, { importMeta: import.meta });

// Record: callback'и реально вызываются и записываются
SnapshotStore.setMode('record');

const recordedCalls: number[] = [];
await new Mocked().run('SELECT * FROM t', (row) => recordedCalls.push(row));
// recordedCalls === [1, 2]
flushAllSnapshots();

// Replay: callback'и воспроизводятся из записи без реального метода
SnapshotStore.setMode('replay');

const replayedCalls: number[] = [];
await new Mocked().run('SELECT * FROM t', (row) => replayedCalls.push(row));
// replayedCalls === [1, 2] — из снапшота
```

## Как это работает

- В record функции-аргументы заменяются обёрткой, собирающей вызовы в `records[][]`.
- После `original.apply` записи сериализуются как `{ t: 'callback', v: { callRef, recording } }`.
- В replay для каждого callback-аргумента воспроизводятся записанные вызовы: `fn(...deserialize(args))`.
- Асинхронные callback'и воспроизводятся через `Promise.all`.

## Важно

- Callback'и внутри **результатов** (например метод вернул объект с функциями) обрабатываются через механизм `MockHandler`/серриализации как `<function>` (см. поведение по умолчанию).
- Глубину оборачивания вложенных результатов регулирует опция `depth` — см. [options.md](options.md).
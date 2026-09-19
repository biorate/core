# Мокирование класса-сервиса

Обычный класс с методами и геттерами — декоратор `@Mockable()` либо функциональный `mock()`. Обёртываются методы прототипа и геттеры; результаты вызовов записываются/воспроизводятся из снапшота.

## Что добавить

- **vitest setup**: базовый каркас из [setup.md](setup.md) (ничего специфичного для этого вида мока).
- **`tests/__mocks__/service.ts`**: мок-подкласс (см. ниже).
- **spec**: record → `flushAllSnapshots()` → replay.

## `tests/__mocks__/service.ts`

```ts
import { Mockable } from '@biorate/unimock';

class TestService {
  public async query(sql: string) {
    return { data: [1, 2, 3] };
  }
  public get value() {
    return 'real-value';
  }
}

@Mockable({ importMeta: import.meta })
export class MockedService extends TestService {}
```

> `importMeta: import.meta` кладёт снапшот в `__snapshots__/` рядом с **файлом мока**. Если опустить — снапшот пойдёт в пакетный `tests/__snapshots__/` (или в `UNIMOCK_SNAPSHOT_DIR`).

## Использование в спеке

```ts
import { describe, expect, it } from 'vitest';
import { SnapshotStore, flushAllSnapshots } from '@biorate/unimock';
import { MockedService } from '../__mocks__/service';

// Record-фаза (нужна «живая» реализация)
SnapshotStore.setMode('record');

const service = new MockedService();
console.log(await service.query('SELECT 1')); // { data: [1, 2, 3] } — реальный вызов
console.log(service.value); // 'real-value'
flushAllSnapshots(); // пишет __snapshots__/MockedService.unimock.snap

// Replay-фаза (живая реализация не нужна)
SnapshotStore.setMode('replay');

const replayed = new MockedService();
console.log(await replayed.query('SELECT 1')); // { data: [1, 2, 3] } — из снапшота
console.log(replayed.value); // 'real-value'
```

## Функциональный стиль (без декоратора)

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

class TestService {
  public async query(sql: string) {
    return { data: [1, 2, 3] };
  }
}

const MockedService = mock(TestService, { importMeta: import.meta });

SnapshotStore.setMode('record');
const service = new MockedService();
await service.query('SELECT 1'); // реальный вызов
flushAllSnapshots();

SnapshotStore.setMode('replay');
const replayed = new MockedService();
await replayed.query('SELECT 1'); // из снапшота
```

## Важно

- **`@init()` из `@biorate/lifecycled` не оборачивается** — если базовый класс инициализируется через `@init()`, он выполнится реально даже в replay (см. ограничение №1 в README). Лечение: переопределить `initialize` в мок-подклассе как no-op либо проверять `SnapshotStore.mode`.
- Геттеры тоже оборачиваются (пример `value` выше).
- Приватные `#`-поля не оборачиваются.
- Невызванный в record метод бросит `UnimockReplayMissError` в replay (by design).
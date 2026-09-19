# Unimock examples

Примеры мокирования распространённых типов зависимостей. Каждый пример построен по единому шаблону **«Что добавить»**: что прописать в vitest на стадии `setup`, что положить в `__mocks__/` (импортируемую из setup), и как использовать мок в спеках.

## Как это работает (общая схема)

```
vitest.config.ts                — подключает setup-файл
        │
        ▼
tests/setup.ts                  — импортирует '@biorate/unimock/vitest/setup'
        │                         (авто-flush снапшотов в afterAll) + поднимает DI Config
        ▼
tests/__mocks__/<dep>.ts        — мок-класс с @Mockable() + конфиг + setup/teardown
        │
        ▼
tests/**/*.spec.ts              — использует мок: record → flushAllSnapshots() → replay
```

Выбор того, как мокировать зависимость, определяет, что именно нужно на стадии setup:

| Пример | Мокируемое | Что добавить в vitest setup | Что нужно в `__mocks__/` |
| ------ | ---------- | ---------------------------- | ------------------------- |
| [setup.md](setup.md) | Каркас интеграции | `@biorate/unimock/vitest/setup` в `setupFiles` | — (обязательная база для всего) |
| [service-class.md](service-class.md) | Обычный класс-сервис | Только базовый setup | Мок-подкласс `@Mockable()` |
| [plain-object.md](plain-object.md) | Plain-объект / инстанс | Только базовый setup | Не нужен — `mock()` прямо в спеке |
| [connector.md](connector.md) | Коннектор (ClickHouse и др.) | Директория моков в `tests/` | `@Mockable()` наследник коннектора + DI-конфиг |
| [static-methods.md](static-methods.md) | Статические методы (Sequelize) | **Хак**: offline-биндинг моделей в replay | `@Mockable({ statics: [...] })` модель |
| [callbacks.md](callbacks.md) | Функции-аргументы | Только базовый setup | Мок с callback-параметрами |
| [noop.md](noop.md) | Любая зависимость (заглушка) | Не нужен | Не нужен — `noop` из пакета |
| [options.md](options.md) | Настройки мокирования | Только базовый setup | Специфичные опции `@Mockable()` |

## Минимальный setup (обязателен для record/replay)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
  },
});
```

```ts
// tests/setup.ts
import '@biorate/unimock/vitest/setup'; // авто-flush снапшотов в afterAll
```

Дальнейшие детали — в [setup.md](setup.md). Пошаговое мокирование конкретных типов — в остальных файлах.

## Режимы

| `UNIMOCK` | Поведение |
| --------- | --------- |
| _(не задан)_ / `off` | Мокирование выключено, zero-overhead pass-through |
| `record` | Реальный вызов + запись снапшота |
| `replay` | Воспроизведение из снапшота без живой инфраструктуры |

```bash
# рекорд (нужна живая инфраструктура)
UNIMOCK=record pnpm test

# реплей (коммиченные снапшоты, инфраструктура не нужна)
UNIMOCK=replay pnpm test
```
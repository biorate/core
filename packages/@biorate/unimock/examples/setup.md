# Setup для vitest

Базовый каркас интеграции `@biorate/unimock`. Другие примеры могут добавлять к нему специфику (см. колонку «Что добавить в vitest setup» в [README.md](README.md)).

> 💡 Это минимум. Коннекторы и статические методы требуют дополнительных действий на стадии setup — смотрите [connector.md](connector.md) и [static-methods.md](static-methods.md).

## 1. Подключить setup-файл в vitest.config.ts

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
  },
});
```

## 2. Создать tests/setup.ts

```ts
// tests/setup.ts
import '@biorate/unimock/vitest/setup'; // авто-flush снапшотов в afterAll (UNIMOCK=record)
```

`@biorate/unimock/vitest/setup` подключает хук `afterAll`, который автоматически вызывает `flushAllSnapshots()`, когда мод `record` — после теста файл-снапшот гарантированно записан.

## 3. Биндинг DI Config (для коннекторов)

Если мокируются коннекторы (через `@biorate/inversion`), `Config` должен быть доступен до начала тестов:

```ts
// tests/setup.ts
import '@biorate/unimock/vitest/setup';
import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

if (!container.isBound(Types.Config))
  container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
```

## Режимы

| `UNIMOCK` | Поведение |
| --------- | --------- |
| _(не задан)_ / `off` | Мокирование выключено — zero-overhead pass-through, снапшоты не читаются и не пишутся |
| `record` / `update` / `1` / `true` | Реальный вызов + запись снапшота на `flush()` |
| `replay` | Воспроизведение из снапшота; промах → `UnimockReplayMissError` |

```bash
# запись снапшотов (нужна живая инфраструктура)
UNIMOCK=record pnpm test

# воспроизведение (коммиченные снапшоты, живая инфраструктура не нужна)
UNIMOCK=replay pnpm test
```

## Помощники режимов

```ts
import { isReplay, isRecord } from '@biorate/unimock';

if (isReplay()) {
  // пропустить инфраструктурно-зависимый setup
}
if (!isRecord()) {
  // cleanup только вне record
}
```

Также доступны как `Unimock.isReplay`, `Unimock.isRecord`, `Unimock.mode`.

## Флаги оптимизации снапшотов

| Переменная | Описание |
| ---------- | -------- |
| `UNIMOCK_GZIP=1` | Gzip-компрессия `.unimock.json` (~97% reduction). Чтение автоопределяет gzip |
| `UNIMOCK_STRIP_REQUEST=1` | Пропускать поле `request` у Axios-подобных ответов |
| `UNIMOCK_SKIP_PROXY_ARGS=1` (`UNIMOCK_SKIP_CONN_ARGS=1`) | Не сериализовать `args` для `call:*` |
| `UNIMOCK_SNAPSHOT_DIR` | Кастомная папка снапшотов (fallback; игнорируется при `importMeta`) |
| `SNAPSHOT_EXT` | Расширение файла снапшота (default: `.snap`). Имя: `{ClassName}.unimock{ext}` |

## Контракт режимов (коротко)

- **Пишут только в record**: `record()`/`flush()`/`flushAllSnapshots()` вне record — no-op.
- **Record-сессия начинается с чистого листа**: файл перезаписывается целиком; межпрогонные дубли одной строки невозможны.
- **Replay/off не трогают файлы**: байт-в-байт неизменность коммиченных снапшотов.
- **Edge**: если record-сессия ни разу не флашится, файл на диске остаётся устаревшим (витest-setup флашит за вас).

## Где живут снапшоты

- `/tests/__snapshots__/<ClassName>.unimock.snap` — по умолчанию (от корня пакета), если не задан `importMeta`.
- `__snapshots__/` рядом с тестовым файлом — при передаче `importMeta: import.meta` в `@Mockable()`/`mock()`.
- Коммитятся в репозиторий; CI использует `UNIMOCK=replay`.
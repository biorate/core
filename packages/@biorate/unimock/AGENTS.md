# @biorate/unimock — snapshot-based proxy mocking

Локальные правила пакета. Если конфликтуют с корневым `AGENTS.md` — применяется корневой.

## Назначение

`@biorate/unimock` — библиотека для snapshot-мокирования коннекторов и сервисов через декоратор `@Mockable()`. Два режима: **record** (реальный вызов + сохранение снапшота) и **replay** (воспроизведение из снапшота без live-инфраструктуры).

## Архитектура (Option 1 — Method Override-based)

Выбранный подход: **extends + переопределение дескрипторов** на экземпляре, а не `Proxy`. Причина: приватные ES-поля (`#connections`, `#current`) в базовом классе `Connector` ломают `Proxy`.

```
@Mockable() → возвращает класс-наследник (MockedClass)
                ↓
          constructor: super() + wrapPrototype()
                ↓
          wrapPrototype(): обходит цепочку прототипов,
          заменяет методы на wrapped-версии, геттеры — на wrapped-геттеры
                ↓
          wrapMethod(): возвращает функцию, которая:
            - в record: вызывает original, записывает args/result в SnapshotStore
            - в replay: ищет entry по callKey
            - оборачивает result с hasMethods() в ConnectionHandler
```

## Ключевые файлы

| Файл | Назначение |
| ---- | ---------- |
| `src/mockable.ts` | Декоратор `@Mockable()`, `wrapMethod`, `replayCall`, `wrapAndRecord`, `hasMethods`, `wrapGetter` |
| `src/connection-proxy.ts` | `ConnectionHandler` (Proxy) — обёртка для connection-объектов с методами (query, json и т.д.) |
| `src/snapshot-store.ts` | `SnapshotStore` — загрузка/сохранение JSON-снапшотов, кэш stores, `flushAllSnapshots()` |
| `src/serializer.ts` | `serialize`/`deserialize` (t/v формат), `stableHash`, `makeCallKey` |
| `src/env.ts` | `parseUnimockMode()`, `resolveSnapshotDir()` |
| `src/errors.ts` | `UnimockReplayMissError`, `UnimockSerializeError`, `UnimockConnectionHandlerTargetRequiredError` |
| `src/interfaces.ts` | Типы `SerializedValue`, `SnapshotCall`, `SnapshotFile`, `UnimockMode` |
| `src/index.ts` | Публичный API: `Mockable`, `SnapshotStore`, `flushAllSnapshots`, `ConnectionHandler`, `Unimock` |
| `vitest/setup.ts` | Хук `afterAll` для автоматического `flushAllSnapshots()` |
| `tests/unimock.spec.ts` | 24 unit-теста для ядра |
| `tests/clickhouse.spec.ts` | 2 интеграционных теста с реальным Clickhouse (record + replay) |
| `tests/rdkafka.spec.ts` | 2 интеграционных теста с реальным Kafka (record + replay) |
| `tests/schema-registry.spec.ts` | 2 интеграционных теста с Schema Registry (record + replay) |

## Поток данных (sequence)

### Record:
```
@Mockable() instance created with mode='record'
  → wrapPrototype() replaces prototype methods with wrapped versions
  → method call (e.g. get()):
    1. original.apply(this, args) → real result
    2. serializeArgs(args_with_callback_recordings)
    3. hasMethods(result)?
       YES → new ConnectionHandler(result, refId, store)
              store.record(callKey, { result: {t:'ref', v: refId} })
       NO  → store.record(callKey, { result: serialize(result) })
    4. return wrapped result
  → ConnectionHandler.get('query') trap:
    - record: wraps original query method on target
      → calls real query, wrapNested(result) → records ref
    - returns Promise<ConnectionHandler> wrapping QueryResult
  → ConnectionHandler.get('json') trap:
    - record: calls real json(), serializes plain data
    → returns Promise<{data: [...]}>
```

### Replay:
```
@Mockable() instance created with mode='replay'
  → wrapPrototype() replaces methods
  → method call (e.g. get()):
    1. replayCall(callKey, name, args, store)
    2. looks up callKey in store
    3. entry.result.t === 'ref'?
       YES → return new ConnectionHandler(null, refId, store)
       NO  → return deserialize(entry.result)
  → ConnectionHandler.get('query') trap:
    - mode='replay' → returns sync function
    - looks up conn:refId:query:{hash} in store
    - returns ConnectionHandler or deserialized data
  → json() on that handler → same flow → returns plain data
```

## hasMethods() — различение connection и data-объектов

```typescript
function hasMethods(value: unknown): value is object {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date || value instanceof RegExp) return false;
  if (Buffer.isBuffer(value)) return false;
  if (value instanceof Error) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return true;
  for (const key of Object.keys(value)) {
    if (typeof (value as Record<string, unknown>)[key] === 'function') return true;
  }
  return false;
}
```

Логика: инстанс класса (прототип не `Object.prototype`) → true. Plain object с методом → true. Иначе false (data, оборачивать не нужно).

## ConnectionHandler (Proxy)

```typescript
new ConnectionHandler(target, refId, store) → Proxy
```

- **record mode**: `get` trap → если `prop` — функция на target, возвращает обёртку, вызывающую original, записывает `conn:{refId}:prop:{hash}`, оборачивает результат через `wrapNested`.
- **replay mode**: `get` trap → возвращает функцию, ищущую `conn:{refId}:prop:{hash}` в store. `target` может быть `null`.
- `'then'`, `'constructor'`, `__unimock_ref__`, `#` → спецобработка (избегаем thenable, даём доступ к refId).
- `wrapNested` возвращает `{ wrapped, serialized }` — ConnectionHandler + `{t:'ref', v: refId}`.

## Сериализация

Формат `{ t: string, v: any }`:
- `'string'`, `'number'`, `'boolean'`, `'null'`, `'undefined'`
- `'date'` → ISO string
- `'regexp'` → `{ source, flags }`
- `'buffer'` → base64
- `'error'` → `{ name, message, stack, cause, ... }`
- `'array'` → `[{t, v}, ...]`
- `'object'` → `[{k: string, v: {t, v}}, ...]`
- `'ref'` → `{t:'ref', v: refId}` — ссылка на ConnectionHandler
- `'callback'` → `{t:'callback', v: {callRef, recording: [[{t,v},...]]}}`

`stableHash` — детерминированный MD5-like хеш для аргументов. `makeCallKey(prefix, name, args)` = `prefix + name + ':' + stableHash(args)`.

## Известные ограничения

1. **`@init()` из `@biorate/lifecycled` не проходит через `wrapMethod`**. `@init()` хранит оригинальный PropertyDescriptor в metadata конструктора. `Lifecycled.call()` читает дескриптор из metadata, а не с инстанса. Поэтому `initialize()` в replay-режиме всё равно выполняется (создаёт реальное соединение). Это не ломает replay (get/query идут из снапшота), но требует live-инфраструктуры.
   - **Workaround**: переопределить `initialize` в тестовом подклассе как no-op.
   - **Потенциальный фикс**: добавить проверку `SnapshotStore.mode` внутри `initialize()` наследника, или изменить механизм `@init()`.

2. **ConnectionHandler не возвращает Promise в replay-режиме**. В record-режиме `query()` возвращает Promise (original асинхронный). В replay — синхронно ConnectionHandler или deserialized data. `await` на non-Promise работает, но поведение неидентичное.

3. **Сериализация функций** — функции сериализуются как строка `<function>`. При deserialization возвращается строка. Callback-аргументы обрабатываются через механизм `'callback'` записи.

4. **Приватные поля `#`** не оборачиваются (`wrapPrototype` и ConnectionHandler фильтруют ключи, начинающиеся с `#`).

## Callback-механизм

Record: функции-аргументы заменяются обёрткой, собирающей вызовы в `records[][]`. После `original.apply` записи сериализуются как `{t:'callback', v: {callRef, recording}}`.

Replay: для каждого callback-аргумента воспроизводятся записанные вызовы: `fn(...deserialize(args))`. Асинхронные fn — Promise'ы в `Promise.all`.

## Тестирование

```bash
# Все тесты (24 unit + 2 clickhouse + 2 rdkafka)
pnpm --filter @biorate/unimock test

# Unit только
pnpm --filter @biorate/unimock exec npx vitest run tests/unimock.spec.ts

# Clickhouse (нужен clickhouse в docker)
pnpm --filter @biorate/unimock exec npx vitest run tests/clickhouse.spec.ts

# RDKafka (нужен kafka на localhost:9092)
pnpm --filter @biorate/unimock exec npx vitest run tests/rdkafka.spec.ts

# Replay-режим (без инфраструктуры)
UNIMOCK=replay pnpm --filter @biorate/unimock exec npx vitest run tests/{clickhouse,rdkafka}.spec.ts
```

Clickhouse:
```bash
docker compose up -d clickhouse
curl http://localhost:8123/ping  # → Ok.
```

## Снапшоты

- Формат: `tests/__snapshots__/<ClassName>.unimock.json` (или кастомный `snapshotDir`).
- Структура: `{ version: 1, className, calls: { [callKey]: { args, result, error } } }`.
- Коммитятся в репозиторий. CI использует `UNIMOCK=replay`.

## devDependencies для интеграционных тестов

`package.json`:
- `@biorate/clickhouse: "workspace:*"`
- `@biorate/config: "workspace:*"`
- `@biorate/prometheus: "workspace:*"` — требуется barrel-импортом `@biorate/rdkafka` (decorators)
- `@biorate/rdkafka: "workspace:*"`
- `@biorate/schema-registry: "workspace:*"`
- `@biorate/tools: "workspace:*"`
- `@confluentinc/kafka-javascript: "latest"` — peer dep rdkafka

## clickhouse-тест

`tests/clickhouse.spec.ts` использует DI из `@biorate/inversion`. Record: `SnapshotStore.setMode('record')` → DI-init → `SELECT 1` → `flushAllSnapshots()`. Replay: `SnapshotStore.setMode('replay')` → unbind/rebind DI → `$run()` (`@init()` live) → `get().query()` из снапшота.

## rdkafka-тест

`tests/rdkafka.spec.ts` — admin (createTopic) + producer (produce) + consumer (subscribe/consumePromise/commitMessageSync/unsubscribe). Record: `SnapshotStore.setMode('record')` → DI-init → produce message → consume → verify content → flush. Replay: `SnapshotStore.setMode('replay')` → consume из снапшота. Вызовы `admin.createTopic`, `producer.produce`, `consumer.commitMessageSync` — на ConnectionHandler-wrapped объектах, в replay воспроизводятся из снапшота.

**Важно**: `beforeAll` чистит топик через прямой `AdminClient` (не через Mockable), чтобы избежать race condition между запусками. Этот вызов выполняется только в record-режиме.

## schema-registry-тест

`tests/schema-registry.spec.ts` — HTTP API методы (ping, postSubjectsVersions, getSubjectsByVersion, getSchemasById, getSubjects, getSubjectsVersions, getSchemasTypes, deleteSubjects). Все вызовы на ConnectionHandler-wrapped объектах — в replay-режиме воспроизводятся из снапшота.

**Важно**: 
- `flushAllSnapshots()` автоматический в `tests/setup.ts` (`afterAll` хук)
- Используется фиксированный subject (`unimock-test-subject`)
- Один тест для обоих режимов (контроль через `UNIMOCK` env)

**Ограничение**: глобальный счётчик refId (`obj_${counter++}`) в `mockable.ts` — при повторных `get()` на одном и том же connection создаются новые ConnectionHandler с разными refId. Фикс: сохранять результат `get()` в переменную и переиспользовать.

Snapshot-store кэшируется по ключу `"{className}::{snapshotDir}"`.

## ENV-флаги оптимизации снапшотов

| Переменная | Описание |
| ---------- | -------- |
| `UNIMOCK_GZIP=1` | Gzip-компрессия `.unimock.json` при записи (~97% reduction на реальных данных). Чтение автоопределяет gzip-магию. |
| `UNIMOCK_STRIP_REQUEST=1` | Пропускать поле `request` у Axios-подобных ответов при сериализации (HTTP-интерны, ~40KB на entry). |
| `UNIMOCK_SKIP_CONN_ARGS=1` | Не сериализовать `args` для `conn:*` записей — они не используются в replay (только callKey нужен). |
| `SNAPSHOT_EXT` | Расширение файла снапшота (default: `.snap`). Имя: `{ClassName}.unimock{ext}`. |

**Всегда включены** (без флага):
- **Cache refId** — `WeakMap<object, string>` в `wrapAndRecord`/`wrapGetter`/`wrapNested`. Повторные `get()` на том же объекте переиспользуют refId → устраняются дубли `conn:obj_X:method:hash`.
- **String pool** — строки >500B в `SnapshotStore.record()` заменяются на `{t: "pooled_string", v: "$ref"}` с выносом в `strings:` словарь. Прозрачно расширяются обратно в `SnapshotStore.get()`.

## Чеклист при изменениях

- [ ] `pnpm --filter @biorate/unimock run build` — проверка типов
- [ ] `pnpm --filter @biorate/unimock run test` — все 30 тестов
- [ ] Если менялась сериализация — проверить `serialize`/`deserialize` symmetric
- [ ] Если менялся `hasMethods` — проверить различение connection/data объектов
- [ ] Если менялся replay-механизм — запустить clickhouse integration test (docker должен быть up)
- [ ] Если менялся `@Mockable()` — проверить работу с `@init()` (ограничение #1)

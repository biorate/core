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
            - оборачивает result с hasMethods() в MockHandler
```

## Ключевые файлы

| Файл                          | Назначение                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/mockable.ts`             | Декоратор `@Mockable()`, `wrapMethod`, `replayCall`, `wrapAndRecord`, `hasMethods`, `wrapGetter`, `mock()` (overloaded), `mockObject()`                             |
| `src/mock-handler.ts`         | `MockHandler` (Proxy) — обёртка для connection-объектов с методами (query, json и т.д.)                                                                             |
| `src/snapshot-store.ts`       | `SnapshotStore` — загрузка/сохранение JSON-снапшотов, кэш stores, `flushAllSnapshots()`, `isReplay()`, `isRecord()`, `isOff()` (internal, fast path)                |
| `src/serializer.ts`           | `serialize`/`deserialize` (t/v формат), `stableHash`, `makeCallKey`                                                                                                 |
| `src/env.ts`                  | `parseUnimockMode()`, `resolveSnapshotDir()`                                                                                                                        |
| `src/errors.ts`               | `UnimockReplayMissError`, `UnimockSerializeError`, `UnimockProxyTargetRequiredError`                                                                                |
| `src/interfaces.ts`           | Типы `SerializedValue`, `SnapshotCall`, `SnapshotFile`, `UnimockMode`                                                                                               |
| `src/index.ts`                | Публичный API: `Mockable`, `mock`, `SnapshotStore`, `flushAllSnapshots`, `MockHandler`, `Unimock`, `isReplay`, `isRecord`, `MODE_RECORD`, `MODE_REPLAY`, `MODE_OFF` |
| `vitest/setup.ts`             | Хук `afterAll` для автоматического `flushAllSnapshots()`                                                                                                            |
| `tests/unimock.spec.ts`       | 46 unit-тестов для ядра (включая off fast path, рекурсивный `toPlain`, replay-реконструкцию статиков, refId-scoping)                                                |
| `tests/comprehensive.spec.ts` | 14 тестов (10 старых + 4 новых: plain object mock, авто-naming)                                                                                                     |
| `tests/sequelize.spec.ts`     | 3 интеграционных теста: instance-returning statics (`toJSON`/`instanceof`/`get`) в record+replay                                                                    |
| `tests/clickhouse.spec.ts`    | 2 интеграционных теста с реальным Clickhouse (record + replay)                                                                                                      |
| `tests/rdkafka.spec.ts`       | 1 интеграционный тест с реальным Kafka (record + replay в одном файле)                                                                                              |
| `tests/noop.spec.ts`          | 16 тестов для noop Proxy                                                                                                                                            |

## Поток данных (sequence)

### Record:

```
@Mockable() instance created with mode='record'
  → wrapPrototype() replaces prototype methods with wrapped versions
  → method call (e.g. get()):
    1. original.apply(this, args) → real result
    2. serializeArgs(args_with_callback_recordings)
    3. hasMethods(result)?
       YES → new MockHandler(result, refId, store)
              store.record(callKey, { result: {t:'ref', v: refId} })
       NO  → store.record(callKey, { result: serialize(result) })
    4. return wrapped result
  → MockHandler.get('query') trap:
    - record: wraps original query method on target
      → calls real query, wrapNested(result) → records ref
    - returns Promise<MockHandler> wrapping QueryResult
  → MockHandler.get('json') trap:
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
       YES → return new MockHandler(null, refId, store)
       NO  → return deserialize(entry.result)
  → MockHandler.get('query') trap:
    - mode='replay' → returns sync function
    - looks up call:refId:query:{hash} in store
    - returns MockHandler or deserialized data
  → json() on that handler → same flow → returns plain data
```

## mockObject() — мокирование plain объектов

`mock()` принимает не только классы, но и plain объекты (в т.ч. инстансы классов). В этом случае создаётся копия объекта (прототип сохраняется), на каждом методе вызывается `wrapMethod()`.

**Определение имени снапшота:**

1. `options.name` — явное имя
2. `obj.constructor.name` — если не `'Object'` (для class-инстансов)
3. `Object_<stableHash(keys)>` — для литералов (хеш от имён методов)

Оригинальный объект не мутируется — возвращается копия с тем же прототипом.

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

Глубина рекурсивной обёртки контролируется опцией `depth` (default: `Infinity`). При `depth >= store.depth` результат сериализуется напрямую, без создания `MockHandler`. Позволяет ограничить вложенность для глубоких цепочек вызовов.

## MockHandler (Proxy)

```typescript
new MockHandler(target, refId, store) → Proxy
```

- **record mode**: `get` trap → если `prop` — функция на target, возвращает обёртку, вызывающую original, записывает `call:{refId}:prop:{hash}`, оборачивает результат через `wrapNested`.
- **replay mode**: `get` trap → возвращает функцию, ищущую `call:{refId}:prop:{hash}` в store. `target` может быть `null`.
- `'then'`, `'constructor'`, `__unimock_ref__`, `#` → спецобработка (избегаем thenable, даём доступ к refId).
- `wrapNested` возвращает `{ wrapped, serialized }` — MockHandler + `{t:'ref', v: refId}`.
- **Double-wrap guard**: `wrapResult` (mockable.ts) и `wrapNested` (mock-handler.ts) проверяют `__unimock_ref__` на result. Если объект уже обёрнут в MockHandler — переиспользуют существующий refId и не создают новый. Это позволяет вызывать `get()` (или `connection()`) многократно: все возвращают один и тот же MockHandler с одинаковым refId, и записи `call:{refId}:*` не дублируются.

## Обёртка статических методов и replay-реконструкция (1.9.0)

Опция `statics: [[...имена]]` оборачивает статические методы класса (например `SEQUELIZE_STATICS` для Sequelize).

### Off-режим: zero-overhead fast path

Первая строка `makeMethodWrapper` и `wrapGetter` — `if (isOff()) return original.apply/call(...)`. В off-режиме вызов уходит прямо на original **до** `reportArgs`/`makeCallKey` — нулевой hashing, нулевой MD5, snapshot-store не трогается. `isOff()` — internal-функция `snapshot-store.ts`, в публичный API (`src/index.ts`) не экспортируется.

### `staticOriginals` — WeakMap оригинальных статиков

`const staticOriginals = new WeakMap<object, Map<string, Function>>()` (module-level, `src/mockable.ts`). `wrapStaticMethods` **до** `Object.defineProperty` сохраняет оригинальную реализацию каждого статика (в первую очередь `build`). Критично: replay-реконструкция должна вызывать **оригинальный** `build`, а не обёрнутый (обёрнутый ушёл бы в replay-lookup и упал бы с `UnimockReplayMissError`).

### `STATIC_REPLAY_SHAPE` — формы результата в replay

| shape           | статик-и                                                  | результат replay                                    |
| --------------- | --------------------------------------------------------- | --------------------------------------------------- |
| `chain`         | `scope`, `unscoped`, `schema`                             | сам декорированный класс (дальше цепочка работает)  |
| `single`        | `create`, `findOne`, `findByPk`, `build`                  | `rebuildInstance(klass, data)`                      |
| `array`         | `findAll`, `bulkCreate`, `bulkBuild`                      | `data.map(rebuildInstance)`                         |
| `pairInstance`  | `findOrCreate`, `findOrBuild`, `findCreateFind`, `upsert` | `[rebuildInstance(data[0]), data[1]]`               |
| `pairCount`     | `update`                                                  | `[data[0], data[1].map(rebuildInstance)]`           |
| `wrapper`       | `findAndCountAll`                                         | `{ ...data, rows: data.rows.map(rebuildInstance) }` |
| (нет в таблице) | кастомные/неизвестные статик-и                            | deserialized data as-is (legacy-поведение)          |

`rebuildInstance(klass, plain)`: берёт `staticOriginals.get(klass)?.get('build') ?? (klass as any).build` (единственный задокументированный `as any` в src) и вызывает `build.call(klass, plain, { isNewRecord: false })` — но только если `plain` — непустой plain object и `build` — функция; иначе (null, array, инстанс, пустой объект) plain возвращается как есть. Реконструированный инстанс — инстанс **декорированного** класса (`new this(...)` внутри оригинального `build`), поэтому его прототип-методы обёрнуты, и replay-lookup для них работает.

### `toPlain` — рекурсивная конверсия результата статика (record-сторона)

Порядок: null/примитивы/функции как есть → `instanceof Date/RegExp/Error` + `Buffer.isBuffer` как есть (**до** toJSON-проверки — у Date и Buffer есть `toJSON`, конвертировать нельзя) → `typeof value.toJSON === 'function'` → `value.toJSON()` (результат **не** рекурсируется дальше) → `Array.isArray` → `map(toPlain)` → plain object (прототип `Object.prototype`) → rebuild через `Object.entries` с `toPlain` по значениям → иначе как есть.

Последствие (смена формата данных, см. миграцию в README): строки `findAll`/`bulkCreate`/`bulkBuild`/`findAndCountAll` теперь чистые `toJSON()` (без `dataValues`/`_previousDataValues`/`uniqno`); top-level `Date`-результат статика теперь `t: 'date'` (был ISO-string из `Date.toJSON()`).

### refId-scoping для инстансов из статиков

- Запись (`recordStaticResult`): `assignStaticRefs(name, result)` идёт **до** `toPlain(result)` — живым инстансам раздаются refId'ы (WeakMap `refIdCache`), и тогда wrapped-`toJSON()` записывает per-instance scoped-входы. `refs` кладётся в entry только если ≥1 элемент получил refId.
- `SnapshotCall.refs?: unknown` — **опциональное** поле (формат version не менялся, 1): отсутствует = legacy, чтение толерантно.
- Воспроизведение (`replayStaticCall`): `registerStaticRefs(shape, rebuilt, entry.refs)` ставит реконструированные инстансы в `refIdCache` под **записанными** refId'ами (никогда не `nextRefId()` в replay).
- Прямые вызовы обёрнутых методов/геттеров на этих инстансах считаются с префиксом `connectionPrefix(this)` → call-key `call:{refId}:{method}:{hash}` (та же конвенция, что в `mock-handler.ts`; `conn:{refId}:` в TSDoc сериализатора — устаревшая док, реальный формат `call:`).
- Незаписанный instance-метод на ref'd-инстансе в replay → `UnimockReplayMissError` (by design).
- Passthrough `refs` в `snapshot-store.ts` `get()`/`record()` — обязательно: record()/get() пересобирают entry-объекты с фиксированным набором полей, без условного spread `refs` терялся бы при flush и при чтении.

## Сериализация

Формат `{ t: string, v: any }`:

- `'string'`, `'number'`, `'boolean'`, `'null'`, `'undefined'`
- `'date'` → ISO string
- `'regexp'` → `{ source, flags }`
- `'buffer'` → base64
- `'error'` → `{ name, message, stack, cause, ... }`
- `'array'` → `[{t, v}, ...]`
- `'object'` → `[{k: string, v: {t, v}}, ...]`
- `'ref'` → `{t:'ref', v: refId}` — ссылка на MockHandler
- `'callback'` → `{t:'callback', v: {callRef, recording: [[{t,v},...]]}}`

`stableHash` — детерминированный MD5-like хеш для аргументов. `makeCallKey(prefix, name, args)` = `prefix + name + ':' + stableHash(args)`.

## Известные ограничения

1. **`@init()` из `@biorate/lifecycled` не проходит через `wrapMethod`**. `@init()` хранит оригинальный PropertyDescriptor в metadata конструктора. `Lifecycled.call()` читает дескриптор из metadata, а не с инстанса. Поэтому `initialize()` в replay-режиме всё равно выполняется (создаёт реальное соединение). Это не ломает replay (get/query идут из снапшота), но требует live-инфраструктуры.

   - **Workaround**: переопределить `initialize` в тестовом подклассе как no-op.
   - **Потенциальный фикс**: добавить проверку `SnapshotStore.mode` внутри `initialize()` наследника, или изменить механизм `@init()`.

2. **MockHandler не возвращает Promise в replay-режиме**. В record-режиме `query()` возвращает Promise (original асинхронный). В replay — синхронно MockHandler или deserialized data. `await` на non-Promise работает, но поведение неидентичное.

3. **Сериализация функций** — функции сериализуются как строка `<function>`. При deserialization возвращается строка. Callback-аргументы обрабатываются через механизм `'callback'` записи.

4. **Приватные поля `#`** не оборачиваются (`wrapPrototype` и MockHandler фильтруют ключи, начинающиеся с `#`).

5. **Вложенные include/association-объекты остаются plain в replay.** Реконструкция пересобирает только top-level элементы формы результата статика; вложенные модели внутри строки остаются deserialized plain-объектами (toPlain не рекурсирует в результат `toJSON()`).

6. **Невызывавшийся в record instance-метод бросает `UnimockReplayMissError` в replay.** Если метод не вызывался на данном инстансе в record-фазе — в replay его вызов промахнётся (by design, семантика replay).

7. **Replay-инстансы реконструируются оригинальным статик-`build` самой модели** — класс модели должен быть импортируем и инициализирован в replay-среде (для Sequelize: связан с инстансом `Sequelize`, иначе `build` упадёт с `ModelNotInitializedError`; в тестах — offline `new Sequelize({ models: [Model] })` в setup).

## Callback-механизм

Record: функции-аргументы заменяются обёрткой, собирающей вызовы в `records[][]`. После `original.apply` записи сериализуются как `{t:'callback', v: {callRef, recording}}`.

Replay: для каждого callback-аргумента воспроизводятся записанные вызовы: `fn(...deserialize(args))`. Асинхронные fn — Promise'ы в `Promise.all`.

## Тестирование

```bash
# Все тесты (15 files / 91 tests, верифицировано 2026-09-08)
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

- Формат: `__snapshots__/<ClassName>.unimock.json` рядом с файлом теста (или кастомный `snapshotDir`).
  Механизм: передача `importMeta: import.meta` в `@Mockable()` или `mock()`. Если `importMeta` не
  указан — используется `tests/__snapshots__/` (по умолчанию) или `UNIMOCK_SNAPSHOT_DIR`.
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

`tests/rdkafka.spec.ts` — admin (createTopic) + producer (produce) + consumer (subscribe/consumePromise/commitMessageSync/unsubscribe). Record: `SnapshotStore.setMode('record')` → DI-init → produce message → consume → verify content → flush. Replay: `SnapshotStore.setMode('replay')` → consume из снапшота. Вызовы `admin.createTopic`, `producer.produce`, `consumer.commitMessageSync` — на MockHandler-wrapped объектах, в replay воспроизводятся из снапшота.

**Важно**: `beforeAll` чистит топик через прямой `AdminClient` (не через Mockable), чтобы избежать race condition между запусками. Этот вызов выполняется только в record-режиме.

## schema-registry-тест

`tests/schema-registry.spec.ts` — HTTP API методы (ping, postSubjectsVersions, getSubjectsByVersion, getSchemasById, getSubjects, getSubjectsVersions, getSchemasTypes, deleteSubjects). Все вызовы на MockHandler-wrapped объектах — в replay-режиме воспроизводятся из снапшота.

**Важно**:

- `flushAllSnapshots()` автоматический в `tests/setup.ts` (`afterAll` хук)
- Используется фиксированный subject (`unimock-test-subject`)
- Один тест для обоих режимов (контроль через `UNIMOCK` env)

**Ограничение**: глобальный счётчик refId (`ref_${counter++}`) в `mockable.ts` — при повторных `get()` на одном и том же connection создаются новые MockHandler с разными refId. Фикс: сохранять результат `get()` в переменную и переиспользовать.

Snapshot-store кэшируется по ключу `"{className}::{snapshotDir}"`.

## ENV-флаги оптимизации снапшотов

| Переменная                                                   | Описание                                                                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `UNIMOCK_GZIP=1`                                             | Gzip-компрессия `.unimock.json` при записи (~97% reduction на реальных данных). Чтение автоопределяет gzip-магию. |
| `UNIMOCK_STRIP_REQUEST=1`                                    | Пропускать поле `request` у Axios-подобных ответов при сериализации (HTTP-интерны, ~40KB на entry).               |
| `UNIMOCK_SKIP_PROXY_ARGS=1` (или `UNIMOCK_SKIP_CONN_ARGS=1`) | Не сериализовать `args` для `call:*` записей — они не используются в replay (только callKey нужен).               |
| `UNIMOCK_SNAPSHOT_DIR`                                       | Кастомная папка снапшотов (fallback; игнорируется при `importMeta`).                                              |
| `SNAPSHOT_EXT`                                               | Расширение файла снапшота (default: `.snap`). Имя: `{ClassName}.unimock{ext}`.                                    |

**Всегда включены** (без флага):

- **Cache refId** — `WeakMap<object, string>` в `wrapAndRecord`/`wrapGetter`/`wrapNested`. Повторные `get()` на том же объекте переиспользуют refId → устраняются дубли `call:ref_X:method:hash`.
- **String pool** — строки >500B в `SnapshotStore.record()` заменяются на `{t: "pooled_string", v: "$ref"}` с выносом в `strings:` словарь. Прозрачно расширяются обратно в `SnapshotStore.get()`.

## Helper-функции `isReplay()` / `isRecord()`

`isReplay()` и `isRecord()` — read-only функции, проверяющие глобальный режим (`SnapshotStore.mode`). Всегда читают актуальное значение, корректно работают после `SnapshotStore.setMode()`.

Заменяют ручные проверки `store.mode === MODE_REPLAY` и `SnapshotStore.mode !== 'record'`:

```ts
// Было
const mode = store.mode;
if (mode === MODE_REPLAY) return replayCall(...);

// Стало
if (isReplay()) return replayCall(...);

// Было
if (SnapshotStore.mode !== 'record') return;

// Стало
if (!isRecord()) return;
```

Также доступны через `Unimock.isReplay`, `Unimock.isRecord` (getter-свойства).

## Чеклист при изменениях

- [ ] `pnpm --filter @biorate/unimock run build` — проверка типов
- [ ] `pnpm --filter @biorate/unimock run test` — все 91 тест (15 files)
- [ ] Если менялась сериализация — проверить `serialize`/`deserialize` symmetric
- [ ] Если менялся `hasMethods` — проверить различение connection/data объектов
- [ ] Если менялся replay-механизм — запустить clickhouse integration test (docker должен быть up)
- [ ] Если менялся `@Mockable()` — проверить работу с `@init()` (ограничение #1)
- [ ] Если менялся `mock`/`mockObject` — проверить record+replay для plain объектов, сохранение прототипа, авто-naming
- [ ] Документация — обновить `README.md` (примеры, секции) и TSDoc на новых/изменённых функциях и типах

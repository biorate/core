# @biorate/unimock — snapshot-based proxy mocking

Локальные правила пакета. Если конфликтуют с корневым `AGENTS.md` — применяется корневой.

## Назначение

`@biorate/unimock` — библиотека для snapshot-мокирования коннекторов и сервисов через декоратор `@Mockable()`. Три режима: **record** (реальный вызов + сохранение снапшота), **replay** (воспроизведение из снапшота без live-инфраструктуры) и **off** (zero-overhead pass-through, по умолчанию).

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
| `src/mockable.ts`             | Декоратор `@Mockable()`, `mock()` (overloaded), `mockObject()`, `patchPrototype`, `resolveObjectName`                                                               |
| `src/method-wrapper.ts`       | `MethodWrapper` (config-object), `wrapMethod`, `wrapGetter`, `replayCall`, `replayCallbacks`, `recordPrep`, `serializeArgs`, `wrapResult`, `hasMethods`              |
| `src/statics.ts`              | `StaticReplayShape`, `STATIC_REPLAY_SHAPE`, `wrapStaticMethod`, `replayStaticCall`, `registerStaticRefs`, `rebuildInstance`, `recordStaticResult`, `toPlain`, `assignStaticRefs` |
| `src/state.ts`                | Module-level state: `replayRebuilt`, `staticOriginals`, `reconstructionDepth` + `inReconstruction()`/`withReconstructionDepth()`                                      |
| `src/mock-handler.ts`         | `MockHandler` (Proxy) — обёртка для connection-объектов с методами (query, json и т.д.), private `#replayGet`/`#recordGet`                                           |
| `src/sequelize.ts`            | `bindReplaySequelizeModels` — offline-binding Sequelize-моделей в replay (no-op вне replay, off-guard вокруг биндинга, вариадик-модели + опции)                                      |
| `src/snapshot-store.ts`       | `SnapshotStore` — JSONL загрузка/сохранение (v2 header `_jsonl:2`, refs всегда явный), кэш stores, режимные гейты `record()`/`flush()`, `flushAllSnapshots()`, `isReplay()`, `isRecord()`, `isOff()` (internal, fast path) |
| `src/serializer.ts`           | `serialize`/`deserialize` (t/v формат), `stableHash`, `makeCallKey`                                                                                                 |
| `src/utils.ts`                | `getOrAssignRefId`, `getRefId`, `setRefId`, `getUnimockRef`, `isPromiseLike`, `getReplayStaticEntry`, `recordError`                                                  |
| `src/env.ts`                  | `parseUnimockMode()`, `resolveSnapshotDir()`                                                                                                                        |
| `src/errors.ts`               | `UnimockReplayMissError`, `UnimockSerializeError`, `UnimockProxyTargetRequiredError`                                                                                |
| `src/interfaces.ts`           | Типы `SerializedValue`, `SnapshotCall`, `SnapshotFile`, `UnimockMode`                                                                                               |
| `src/constants.ts`            | Постоянные: mode-строки, t/v теги, префиксы call-key, `POOL_THRESHOLD`, `JSONL_FORMAT_VERSION`                                                                      |
| `src/index.ts`                | Публичный API: `Mockable`, `mock`, `SnapshotStore`, `flushAllSnapshots`, `MockHandler`, `Unimock`, `isReplay`, `isRecord`, `MODE_RECORD`, `MODE_REPLAY`, `MODE_OFF` |
| `vitest/setup.ts`             | Хук `afterAll` для автоматического `flushAllSnapshots()`                                                                                                            |
| `tests/unit/unimock.spec.ts`       | 47+ unit-тестов для ядра (включая off fast path, рекурсивный `toPlain`, replay-реконструкцию статиков, refId-scoping, reconstruction pass-through)                     |
| `tests/unit/comprehensive.spec.ts` | 14 тестов (10 старых + 4 новых: plain object mock, авто-naming)                                                                                                     |
| `tests/e2e/sequelize.spec.ts`     | 4 интеграционных теста (+destroy: instance + static); instance-returning statics (`toJSON`/`instanceof`/`get`) в record+replay                                      |
| `tests/e2e/clickhouse.spec.ts`    | 2 интеграционных теста с реальным Clickhouse (record + replay)                                                                                                      |
| `tests/e2e/rdkafka.spec.ts`       | 1 интеграционный тест с реальным Kafka (record + replay в одном файле)                                                                                              |
| `tests/unit/noop.spec.ts`          | 16 тестов для noop Proxy                                                                                                                                            |

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
- **Double-wrap guard**: `wrapResult` (method-wrapper.ts) и `wrapNested` (mock-handler.ts) проверяют `__unimock_ref__` на result. Если объект уже обёрнут в MockHandler — переиспользуют существующий refId и не создают новый. Это позволяет вызывать `get()` (или `connection()`) многократно: все возвращают один и тот же MockHandler с одинаковым refId, и записи `call:{refId}:*` не дублируются.

## Обёртка статических методов и replay-реконструкция (1.9.0)

Опция `statics: [[...имена]]` оборачивает статические методы класса (например `SEQUELIZE_STATICS` для Sequelize).

### Off-режим: zero-overhead fast path

Первая строка `makeMethodWrapper` и `wrapGetter` — `if (isOff()) return original.apply/call(...)`. В off-режиме вызов уходит прямо на original **до** `reportArgs`/`makeCallKey` — нулевой hashing, нулевой MD5, snapshot-store не трогается. `isOff()` — internal-функция `snapshot-store.ts`, в публичный API (`src/index.ts`) не экспортируется.

### `staticOriginals` — WeakMap оригинальных статиков

`const staticOriginals = new WeakMap<object, Map<string, Function>>()` (module-level, `src/state.ts`). `wrapStaticMethods` **до** `Object.defineProperty` сохраняет оригинальную реализацию каждого статика (в первую очередь `build`). Критично: replay-реконструкция должна вызывать **оригинальный** `build`, а не обёрнутый (обёрнутый ушёл бы в replay-lookup и упал бы с `UnimockReplayMissError`).

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

Статик-и, отсутствующие в таблице (destroy, count, truncate и др.), проходят default-ветку: deserialized data as-is (legacy-поведение) — покрыто тестами в tests/e2e/sequelize.spec.ts.

`rebuildInstance(klass, plain)`: берёт `staticOriginals.get(klass)?.get('build') ?? (klass as any).build` (единственный задокументированный `as any` в src) и вызывает `build.call(klass, plain, { isNewRecord: false })` — но только если `plain` — непустой plain object и `build` — функция; иначе (null, array, инстанс, пустой объект) plain возвращается как есть. Реконструированный инстанс — инстанс **декорированного** класса (`new this(...)` внутри оригинального `build`), поэтому его прототип-методы обёрнуты, и replay-lookup для них работает.

### `reconstructionDepth` — pass-through во время replay-реконструкции (1.10.1)

`let reconstructionDepth = 0;` (module-private, `src/state.ts`). `rebuildInstance` повышает/понижает его вокруг `build.call` (`++`/`try`/`finally --`). Пока счётчик `> 0`, первая проверка в `makeMethodWrapper` (после `isOff()` — T1-инвариант zero-overhead fast path остаётся первой) и в `wrapGetter` **возвращает `original` напрямую** — до `reportArgs`/`makeCallKey` (hashing во время реконструкции не считается — бесплатный перф-бонус) и до replay/record-веток.

Причина: vanilla-конструктор Sequelize при реконструкции повторно входит в обёрнутые прототип-методы (например `_initValues`) с опциями, которые record-режим **никогда не производил** (recon `{isNewRecord:false,_schema:null,_schemaDelimiter:""}` vs hydration `{raw:true,attributes:[...]}`) → unscoped call-key `_initValues:{hash}` без entry → `UnimockReplayMissError`. С pass-through состояние инстанса заполняет сам Sequelize; post-construction-вызовы (`toJSON`/`get`/…) обслуживаются из записанных `call:{refId}:`-entries после `registerStaticRefs`. Последствие: опции конструирования в record и replay **больше не обязаны совпадать**; сид-вызов `build()` с идентичными аргументами (внутренний T4-воркараунд) больше не нужен. Статический путь `build` не меняется: `staticOriginals`-инвариант T3 цел (dedicated-тест «replays build() itself without replay-lookup miss» зелёный).

### `toPlain` — рекурсивная конверсия результата статика (record-сторона)

Порядок: null/примитивы/функции как есть → `instanceof Date/RegExp/Error` + `Buffer.isBuffer` как есть (**до** toJSON-проверки — у Date и Buffer есть `toJSON`, конвертировать нельзя) → `typeof value.toJSON === 'function'` → `value.toJSON()` (результат **не** рекурсируется дальше) → `Array.isArray` → `map(toPlain)` → plain object (прототип `Object.prototype`) → rebuild через `Object.entries` с `toPlain` по значениям → иначе как есть.

Последствие (смена формата данных, см. миграцию в README): строки `findAll`/`bulkCreate`/`bulkBuild`/`findAndCountAll` теперь чистые `toJSON()` (без `dataValues`/`_previousDataValues`/`uniqno`); top-level `Date`-результат статика теперь `t: 'date'` (был ISO-string из `Date.toJSON()`).

### refId-scoping для инстансов из статиков

- Запись (`recordStaticResult`): `assignStaticRefs(name, result)` идёт **до** `toPlain(result)` — живым инстансам раздаются refId'ы (WeakMap `refIdCache`), и тогда wrapped-`toJSON()` записывает per-instance scoped-входы. В v2 `refs` пишется всегда (`refs ?? null`); <code>null</code> = результат без модели (raw/plain marker).
- `SnapshotCall.refs?: unknown` — **опциональный** тип (runtime): в v2-файле всегда присутствует (значение или `null`); legacy v1-записи без поля читаются с `undefined`, что триггерит legacy rebuild path. Отличие `null` от отсутствия важно: `null` → результат as-is без реконструкции.
- Воспроизведение (`replayStaticCall`): `registerStaticRefs(shape, rebuilt, entry.refs)` ставит реконструированные инстансы в `refIdCache` под **записанными** refId'ами (никогда не `nextRefId()` в replay).
- Прямые вызовы обёрнутых методов/геттеров на этих инстансах считаются с префиксом `connectionPrefix(this)` → call-key `call:{refId}:{method}:{hash}` (та же конвенция, что в `mock-handler.ts`).
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

7. **Replay-инстансы реконструируются оригинальным статик-`build` самой модели** — класс модели должен быть импортируем и инициализирован в replay-среде (для Sequelize: связан с инстансом `Sequelize`, иначе `build` упадёт с `ModelNotInitializedError`). Для этого есть публичный хелпер `bindReplaySequelizeModels(...models)` (`src/sequelize.ts`): offline-binding без I/O, no-op вне replay, внутри временно переключает режим в off (wrapped-статики вроде `getTableName` не уходят в replay-lookup). Используется в `tests/e2e/sequelize.spec.ts`; юнит-спеки android (`association-replay`, `aggregate-replay`) биндят безусловно вручную (нужны вне replay тоже).

## Callback-механизм

Record: функции-аргументы заменяются обёрткой, собирающей вызовы в `records[][]`. После `original.apply` записи сериализуются как `{t:'callback', v: {callRef, recording}}`.

Replay: для каждого callback-аргумента воспроизводятся записанные вызовы: `fn(...deserialize(args))`. Асинхронные fn — Promise'ы в `Promise.all`.

## Тестирование

Сьют (25 files / 136 tests, верифицировано 2026-09-18) делится на два класса:

**Unit — 15 файлов** (`tests/unit/`), самодостаточны, внешняя инфраструктура не нужна (сами выставляют `SnapshotStore.setMode` / `process.env`): `unimock`, `noop`, `comprehensive`, `compact-table`, `content-dedup`, `mode-guards`, `record-session`, `snapshot-store-lifecycle`, `iterator-replay`, `static-sequence-replay`, `refid-determinism`, `association-replay`, `aggregate-replay`, `proxy`, `proxy-prometheus`.

**E2E — 10 файлов** (`tests/e2e/`), требуют живую инфраструктуру (docker-compose сервисы): `clickhouse` (:8123), `ioredis` (:6379), `mongodb` (:27017), `mssql` (:1433), `opensearch` (:9200), `pg` (:5432), `rdkafka` (:9092), `redis` (:6379), `schema-registry` (:8085), `sequelize` (:5432).

Важно: даже в replay-режиме e2e **требуют** live-инфру, потому что `@init()` из `@biorate/lifecycled` выполняется реально (ограничение #1) и коннектится к сервису до обращения к снапшоту. Полностью офлайн без инфры — только `test:unit` (или `UNIMOCK=replay npx vitest run tests/unit`).

```bash
# Весь сьют в replay-режиме (e2e в этом прогоне всё равно требуют поднятую инфру — ограничение #1)
pnpm --filter @biorate/unimock test

# Unit только (без e2e-файлов, без инфраструктуры, off-режим)
pnpm --filter @biorate/unimock run test:unit

# E2E только (запись снапшотов; требут поднятую инфру: docker compose up -d)
pnpm --filter @biorate/unimock run test:e2e

# Индивидуальный unit-спек
pnpm --filter @biorate/unimock exec npx vitest run tests/unit/unimock.spec.ts

# Replay-режим точечно (e2e всё равно требуют live-инфру для @init(), см. выше)
UNIMOCK=replay pnpm --filter @biorate/unimock exec npx vitest run tests/e2e/{clickhouse,rdkafka}.spec.ts
```

Clickhouse:

```bash
docker compose up -d clickhouse
curl http://localhost:8123/ping  # → Ok.
```

## Снапшоты

- Формат: `__snapshots__/<ClassName>.unimock.json` (или кастомный `snapshotDir`).
  Механизм: передача `importMeta: import.meta` в `@Mockable()` или `mock()`. Если `importMeta` не
  указан — используется `tests/__snapshots__/` (по умолчанию) или `UNIMOCK_SNAPSHOT_DIR`.
- Формат файла: **streaming JSONL** (gzip по флагу). Три типа строк:
  - `_t:'s'` — строковый пул (`ref→val`); threshold >500 символов.
  - `_t:'v'` — пул значений (массивы/объекты).
  - `_t:'c'` — запись вызова: `{ key, call: { args, result, error?, refs? } }`.
- **v2-формат** (текущий, `_jsonl: 2`): поле `refs` **обязательно** на каждой `_t:'c'`-строке
  (explicit `null` когда нет модели). Reader отличает v1/v2 по заголовку; v1 без `refs` →
  legacy rebuild path, v2 с `refs: null` → `asIs` (raw/plain без реконструкции).
  При `record()` в памяти `call.refs` нормализуется через `call.refs ?? null`.
- Файл `{version: 1, className, calls}` (legacy non-JSONL `.fmt`) поддерживается для чтения,
  но не записывается.
- Коммитятся в репозиторий. CI использует `UNIMOCK=replay`.
- **Отказ от call-key-словаря (`_t:'k'`)** (измерено на TestModel): ключи почти всегда уникальны,
  словарь на delta +3542B увеличивает файл, а не сокращает → идея отброшена, ключи пишутся inline.

### Контракт режимов и жизненный цикл снапшотов

- Пишут только в record-режиме: `record()` и `flush()` вне record являются no-op (`if (!isRecord()) return;`, защита в глубину: обёртки `@Mockable()` и так не вызывают их вне record). `flushAllSnapshots()` защищён так же.
- Record-сессия начинается с чистого листа: конструктор store в record НЕ загружает существующий файл, первый flush сессии перезаписывает файл целиком (truncate + rewrite через `writeJsonlFull`). Межпрогонные дубли `_t:'c'`-строк одного ключа невозможны. Внутри-сессионные повторные `_t:'c'`-строки одного ключа остаются (нужны итераторам и sequence-replay).
- Sweep при `setMode()`: переход в record (из replay/off) сбрасывает память всех кэшированных store реестра (включая `valueIndex`, счётчики пулов, `jsonlOnDisk=false` → следующий flush = `writeJsonlFull`). Повторный `setMode('record')` без выхода из record сессию НЕ очищает (sweep только на переходе).
- Edge: если record-сессия ни разу не флашится, файл на диске остаётся устаревшим (держит контент прошлой сессии).
- Параллельная безопасность: 1 файл снапшота = одна record-сессия-владелец; className+dir уникальны per spec-файл или mkdtemp-директория. Параллельный replay безопасен по построению (не пишет).
- Контракт зафиксирован тестами: `tests/unit/mode-guards.spec.ts` (4 теста: replay/off не создают файл; replay не меняет существующий байт-в-байт; record happy-path) и `tests/unit/record-session.spec.ts` (5 тестов: чистая сессия, отсутствие межпрогонных дублей, инвариант повторного `setMode`, in-process record→flush→replay, fresh-конструктор).

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

`tests/e2e/clickhouse.spec.ts` использует DI из `@biorate/inversion`. Record: `SnapshotStore.setMode('record')` → DI-init → `SELECT 1` → `flushAllSnapshots()`. Replay: `SnapshotStore.setMode('replay')` → unbind/rebind DI → `$run()` (`@init()` live) → `get().query()` из снапшота.

## rdkafka-тест

`tests/e2e/rdkafka.spec.ts` — admin (createTopic) + producer (produce) + consumer (subscribe/consumePromise/commitMessageSync/unsubscribe). Record: `SnapshotStore.setMode('record')` → DI-init → produce message → consume → verify content → flush. Replay: `SnapshotStore.setMode('replay')` → consume из снапшота. Вызовы `admin.createTopic`, `producer.produce`, `consumer.commitMessageSync` — на MockHandler-wrapped объектах, в replay воспроизводятся из снапшота.

**Важно**: `beforeAll` чистит топик через прямой `AdminClient` (не через Mockable), чтобы избежать race condition между запусками. Этот вызов выполняется только в record-режиме.

## schema-registry-тест

`tests/e2e/schema-registry.spec.ts` — HTTP API методы (ping, postSubjectsVersions, getSubjectsByVersion, getSchemasById, getSubjects, getSubjectsVersions, getSchemasTypes, deleteSubjects). Все вызовы на MockHandler-wrapped объектах — в replay-режиме воспроизводятся из снапшота.

**Важно**:

- `flushAllSnapshots()` автоматический в `tests/setup.ts` (`afterAll` хук)
- Используется фиксированный subject (`unimock-test-subject`)
- Один тест для обоих режимов (контроль через `UNIMOCK` env)

**Ограничение**: глобальный счётчик refId (`ref_${counter++}`) в `mock-handler.ts`/`utils.ts` — при повторных `get()` на одном и том же connection создаются новые MockHandler с разными refId. Фикс: сохранять результат `get()` в переменную и переиспользовать.

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
- [ ] `pnpm --filter @biorate/unimock run test` — все 137 тестов (25 files)
- [ ] Если менялся режимный контракт (`record()`/`flush()`/`setMode()`/конструктор store) — прогнать контракт-тесты: `npx vitest run tests/unit/mode-guards.spec.ts tests/unit/record-session.spec.ts`
- [ ] Если менялся sweep/fresh-сессия — проверить отсутствие межпрогонных дублей `_t:'c'` (`tests/unit/record-session.spec.ts`) и неизменность файлов снапшотов при `UNIMOCK=replay`
- [ ] Если менялась сериализация — проверить `serialize`/`deserialize` symmetric
- [ ] Если менялся `hasMethods` — проверить различение connection/data объектов
- [ ] Если менялся replay-механизм — запустить clickhouse integration test (docker должен быть up)
- [ ] Если менялся `@Mockable()` — проверить работу с `@init()` (ограничение #1)
- [ ] Если менялся `mock`/`mockObject` — проверить record+replay для plain объектов, сохранение прототипа, авто-naming
- [ ] Документация — обновить `README.md` (примеры, секции) и TSDoc на новых/изменённых функциях и типах

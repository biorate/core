# Глобальные правила монорепозитория

## Иерархия правил (важно)

1. Корневой `AGENTS.md` — **единый источник истины** для всего репозитория.
2. При необходимости можно добавлять `packages/**/*/AGENTS.md` — правила конкретного пакета (сейчас в дереве таких файлов нет).

Если локальные правила конфликтуют с корневыми — **применяются корневые**, а конфликт нужно исправить в документации.

## Структура репозитория

| Путь                       | Назначение                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `packages/@biorate/<имя>/` | Публикуемые npm-пакеты с scope `@biorate/*`                                        |
| `.tools/*`                 | Внутренние воркспейсы (например проверки импорта), не публикуются как `@biorate/*` |
| `.scripts/`                | Общие скрипты сборки (`write-package-type.js`, `copy-assets.js` и т.д.)            |
| `docs/`                    | Документация и демо (часть пакетов собирает дemo в `docs/demo/...`)                |
| Корневой `package.json`    | Приватный мета-пакет `biorate`, общие `devDependencies`, скрипты через Lerna       |

**Воркспейсы:** `pnpm-workspace.yaml` и поле `workspaces` в корневом `package.json` задают `packages/*/*` и `.tools/*`.

**Версии пакетов:** Lerna в режиме **independent** (`lerna.json`), клиент — **pnpm**. Публикация: `pnpm run publish` → `lerna publish from-package`.

**Nx:** в `nx.json` кэшируется операция `build`; оркестрация задач по-прежнему через Lerna/pnpm.

**TypeScript paths:** в корневом `tsconfig.json` поле `compilerOptions.paths` сейчас пустое; связность пакетов — через **`workspace:*`** в `dependencies` / `devDependencies` и через собранный `dist` соседних пакетов. При введении path-алиасов для разработки — согласовать и задокументировать здесь.

## Типичный пакет `@biorate/*`

Большинство библиотек следуют одному шаблону:

- **Выход:** `dist/cjs/`, `dist/esm/`, `dist/types/` (три прохода `tsc`: CJS, ESM, затем `emitDeclarationOnly` в `dist/types`).
- **package.json:** `main`, `module`, `types`, поле **`exports`** (в т.ч. ветка `types`), **`files`**: как минимум `dist/**`, `README.md`, `LICENSE` — чтобы в npm не попадали `src/`, тесты и конфиги.
- **Скрипты:** `clean` (часто `cleanup dist`), `build:cjs` / `build:esm` / `build:types`, общий `build`, у публикуемых пакетов — **`prepublishOnly`: сборка**.
- **postbuild:** правка `package.json` внутри `dist/cjs` и `dist/esm` (`node ../../../.scripts/write-package-type.js`), для ESM — `tsc-esm-fix`.

Исключения из шаблона (например сборка через Webpack) нужно явно отражать в `package.json` и в этом файле при смене контракта.

## Команды

- Сборка / тесты всех пакетов: из корня `pnpm run build`, `pnpm run test` (через `lerna run`).
- Точечно по пакету: `pnpm --filter @biorate/<имя> run <script>` (например `test`, `build`).
- Согласованные версии Node/pnpm: поле **`engines`** в корневом `package.json`.

## Обязательный рабочий процесс

Перед написанием кода строго следуй алгоритму:

1. **Анализ** — суть, риски, зависимости, краевые случаи.
2. **План** — шаги, файлы, слои, команды проверки.
3. **Варианты** — 2–3 подхода с плюсами и минусами (если применимо).
4. **Ожидание** — запроси разрешение. Не пиши код до явного `ОК` или выбора варианта (краткое «делай / начинай» от автора считается согласием на озвученный план).
5. **Реализация** — строго по плану. Комментируй только нетривиальные решения.
6. **Верификация** — команды тестов и линтов, что проверить в UI/API при наличии.

Запрещено: код без согласования, произвольный `any`, любые правки в `node_modules`.

## Git: действия ассистента

- **Не делать коммитов:** не выполнять `git commit` и не создавать коммиты иным способом, пока автор явно не попросит закоммитить.
- **Не трогать индекс:** не выполнять `git add`, `git add -A`, `git add -p` и любое другое добавление файлов в staging; не готовить коммит за автора. Достаточно правок в файлах на диске — включение в коммит остаётся за человеком.
- По умолчанию также **не** выполнять `git push`, `git merge`, `git rebase` и смену веток без явного поручения автора.

## Монорепо: границы и новый пакет

- Новый пакет под `@biorate/*`: каталог `packages/@biorate/<имя>/`, имя в npm согласовано с директорией, зависимости на соседей через `workspace:*`.
- Убедись, что пакет попадает в воркспейсы (`packages/*/*`), при необходимости обнови документацию и скрипты (корень, CI, Typedoc, если пакет должен попасть в `pnpm run doc`).
- Не устанавливай зависимости обходом среды: предпочтительно указать нужное в манифесте и попросить выполнить `pnpm i` (с нужными флагами) в корне репозитория.

## Инструменты

- **Менеджер пакетов:** `pnpm` (см. `engines`).
- **Сборка и релиз:** Lerna + при необходимости Nx-кэш для `build`.
- **Prettier:** корневой `.prettierrc`. Форматируй изменённые файлы перед коммитом. Не меняй конфиг без согласования.
- **TypeScript:** базовый корневой `tsconfig.json` и локальные конфиги пакетов; в пакетах обычно `strict: true` (входит `noImplicitAny`, `strictNullChecks` и др. подфлаги `strict`). Включение дополнительных опций (например `exactOptionalPropertyTypes`) — только осознанно и с проходом по типам во всём монорепо.
- **Тесты:** по репозиторию преобладает **Vitest**; корневой `vitest.config.ts` задаёт общие дефолты, пакеты при необходимости расширяют конфиг локально.

Язык ответов ассистенту: **русский**. Код и идентификаторы: **английский**; комментарии — только для нетривиальной логики.

## Ошибки и исключения (единый формат)

В рантайм-коде приложений не бросаем «сырые» `Error` / `TypeError` и т.п. — используем **стандартизированные классы ошибок** (ориентир: `packages/@biorate/config/src/errors.ts` и аналоги в домене).

---

## Пакет @biorate/unimock — snapshot-based proxy mocking

### Назначение

`@biorate/unimock` — библиотека для snapshot-мокирования коннекторов и сервисов через декоратор `@Mockable()`. Два режима: **record** (реальный вызов + сохранение снапшота) и **replay** (воспроизведение из снапшота без live-инфраструктуры).

### Архитектура (Option 1 — Method Override-based)

Выбранный подход: **extends + переопределение дескрипторов** на экземпляре, а не `Proxy`. Причина: приватные ES-поля (`#connections`, `#current`) в базовом классе `Connector` ломают `Proxy` (они не видны через `get`-trap, а `Proxy` не может их перехватить, если they are truly private).

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

### Ключевые файлы

| Файл | Назначение |
| ---- | ---------- |
| `src/mockable.ts` | Декоратор `@Mockable()`, `wrapMethod`, `replayCall`, `wrapAndRecord`, `hasMethods`, `wrapGetter` |
| `src/connection-proxy.ts` | `ConnectionHandler` (Proxy) — обёртка для connection-объектов с методами (query, json и т.д.) |
| `src/snapshot-store.ts` | `SnapshotStore` — загрузка/сохранение JSON-снапшотов, кэш stores. `flushAllSnapshots()` |
| `src/serializer.ts` | `serialize`/`deserialize` (t/v формат), `stableHash`, `makeCallKey` |
| `src/env.ts` | `parseUnimockMode()`, `resolveSnapshotDir()` |
| `src/errors.ts` | `UnimockReplayMissError`, `UnimockSerializeError` |
| `src/interfaces.ts` | Типы `SerializedValue`, `SnapshotCall`, `SnapshotFile`, `UnimockMode` |
| `src/index.ts` | Публичный API: `Mockable`, `SnapshotStore`, `flushAllSnapshots`, `ConnectionHandler`, `Unimock` |
| `vitest/setup.ts` | Хук `afterAll` для автоматического `flushAllSnapshots()` |
| `tests/unimock.spec.ts` | 24 unit-теста для ядра |
| `tests/clickhouse.spec.ts` | 2 интеграционных теста с реальным Clickhouse (record + replay) |

### Поток данных (sequence)

#### Record:
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

#### Replay:
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

### hasMethods() — различение connection и data-объектов

```typescript
function hasMethods(value: unknown): value is object {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date || value instanceof RegExp) return false;
  if (Buffer.isBuffer(value)) return false;
  if (value instanceof Error) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return true; // class instance
  for (const key of Object.keys(value)) {
    if (typeof (value as Record<string, unknown>)[key] === 'function') return true;
  }
  return false;
}
```

Логика: если объект — инстанс класса (прототип не `Object.prototype`) → true (считаем connection-объектом). Если plain object с хотя бы одним методом → true. Иначе false (data-объект, оборачивать не нужно).

### ConnectionHandler (Proxy)

```typescript
new ConnectionHandler(target, refId, store) → Proxy
```

- **record mode**: `get` trap → если `prop` — функция на target, возвращает обёртку, которая вызывает original, записывает `conn:{refId}:prop:{hash}`, оборачивает результат через `wrapNested` (рекурсивно для вложенных connection-объектов).
- **replay mode**: `get` trap → возвращает функцию, которая ищет `conn:{refId}:prop:{hash}` в store. `target` может быть `null`.
- `'then'`, `'constructor'`, `__unimock_ref__`, `#` → спецобработка (избегаем thenable, даём доступ к refId).
- `wrapNested` возвращает `{ wrapped, serialized }` — ConnectionHandler + `{t:'ref', v: refId}`.

### Сериализация

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

### Известные ограничения

1. **`@init()` из `@biorate/lifecycled` не проходит через `wrapMethod`**. `@init()` хранит оригинальный PropertyDescriptor в metadata конструктора. `Lifecycled.call()` читает дескриптор из metadata, а не с инстанса. Поэтому `initialize()` в replay-режиме всё равно выполняется (создаёт реальное соединение). Это не ломает replay (get/query идут из снапшота), но требует live-инфраструктуры.
   - **Workaround**: переопределить `initialize` в тестовом подклассе как no-op.
   - **Потенциальный фикс**: добавить проверку `SnapshotStore.mode` внутри `initialize()` наследника, или изменить механизм `@init()`.

2. **ConnectionHandler не возвращает Promise в replay-режиме**. В record-режиме `query()` возвращает Promise (так как original асинхронный). В replay-режиме возвращается синхронно ConnectionHandler или deserialized data. `await` на non-Promise работает (оборачивает в `Promise.resolve()`), но поведение неидентичное.

3. **Сериализация функций** — функции сериализуются как строка `<function>`. При deserialization возвращается строка, а не функция. Поэтому вызовы с функциями-аргументами (например callback) обрабатываются через механизм `'callback'` записи, а не сериализацию функции как аргумента.

4. **Приватные поля `#`** не оборачиваются (`wrapPrototype` и ConnectionHandler фильтруют ключи, начинающиеся с `#`).

### Callback-механизм

В record-режиме функции-аргументы заменяются на обёртку, которая собирает все вызовы с аргументами в `records[][]`. После вызова original эти записи сериализуются как `{t:'callback', v: {callRef, recording}}`.

В replay-режиме для каждого callback-аргумента воспроизводятся записанные вызовы: `fn(...deserialize(args))`. Если fn асинхронный, Promise'ы собираются в `Promise.all`.

### Тестирование

```bash
# Все тесты (24 unit + 2 integration)
pnpm --filter @biorate/unimock test

# Unit только
pnpm --filter @biorate/unimock exec npx vitest run tests/unimock.spec.ts

# Integration (нужен clickhouse в docker)
pnpm --filter @biorate/unimock exec npx vitest run tests/clickhouse.spec.ts

# Replay-режим (без clickhouse)
UNIMOCK=replay pnpm --filter @biorate/unimock exec npx vitest run tests/clickhouse.spec.ts
```

Clickhouse должен быть запущен:
```bash
# Из корня репозитория
docker compose up -d clickhouse
curl http://localhost:8123/ping  # → Ok.
```

### Снапшоты

- Формат: `tests/__snapshots__/<ClassName>.unimock.json` (или кастомный `snapshotDir`).
- Структура: `{ version: 1, className, calls: { [callKey]: { args, result, error } } }`.
- Коммитятся в репозиторий. CI использует `UNIMOCK=replay`.

### devDependencies для интеграционных тестов

`packages/@biorate/unimock/package.json`:
- `@biorate/clickhouse: "workspace:*"`
- `@biorate/config: "workspace:*"`

### Подключение clickhouse-теста

Файл `tests/clickhouse.spec.ts` использует DI-контейнер из `@biorate/inversion`. Record-фаза: `SnapshotStore.setMode('record')` → DI-init → реальный `SELECT 1` → `flushAllSnapshots()`. Replay-фаза: `SnapshotStore.setMode('replay')` → unbind/rebind DI → `$run()` (`@init()` выполняется live) → `get().query()` идёт из снапшота.

Класс с `@Mockable()` объявлен один раз на весь файл, snapshot-store кэшируется по ключу `"{className}::{snapshotDir}"`.

### Чеклист при изменениях

- [ ] `pnpm --filter @biorate/unimock run build` — проверка типов
- [ ] `pnpm --filter @biorate/unimock run test` — все 26 тестов
- [ ] Если менялась сериализация — проверить `serialize`/`deserialize` symmetric
- [ ] Если менялся `hasMethods` — проверить различение connection/data объектов
- [ ] Если менялся replay-механизм — запустить clickhouse integration test (docker должен быть up)
- [ ] Если менялся `@Mockable()` — проверить работу с `@init()` (ограничение #1)

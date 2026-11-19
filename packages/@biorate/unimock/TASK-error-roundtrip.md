# Задача: round-trip брошенных ошибок (и Uint8Array) в unimock-снапшотах

**Пакет:** `@biorate/unimock` (текущая версия 1.15.4)

## Проблема

1. **Ошибки теряют класс и собственные поля.** Сериализатор пишет Error только как
   `{name, message, stack}` (`src/serializer.js:114-115`):

   ```js
   if (value instanceof Error)
     return { t: T_ERROR, v: { n: value.name, m: value.message, s: value.stack } };
   ```

   и восстанавливает generic Error (`src/serializer.js:177-178`):

   ```js
   case T_ERROR:
     return Object.assign(new Error(value.v.m), { name: value.v.n, stack: value.v.s });
   ```

   Следствия (реальный кейс: негативные e2e-тесты KeyCloak в CashOffice):

   - собственные поля ошибки теряются — `AxiosError.response` (`{status: 401, data}`) не доходит до replay;
   - класс не восстанавливается — `error instanceof AxiosError` в сервисе всегда `false`
     → вместо 401/500 приложение отдаёт 503 `CommonServerRequestError`.

2. **Бонус (та же болезнь): Uint8Array теряет тип.** `Buffer.isBuffer()` покрывает только
   Buffer; чистый `Uint8Array` (например, `pdf.save()` из pdf-lib) падает в generic-ветку
   объекта и после round-trip превращается в plain object → `PDFDocument.load` падает
   («must be of type string or Uint8Array or ArrayBuffer»). Сейчас обходится
   base64-строкой на стороне тестов.

## Решение

### Изменение 1 — сериализация собственных полей ошибки

В ветке `T_ERROR` добавить собственные enumerable-поля, кроме `name/message/stack`
(у AxiosError это `response`, `config`, `code`):

```js
if (value instanceof Error) {
  const props = Object.entries(value)
    .filter(([k]) => k !== 'name' && k !== 'message' && k !== 'stack')
    .filter(([k]) => !(stripRequestEnabled() && k === 'request'));
  return {
    t: T_ERROR,
    v: {
      n: value.name,
      m: value.message,
      s: value.stack,
      p: props.map(([k, v]) => ({ k, v: serialize(v, seen, symbols) })),
    },
  };
}
```

`request/config` тяжёлые и цикличные — сериализатор уже умеет циклы (seen-map) и функции
(MARKER_CALLBACK); для консистентности уважать `UNIMOCK_STRIP_REQUEST` (как request в
объектах). Циклический `request` внутри `response` тоже отсекается strip-флагом.

### Изменение 2 — реестр классов ошибок для десериализации

`instanceof` нельзя обмануть присваиванием полей — нужен настоящий конструктор:

```ts
const errorClasses = new Map<string, new (message?: string) => Error>([
  ['Error', Error],
  ['TypeError', TypeError],
  ['RangeError', RangeError],
  ['EvalError', EvalError],
  ['SyntaxError', SyntaxError],
  ['URIError', URIError],
]);

export function registerErrorClass(name: string, ctor: new (message?: string) => Error) {
  errorClasses.set(name, ctor);
}

// case T_ERROR:
const Ctor = errorClasses.get(value.v.n) ?? Error;
const error = Object.assign(new Ctor(value.v.m), { name: value.v.n, stack: value.v.s });
for (const { k, v } of value.v.p ?? []) error[k] = deserialize(v);
return error;
```

`registerErrorClass` экспортировать. Чтобы не тащить axios в unimock — в `@biorate/axios`
(или в e2e-сетапе приложения) один вызов: `registerErrorClass('AxiosError', AxiosError)`.
Хардкод-фолбэк «если name === 'AxiosError' → require('axios') лениво» тоже допустим,
но реестр чище.

### Изменение 3 (бонус, можно отдельным коммитом) — TypedArray round-trip

```js
if (ArrayBuffer.isView(value)) {
  return {
    t: value instanceof Buffer ? T_BUFFER : T_TYPED_ARRAY,
    v: Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString('base64'),
  };
}
// deserialize: T_TYPED_ARRAY → new Uint8Array(Buffer.from(value.v, 'base64'))
```

Можно отказаться — обходимо на стороне тестов (base64-строка).

## Обратная совместимость

- Старые снапшоты (`v` без `p`) — `value.v.p ?? []` → поведение как сейчас.
- Формат ключей вызовов не меняется (ключ = метод + hash(args), не result) → FIFO-порядок
  потребления не сдвигается.
- Снапшоты, записанные старой версией, читаются новой; записи с `response` появятся
  только после перезаписи record-прогоном.

## Тесты

1. Mockable-стат бросает `new AxiosError('boom', undefined, undefined, undefined, { status: 401, data: { foo: 'bar' } })`
   → record → replay: `err instanceof AxiosError && err.response.status === 401 && err.response.data.foo === 'bar'`
   (с зарегистрированным классом).
2. Старый формат снапшота (`{n,m,s}` без `p`) → десериализуется как раньше (generic Error).
3. Generic Error без допполей — round-trip без изменений.
4. (если брать бонус) `Uint8Array` round-trip.
5. Циклический `error.request` при включённом `UNIMOCK_STRIP_REQUEST` — не ломает сериализацию.

## После мержа (в репо приложения CashOffice)

- Поднять `@biorate/unimock`, зарегистрировать `AxiosError` (одна строка в
  `apps/server/tests/__mocks__/e2e.ts`).
- Полный `pnpm run test:e2e:record` (~30 мин) — записи ошибок перезапишутся с `response`.
- Обновить пункт «Брошенные ошибки не проходят round-trip» в корневом `AGENTS.md`
  (guard-и в 073/080 уже сняты — верификация 401/500 в replay заработает после
  перезаписи снапшотов).

# noop — универсальная заглушка

`noop` — синглтон-Proxy, который можно подсунуть **вместо любой зависимости**: любой вызов, свойство, конструирование, асинхронность — ничего не бросает и возвращает `noop` самого себя.

## Что добавить

- **vitest setup**: не нужен.
- **`__mocks__/`**: не нужен.
- **spec**: импортировать `noop` и подставить вместо зависимости.

## Пример

```ts
import { noop } from '@biorate/unimock';

noop.database.query('SELECT 1'); // → noop (ничего не делает)
noop.config.get('key').nested; // → noop
'query' in noop.database; // true
await noop.asyncMethod(); // → noop (не бросает)
for (const x of noop.items) {
} // пустой итератор
typeof noop.callback; // 'function'
JSON.stringify(noop); // {}
```

## Как подставить в DI

```ts
import { container, inject, Types, Core } from '@biorate/inversion';
import { noop } from '@biorate/unimock';

class Root extends Core() {
  @inject(Types.Config) public config: any;
}

// например, вместо реального конфига
container.bind(Types.Config).toConstantValue(noop);
```

## Важно

- `typeof noop` возвращает `'function'` (таргет Proxy — функция). Это ограничение JS: `typeof` не перехватывается Proxy.
- Итерация по `noop` — пустая (пустой итератор), `JSON.stringify(noop)` → `{}`.
- Это не снапшот-мок, а «вечная заглушка»: для воспроизведения реальных ответов используйте [service-class.md](service-class.md), [connector.md](connector.md) и т.д.
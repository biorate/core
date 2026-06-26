# @biorate/collection

Collection framework — fast O(1) indexed collections with decorator-based data modelling and observable support.

## Features

- **`Item`** — base class with typed decorators for property embedding (`@embed`).
- **`List`** — abstract multi-index collection with O(1) lookup, iteration, and CRUD.
- **`ObservableItem`** / **`ObservableList`** — MobX-observable variants with subscribe/unsubscribe.
- **`@embed` decorator** — declare property types (Int, String, Float, Bool, Date, Object, Array, Json, Map, Set, Luxon).
- **`@observable` / `@action` / `@computed`** — MobX decorator wrappers.
- **`@singleton`** — class-level singleton decorator.
- **Multi-index** — `_keys` defines indexed fields; `find()`, `get()`, `has()`, `delete()` use the index.

## Installation

```bash
pnpm add @biorate/collection
```

For observable support, requires `mobx` (optional peer).

## Quick start

```ts
import * as collection from '@biorate/collection';

const { embed, Item, List } = collection;

class User extends Item {
  @embed(Item.Int) public id: number = null!;
  @embed(Item.String) public name: string = null!;
  @embed(Item.String) public email: string = null!;
}

class UserList extends List<User> {
  protected get _keys() { return [['id'], ['email']]; }
  protected get _Item() { return User; }
}

const list = new UserList([
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' },
]);

console.log(list.find(1));          // User { id: 1, name: 'Alice', ... }
console.log(list.find(2));          // User { id: 2, name: 'Bob', ... }
console.log(list.find(3));          // undefined
```

## Module reference

### `Item<P>` — Base data model

```ts
import { Item } from '@biorate/collection';
```

Abstract class for data objects with typed property embedding.

#### Static symbol types (for `@embed`)

| Symbol         | Type      |
|----------------|-----------|
| `Item.Int`     | `number`  |
| `Item.String`  | `string`  |
| `Item.Float`   | `number`  |
| `Item.Bool`    | `boolean` |
| `Item.Date`    | `Date`    |
| `Item.Object`  | `object`  |
| `Item.Array`   | `array`   |
| `Item.Json`    | `any`     |
| `Item.Map`     | `Map`     |
| `Item.Set`     | `Set`     |
| `Item.Luxon`   | `DateTime`|

#### Static methods

| Method      | Signature                                                          | Description                       |
|-------------|--------------------------------------------------------------------|-----------------------------------|
| `Item.bind` | `static bind(key, val): Map<key, val>`                             | Register a type resolver mapping. |

#### Instance members

| Member       | Signature                                   | Description                           |
|--------------|---------------------------------------------|---------------------------------------|
| `constructor`| `(data?, parent?)`                          | Create item with optional initial data and parent reference. |
| `initialize` | `initialize(data?): this`                   | Populate item from a plain object.    |
| `set`        | `set(data): this`                           | Merge data into the item.             |
| `parent`     | `get parent(): P`                           | Parent reference (if any).            |

### `List<I, P>` — Multi-index collection

```ts
import { List } from '@biorate/collection';
```

Abstract class for indexed collections with O(1) lookup.

#### Abstract members (must be overridden)

| Member   | Signature                       | Description                                  |
|----------|---------------------------------|----------------------------------------------|
| `_keys`  | `protected abstract get _keys()` | Index key paths, e.g. `[['id'], ['email']]`. |
| `_Item`  | `protected get _Item()`          | Item constructor (or `null` if not used).    |

#### Instance members

| Member       | Signature                                             | Description                                      |
|--------------|-------------------------------------------------------|--------------------------------------------------|
| `constructor`| `(items?, parent?)`                                   | Create list with optional initial items.         |
| `size`       | `get size(): number`                                  | Number of items in the list.                     |
| `parent`     | `get parent(): P`                                     | Parent reference.                                |
| `set`        | `set(...items): I[]`                                  | Add items (supports multiple args).              |
| `find`       | `find(...keys): I \| undefined`                       | Lookup by indexed key(s).                        |
| `get`        | `get(...keys): I[]`                                   | Lookup all matching items.                       |
| `getBy`      | `getBy(criteria, one?): I[]`                          | Query by partial criteria.                       |
| `has`        | `has(...keys): boolean`                               | Check if item(s) exist.                          |
| `delete`     | `delete(...keys): boolean`                            | Remove by key(s).                                |
| `clear`      | `clear(): void`                                       | Remove all items.                                |
| `initialize` | `initialize(items?): void`                            | Initialise with items (replaces all).            |
| `[Symbol.iterator]` | `*[Symbol.iterator](): Generator<I>`           | Iterable.                                        |

### `ObservableItem` — Observable item

```ts
import { ObservableItem } from '@biorate/collection';
```

Extends `Item` with MobX observability.

| Member       | Signature                                   | Description                            |
|--------------|---------------------------------------------|----------------------------------------|
| `subscribe`  | `subscribe(callback): this`                 | Subscribe to changes.                  |
| `unsubscribe`| `unsubscribe(callback): this`               | Unsubscribe from changes.              |

### `ObservableList` — Observable list

```ts
import { ObservableList } from '@biorate/collection';
```

Extends `List` with MobX observability.

| Member       | Signature                                   | Description                            |
|--------------|---------------------------------------------|----------------------------------------|
| `subscribe`  | `subscribe(callback): this`                 | Subscribe to changes.                  |
| `unsubscribe`| `unsubscribe(callback): this`               | Unsubscribe from changes.              |

### Decorators

```ts
import { embed, observable, action, computed, singleton } from '@biorate/collection';
```

| Decorator     | Target        | Description                                    |
|---------------|---------------|------------------------------------------------|
| `@embed(type)`| Property      | Declare a typed property (e.g. `@embed(Item.Int)`). |
| `@observable()` | Property   | MobX `observable` wrapper.                    |
| `@action()`   | Method        | MobX `action` wrapper.                        |
| `@computed()` | Accessor      | MobX `computed` wrapper.                      |
| `@singleton()`| Class         | Enforce single instance per class.            |
| `@singletone()`| Class        | Deprecated alias for `@singleton`.            |

### `ObservableTypes` — Enum

```ts
import { ObservableTypes } from '@biorate/collection';
```

```ts
enum ObservableTypes {
  add = 'add',
  delete = 'delete',
  update = 'update',
}
```

Used in observable collection events to indicate the type of change.

### `ICollection` — Types

```ts
import { ICollection } from '@biorate/collection';
```

```ts
namespace ICollection {
  namespace List {
    type Keys = (string | symbol)[][];  // Array of key tuples for indexing
  }
}

type Ctor<R = any> = { new (...args: any[]): R };
```

## Usage patterns

### Multiple indexes

```ts
class ProductList extends List<Product> {
  protected get _keys() { return [['sku'], ['category', 'name']]; }
  protected get _Item() { return Product; }
}

const list = new ProductList([...]);
list.find('SKU-001');                    // by first index
list.find('electronics', 'TV');          // by composite index
```

### Observable with subscriptions

```ts
import { ObservableList } from '@biorate/collection';

class WatchList extends ObservableList<Item> {
  protected get _keys() { return [['id']]; }
}

const list = new WatchList([...]);
list.subscribe((event) => console.log(event));
```

### Singleton model

```ts
import { singleton, Item } from '@biorate/collection';

@singleton()
class Config extends Item {
  @embed(Item.String) public apiUrl: string = null!;
  @embed(Item.Int) public port: number = null!;
}
```

## Architecture

```
Item extends null                          (base data model)
│
├── @embed(Item.Int) id                    Typed properties
├── @embed(Item.String) name
├── constructor(data?, parent?)            From plain object
├── initialize(data?)                      Populate
└── set(data)                              Merge
    │
    └── ObservableItem extends Item        (MobX observable)
        ├── subscribe(callback)
        └── unsubscribe(callback)

List<I, P>                                 (multi-index collection)
│
├── _keys                                   [[key1], [key2, subkey]]
├── _Item                                   Constructor
├── set(...items)                           Insert / index
├── find(...keys)                           O(1) lookup
├── getBy(criteria)                         Partial match
├── has(...keys) / delete(...keys)
├── clear()
└── [Symbol.iterator]
    │
    └── ObservableList extends List         (MobX observable)
        ├── subscribe(callback)
        └── unsubscribe(callback)

Decorators:
├── @embed(type)                            Property typing
├── @observable / @action / @computed       MobX wrappers
└── @singleton                              Class singleton
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/collection.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/collection/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/collection/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

# Collection

### Indexed collection list:

```ts
import * as collection from '@biorate/collection';

class List extends collection.List<{ id: number }> {
  protected get _keys() {
    return [['id']];
  }

  protected get _Item() {
    return null;
  }
}

const list = new List();

list.set({ id: 1, title: 'one' }, { id: 2, title: 'two' }, { id: 3, title: 'three' });

console.log(list.get(1)); // { id: 1, title: 'one' }
console.log(list.get(2)); // { id: 2, title: 'two' }
console.log(list.get(3)); // { id: 3, title: 'three' }
```

### Smart collection item:

```ts
import { Item as Base, embed } from '@biorate/collection';

class Item extends collection.Item {
  @embed(Item.Int) public int: number = null;
  @embed(Item.Float) public float: number = null;
  @embed(Item.String) public string: string = null;
  @embed(Item.Bool) public bool: boolean = null;
}

const item = new Item().initialize({ int: '1', float: '1.1', string: 'test', bool: 0 });

console.log(item); // Item { int: 1, float: 1.1, string: 'test', bool: false }
```

### Learn

- Docs: Checking out the [docs](https://biorate.github.io/core/modules/collection.html).

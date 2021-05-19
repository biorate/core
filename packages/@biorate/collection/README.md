# Collection

### What:
This package implements two base classes [List](https://biorate.github.io/core/classes/collection.list.html) 
and [Item](https://biorate.github.io/core/classes/collection.item.html), as well as their extensions.
The [List](https://biorate.github.io/core/classes/collection.list.html) extensions is intended for 
solving problems associated with fast O(1) search for objects by given keys and fast iteration of a 
collection of objects, multi-index and objects-factory supported. The [Item](https://biorate.github.io/core/classes/collection.item.html)
extensions is designed to form the structure of the object, solve the problem of application architecture, 
dependency injection and inversion of control.

### Example:
```ts
import * as collection from '@biorate/collection';
const { embed } = collection;

class Item extends collection.Item {
  @embed(Item.Int) public id: number = null;
  @embed(Item.String) public title: string = null;
}

class List extends collection.List<Item> {
  protected get _keys() {
    return [['id']];
  }
  protected get _Item() {
    return Item;
  }
}

const list = new List([
  { id: 1, title: 'one' },
  { id: 2, title: 'two' },
]);

list.set({ id: 3, title: 'three' }, { id: 4, title: 'four' });

console.log(list.find(1)); // Item { id: 1, title: 'one' }
console.log(list.find(2)); // Item { id: 2, title: 'two' }
console.log(list.find(3)); // Item { id: 3, title: 'three' }
console.log(list.find(4)); // Item { id: 4, title: 'four' }
```

### Learn

- Learn more from documentation that can be found here - [docs](https://biorate.github.io/core/modules/collection.html).

### Release History
See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/collection/CHANGELOG.md)

### License
[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/collection/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

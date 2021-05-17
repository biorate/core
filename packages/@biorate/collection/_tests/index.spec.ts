import { assert } from 'chai';
import { List as AList, Item, embed, singletone, observable } from '../src';
import { DateTime } from 'luxon';

describe('Collection', () => {
  class List extends AList<Item> {
    protected get Item() {
      return null;
    };
  }

  class Item1 {
    @observable() id = 1;
    @observable() test = 3;

    toJSON() {
      return {
        id: this.id,
        test: this.test,
      };
    }
  }

  class Item2 {
    @observable() id = 2;
    @observable() test = 2;
  }

  class Item3 {
    @observable() id = 3;
    @observable() test = 1;
  }

  class Item4 {
    @observable() id = 4;
    @observable() test = 3;
  }

  it('get', () => {
    const list = new List();
    const item = new Item1();
    list.set(item);
    assert(list.get(1) === item);
  });

  it('has', () => {
    const list = new List();
    const item = new Item1();
    list.set(item);
    assert(list.has(1));
    assert(!list.has(0));
  });

  it('delete', () => {
    const list = new List();
    const item = new Item1();
    list.set(item);
    assert(list.delete(1));
    assert(!list.delete(1));
    assert(!list.get(1));
  });

  it('getBy', () => {
    const list = new List();
    const item1 = new Item1();
    const item2 = new Item2();
    const item3 = new Item4();
    list.set(item1, item2, item3);
    assert(list.getBy({ test: 3 }, true).length === 2);
    assert(list.getBy({ test: 3 }, false) === item1);
    assert(!list.getBy({ test: 5 }, false));
    assert(!list.getBy({}, false));
  });

  it('toJSON', () => {
    const list = new List();
    const item = new Item1();
    list.set(item);
    assert(list.toJSON().length === 1);
    assert.deepEqual(list.toJSON()[0], item.toJSON());
  });

  it('toArray', () => {
    const list = new List();
    const item = new Item1();
    list.set(item);
    assert(list.toArray().length === 1);
    assert(list.toArray()[0] === item);
  });

  it('size', () => {
    const list = new List();
    const item1 = new Item1();
    const item2 = new Item2();
    const item3 = new Item3();
    const items = [item1, item2, item3];
    list.set(...items);
    for (let i = 0; i < items.length; i++) {
      assert(list.size === items.length - i);
      list.delete(items[i].id);
    }
  });

  it('iteration', () => {
    let i = 0;
    const list = new List();
    const item1 = new Item1();
    const item2 = new Item2();
    const item3 = new Item3();
    const items = [item1, item2, item3];
    list.set(...items);
    for (const item of list) ++i;
    assert(i === items.length);
  });

  it('clear', () => {
    const list = new List();
    const item1 = new Item1();
    const item2 = new Item2();
    const item3 = new Item3();
    const items = [item1, item2, item3];
    list.set(...items);
    list.clear();
    assert(list.size === 0);
  });

  it('subscribe add', (done) => {
    const list = new List();
    list.subscribe((event) => {
      assert(event.type === 'add');
      done();
    });
    list.set(new Item1());
  });

  it('subscribe delete', (done) => {
    const list = new List();
    list.set(new Item1());
    list.subscribe((event) => {
      assert(event.type === 'delete');
      done();
    });
    list.delete(1);
  });

  it('subscribe update', (done) => {
    const list = new List();
    const item = new Item1();
    list.set(item);
    list.subscribe((event) => {
      assert(event.type === 'update');
      done();
    });
    item.test = 1;
  });

  it('unsubscribe', () => {
    const list = new List();
    const fn = (event) => {
      throw new Error('must unsubscribe');
    };
    list.subscribe(fn);
    list.unsubscribe(fn);
    list.set(new Item1());
  });

  describe('Multi keys', () => {
    class MultiKeyList extends List {
      protected get _keys() {
        return [['id'], ['test']];
      }
    }

    it('get', () => {
      const list = new MultiKeyList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.get(1) === item1);
      assert(list.get(3) === item1);
      assert(list.get(2) === item2);
      assert(list.get(2) === item2);
    });

    it('has', () => {
      const list = new MultiKeyList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.has(1));
      assert(list.has(3));
      assert(list.has(2));
    });

    it('delete', () => {
      const list = new MultiKeyList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      list.delete(1);
      assert(list.size === 1);
      list.delete(2);
      assert(list.size === 0);
    });
  });

  describe('Multi keys pairs', () => {
    class MultiKeyList extends List {
      protected get _keys() {
        return [['id', 'test']];
      }
    }

    it('get', () => {
      const list = new MultiKeyList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.get(1, 3) === item1);
      assert(list.get(2, 2) === item2);
    });

    it('has', () => {
      const list = new MultiKeyList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.has(1, 3));
      assert(list.has(2, 2));
    });

    it('delete', () => {
      const list = new MultiKeyList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      list.delete(1, 3);
      assert(list.size === 1);
      list.delete(2, 2);
      assert(list.size === 0);
    });
  });

  describe('Index key', () => {
    class IndexList extends List {
      protected get _keys() {
        return [[IndexList.index]];
      }
    }

    it('get', () => {
      const list = new IndexList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(item1[IndexList.index] === 0);
      assert(item2[IndexList.index] === 1);
      assert(list.get(0) === item1);
      assert(list.get(1) === item2);
    });

    it('has', () => {
      const list = new IndexList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.has(0));
      assert(list.has(1));
    });

    it('delete backward', () => {
      const list = new IndexList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.get(0) === item1);
      assert(list.get(1) === item2);
      assert(list.delete(1));
      assert(list.get(0) === item1);
      assert(list.delete(0));
      assert(list.size === 0);
    });

    it('delete forward', () => {
      const list = new IndexList();
      const item1 = new Item1();
      const item2 = new Item2();
      list.set(item1, item2);
      assert(list.get(0) === item1);
      assert(list.get(1) === item2);
      assert(list.delete(0));
      assert(list.get(0) === item2);
      assert(list.delete(0));
      assert(list.size === 0);
    });
  });

  describe('ClassList', () => {
    class ClassItem extends Item {
      @observable() id: number = null;
      @observable() test: string = null;
    }
    class ClassList extends List {
      protected get Item() {
        return ClassItem;
      }
    }

    it('set', () => {
      const list = new ClassList();
      list.set({ id: 1, test: 'test1' }, { id: 2, test: 'test2' });
      assert(list.get(1) instanceof ClassItem);
      assert(list.get(2) instanceof ClassItem);
    });

    it('subscribe update', (done) => {
      const list = new ClassList();
      list.set({ id: 1, test: 'test1' });
      list.subscribe((event) => {
        assert(event.type === 'update');
        done();
      });
      list.get(1).test = 'test2';
    });

    it('iteration', () => {
      const list = new ClassList();
      list.set({ id: 1, test: 'test1' }, { id: 2, test: 'test2' });
      let i = list.size;
      for (const item of list) --i;
      assert(!i);
    });
  });

  describe('Types', () => {
    function check(type, value, check: (...any) => boolean) {
      class Test extends Item {
        value = type;
      }
      const item = new Test().initialize({ value });
      assert(check(item));
    }

    it('Int', () => {
      check(Item.Int, '1', (item) => typeof item.value === 'number' && item.value === 1);
    });

    it('Float', () => {
      check(
        Item.Float,
        '1.1',
        (item) => typeof item.value === 'number' && item.value === 1.1,
      );
    });

    it('String', () => {
      check(
        Item.String,
        123,
        (item) => typeof item.value === 'string' && item.value === '123',
      );
    });

    it('Bool', () => {
      check(
        Item.Bool,
        0,
        (item) => typeof item.value === 'boolean' && item.value === false,
      );
    });

    it('Date', () => {
      check(Item.Date, '2020-01-01', (item) => item.value instanceof Date);
    });

    it('Luxon', () => {
      check(Item.Luxon, '2020-01-01', (item) => item.value instanceof DateTime);
    });

    it('Object', () => {
      check(
        Item.Object,
        { test: 1 },
        (item) => typeof item.value === 'object' && item.value.test === 1,
      );
    });

    it('Array', () => {
      check(
        Item.Array,
        [1],
        (item) =>
          typeof item.value === 'object' &&
          Array.isArray(item.value) &&
          item.value[0] === 1,
      );
    });

    it('Json', () => {
      check(
        Item.Json,
        '{"a": 1}',
        (item) => typeof item.value === 'object' && item.value.a === 1,
      );
    });

    it('String / File', () => {
      check(
        Item.String,
        undefined,
        (item) => typeof item.value === 'string' && item.value === '',
      );
    });

    it('Map', () => {
      check(
        Item.Map,
        [['test', 1]],
        (item) => item.value instanceof Map && item.value.get('test') === 1,
      );
    });

    it('Set', () => {
      check(
        Item.Set,
        ['test'],
        (item) => item.value instanceof Set && item.value.has('test'),
      );
    });

    it('Sub Item', () => {
      class Test extends Item {
        value = Item.Int;
      }
      check(
        Test,
        { value: 1 },
        (item) => item.value instanceof Test && item.value.value === 1,
      );
    });

    it('Sub List', () => {
      class I extends Item {
        id = Item.Int;
      }
      class L extends List {
        protected get Item() {
          return I;
        }
      }
      check(
        L,
        [{ id: 1 }, { id: 2 }],
        (item) =>
          item.value instanceof L &&
          item.value.get(1).id === 1 &&
          item.value.get(2).id === 2,
      );
    });
  });

  describe('Cast', () => {
    class Cat extends Item {
      type: string = null;
    }

    class Dog extends Item {
      type: string = null;
    }

    class Horse extends Item {
      type: string = null;
    }

    class Animals extends List {
      #types = { Cat, Dog, Horse };

      protected get _keys() {
        return [['type']];
      }

      protected get Item() {
        return this.#types[this.processed.type];
      }
    }

    it('Factory', () => {
      const animals = new Animals();
      animals.set({ type: 'Cat' }, { type: 'Dog' }, { type: 'Horse' });
      assert(animals.get('Cat') instanceof Cat);
      assert(animals.get('Dog') instanceof Dog);
      assert(animals.get('Horse') instanceof Horse);
    });
  });

  describe('decorators', () => {
    class Cat extends Item {
      say: string = null;
    }

    class Dog extends Item {
      say: string = null;
    }

    class Horse extends Item {
      say: string = null;
    }

    class Animals extends Item {
      @embed(Cat) cat: Cat = null;
      @embed(Dog) dog: Dog = null;
      @embed(Horse) horse: Horse = null;
    }

    it('embed', () => {
      const animals = new Animals();
      const meow = 'meow';
      const woof = 'woof';
      const ieegoo = 'ieegoo';
      animals.initialize({
        cat: { say: meow },
        dog: { say: woof },
        horse: { say: ieegoo },
      });
      assert(animals.cat instanceof Cat);
      assert(animals.dog instanceof Dog);
      assert(animals.horse instanceof Horse);
      assert(animals.cat.say === meow);
      assert(animals.dog.say === woof);
      assert(animals.horse.say === ieegoo);
    });
  });

  describe('embed', () => {
    class ClassItem extends Item {
      @embed(Item.Int) num: number = null;
      @embed(Item.String) str: string = null;
    }

    it('set - simple', () => {
      const num = 2;
      const str = 'test2';
      const item = new ClassItem();
      item.initialize({ num: 1, str: 'test' });
      item.update({ num, str });
      assert(item.num === num);
      assert(item.str === str);
    });

    it('set - cast', () => {
      const num = '2';
      const str = 1;
      const item = new ClassItem();
      item.initialize({ num: 1, str: 'test' });
      item.update({ num, str });
      assert(typeof item.num === 'number');
      assert(typeof item.str === 'string');
      assert(item.num === Number(num));
      assert(item.str === String(str));
    });
  });

  describe('observable', () => {
    class ClassItem extends Item {
      @observable() @embed(Item.Int) num: number = null;
    }

    it('set', (done) => {
      const num = 2;
      const item = new ClassItem();
      item.initialize({ num: 1 });
      item.subscribe((event) => {
        assert(event.type === 'update');
        assert(event.newValue === num);
        done();
      });
      item.update({ num });
    });
  });

  describe('embed / observable', () => {
    class ClassItem extends Item {
      @embed(Item.Int) id: number = null;
      @observable() @embed(Item.Int) num: number = null;
    }

    class ClassList extends List {
      protected get Item() {
        return ClassItem;
      }
    }

    it('set', (done) => {
      const num = 2;
      const list = new ClassList();
      list.set({ id: 1, num: 1 });
      list.subscribe((event) => {
        assert(event.type === 'update');
        assert(event.newValue === num);
        done();
      });
      list.get(1).update({ num });
    });
  });

  describe('singletone', () => {
    @singletone()
    class Singletone {}
    it('check', () => {
      assert.equal(new Singletone(), new Singletone());
    });
  });
});

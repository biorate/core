# Singleton

Abstract singleton class

#### Example:

```ts
import { Singleton } from '@biorate/singleton';

class Test extends Singleton {
  public static get() {
    return this.instance<Test>();
  }
}

const instance1 = Test.get();
const instance2 = Test.get();

console.log(instance1 === instance2); // true
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/singleton.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/singleton/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/singleton/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

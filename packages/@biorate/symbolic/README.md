# Symbols factory

Symbols factory registry with namespaces

#### Example:
```ts
import { create } from '@biorate/symbolic';

const Namespace1 = create('Namespace1');
const Namespace2 = create('Namespace2');

/* auto-create symbol on property call */
console.log(Namespace1.Test1); // Symbol(Namespace1.Test)
console.log(Namespace1.Test1 === Namespace1.Test1); // true

console.log(Namespace1.Test2); // Symbol(Namespace1.Test)
console.log(Namespace1.Test1 === Namespace1.Test2); // false

/* namespace isolation */
console.log(Namespace2.Test1 === Namespace1.Test1); // false
```

### Learn
* Documentation can be found here - [docs](https://biorate.github.io/core/modules/symbolic.html).

### Release History
See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/symbolic/CHANGELOG.md)

### License
[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/symbolic/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](llevkin@yandex.ru)

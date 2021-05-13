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

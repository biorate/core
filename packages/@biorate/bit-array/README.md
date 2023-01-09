# Bit array class

The BitArray class is for setting and extracting bits from a number.
It can be used, for example, for compact storage array of boolean values.

### Features:

- compact storage array of boolean values

### Examples:

```ts
import { BitArray } from '@biorate/bit-array';

const bits = new BitArray();

bits.set(0);
bits.set(1);
bits.set(2);

console.log(bits.value(0)); // 1
console.log(bits.value(0, 1)); // 3
console.log(bits.value(0, 1, 2)); // 7

bits.remove(1);

console.log(bits.value(0)); // 1
console.log(bits.value(0, 1)); // 1
console.log(bits.value(0, 1, 2)); // 5
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/bit_array.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/bit-array/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/bit-array/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

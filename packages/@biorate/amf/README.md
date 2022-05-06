# Action Message Format

Action Message Format (AMF3) protocol realization for JS

### Links:

- [wikipedia](https://en.wikipedia.org/wiki/Action_Message_Format)
- [specification](https://www.adobe.com/content/dam/acom/en/devnet/pdf/amf-file-format-spec.pdf)

### Limitations:

- Function is not supported
- XML is not supported
- ByteArray is not supported
- Dictionary is not supported
- Vectors is not supported

### Examples:

```ts
import { encode, decode } from '@biorate/amf';

const buffer = encode({ test: 1 }); // <Buffer 0a 0b 01 09 74 65 73 74 04 01 01>

console.log(decode(buffer)); // { test: 1 }
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/amf.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/amf/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/amf/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

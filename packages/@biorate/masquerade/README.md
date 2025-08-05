# Masquerade

Mask data configurator

#### Example:

```ts
import { Masquerade } from '@biorate/masquerade';

Masquerade.configure({ emailFields: ['email'] });

const result = Masquerade.processJSON({ email: 'test@email.com' });

console.log(result); // { "email": "tes*@*******om" }
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/masquerade.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/masquerade/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/masquerade/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

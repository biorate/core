# Masquerade

Mask data configurator

#### Example:

```ts
import { Masquerade } from '@biorate/masquerade';

Masquerade.configure({ emailFields: ['email'] });

const result = Masquerade.processJSON({ email: 'test@email.com' });

console.log(result); // { "email": "tes*@*******om" }
```

```ts
import { Masquerade } from '@biorate/masquerade';

Masquerade.use(EmailMask).use(PhoneMask).use(CardMask);

const result = Masquerade.processString(
  `user@example.com, +79231231224, 4111 1111 1111 1111 (Visa), 5500-0000-0000-0004 (MC)`,
);

console.log(result); // u***@**********m, +*******1224, **** **** **** 1111 (Visa), ****-****-****-0004 (MC)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/masquerade.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/masquerade/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/masquerade/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

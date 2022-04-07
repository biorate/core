# Axios

Axios OOP static interface

### Examples:

```ts
import { Axios } from '@biorate/axios';

class Yandex extends Axios {
  public baseURL = 'https://yandex.ru';
}

(async () => {
  const response = await Yandex.fetch<string>();
  console.log(response.status); // 200
  console.log(response.data); // <!DOCTYPE html><html ...
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/axios.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/axios/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/axios/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

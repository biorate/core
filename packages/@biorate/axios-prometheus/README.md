# Axios-prometheus

Axios-prometheus HTTP interface

### Example

```
import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AxiosPrometheus } from '@biorate/axios-prometheus';

export class Google extends AxiosPrometheus {
  public baseURL = this.config.get<string>('baseURL');
  public url = '/';
  public method = 'get';
  public timeout = 1500;
}

container.bind(Types.Config).to(Config).inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  baseURL: 'https://google.com',
});

(async () => {
  await Google.fetch();
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/axios_prometheus.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/axios-prometheus/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/axios-prometheus/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

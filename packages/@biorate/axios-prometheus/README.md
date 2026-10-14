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

### Tracing

Each request opens an OpenTelemetry span (`outgoing.request.*` / `outgoing.response.*`
attributes). Exclusion config:

```json
{
  "AxiosPrometheus": {
    "tracing": {
      "excluded": ["https://cdn.example.com"],
      "excludedAttributes": ["response.data"],
      "excludedByURL": [{ "url": "cdn.example.com", "attributes": ["data"] }]
    }
  }
}
```

- `AxiosPrometheus.tracing.excluded` — array of strings or RegExp; matching URLs are
  fully skipped (span is created and closed without attributes; Prometheus metrics
  are still collected). String entries match by substring inclusion.
- `AxiosPrometheus.tracing.excludedAttributes` — aspects to skip globally.
- `AxiosPrometheus.tracing.excludedByURL` — array of `{ url: string | RegExp, attributes: string[] }`
  entries; aspects are skipped only for matching URLs (strings match by substring
  inclusion, RegExp by test).
- An excluded item also matches aspect groups by prefix: `response` excludes
  `response.headers`, `response.statusCode` and `response.data`.
- Accepted aliases: `url`, `method`, `headers`, `body`, `params`, `query`
  (→ `outgoing.request.*`), `statusCode`, `data` (→ `outgoing.response.*`);
  full names (`request.body`, `response.data`, …) work as-is.

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/axios_prometheus.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/axios-prometheus/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/axios-prometheus/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

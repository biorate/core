# Prometheus

Allows you to create prometheus metrics easily using dependency injection mechanism

#### Example:

```ts
import { counter, Counter } from '@biorate/prometheus';

class Test {
  @counter({
    name: 'test_counter',
    help: 'Test counter',
    labelNames: ['label1', 'label2'],
  })
  protected counter: Counter;

  public metric() {
    this.counter.labels({ label1: 1, label2: 2 }).inc();
  }
}

const test = new Test();

test.metric();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/prometheus.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/prometheus/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/prometheus/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

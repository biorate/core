# @biorate/prometheus

Prometheus metrics for `@biorate/inversion` — create and use counters, gauges, histograms, and summaries via TypeScript decorators with automatic registry management.

## Features

- **Decorator‑based** — `@counter`, `@gauge`, `@histogram`, `@summary` on class properties.
- **Singleton metrics** — metrics are created once per name (across the whole process).
- **Override support** — set `override: true` to re‑create a metric with new settings.
- **Default metrics** — auto‑collects Node.js default metrics (event loop, GC, memory, etc.).
- **Shared registry** — a single `Registry` instance per process via `Prometheus.registry`.

## Installation

```bash
pnpm add @biorate/prometheus
```

Requires `@biorate/inversion`, `@biorate/config`, and `prom-client`.

## Quick start

```ts
import { counter, Counter } from '@biorate/prometheus';

class MyService {
  @counter({ name: 'my_counter', help: 'Counts something', labelNames: ['label1'] })
  protected counter: Counter;

  public inc() {
    this.counter.labels({ label1: 'test' }).inc();
  }
}

const s = new MyService();
s.inc();
```

## API Reference

### Decorators

| Decorator      | Metric type         | Config interface                |
|----------------|---------------------|---------------------------------|
| `@counter`     | `Counter<string>`   | `CounterConfiguration & IdefaultSettings` |
| `@gauge`       | `Gauge<string>`     | `GaugeConfiguration & IdefaultSettings`    |
| `@histogram`   | `Histogram<string>` | `HistogramConfiguration & IdefaultSettings`|
| `@summary`     | `Summary<string>`   | `SummaryConfiguration & IdefaultSettings`  |

All decorators accept an additional `IdefaultSettings` field:

```ts
interface IdefaultSettings {
  name: string;     // metric name (required)
  help: string;     // help text (required)
  override?: boolean; // re‑create if already exists (default false)
}
```

### `Prometheus` class

| Member               | Description                                         |
|----------------------|-----------------------------------------------------|
| `Prometheus.registry`| Shared `Registry` instance (static).                |
| `counter()`          | Static factory — same as `@counter` decorator.      |
| `gauge()`            | Static factory — same as `@gauge` decorator.        |
| `histogram()`        | Static factory — same as `@histogram` decorator.    |
| `summary()`          | Static factory — same as `@summary` decorator.      |
| `this.registry`      | Instance getter returning `Prometheus.registry`.    |
| `initialize()`       | `@init()` — calls `collectDefaultMetrics` if config `prometheus.collectDefaultMetrics` is true. |

## Usage patterns

### `@counter`

```ts
import { counter, Counter } from '@biorate/prometheus';

class Service {
  @counter({
    name: 'api_requests_total',
    help: 'Total API requests',
    labelNames: ['method', 'path', 'status'],
  })
  protected counter: Counter;

  public track(method: string, path: string, status: number) {
    this.counter.labels({ method, path, status: String(status) }).inc();
  }
}
```

### `@gauge`

```ts
import { gauge, Gauge } from '@biorate/prometheus';

class Service {
  @gauge({
    name: 'active_connections',
    help: 'Currently active connections',
    labelNames: ['pool'],
  })
  protected gauge: Gauge;

  public add(n = 1) { this.gauge.labels({ pool: 'main' }).inc(n); }
  public remove(n = 1) { this.gauge.labels({ pool: 'main' }).dec(n); }
}
```

### `@histogram`

```ts
import { histogram, Histogram } from '@biorate/prometheus';

class Service {
  @histogram({
    name: 'request_duration_seconds',
    help: 'Request duration in seconds',
    labelNames: ['method', 'path'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
  })
  protected histogram: Histogram;

  public observe(method: string, path: string, duration: number) {
    this.histogram.labels({ method, path }).observe(duration);
  }
}
```

### `@summary`

```ts
import { summary, Summary } from '@biorate/prometheus';

class Service {
  @summary({
    name: 'response_size_bytes',
    help: 'Response size in bytes',
    percentiles: [0.5, 0.9, 0.99],
  })
  protected summary: Summary;

  public record(bytes: number) {
    this.summary.observe(bytes);
  }
}
```

### With DI container

```ts
import { Core, inject, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { Prometheus, counter, Counter } from '@biorate/prometheus';

@injectable()
class MetricsService {
  @counter({ name: 'events_total', help: 'Total events' })
  public counter: Counter;
}

class Root extends Core() {
  @inject(Prometheus) public prometheus: Prometheus;
  @inject(MetricsService) public metrics: MetricsService;
}

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(Prometheus).toSelf().inSingletonScope();
container.bind(MetricsService).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  'prometheus.collectDefaultMetrics': true,
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.metrics.counter.inc();
})();
```

### Default metrics configuration

```ts
// config
{
  'prometheus.collectDefaultMetrics': true,   // enable (default true)
  'prometheus.defaultMetrics': {
    // prom-client DefaultMetricsCollectorConfiguration
    timeout: 5000,
  },
}
```

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  Prometheus (static)                                   │
│                                                        │
│  counters  ─── Map<name, Counter>                      │
│  gauges    ─── Map<name, Gauge>                        │
│  histograms ── Map<name, Histogram>                    │
│  summaries ─── Map<name, Summary>                      │
│                                                        │
│  findOrCreate(settings, map, Class) ─── decorator      │
│    ├── checks map for existing metric by name          │
│    ├── removes old metric from registry if override    │
│    ├── creates new metric on registry                  │
│    └── returns property descriptor                     │
│                                                        │
│  registry ── Registry (static singleton)               │
│    └── collectDefaultMetrics() on @init()              │
└────────────────────────────────────────────────────────┘
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/prometheus.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/prometheus/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/prometheus/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

# @biorate/proxy-prometheus

Proxy connector with Prometheus metrics — extends `@biorate/proxy` with gauges for read/write bytes and active status.

## Features

- **Inherits all proxy features** — TCP load balancing, liveness checks, failover.
- **Prometheus gauges** — `proxy_connector_write_bytes`, `proxy_connector_read_bytes`, `proxy_connector_active`.
- **Auto-metrics** — background loop (configurable interval) updates metric values.
- **Zero-config migration** — same config namespace `Proxy` as base; just swap the import.

## Installation

```bash
pnpm add @biorate/proxy-prometheus
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/prometheus`, `@biorate/proxy`.

## Quick start

```ts
import { ProxyConnector } from '@biorate/proxy-prometheus';
// Same API as @biorate/proxy — just import from proxy-prometheus instead
```

## API Reference

### `ProxyConnector`

Same as `@biorate/proxy` `ProxyConnector` with added metrics.

### Metrics

| Metric                        | Type    | Labels                                | Description             |
|-------------------------------|---------|---------------------------------------|-------------------------|
| `proxy_connector_write_bytes` | Gauge   | `connection`, `host`                  | Bytes written upstream. |
| `proxy_connector_read_bytes`  | Gauge   | `connection`, `host`                  | Bytes read from upstream. |
| `proxy_connector_active`      | Gauge   | `connection`, `host`                  | 1 if client is active.  |

### Config

Uses the same `Proxy` and `ProxyStats` config as `@biorate/proxy`. Additional:

```ts
ProxyStats: {
  metricsInterval?: number;  // ms between metric updates (default 1000)
}
```

## Architecture

```
ProxyConnector extends BaseProxyConnector (@biorate/proxy)
│
├── @gauge proxy_connector_write_bytes
├── @gauge proxy_connector_read_bytes
├── @gauge proxy_connector_active
│
├── @init() initialize()
│   ├── super.initialize() — from base proxy
│   └── metrics() — background loop
│       └── for each connection/client:
│           ├── write.labels({connection, host}).set(stat.write)
│           ├── read.labels({connection, host}).set(stat.read)
│           └── active.labels({connection, host}).set(active ? 1 : 0)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/proxy_prometheus.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/proxy-prometheus/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/proxy-prometheus/LICENSE)

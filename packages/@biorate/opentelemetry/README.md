# @biorate/opentelemetry

OpenTelemetry integration with auto-instrumentation, decorator-based tracing, data masking, and span attribute filtering.

## How it works

The package sets up a fully configured [OpenTelemetry NodeSDK](https://opentelemetry.io/docs/languages/js/) on import — auto-instrumentations, resource detectors (AWS, GCP, Alibaba, container, host), OTLP trace/metric exporters, and a configurable Prometheus or console metric reader.

Two decorators provide declarative tracing:

- **`@scope()`** — class-level decorator: assigns an OpenTelemetry `Tracer` to the class via Reflect metadata.
- **`@span()`** — method-level decorator: wraps a method in an active span, recording `class`, `method`, `arguments`, and `result` as span attributes. Arguments and result are serialised via `json-stringify-safe`.

A custom `DataMaskingProcessor` (extends `SimpleSpanProcessor`) applies two layers of redaction before span export:
1. **String-level masking** — regex-based (email, phone, card numbers via `@biorate/masquerade`).
2. **JSON-level masking** — parsed JSON attributes are run through `maskdata` rules (field-name‑based).

Additionally, `@span()` supports an `exclude` option that filters data before it ever reaches the span — preventing large or sensitive payloads from being recorded at all.

## Installation

```bash
pnpm add @biorate/opentelemetry
```

## Usage

### Minimal setup

Set the required environment variables and import the package. The SDK starts automatically on import.

```ts
process.env.OTEL_SERVICE_NAME = 'my-app';
process.env.OTEL_TRACES_SAMPLER = 'always_on';
process.env.OTEL_TRACES_SAMPLER_ARG = '1';
process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:4317';

import { scope, span } from '@biorate/opentelemetry';

@scope('1.0')
class MyService {
  @span()
  public greet(name: string) {
    return `Hello, ${name}!`;
  }
}

const svc = new MyService();
svc.greet('world');
```

The exported span will contain the following attributes:

| Attribute     | Value                           |
| ------------- | ------------------------------- |
| `class`       | `"MyService"`                   |
| `method`      | `"greet"`                       |
| `arguments`   | `'["world"]'`                   |
| `result`      | `'"Hello, world!"'`             |
| `SpanKind`    | `"SERVER"`                      |

### @scope — assigning a tracer

```ts
@scope()
class A {}
// tracer name = 'A', version undefined

@scope('2.0')
class B {}
// tracer name = 'B', version '2.0'

@scope('2.0', 'my-domain')
class C {}
// tracer name = 'my-domain', version '2.0'
```

### @span — method tracing

```ts
@span()
public syncMethod(a: number, b: number) {
  return a + b;
}

@span({ name: 'custom-span-name' })
public namedSpan() { /* ... */ }

@span({ spanKind: 'CLIENT' })
public clientSpan() { /* ... */ }
```

The `name` option overrides the span name (defaults to the method name). `spanKind` sets the `SpanKind` attribute (default `SERVER`).

Async methods are handled transparently — the span is kept open until the promise settles:

```ts
@span()
public async query(sql: string) {
  const result = await db.execute(sql);
  return result;
}
```

### @span({ exclude }) — filtering span data

The `exclude` option accepts an array of **JSON path patterns** that prevent matching fields from being recorded in the span. This avoids storing large or sensitive payloads (binary blobs, tokens, passwords) in tracing backends.

Patterns are relative to the span attribute name (`arguments` or `result`):

| Pattern | Effect |
| ------- | ------ |
| `'arguments'` | Entire `arguments` attribute is omitted |
| `'arguments.0.password'` | `password` field of the first argument is removed |
| `'arguments.*.creditCard'` | `creditCard` field at any argument is removed (`*` — single segment wildcard) |
| `'arguments.**.token'` | `token` at any nesting depth is removed (`**` — multi‑level globstar) |
| `'result'` | Entire `result` attribute is omitted |
| `'result.token'` | `token` field in the result is removed |

The original method arguments and return value are **not mutated** — filtering is applied on a deep clone.

```ts
@span({ exclude: ['arguments.password', 'result.token'] })
public authenticate(password: string) {
  return { token: 'jwt...', user: { id: 1 } };
}
// arguments written to span: '[password]' → password field value IS the string,
// but since password is at index 0 and pattern is 'arguments.password',
// it matches only if an argument *object* has a 'password' key.
// To match a positional argument, use 'arguments.0' or 'arguments.*'.
```

Practical example — exclude a field nested in an argument object:

```ts
@span({ exclude: ['arguments.0.password'] })
public authenticate(credentials: { password: string; login: string }) {
  return { session: 'abc' };
}
// span.arguments → '[{"login":"user"}]' (password removed)
```

Exclude result fields:

```ts
@span({ exclude: ['result.token', 'result.nested.secret'] })
public fetchData() {
  return {
    token: 's3cr3t',
    nested: { secret: 'classified', visible: 'ok' },
    normal: 'hello',
  };
}
// span.result → '{"nested":{"visible":"ok"},"normal":"hello"}'
```

Wildcard patterns — single (`*`) and multi‑level (`**`):

```ts
@span({ exclude: ['arguments.*.creditCard'] })
public pay(users: Array<{ name: string; creditCard: string }>) {
  // ...
}

@span({ exclude: ['arguments.**.creditCard'] })
public processNested(data: { deep: { creditCard: string } }) {
  // ...
}
```

Combined with data masking:

```ts
// exclude prevents large payloads from being stored in the span,
// DataMaskingProcessor masks remaining sensitive fields on export.
@span({ exclude: ['arguments.binaryData', 'result.token'] })
public handleRequest(body: { binaryData: Buffer; token: string }) {
  // ...
}
```

### Data masking

The built-in `DataMaskingProcessor` is automatically added to the span processor chain. Configure `@biorate/masquerade` anywhere in your application startup:

```ts
import { CardMask, EmailMask, Masquerade, PhoneMask } from '@biorate/masquerade';

Masquerade.configure({
  maskJSON2: {
    emailFields: ['result.email', 'arguments.*'],
    passwordFields: ['password'],
  },
});

Masquerade.use(EmailMask).use(PhoneMask).use(CardMask);
```

At export time every string attribute value is scanned for emails, phones, and card numbers via regex, and JSON-parsed attributes are masked by field name rules from `maskJSON2`.

## Configuration

### OpenTelemetry environment variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `OTEL_SERVICE_NAME` | — | Logical service name (resource attribute) |
| `OTEL_TRACES_SAMPLER` | — | Sampler: `always_on`, `always_off`, `traceidratio`, `parentbased_traceidratio` |
| `OTEL_TRACES_SAMPLER_ARG` | — | Sampler argument (e.g. ratio for `traceidratio`) |
| `OTEL_PROPAGATORS` | `'tracecontext,baggage'` | Propagators list |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | — | OTLP gRPC endpoint for traces and metrics |
| `OTEL_LOG_LEVEL` | — | OpenTelemetry log level |
| `OTEL_METRICS_EXPORTER` | `'none'` | Metrics exporter: `otlp`, `prometheus`, `console`, `none` |
| `OTEL_BSP_SCHEDULE_DELAY` | `5000` | Batch span processor schedule delay (ms) |
| `OTEL_BSP_EXPORT_TIMEOUT` | `30000` | Batch span processor export timeout (ms) |
| `OTEL_EXCLUDED_DETECTORS` | — | Comma-separated resource detector names to skip |

### Resource detectors

Detectors are loaded from environment, container, and cloud metadata. Exclude any detector by adding its name to `OTEL_EXCLUDED_DETECTORS`:

```bash
OTEL_EXCLUDED_DETECTORS=gcpDetector,alibabaCloudEcsDetector
```

Available detectors:

| Name | Source |
| ---- | ------ |
| `containerDetector` | Container metadata |
| `envDetector` | OTEL_RESOURCE_ATTRIBUTES |
| `hostDetector` | Host info |
| `osDetector` | OS info |
| `processDetector` | Process info |
| `alibabaCloudEcsDetector` | Alibaba Cloud ECS |
| `awsEksDetector` | AWS EKS |
| `awsEc2Detector` | AWS EC2 |
| `gcpDetector` | GCP |

### Resource attributes (Kubernetes example)

```bash
OTEL_RESOURCE_ATTRIBUTES='
  k8s.cluster.name=prod,
  k8s.container.name=app,
  k8s.deployment.name=app,
  k8s.namespace.name=default,
  k8s.node.name=node-1,
  k8s.pod.name=app-7d9f8c6b4-abcde,
  k8s.replicaset.name=app-7d9f8c6b4,
  service.instance.id=app.prod.1,
  service.namespace=production,
  service.version=1.0.0'
```

## Span attributes

Every method decorated with `@span()` produces a span with the following attributes (unless excluded):

| Attribute    | Type     | Description |
| ------------ | -------- | ----------- |
| `class`      | `string` | Decorated class name (`target.constructor.name`) |
| `method`     | `string` | Method name (`propertyKey`) |
| `arguments`  | `string` | `JSON.stringify`-safe serialisation of all arguments |
| `result`     | `string` | `JSON.stringify`-safe serialisation of the return value |
| `SpanKind`   | `string` | Kind hint: `SERVER`, `CLIENT`, `PRODUCER`, `CONSUMER`, `INTERNAL` |

## Exclude pattern reference

Pattern matching uses [`micromatch`](https://github.com/micromatch/micromatch) with `/` as path separator.

| Wildcard | Meaning |
| -------- | ------- |
| `*` | Matches any single path segment |
| `**` | Matches zero or more path segments |
| `?(...)` | Matches zero or one of the given patterns |
| `+(...)` | Matches one or more of the given patterns |
| `@(...)` | Matches exactly one of the given patterns |
| `!(...)` | Matches anything except one of the given patterns |

For full glob syntax see the [micromatch documentation](https://github.com/micromatch/micromatch#matching-features).

## Architecture

```
Import @biorate/opentelemetry
  └─ NodeSDK.start()
       ├─ auto-instrumentations (HTTP, gRPC, DB, ...)
       ├─ resource detectors (env, host, container, cloud)
       ├─ OTLPTraceExporter
       ├─ DataMaskingProcessor (masks span attributes on export)
       └─ metricReader (OTLP / Prometheus / Console)

@scope('v') class C { @span() m() {} }
  ├─ @scope:  trace.getTracer(C.name, 'v') → Reflect.defineMetadata(tracer, C)
  └─ @span:   descriptor.value = wrapper
                ├─ tracer.startActiveSpan(name, span => { ... })
                ├─ span.setAttribute('arguments', stringify(filterByPaths(args, ...)))
                ├─ const result = method.apply(this, args)
                ├─ span.setAttribute('result', stringify(filterByPaths(result, ...)))
                └─ span.end()

DataMaskingProcessor.onEnd(span)
  ├─ forEach attribute: Masquerade.processString (regex masking)
  ├─ if maskJSON2 enabled: Masquerade.processJSON (field-name masking)
  └─ super.onEnd(span) → export
```

### Learn
* Documentation can be found here - [docs](https://biorate.github.io/core/modules/opentelemetry.html).

### Release History
See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/opentelemetry/CHANGELOG.md)

### License
[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/opentelemetry/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

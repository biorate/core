# @biorate/nestjs-tools

Production‑grade middleware, guards, interceptors, filters, decorators, and HTTP controllers for NestJS applications built on `@biorate/inversion` and `@biorate/prometheus`.

## Features

- **Request counting** — Prometheus‑backed counter per method + route + status.
- **Response time** — Prometheus histogram + `x-response-time` header.
- **HTTP proxy** — Prometheus‑instrumented `http-proxy-middleware` wrapper.
- **Tracing** — OpenTelemetry span attributes for incoming requests.
- **Exception filter** — structured JSON error responses for HTTP, WS, and RPC.
- **Auth** — `@AuthBasic()` decorator + `AuthGuardProvider`.
- **Roles** — `@Roles()` decorator + `RolesGuardProvider`.
- **CORS** — config‑driven origin validation.
- **Built‑in controllers** — `/metrics`, `/probe`, `/locales`.
- **Hexagonal app template** — domain/application/infrastructure layers.

## Installation

```bash
pnpm add @biorate/nestjs-tools
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@nestjs/swagger`, `class-validator`, `express`, `http-proxy`, `http-proxy-middleware`, `lodash-es`, `rxjs`, `ws`.

## Quick start

`main.ts`:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  RoutesInterceptor,
  TracingInterceptor,
} from '@biorate/nestjs-tools';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new RoutesInterceptor(), new TracingInterceptor());

  await app.listen(3000);
}

bootstrap();
```

`app.module.ts`:

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  RequestCountMiddleware,
  ResponseTimeMiddleware,
} from '@biorate/nestjs-tools';

@Module({ imports: [...] })
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestCountMiddleware, ResponseTimeMiddleware)
      .forRoutes('*');
  }
}
```

> Middleware and interceptor classes use `@inject(Types.Config)` from the global
> `@biorate/inversion` container — bootstrap the app via the `@biorate/launcher`
> lifecycle with `Types.Config` bound, otherwise requests will fail with
> `InversionInjectionIsUndefinedError`.

## Middlewares

### `RequestCountMiddleware`

Prometheus counter `http_server_requests_seconds_count` with labels `method`, `uri`, `status`.

```ts
consumer.apply(RequestCountMiddleware).forRoutes('*');
```

Uses `RoutesInterceptor` to resolve the actual route path (e.g. `/api/users/:id` instead of `/api/users/123`).

Config option: `app.middleware.RequestCountMiddleware.log-base-url` (boolean, default `false`).

### `ResponseTimeMiddleware`

Prometheus histogram `http_server_requests_seconds` + `x-response-time` header.

```ts
consumer.apply(ResponseTimeMiddleware).forRoutes('*');
```

Config options:

| Path                                                 | Default                 |
| ---------------------------------------------------- | ----------------------- |
| `app.middleware.ResponseTimeMiddleware.suffix`       | `true`                  |
| `app.middleware.ResponseTimeMiddleware.header`       | `x-response-time`       |
| `app.middleware.ResponseTimeMiddleware.digits`       | `3`                     |
| `app.middleware.ResponseTimeMiddleware.log-base-url` | `false`                 |
| `ResponseTimeMiddleware.histogram.buckets`           | `[0.005, 0.01, … , 10]` |

### `ProxyPrometheusMiddleware`

Prometheus‑instrumented HTTP proxy via `http-proxy-middleware`.

```ts
import { ProxyPrometheusMiddleware } from '@biorate/nestjs-tools';

consumer
  .apply(
    ProxyPrometheusMiddleware.create({
      target: 'http://upstream.service:8080',
      changeOrigin: true,
    }),
  )
  .forRoutes('/api/v2/legacy');
```

Creates two metrics:

- `http_proxy_server_requests_seconds_count` (counter)
- `http_proxy_server_requests_seconds` (histogram)

Config: `ProxyPrometheusMiddleware.histogram.buckets`.

## Filters

### `AllExceptionsFilter`

Catches all exceptions and returns a structured JSON response:

```json
{
  "status": 402,
  "code": "PaymentError",
  "hint": "Insufficient funds",
  "path": "/api/orders",
  "meta": {}
}
```

Supports HTTP, WebSocket, and RPC transport types. Maps `meta.status` from `@biorate/errors` to HTTP status codes.

```ts
app.useGlobalFilters(new AllExceptionsFilter());
```

## Interceptors

### `TracingInterceptor`

Adds OpenTelemetry span attributes for incoming requests:

```
incoming.request.url
incoming.request.body
incoming.request.headers
incoming.request.method
incoming.request.params
incoming.request.query
incoming.response.headers
incoming.response.statusCode
incoming.response.data
incoming.response.errorCode
```

Config: `TracingInterceptor.excluded` — array of strings or RegExp to skip URLs
(string entries match by substring inclusion, RegExp entries by test).

#### Aspect exclusion

Granular control over which span attributes are written:

```json
{
  "TracingInterceptor": {
    "excluded": ["/health"],
    "excludedAttributes": ["response.data"],
    "excludedByURL": [{ "url": "/files", "attributes": ["body", "response"] }]
  }
}
```

- `TracingInterceptor.excludedAttributes` — string[] of aspects to skip globally.
- `TracingInterceptor.excludedByURL` — array of `{ url: string | RegExp, attributes: string[] }`
  entries; aspects are skipped only for matching URLs (string entries match by
  substring inclusion, RegExp entries by test).
- An excluded item also matches aspect groups by prefix: `response` excludes
  `response.headers`, `response.statusCode`, `response.data` and `response.errorCode`.
- Accepted aliases: `url`, `method`, `headers`, `body`, `params`, `query`
  (→ `incoming.request.*`), `statusCode`, `data`, `errorCode` (→ `incoming.response.*`);
  full names (`request.body`, `response.data`, …) work as-is.

### `RoutesInterceptor`

Resolves the full route path (controller + handler) and stores it in a `WeakMap<Request, { path }>` for use by `RequestCountMiddleware` and `ResponseTimeMiddleware`.

Not applied automatically: when using the count/time middlewares, register it globally via `app.useGlobalInterceptors(new RoutesInterceptor())` — otherwise they won't see the resolved route path and metrics fall back to `/`.

## Providers (Guards)

### `AuthGuardProvider`

HTTP Basic Authentication guard. Validates `Authorization: Basic …` against config `app.auth.basic` (map of `username: password`). If config is absent, access is granted.

```ts
@Injectable()
export class MyController {
  @Get('/admin')
  @AuthBasic()
  public admin() {
    return 'secret data';
  }
}
```

### `RolesGuardProvider`

Bitmask‑based role guard. Use with `@Roles()` decorator:

```ts
import { Controller, Get } from '@nestjs/common';
import { Roles, UserRoles } from '@biorate/nestjs-tools';

@Controller()
export class AdminController {
  @Roles(UserRoles.Admin, UserRoles.Basic)
  @Get('/admin')
  public admin() {
    return 'ok';
  }
}
```

`Roles(...)` accepts a variadic list of roles (combined into a bitmask via
bitwise OR internally). Built-in `UserRoles`: `Basic` (`1 << 0`), `Admin` (`1 << 1`).

Override `getUser()` to load the user from your database:

```ts
export class CustomRolesGuard extends RolesGuardProvider {
  protected async getUser(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = await myDb.findUser(request.cookies.sessionId);
    return user;
  }
}
```

## Decorators

| Decorator      | Composition                                       |
| -------------- | ------------------------------------------------- |
| `@Roles(...)`  | `SetMetadata(ROLES_KEY, bitmask)`                 |
| `@AuthBasic()` | `ApiBasicAuth()` + `UseGuards(AuthGuardProvider)` |

## CORS

```ts
import { corsOriginHandler } from '@biorate/nestjs-tools';

app.enableCors({ origin: corsOriginHandler });
```

In non‑debug environments, validates the origin against `ALLOWED_ORIGIN` config regexp (defaults to `package.name` without `-server` suffix). In `debug` env, all origins are allowed.

## HTTP controllers

### `MetricsController`

Exposes `GET /metrics` with Prometheus metrics from the shared registry.

### `ProbeController`

| Route        | Purpose            |
| ------------ | ------------------ |
| `GET /probe` | Liveness/readiness |

### `LocalesController`

Serves locale files for internationalization.

## App structure (hexagonal)

```
src/app/
├── application/
│   ├── ports/          ← Use‑case interfaces (inbound ports)
│   └── service/        ← Use‑case implementations
├── domain/
│   └── .keep           ← Domain models, entities, value objects
└── infrastructure/
    ├── adapters/       ← Outbound port implementations
    └── controllers/    ← NestJS controllers
```

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Incoming HTTP                      │
└──────────┬───────────────────────────────────────────┘
           │
┌──────────▼───────────────────────────────────────────┐
│ RoutesInterceptor (path resolution)                   │
├──────────────────────────────────────────────────────┤
│ RequestCountMiddleware (counter)                      │
├──────────────────────────────────────────────────────┤
│ ResponseTimeMiddleware (histogram + header)           │
├──────────────────────────────────────────────────────┤
│ TracingInterceptor (OpenTelemetry span attrs)         │
├──────────────────────────────────────────────────────┤
│ AllExceptionsFilter (structured error JSON)           │
├──────────────────────────────────────────────────────┤
│ AuthGuardProvider / RolesGuardProvider                 │
├──────────────────────────────────────────────────────┤
│              ┌──────────────────────┐                │
│              │ ProxyMiddleware      │  (optional)     │
│              │                      │                │
│              └──────────────────────┘                │
└──────────────────────────────────────────────────────┘
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/nestjs_tools.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/nestjs-tools/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/nestjs-tools/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

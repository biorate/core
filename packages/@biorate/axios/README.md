# @biorate/axios

Axios OOP static interface — extends `axios` with lifecycle hooks, stubbing, mock caching, and a class-based HTTP client pattern.

## Features

- **Class-based** — extend `Axios` and override hooks for per-service configuration.
- **Lifecycle hooks** — `before()`, `after()`, `catch()`, `finally()` for request/response interception.
- **Static `fetch()`** — convenient static entry point (no instance required).
- **Stubbing** — `stub()` / `unstub()` for deterministic tests without network.
- **Mock mode** — `useMock()` enables mock mode; response caching is provided by subclasses that override `getMock()`/`setMock()` (the base class caches nothing).
- **Re-exports `axios`** — all `axios` types, classes, and helpers available from the same import.

## Installation

```bash
pnpm add @biorate/axios
```

Peer dependencies: `lodash-es`. `axios` is a regular dependency, `@biorate/singleton` a runtime dependency, and `@biorate/inversion` a dev dependency.

## Quick start

```ts
import { Axios } from '@biorate/axios';

class Yandex extends Axios {
  public baseURL = 'https://yandex.ru';
  public timeout = 5000;
}

(async () => {
  const response = await Yandex.fetch<string>();
  console.log(response.status); // 200
  console.log(response.data); // <!DOCTYPE html>...
})();
```

## Module reference

### `Axios` — Main class

```ts
import { Axios } from '@biorate/axios';
```

Extends `Singleton` from `@biorate/singleton`.

#### Static methods

| Method     | Signature                                                  | Description                                                    |
| ---------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| `fetch`    | `public static fetch(options?: any)`                       | Makes an HTTP request (delegates to `protected _fetch<T, D>`). |
| `stub`     | `static stub(params: IStubParam, persist?: boolean): void` | Replaces `fetch` with a fake response for testing.             |
| `unstub`   | `static unstub(): void`                                    | Restores the original `fetch` implementation.                  |
| `useMock`  | `static useMock(): void`                                   | Enables mock mode — caches successful GET responses.           |
| `defaults` | `static get defaults()`                                    | Delegates to `axios.defaults`.                                 |

#### Instance hooks

Override these in subclasses to add custom logic:

| Hook           | Signature                                                                                            | When called                     |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| `before`       | `protected async before(params?: IAxiosFetchOptions, meta?: Record<string, unknown>): Promise<void>` | Before request.                 |
| `after`        | `protected async after<T, D>(result: AxiosResponse<T, D>, startTime, params?, meta?): Promise<void>` | After successful response.      |
| `catch`        | `protected async catch(e, startTime, params?, meta?): Promise<void>`                                 | On error.                       |
| `finally`      | `protected async finally(startTime, params?, meta?): Promise<void>`                                  | Always after request completes. |
| `getStartTime` | `protected getStartTime(): [number, number]`                                                         | Returns `[Date.now(), 0]`.      |

#### Instance properties

| Property  | Type     | Default | Description            |
| --------- | -------- | ------- | ---------------------- |
| `timeout` | `number` | `15000` | Request timeout in ms. |
| `baseURL` | `string` | —       | Base URL for requests. |

### Types

```ts
import { IAxiosFetchOptions, IStubParam } from '@biorate/axios';
```

| Export               | Signature                                                                                | Description                                  |
| -------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------- |
| `IAxiosFetchOptions` | `type = AxiosRequestConfig & { path?: Record<string, string\|number>; retry?: boolean }` | Extended request config with path params.    |
| `IStubParam`         | `type = { data, status?, statusText?, headers?, config? }`                               | Parameters for `Axios.stub()` fake response. |

### Re-exports from `axios`

The package re-exports all `axios` exports for convenience:

**Classes:** `Axios`, `AxiosError`, `AxiosHeaders`, `CanceledError`, `CancelToken`.

**Interfaces:** `AxiosInstance`, `AxiosStatic`, `AxiosRequestConfig`, `InternalAxiosRequestConfig`, `AxiosResponse`, `AxiosDefaults`, `CreateAxiosDefaults`, `HeadersDefaults`, `AxiosInterceptorManager`, `AxiosInterceptorOptions`, `CancelStatic`, `Cancel`, `Canceler`, `CancelTokenStatic`, `CancelTokenSource`, `GenericAbortSignal`, `GenericFormData`, `GenericHTMLFormElement`.

**Types:** `RawAxiosRequestConfig`, `AxiosPromise`, `AxiosHeaderValue`, `RawAxiosHeaders`, `RawAxiosRequestHeaders`, `AxiosRequestHeaders`, `RawAxiosResponseHeaders`, `AxiosResponseHeaders`, `Method`, `ResponseType`, `responseEncoding`, `TransitionalOptions`, `AxiosAdapter`, `AxiosAdapterName`, `AxiosAdapterConfig`, `AxiosBasicCredentials`, `AxiosProxyConfig`, `AxiosProgressEvent`, `AxiosRequestTransformer`, `AxiosResponseTransformer`, `SerializerVisitor`, `SerializerOptions`, `FormSerializerOptions`, `ParamEncoder`, `CustomParamsSerializer`, `ParamsSerializerOptions`, `AddressFamily`, `LookupAddressEntry`, `LookupAddress`.

**Enums:** `HttpStatusCode` (all standard HTTP status codes).

**Functions:** `getAdapter`, `toFormData`, `formToJSON`, `isAxiosError`, `spread`, `isCancel`, `all`, `mergeConfig`, `create`.

## Usage patterns

### Subclass with hooks

```ts
import { Axios, IAxiosFetchOptions } from '@biorate/axios';
import { AxiosResponse } from 'axios';

class ApiClient extends Axios {
  public baseURL = 'https://api.example.com';

  protected async before(params?: IAxiosFetchOptions) {
    console.log(`→ ${params?.method || 'GET'} ${params?.url}`);
  }

  protected async after<T>(result: AxiosResponse<T>, startTime: [number, number]) {
    console.log(`← ${result.status} (${Date.now() - startTime[0]}ms)`);
  }
}

const response = await ApiClient.fetch({ url: '/users' });
```

### Testing with stubs

```ts
Axios.stub({ data: { users: [] }, status: 200 });
const response = await ApiClient.fetch({ url: '/users' });
console.log(response.data); // { users: [] }
Axios.unstub();
```

### Mock mode

`Axios.useMock()` only flips a flag on the class — the base `Axios` caches **nothing**: its `getMock()` returns `undefined` and `setMock()` has an empty body (`src/index.ts:97-110`). Response caching must be implemented in a subclass that overrides both:

```ts
import { Axios, IAxiosFetchOptions } from '@biorate/axios';
import { AxiosResponse } from 'axios';
import { get, set } from 'lodash-es';

class CachedClient extends Axios {
  public static store: Record<string, any> = {};

  protected static getMock<T = any, D = any>(
    instance: Axios,
    options?: IAxiosFetchOptions,
  ): undefined | AxiosResponse<T, D> {
    return get(this.store, `${instance.constructor.name}.${JSON.stringify(options)}`);
  }

  protected static setMock<T = any, D = any>(
    instance: Axios,
    result: AxiosResponse<T, D>,
    options?: IAxiosFetchOptions,
  ) {
    set(this.store, `${instance.constructor.name}.${JSON.stringify(options)}`, result);
  }
}

CachedClient.useMock();
// First call hits the network, subsequent identical calls return the cached response.
```

On the base class, `useMock()` therefore has no effect on repeat requests — every call goes to the network.

## Architecture

```
Axios (extends Singleton)
│
├── static fetch(options)
│   ├── lookup mock cache (if useMock enabled)
│   └── → instance.before(params, meta)
│       → instance.fetch() → axios.request(...)
│       → instance.after(result, startTime, params, meta)  or  instance.catch(e, startTime, params, meta)
│       → instance.finally(startTime, params, meta)
│   └── set mock cache (if useMock enabled)
│
├── static stub(params)        Replace implementation with FakeResponse
├── static unstub()            Restore original implementation
├── static useMock()           Enable mock mode (caching via subclass getMock/setMock)
│
└── Stubs (internal)
    └── FakeResponse implements AxiosResponse
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/axios.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/axios/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/axios/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

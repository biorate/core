# @biorate/i18n

Internationalization library — DI‑wrapped `i18next` with automatic lifecycle initialization and a convenience `t` tagged‑template function.

## Features

- **DI integration** — `@injectable()` abstract class with `@init()` lifecycle.
- **i18next re‑export** — all types, interfaces, and helpers from `i18next` are available from the same import.
- **Tagged‑template `t`** — `t\`key\`` syntax for concise translations.
- **Middleware support** — i18next plugins via `middlewares` getter.
- **Languages helper** — `languages` getter from `supportedLngs` option.

## Installation

```bash
pnpm add @biorate/i18n
```

Requires `@biorate/config`, `@biorate/inversion`, `i18next`.

## Quick start

```ts
import { inject, container, Core, Types } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import { I18n, t } from '@biorate/i18n';

class MyI18n extends I18n {
  protected options = {
    fallbackLng: 'ru',
    lng: 'ru',
    resources: {
      ru: { translation: { 'Привет мир': 'Привет мир!' } },
      en: { translation: { 'Привет мир': 'Hello world!' } },
    },
  };
}

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(MyI18n) public i18n: MyI18n;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<MyI18n>(MyI18n).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(t`Привет мир`);             // 'Привет мир!'
  console.log(t('Привет мир', { lng: 'en' })); // 'Hello world!'
})();
```

## Module reference

### `I18n` — Abstract base

```ts
import { I18n } from '@biorate/i18n';
```

DI‑ready abstract class wrapping i18next.

| Member        | Visibility    | Type / Signature                         | Description                          |
|---------------|---------------|------------------------------------------|--------------------------------------|
| `config`      | `protected`   | `IConfig`                                | Injected config service.             |
| `options`     | `protected abstract` | `Record<string, unknown>`      | i18next init options (must override).|
| `middlewares` | `protected get` | `(NewableModule \| Newable \| Module)[]` | i18next plugins (default: `[]`).      |
| `initialize`  | `@init() protected` | `(): Promise<void>`           | Register middlewares, call `i18next.init()`. |
| `languages`   | `public get`  | `string[]`                               | `options.supportedLngs` array.       |

### `t` — Translation function

```ts
import { t } from '@biorate/i18n';
```

| Export | Signature                                       | Description                              |
|--------|-------------------------------------------------|------------------------------------------|
| `t`    | `(key: any \| any[], options?: TOptionsBase)`   | Translate key (wraps `i18next.t`). Works as tagged template `t\`key\`` or function call. |

### Re‑exports from `i18next`

All named exports from `i18next` v23 are available:

**Interfaces:** `i18n`, `WithT`, `Interpolator`, `Formatter`, `Services`, `Module`, `BackendModule`, `LanguageDetectorModule`, `LanguageDetectorAsyncModule`, `PostProcessorModule`, `LoggerModule`, `I18nFormatModule`, `FormatterModule`, `ThirdPartyModule`, `Modules`, `Newable`, `NewableModule`, `ExistsFunction`, `CloneOptions`.

**Types:** `TFunction`, `TOptions`, `InitOptions`, `Resource`, `ResourceKey`, `ResourceLanguage`, `Namespace`, `DefaultNamespace`, `ParseKeys`, `TFunctionReturn`, `TFunctionDetailedResult`, `Callback`, `CallbackError`, `FallbackLng`, `FallbackLngObjList`, `TypeOptions`, `CustomTypeOptions`, `CustomPluginOptions`, `PluginOptions`, `FormatFunction`, `InterpolationOptions`, `ReactOptions`, `KeyPrefix`, `ModuleType`, `ReadCallback`, `MultiReadCallback`.

**Classes:** `ResourceStore`.

**Functions/Constants:** `createInstance`, `init`, `use`, `changeLanguage`, `getFixedT`, `exists`, `setDefaultNamespace`, `hasLoadedNamespace`, `loadNamespaces`, `loadLanguages`, `dir`, `loadResources`, `reloadResources`.

## Usage patterns

### Custom middleware (i18next backend)

```ts
class MyI18n extends I18n {
  protected options = { fallbackLng: 'en', lng: 'en' };

  protected get middlewares() {
    return [MyCustomBackend];  // i18next BackendModule
  }
}
```

### Accessing i18next instance directly

```ts
import { init, use, changeLanguage } from '@biorate/i18n';
```

## Architecture

```
I18n (abstract, @injectable)
│
├── @inject(Types.Config) config
├── protected abstract options          → i18next.init options
├── protected get middlewares()         → i18next.use() plugins
│
└── @init() initialize()
    ├── for each middleware → use(middleware)
    └── await i18next.init(this.options)
        └── t`key` / t('key') now resolves
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/i18n.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/i18n/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/i18n/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

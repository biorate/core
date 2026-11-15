# Biorate core

A monorepo of 56 reusable TypeScript packages published under the `@biorate/*` scope for backend services: IoC and inversion, layered configuration (files, env, Vault), transport and messaging connectors (Kafka, AMQP, HTTP proxy, schema registry), storage adapters (PostgreSQL, MongoDB, Redis, ClickHouse, MSSQL, MinIO, OpenSearch), observability (Prometheus, OpenTelemetry), NestJS integration, and testing/code-generation tooling (Vitest, Mocha, Playwright, unimock, hygen). Every package ships CJS and ESM builds with type declarations and is covered by the generated API reference.

[![Donate on Boosty](https://img.shields.io/badge/Boosty-donate-orange)](https://boosty.to/llevkin)

Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.

## Requirements

- Node.js >= 20.20.0
- npm, pnpm, or yarn — any workspace-aware package manager

## Install

Packages are published independently — install only the ones you need:

```bash
pnpm add @biorate/config
# or
npm install @biorate/config
# or
yarn add @biorate/config
```

## Repository layout

| Path                        | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `packages/@biorate/<name>/` | Published `@biorate/*` packages                 |
| `.tools/*`                  | Internal workspaces (not published)             |
| `.scripts/`                 | Shared build scripts                            |
| `docs/`                     | Generated API reference and documentation sites |
| `openspec/`                 | Spec-driven change artifacts                    |

## Development

```bash
npm install           # install workspace dependencies
npm run build         # build every package (CJS, ESM, types)
npm run test          # run the test suites
npm run lint          # lint every package
npm run format        # check formatting
npm run doc           # regenerate the TypeDoc API reference in docs/
npm run docs          # build per-package documentation sites (e.g. hygen)
```

pnpm and yarn work as well — the scripts are plain npm scripts.

A single package can be targeted with a workspace filter, for example
`npm run test --workspace @biorate/config`.

## Modules

Every package is published independently; the links below point to the generated
documentation.

### Core and DI

- [errors](https://biorate.github.io/core/modules/errors.html) — errors factory
- [symbolic](https://biorate.github.io/core/modules/symbolic.html) — symbols factory
- [tools](https://biorate.github.io/core/modules/tools.html) — shared utilities
- [collection](https://biorate.github.io/core/modules/collection.html) — collection
- [inversion](https://biorate.github.io/core/modules/inversion.html) — IoC core built on InversifyJS
- [singleton](https://biorate.github.io/core/modules/singleton.html) — abstract singleton class
- [auto-object](https://biorate.github.io/core/modules/auto_object.html) — auto object
- [bit-array](https://biorate.github.io/core/modules/bit_array.html) — bit array class
- [lifecycled](https://biorate.github.io/core/modules/lifecycled.html) — lifecycle control decorators
- [async-loop](https://biorate.github.io/core/modules/async_loop.html) — async loop function
- [run-context](https://biorate.github.io/core/modules/run_context.html) — contexted scenarios execution
- [shutdown-hook](https://biorate.github.io/core/modules/shutdown_hook.html) — shutdown hook for Node.js
- [command](https://biorate.github.io/core/modules/command.html) — command executor
- [cleanup](https://biorate.github.io/core/modules/cleanup.html) — cleanup files and directories
- [batcher](https://biorate.github.io/core/modules/batcher.html) — tasks batcher
- [i18n](https://biorate.github.io/core/modules/i18n.html) — internationalization library
- [amf](https://biorate.github.io/core/modules/amf.html) — Action Message Format protocol
- [masquerade](https://biorate.github.io/core/modules/masquerade.html) — redact sensitive information
- [nestjs-tools](https://biorate.github.io/core/modules/nestjs_tools.html) — NestJS tools

### Configuration

- [config](https://biorate.github.io/core/modules/config.html) — application configurator
- [file-config](https://biorate.github.io/core/modules/file_config.html) — configure the application using files
- [config-loader](https://biorate.github.io/core/modules/config_loader.html) — config loader abstraction
- [config-loader-fs](https://biorate.github.io/core/modules/config_loader_fs.html) — filesystem config loader
- [config-loader-env](https://biorate.github.io/core/modules/config_loader_env.html) — environment config loader
- [config-loader-vault](https://biorate.github.io/core/modules/config_loader_vault.html) — Vault config loader
- [vault](https://biorate.github.io/core/modules/vault.html) — Vault connector

### Transport and messaging

- [connector](https://biorate.github.io/core/modules/connector.html) — connector interface
- [amqp](https://biorate.github.io/core/modules/amqp.html) — AMQP connector
- [kafkajs](https://biorate.github.io/core/modules/kafkajs.html) — KafkaJS connector
- [rdkafka](https://biorate.github.io/core/modules/rdkafka.html) — rdkafka connector
- [schema-registry](https://biorate.github.io/core/modules/schema_registry.html) — schema registry connector
- [proxy](https://biorate.github.io/core/modules/proxy.html) — proxy connector
- [proxy-prometheus](https://biorate.github.io/core/modules/proxy_prometheus.html) — proxy connector with Prometheus metrics
- [haproxy](https://biorate.github.io/core/modules/haproxy.html) — HAProxy runner
- [axios](https://biorate.github.io/core/modules/axios.html) — Axios OOP interface
- [axios-prometheus](https://biorate.github.io/core/modules/axios_prometheus.html) — Axios interface with Prometheus metrics

### Storage

- [mongodb](https://biorate.github.io/core/modules/mongodb.html) — MongoDB connector based on mongoose and typegoose
- [pg](https://biorate.github.io/core/modules/pg.html) — PostgreSQL raw connector
- [mssql](https://biorate.github.io/core/modules/mssql.html) — MSSQL raw connector
- [redis](https://biorate.github.io/core/modules/redis.html) — Redis connector
- [ioredis](https://biorate.github.io/core/modules/ioredis.html) — IORedis connector
- [clickhouse](https://biorate.github.io/core/modules/clickhouse.html) — ClickHouse connector
- [minio](https://biorate.github.io/core/modules/minio.html) — MinIO connector
- [opensearch](https://biorate.github.io/core/modules/opensearch.html) — OpenSearch OOP interface
- [sequelize](https://biorate.github.io/core/modules/sequelize.html) — Sequelize ORM connector
- [migrations](https://biorate.github.io/core/modules/migrations.html) — migrations tools

### Observability

- [prometheus](https://biorate.github.io/core/modules/prometheus.html) — Prometheus DI module
- [opentelemetry](https://biorate.github.io/core/modules/opentelemetry.html) — OpenTelemetry integration

### Testing and code generation

- [vitest](https://biorate.github.io/core/modules/vitest.html) — OOP test decorators for Vitest with Allure support
- [vitest-spec](https://biorate.github.io/core/modules/vitest_spec.html) — Vitest spec helper
- [mocha](https://biorate.github.io/core/modules/mocha.html) — OOP tests based on @testdeck/core
- [mocha-spec](https://biorate.github.io/core/modules/mocha_spec.html) — Mocha spec helper
- [playwright](https://biorate.github.io/core/modules/playwright.html) — OOP test decorators for Playwright
- [unimock](https://biorate.github.io/core/modules/unimock.html) — snapshot-based proxy mocking
- [hygen](https://biorate.github.io/core/hygen/) — scalable code generator (fork of jondot/hygen)

### UI

- [react-virtual-table](https://biorate.github.io/core/modules/react_virtual_table.html) — React virtual table

## Learn

- [API reference](https://biorate.github.io/core/) — TypeDoc-generated documentation for every package
- [hygen documentation](https://biorate.github.io/core/hygen/) — guides for the code generator fork

## Contributing

Repository conventions, the build and release flow, and the agent instructions
live in [AGENTS.md](https://github.com/biorate/core/blob/master/AGENTS.md).
Commits follow [Conventional Commits](https://www.conventionalcommits.org/);
run `pnpm run build` and `pnpm run test` before opening a pull request.

## Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

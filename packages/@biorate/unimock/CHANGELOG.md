# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.14.0](https://github.com/biorate/core/compare/%40biorate%2Funimock%401.13.0...%40biorate%2Funimock%401.14.0) (2026-09-22)

### Features

- **unimok:** makeConnectionManagerOffline / fallbackOnMissEnabled ([cedce29](https://github.com/biorate/core/commit/cedce29e17501dc73929fc521eccb29c66fb25f6))

# [1.13.0](https://github.com/biorate/core/compare/%40biorate%2Funimock%401.12.0...%40biorate%2Funimock%401.13.0) (2026-09-19)

### Features

- **unimok:** bindReplaySequelizeModels ([875c3aa](https://github.com/biorate/core/commit/875c3aacb6a3fb968e229d9b1ee543e752e11f75))
- **unimok:** optimisation ([8d954d5](https://github.com/biorate/core/commit/8d954d5871423f6c204a6ee024d71ffa4d6377e9))
- **unimok:** optimisation ([26664b8](https://github.com/biorate/core/commit/26664b85a7ac1f6ca0d16498de0b5402d7203823))
- **unimok:** optimisation ([97ca20c](https://github.com/biorate/core/commit/97ca20c8931638585180a7d609fe3003ee2a2b71))
- **unimok:** optimisation ([29d4296](https://github.com/biorate/core/commit/29d4296dda4fd813fd576c5680e76af98750bc7c))
- **unimok:** optimisation ([450c280](https://github.com/biorate/core/commit/450c28088d7eb546bc8ed940e4bd26ba4b12bf49))

# [1.12.0](https://github.com/biorate/core/compare/%40biorate%2Funimock%401.11.1...%40biorate%2Funimock%401.12.0) (2026-09-15)

### Features

- **unimock:** serialize shared object references fix ([60f1159](https://github.com/biorate/core/commit/60f11599857b93806fac165436bb929acc0ca36c))

## [1.11.2](https://github.com/biorate/core/compare/@biorate/unimock@1.11.1...@biorate/unimock@1.11.2) (2026-09-15)

### Bug Fixes

- **unimock:** serialize shared (non-cyclic) object references in full ([47f3a2b](https://github.com/biorate/core/commit/47f3a2b)) — replaced the "seen forever" cycle guard with an active-stack guard in `serialize`/`stableStringify` so repeated references to the same object are no longer collapsed to `undefined`. This fixes `UnimockReplayMissError` mismatches for configs whose entries share one `options` object via `@biorate/config` template links.

## [1.11.1](https://github.com/biorate/core/compare/@biorate/unimock@1.11.0...@biorate/unimock@1.11.1) (2026-09-14)

### Bug Fixes

- **unimock:** destroy tests ([17f9bd7](https://github.com/biorate/core/commit/17f9bd7b7ead8a9429500ba54088056a3fa670e1))

# [1.11.0](https://github.com/biorate/core/compare/@biorate/unimock@1.10.0...@biorate/unimock@1.11.0) (2026-09-09)

### Features

- **unimock:** static handle improved ([f7404f9](https://github.com/biorate/core/commit/f7404f94a10e1b514ffb0c4b2016983ad2235295))

## [1.10.1](https://github.com/biorate/core/compare/@biorate/unimock@1.10.0...@biorate/unimock@1.10.1) (2026-09-09)

### Bug Fixes

- **unimock:** pass through constructor-internal calls during replay reconstruction — when a recorded result is rebuilt via the model's original static `build(plain, { isNewRecord: false })`, the vanilla constructor re-enters wrapped prototype methods (e.g. Sequelize `_initValues`) with reconstruction options that record mode never produced (recon `{ isNewRecord: false, _schema: null, _schemaDelimiter: '' }` vs hydration `{ raw: true, attributes: [...] }`) → `UnimockReplayMissError` on the unscoped `_initValues` call key. Those inner calls now pass through to the originals (instance state is populated by the model's own constructor); post-construction calls (`toJSON`/`get`/…) are served from the recorded `call:{refId}:` entries. Record/replay construction options no longer need to match, and seeding a `build()` call with identical args is no longer needed

# [1.10.0](https://github.com/biorate/core/compare/@biorate/unimock@1.8.11...@biorate/unimock@1.10.0) (2026-09-08)

### Features

- **unimock:** static handle improved ([497d5e0](https://github.com/biorate/core/commit/497d5e01b6018e0c12f56c79e2c6ebf2a6e1d7e3))

# [1.9.0](https://github.com/biorate/core/compare/@biorate/unimock@1.8.11...@biorate/unimock@1.9.0) (2026-09-08)

### Bug Fixes

- **unimock:** replay of instance-returning model statics (`create`, `findOne`, `findByPk`, `build`, `findAll`, `bulkCreate`, `bulkBuild`, `findOrCreate`, `findOrBuild`, `findCreateFind`, `upsert`, `update`, `findAndCountAll`) now returns real model instances with working `toJSON()`/`get()` (previously plain objects — app code like `item.toJSON()` threw TypeError)
- **unimock:** instance methods of instances returned from statics are refId-scoped (previously all instances in a multi-row result shared one call key → every row's `toJSON()` returned the last row's data in replay)

### Performance Improvements

- **unimock:** off mode (`UNIMOCK` unset/off) is now a zero-overhead pass-through — wrapped calls go straight to the original without any argument hashing or call-key computation

## [1.8.11](https://github.com/biorate/core/compare/@biorate/unimock@1.8.10...@biorate/unimock@1.8.11) (2026-09-01)

**Note:** Version bump only for package @biorate/unimock

## [1.8.10](https://github.com/biorate/core/compare/@biorate/unimock@1.8.9...@biorate/unimock@1.8.10) (2026-08-13)

**Note:** Version bump only for package @biorate/unimock

## [1.8.9](https://github.com/biorate/core/compare/@biorate/unimock@1.8.8...@biorate/unimock@1.8.9) (2026-08-04)

**Note:** Version bump only for package @biorate/unimock

## [1.8.8](https://github.com/biorate/core/compare/@biorate/unimock@1.8.7...@biorate/unimock@1.8.8) (2026-08-03)

**Note:** Version bump only for package @biorate/unimock

## [1.8.7](https://github.com/biorate/core/compare/@biorate/unimock@1.8.6...@biorate/unimock@1.8.7) (2026-07-06)

### Bug Fixes

- **unimock:** mock static bug ([cff2244](https://github.com/biorate/core/commit/cff2244ac6133765822b52e31c9bdad151be880e))

## [1.8.6](https://github.com/biorate/core/compare/@biorate/unimock@1.8.5...@biorate/unimock@1.8.6) (2026-07-06)

**Note:** Version bump only for package @biorate/unimock

## [1.8.5](https://github.com/biorate/core/compare/@biorate/unimock@1.8.4...@biorate/unimock@1.8.5) (2026-06-26)

**Note:** Version bump only for package @biorate/unimock

## [1.8.4](https://github.com/biorate/core/compare/@biorate/unimock@1.8.3...@biorate/unimock@1.8.4) (2026-06-26)

**Note:** Version bump only for package @biorate/unimock

## [1.8.3](https://github.com/biorate/core/compare/@biorate/unimock@1.8.2...@biorate/unimock@1.8.3) (2026-06-26)

### Bug Fixes

- deps, docs ([7e76b7b](https://github.com/biorate/core/commit/7e76b7b09ccc2047469b2377804d3cbac1633f1a))

## [1.8.2](https://github.com/biorate/core/compare/@biorate/unimock@1.8.1...@biorate/unimock@1.8.2) (2026-06-26)

**Note:** Version bump only for package @biorate/unimock

## [1.8.1](https://github.com/biorate/core/compare/@biorate/unimock@1.8.0...@biorate/unimock@1.8.1) (2026-06-26)

**Note:** Version bump only for package @biorate/unimock

# [1.8.0](https://github.com/biorate/core/compare/@biorate/unimock@1.7.0...@biorate/unimock@1.8.0) (2026-06-18)

### Features

- **unimock:** noop added ([0349003](https://github.com/biorate/core/commit/0349003fbbb51c8794eb15e9ad52bf9e83e34b7a))

# [1.7.0](https://github.com/biorate/core/compare/@biorate/unimock@1.6.2...@biorate/unimock@1.7.0) (2026-06-18)

### Features

- **unimock:** mock objects ([00db7e0](https://github.com/biorate/core/commit/00db7e094d45a32a815d435940069b8b3c5ed08c))

## [1.6.2](https://github.com/biorate/core/compare/@biorate/unimock@1.6.1...@biorate/unimock@1.6.2) (2026-06-18)

**Note:** Version bump only for package @biorate/unimock

## [1.6.1](https://github.com/biorate/core/compare/@biorate/unimock@1.6.0...@biorate/unimock@1.6.1) (2026-06-18)

### Bug Fixes

- **unimocl:** tsconfig.json ([f47e5a3](https://github.com/biorate/core/commit/f47e5a3101d46e7c65a8d4c438a96f936538370d))

# [1.6.0](https://github.com/biorate/core/compare/@biorate/unimock@1.5.0...@biorate/unimock@1.6.0) (2026-06-18)

### Features

- **unimock:** import.meta for dir setup ([8c0faaa](https://github.com/biorate/core/commit/8c0faaac2e7d1abce388b66936cc46671020ac69))

# [1.5.0](https://github.com/biorate/core/compare/@biorate/unimock@1.4.0...@biorate/unimock@1.5.0) (2026-06-17)

### Bug Fixes

- **unimock:** prettier ([17bcb58](https://github.com/biorate/core/commit/17bcb5802ea4f73fdcce1d83acccb80efd3a5fb4))

### Features

- **unimock:** depth & mock() function added, unified for all type of objects ([272ba81](https://github.com/biorate/core/commit/272ba8145fb80a02825a7ebf1a0076234c33bbc9))

# [1.4.0](https://github.com/biorate/core/compare/@biorate/unimock@1.3.0...@biorate/unimock@1.4.0) (2026-06-17)

### Features

- **unimock:** isRecord & isReplay added ([e23c025](https://github.com/biorate/core/commit/e23c025c8b6d895bc9765522493ee9395423e63c))

# [1.3.0](https://github.com/biorate/core/compare/@biorate/unimock@1.2.0...@biorate/unimock@1.3.0) (2026-06-17)

### Features

- **unimock:** connector.get() chain bug ([6bc733a](https://github.com/biorate/core/commit/6bc733a1b2644158eaf292d2416525f76f173cb5))

# [1.2.0](https://github.com/biorate/core/compare/@biorate/unimock@1.1.0...@biorate/unimock@1.2.0) (2026-06-17)

### Features

- **unimock:** redesign, stability reached, docs update, minor fixes in monoreposytory deps, lodash-es moved into peerDependencies ([558a27e](https://github.com/biorate/core/commit/558a27e2c36e93522340a8bf61ba00bccc4df589))

# 1.1.0 (2026-05-28)

### Features

- **unimock:** release ([ac05305](https://github.com/biorate/core/commit/ac05305a2b5e2d2d71731740ed22e1d6fcf85590))
- **unimock:** release ([6e771ab](https://github.com/biorate/core/commit/6e771abbdb5df77b3a89068684a9bc2ba0dde7ac))
- **unimock:** release ([aaad30d](https://github.com/biorate/core/commit/aaad30d0bde2ee8d0ea290cef75989eaacbe890c))
- **unimock:** release ([48de970](https://github.com/biorate/core/commit/48de970084a5f82c379d6adba88266705b69f9ac))
- **unimock:** release ([48ea991](https://github.com/biorate/core/commit/48ea991fddc564cf35e07129f9ced91c0f76e512))
- **unimock:** release ([a6e55f9](https://github.com/biorate/core/commit/a6e55f929602534618f7fdc67c446d7c7855136b))
- **unimock:** release ([970b116](https://github.com/biorate/core/commit/970b11659fa4f4603aded41447f7abf4233c6ca5))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.1](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.2.0...@biorate/vitest-spec@2.2.1) (2026-06-26)

**Note:** Version bump only for package @biorate/vitest-spec

# [2.2.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.1.3...@biorate/vitest-spec@2.2.0) (2026-06-17)

### Features

- **unimock:** redesign, stability reached, docs update, minor fixes in monoreposytory deps, lodash-es moved into peerDependencies ([558a27e](https://github.com/biorate/core/commit/558a27e2c36e93522340a8bf61ba00bccc4df589))

## [2.1.3](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.1.2...@biorate/vitest-spec@2.1.3) (2026-05-27)

**Note:** Version bump only for package @biorate/vitest-spec

## [2.1.2](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.1.1...@biorate/vitest-spec@2.1.2) (2026-05-27)

**Note:** Version bump only for package @biorate/vitest-spec

## [2.1.1](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.1.0...@biorate/vitest-spec@2.1.1) (2026-05-26)

**Note:** Version bump only for package @biorate/vitest-spec

# [2.1.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.0.2...@biorate/vitest-spec@2.1.0) (2026-05-18)

### Features

- lodash -> lodash-es migration ([8dcf797](https://github.com/biorate/core/commit/8dcf797dea695410ee0e4435ce50af919a87cb90))

## [2.0.2](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.0.1...@biorate/vitest-spec@2.0.2) (2026-05-16)

**Note:** Version bump only for package @biorate/vitest-spec

## [2.0.1](https://github.com/biorate/core/compare/@biorate/vitest-spec@2.0.0...@biorate/vitest-spec@2.0.1) (2026-05-16)

### Bug Fixes

- **vitest-spec:** docs ([264db93](https://github.com/biorate/core/commit/264db93a0a2682bcee97e762b1e9bd497b92d130))

# [2.0.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.7.1...@biorate/vitest-spec@2.0.0) (2026-05-14)

### Bug Fixes

- **vitest-spec:** build scripts fix ([8e5c02f](https://github.com/biorate/core/commit/8e5c02fea5d8471d41583afc25ecf2ab8cf39abd))
- **vitest-spec:** build scripts fix ([851fd5e](https://github.com/biorate/core/commit/851fd5e7993bb2147f5d52af7d9d78ffe8b30f6f))
- **vitest-spec:** build scripts fix ([9288bde](https://github.com/biorate/core/commit/9288bdea39bc36adc5a8b281f3e836ceb29aaba7))

- feat!: ESLint added with auto-fix for all packages ([d17b810](https://github.com/biorate/core/commit/d17b81046ef6b4be217b01ef059a5a828e590fac))

### Features

- esm/cjs build ([8d6ba60](https://github.com/biorate/core/commit/8d6ba6036f044928cc369afc86b0d3b365896828))
- esm/cjs build ([9119647](https://github.com/biorate/core/commit/9119647796041c2030cbc3c8edb612159d364825))
- esm/cjs build ([4072a50](https://github.com/biorate/core/commit/4072a50de28e322b94b979716080bfad00e8f76d))
- prettier format added ([c8a9562](https://github.com/biorate/core/commit/c8a9562fc853347807b3a8b60cfe993627f000d0))

### BREAKING CHANGES

- Added ESLint configuration and scripts to all packages. The module export format changed and tarballs optimized.

* Added .eslintignore to exclude dist/, node_modules/, test files
* Added lint and lint:fix scripts to all 54 packages
* Added lint and lint:fix commands to root package.json
* Fixed auto-fixable ESLint issues across all packages
* Updated lerna.json for lint workflow

## [1.7.1](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.7.0...@biorate/vitest-spec@1.7.1) (2026-05-05)

**Note:** Version bump only for package @biorate/vitest-spec

# [1.7.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.6.1...@biorate/vitest-spec@1.7.0) (2026-05-05)

### Features

- **vitest-spec:** conditional exports ([194a738](https://github.com/biorate/core/commit/194a73805e5f455a4f45944c60a818e06df3e6bf))
- **vitest-spec:** conditional exports ([e3a75e0](https://github.com/biorate/core/commit/e3a75e089291c64ec06d8f4f98e7fe0236af19b1))
- **vitest-spec:** conditional exports ([bacb504](https://github.com/biorate/core/commit/bacb504f4a98b659fb26ad8730402851c6974a4b))

## [1.6.1](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.6.0...@biorate/vitest-spec@1.6.1) (2026-05-05)

**Note:** Version bump only for package @biorate/vitest-spec

# [1.6.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.5.0...@biorate/vitest-spec@1.6.0) (2026-05-05)

### Features

- **vitest-spec:** require removed ([2baa4a5](https://github.com/biorate/core/commit/2baa4a54e0c16a8a263128f1439eb83b0576ae28))
- **vitest-spec:** require removed ([0584f7f](https://github.com/biorate/core/commit/0584f7f94342dbd2c4e56ba76a96da23c8ddbaa8))

# [1.5.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.4.0...@biorate/vitest-spec@1.5.0) (2026-05-05)

### Features

- **vitest:** mocha backward capability ([e06b71d](https://github.com/biorate/core/commit/e06b71d33d085a300dc92d212332a96629db78dc))

# [1.4.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.3.1...@biorate/vitest-spec@1.4.0) (2026-05-04)

### Features

- deps ([0c6ffc0](https://github.com/biorate/core/commit/0c6ffc0579b51f59fd17bb330cd6745c5a592c66))

## [1.3.1](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.3.0...@biorate/vitest-spec@1.3.1) (2026-04-23)

**Note:** Version bump only for package @biorate/vitest-spec

# [1.3.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.2.0...@biorate/vitest-spec@1.3.0) (2026-04-23)

### Features

- **vitest-spec:** .npmignore ([d40350c](https://github.com/biorate/core/commit/d40350c87c7d37a31de66e708597dd3c3bb34d86))

# [1.2.0](https://github.com/biorate/core/compare/@biorate/vitest-spec@1.1.0...@biorate/vitest-spec@1.2.0) (2026-04-23)

### Features

- **vitest-spec:** index.d.ts ([92a833b](https://github.com/biorate/core/commit/92a833b55d40dea467c568944a34322ca63a6337))

# 1.1.0 (2026-04-23)

### Features

- **vitest-spec:** release ([475740d](https://github.com/biorate/core/commit/475740da06146282f053be4fde2bf0a28191eb01))
- **vitest-spec:** release ([0902a5f](https://github.com/biorate/core/commit/0902a5f744c1c9d45d59715d43e89868809dfb03))

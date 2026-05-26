# @biorate/testing

Test harness and Docker Compose endpoint presets for Biorate connector tests.

## Profiles

- `memory` (default) — in-memory connector implementations from `@biorate/*/testing`
- `docker` — real connectors against `docker-compose.yml` on localhost

Set `BIORATE_TEST_PROFILE=docker` for integration tests.

## Example

```ts
import { Core, inject } from '@biorate/inversion';
import { PgConnector, IPgConnector } from '@biorate/pg';
import { createTestHarness } from '@biorate/testing';
import { setupBiorateTest } from '@biorate/testing';

class Root extends Core() {
  @inject(PgConnector) public connector!: IPgConnector;
}

const harness = createTestHarness({
  root: Root,
  profile: 'memory',
  connectors: ['pg'],
});

setupBiorateTest(harness);
```

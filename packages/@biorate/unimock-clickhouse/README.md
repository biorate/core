# @biorate/unimock-clickhouse

ClickHouse serializers for [@biorate/unimock](../unimock).

```ts
import { Mockable } from '@biorate/unimock';
import { clickhouseSerializers } from '@biorate/unimock-clickhouse';
import { ClickhouseConnector as Base } from '@biorate/clickhouse';

@Mockable({ serializers: clickhouseSerializers })
class ClickhouseConnector extends Base {}
```

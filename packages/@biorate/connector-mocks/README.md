# @biorate/connector-mocks

Библиотека для мокирования коннекторов с использованием снапшот-тестирования.

## Возможности

- **@Mockable() декоратор**: Автоматическое мокирование всех вызовов методов коннектора
- **Snapshot-first подход**: Если снапшот есть — возвращает из него, если нет — выполняет реальный метод и сохраняет
- **File-based хранение**: Снапшоты сохраняются в JSON-файлах
- **Transform функции**: Трансформация аргументов и результатов

## Установка

```bash
pnpm add @biorate/connector-mocks
```

## Использование

### Базовое использование

```typescript
import { Mockable } from '@biorate/connector-mocks';
import { ClickhouseConnector } from '@biorate/clickhouse';

@Mockable()
class MyClickhouseConnector extends ClickhouseConnector {}

const connector = new MyClickhouseConnector();

// Первый вызов - выполнит реальный запрос и сохранит снапшот
const result1 = await connector.get().query({ query: 'SELECT 1' });

// Повторный вызов - вернёт данные из снапшота
const result2 = await connector.get().query({ query: 'SELECT 1' });
```

### С опциями

```typescript
@Mockable({
  namespace: 'MyConnector',
  debug: true,
  transformArgs: (args) => args.map(a => sanitize(a)),
  transformResult: (result) => ({ ...result, mocked: true }),
})
class MyConnector extends ClickhouseConnector {}
```

### Custom Snapshot Store

```typescript
import { Mockable, MemorySnapshotStore } from '@biorate/connector-mocks';

@Mockable({
  snapshotStore: new MemorySnapshotStore(),
})
class MyConnector extends ClickhouseConnector {}
```

## API

### `@Mockable(options)`

Декоратор для автоматического мокирования методов коннектора.

**Опции:**
- `namespace` - Namespace для ключей снапшотов (по умолчанию: имя класса)
- `snapshotStore` - Хранилище снапшотов (по умолчанию: `FileSnapshotStore`)
- `debug` - Логирование (по умолчанию: `false`)
- `transformArgs` - Трансформация аргументов
- `transformResult` - Трансформация результата

### `FileSnapshotStore`

File-based хранилище снапшотов.

**Опции:**
- `snapshotsDir` - Директория (по умолчанию: `'__snapshots__'`)
- `fileExtension` - Расширение (по умолчанию: `'.snap.json'`)
- `indent` - Отступ JSON (по умолчанию: `2`)
- `sortKeys` - Сортировка ключей (по умолчанию: `true`)

### `MemorySnapshotStore`

In-memory хранилище для тестов.

## Рекомендации

- Коммитьте файлы снапшотов в репозиторий
- Используйте `transformArgs` для санитизации чувствительных данных
- Для временных данных используйте `transformResult`

## Лицензия

MIT

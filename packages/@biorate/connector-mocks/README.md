# @biorate/connector-mocks

Библиотека для мокирования коннекторов с использованием снапшот-тестирования. Позволяет легко писать интеграционные и E2E тесты, а затем запускать более лёгкие компонентные тесты без подключения к базам данных и инфраструктуре.

## Возможности

- **Snapshot-based mocking**: Автоматическая запись и воспроизведение вызовов методов коннектора
- **Три режима работы**:
  - `record`: Выполнение реальных методов с сохранением снапшотов (для E2E тестов)
  - `replay`: Возврат данных из снапшотов без подключения к БД (для компонентных тестов)
  - `passthrough`: Прямые вызовы без мокирования
- **File-based хранение**: Снапшоты сохраняются в `.mocks.json` файлах рядом с тестами
- **Transform функции**: Возможность трансформации аргументов и результатов перед сохранением
- **Clickhouse-specific helpers**: Специализированные хелперы для Clickhouse коннектора

## Установка

```bash
pnpm add @biorate/connector-mocks
```

## Быстрый старт

### Базовое использование

```typescript
import { createMockable, FileSnapshotStore } from '@biorate/connector-mocks';
import { ClickhouseConnector } from '@biorate/clickhouse';

// Создание mockable коннектора
const connector = createMockable(new ClickhouseConnector(), {
  snapshotStore: new FileSnapshotStore({
    snapshotsDir: '__snapshots__',
    fileExtension: '.mocks.json',
  }),
});

// В режиме записи (record) - выполнит реальный запрос и сохранит снапшот
// В режиме воспроизведения (replay) - вернёт данные из снапшота
const result = await connector.get().query({ query: 'SELECT 1' });
```

### Режимы работы

Режим определяется через переменные окружения (в порядке приоритета):
- `CONNECTOR_MOCK_MODE`
- `VITEST_MOCK_MODE`
- `TEST_MOCK_MODE`
- `MOCK_MODE`

Значения: `record` (по умолчанию), `replay`, `passthrough`

```bash
# Запись снапшотов (реальная БД)
CONNECTOR_MOCK_MODE=record vitest run e2e/

# Воспроизведение (без БД) - компонентные тесты
CONNECTOR_MOCK_MODE=replay vitest run component/
```

### Clickhouse-specific helpers

```typescript
import { mockClickhouse, mockClickhouseInstance } from '@biorate/connector-mocks';
import { ClickhouseConnector } from '@biorate/clickhouse';

// Вариант 1: Создание из класса (рекомендуемый)
const connector = mockClickhouse(ClickhouseConnector, {
  debug: true, // Логировать записи снапшотов
});

// Вариант 2: Создание из экземпляра
const instance = new ClickhouseConnector();
const connector = mockClickhouseInstance(instance, {
  namespace: 'CustomNamespace',
});
```

## Примеры использования

### E2E тестирование (record mode)

На этом этапе вы записываете снапшоты реальных вызовов к базе данных:

```typescript
// tests/e2e/clickhouse.spec.ts
import { mockClickhouse } from '@biorate/connector-mocks';
import { ClickhouseConnector } from '@biorate/clickhouse';

describe('E2E Clickhouse tests', () => {
  const connector = mockClickhouse(ClickhouseConnector);
  
  it('should query data from database', async () => {
    const result = await connector.get().query({
      query: 'SELECT * FROM users LIMIT 10',
      format: 'JSON',
    });
    
    expect(result).toBeDefined();
    // Снапшот автоматически сохранится в __snapshots__/clickhouse.spec.mocks.json
  });
});
```

После запуска тестов будет создан файл `__snapshots__/clickhouse.spec.mocks.json` с данными.

### Компонентное тестирование (replay mode)

Теперь можно запустить те же тесты без подключения к базе данных:

```typescript
// tests/component/service.spec.ts
import { mockClickhouse } from '@biorate/connector-mocks';
import { ClickhouseConnector } from '@biorate/clickhouse';
import { UserService } from '../services/user.service';

describe('UserService component tests', () => {
  const connector = mockClickhouse(ClickhouseConnector, {
    mode: 'replay', // Только чтение из снапшотов, БД не требуется
  });
  
  const userService = new UserService(connector);
  
  it('should return users', async () => {
    const users = await userService.getUsers();
    // Вернёт данные из снапшота, без подключения к БД
    expect(users).toHaveLength(10);
  });
});
```

## Продвинутое использование

### Transform функции

Используйте для санитизации данных перед сохранением в снапшоты:

```typescript
import { createMockable } from '@biorate/connector-mocks';

const connector = createMockable(new ClickhouseConnector(), {
  // Трансформация аргументов перед сохранением (например, для санитизации)
  transformArgs: (args, methodName) => {
    return args.map(arg => 
      typeof arg === 'string' ? arg.replace(/sensitive/g, '***') : arg
    );
  },
  
  // Трансформация результата перед сохранением
  transformResult: (result, methodName) => {
    return {
      ...result,
      _mocked: true,
      _timestamp: new Date().toISOString(),
    };
  },
});
```

### Custom Snapshot Store

```typescript
import { createMockable, MemorySnapshotStore } from '@biorate/connector-mocks';

// Использование in-memory хранилища для тестов
const connector = createMockable(new ClickhouseConnector(), {
  snapshotStore: new MemorySnapshotStore(),
});
```

### Работа с несколькими соединениями

```typescript
import { mockClickhouse } from '@biorate/connector-mocks';

const connector = mockClickhouse(ClickhouseConnector);

// Основное соединение
const mainConn = connector.get('main');
await mainConn.query({ query: 'SELECT 1' });

// Снапшот сохранится с ключом: ClickhouseConnector.get(main).query
```

## Структура снапшот файлов

```json
{
  "ClickhouseConnector.get.query": {
    "args": [
      {
        "query": "SELECT 1",
        "format": "JSON"
      }
    ],
    "result": {
      "data": [{ "result": 1 }]
    },
    "timestamp": "2026-05-28T10:00:00.000Z"
  },
  "ClickhouseConnector.get.insert": {
    "args": [
      {
        "table": "users",
        "values": [[1, "Alice"]]
      }
    ],
    "result": {
      "written_rows": 1
    },
    "timestamp": "2026-05-28T10:01:00.000Z"
  }
}
```

## API

### `createMockable(connector, options)`

Создаёт mockable обёртку для экземпляра коннектора.

**Параметры:**
- `connector` - Экземпляр коннектора
- `options` - Опции:
  - `mode` - Режим работы ('record' | 'replay' | 'passthrough')
  - `namespace` - Namespace для ключей снапшотов
  - `snapshotStore` - Кастомное хранилище снапшотов
  - `debug` - Включить логирование
  - `transformArgs` - Функция трансформации аргументов
  - `transformResult` - Функция трансформации результата

### `mockable(ConnectorClass, options)`

Создаёт mockable обёртку для класса коннектора.

### `mockClickhouse(ConnectorClass, options)`

Clickhouse-specific хелпер с FileSnapshotStore по умолчанию.

**Параметры:**
- `ConnectorClass` - Класс коннектора
- `options` - Опции:
  - `mode` - Режим работы
  - `namespace` - Namespace для снапшотов
  - `debug` - Логирование
  - `snapshotStore` - Кастомное хранилище

### `mockClickhouseInstance(instance, options)`

Создаёт mockable обёртку для экземпляра ClickhouseConnector.

### `mockClickhouseWith(ConnectorClass, options)`

Хелпер для выборочного мокирования методов Clickhouse:

```typescript
const connector = mockClickhouseWith(ClickhouseConnector, {
  methods: ['query', 'insert'], // Мокировать только эти методы
  debug: true,
});
```

### `FileSnapshotStore`

File-based хранилище снапшотов.

**Опции:**
- `snapshotsDir` - Директория для снапшотов (по умолчанию: `'__snapshots__'`)
- `fileExtension` - Расширение файлов (по умолчанию: `'.mocks.json'`)
- `indent` - Отступ JSON (по умолчанию: `2`)
- `sortKeys` - Сортировать ключи (по умолчанию: `true`)

### `MemorySnapshotStore`

In-memory хранилище для тестов.

### `detectMode()`

Утилита для определения текущего режима мокирования:

```typescript
import { detectMode } from '@biorate/connector-mocks';

const { mode, source, isDefault } = detectMode();
// mode: 'record' | 'replay' | 'passthrough'
// source: 'CONNECTOR_MOCK_MODE' | 'VITEST_MOCK_MODE' | ... | 'default'
```

## Расширение на другие коннекторы

Библиотека работает с любым коннектором, наследующим базовый класс `Connector`:

- ClickHouse
- Sequelize (PostgreSQL, MySQL, MariaDB)
- Redis (ioredis)
- MongoDB
- Kafka
- MinIO
- И другие

```typescript
import { createMockable, FileSnapshotStore } from '@biorate/connector-mocks';
import { RedisConnector } from '@biorate/redis';

// Использование с Redis коннектором
const connector = createMockable(new RedisConnector(), {
  snapshotStore: new FileSnapshotStore({
    snapshotsDir: '__snapshots__',
    fileExtension: '.mocks.json',
  }),
});

// Теперь все вызовы будут записываться/воспроизводиться
const redis = connector.get();
await redis.get('key');
```

## Рекомендации

### Рабочий процесс

1. **E2E тесты**: Запустите с `CONNECTOR_MOCK_MODE=record` для записи снапшотов
2. **Компонентные тесты**: Запустите с `CONNECTOR_MOCK_MODE=replay` для использования снапшотов
3. **Обновление снапшотов**: Удалите файлы `.mocks.json` и перепишите E2E тесты

### best practices

- Коммитьте файлы снапшотов в репозиторий как часть тестовой базы
- Используйте `transformArgs` для исключения чувствительных данных (пароли, токены)
- Для временных данных (даты, UUID) используйте `transformResult` для нормализации

## Лицензия

MIT

Copyright (c) 2026 Leonid Levkin (llevkin)

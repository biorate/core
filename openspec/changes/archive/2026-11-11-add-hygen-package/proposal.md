# Proposal

## Why

Монорепо `biorate/core` не имеет инструмента генерации кода по шаблонам: типовые артефакты (пакеты, миграции, конфиги) создаются вручную. Форк проверенного генератора [hygen](https://github.com/jondot/hygen) (v6.2.11, MIT) даёт генераторы, живущие в самом проекте: шаблоны хранятся в `_templates` и ревьюятся в тех же PR, что и код. Перенос в стандарт пакета монорепо делает инструмент поддерживаемым и публикуемым как `@biorate/hygen`.

## What Changes

- Новый пакет `packages/@biorate/hygen/`: исходный код upstream `src/` (ядро + `ops/`: add, inject, shell, echo, setup) и встроенные шаблоны `src/templates/`.
- Перенос тестов upstream (Jest → Vitest), **без** metaverse-тестов (хрупкие, тянут внешние репозитории).
- Перенос документации `hygen.io/docs/*.md` (11 страниц) в `packages/@biorate/hygen/docs/` в чистом markdown, ссылки переписаны на локальные.
- Рантайм-ошибки приведены к стандарту монорепо: классы на `BaseError` (`@biorate/errors: workspace:*`) вместо сырых `Error`.
- Пакет оформлен по конвенциям монорепо: корневой `index.ts`-шим, три прохода сборки (`dist/cjs|esm|types`), `exports`, точные версии зависимостей, `.npmignore`, `prepublishOnly`.
- CLI-бинарь `hygen` (поле `bin`) — публикация как глобально устанавливаемой команды; **допущение**, не оспоренное автором (см. design.md, «Открытые решения»).
- Не переносим: `dist/`, `lib/`, сайт docusaurus (`hygen.io/`), `media/`, standalone-сборку через `pkg`, benchmark `bin.timed`, CI upstream, `yarn.lock`.

## Capabilities

### New Capabilities

- `hygen-generator`: поведение пакета `@biorate/hygen` как генератора кода — резолвинг шаблонов (`_templates`, `HYGEN_TMPLS`), рендеринг EJS с frontmatter, операции add/inject/shell, промпты, CLI-интерфейс.

### Modified Capabilities

- (пусто — новых требований к существующим пакетам нет; `@biorate/errors` используется как есть)

## Impact

- **Новые файлы:** `packages/@biorate/hygen/**` (код, тесты, docs, конфиги сборки).
- **Зависимости:** 12 рантайм-deps upstream (`ejs`, `enquirer`, `chalk`, `yargs-parser`, `fs-extra`, `execa`, `front-matter`, `change-case`, `inflection`, `debug`, `ora`, `ignore-walk`) — точные версии; `@types/*` в devDeps.
- **Существующие пакеты:** не затрагиваются; `@biorate/errors` — новая входящая workspace-зависимость.
- **Риски:** EJS-шаблоны исполняют произвольный код шаблона (как в upstream, риск не усиливается); CLI в монорепо библиотечных пакетов — первый, проверять `files`/`bin`, чтобы в npm не попали `src/`, `tests/`, `docs/`.

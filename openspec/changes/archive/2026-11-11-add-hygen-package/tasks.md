# Tasks

## 1. Скелет пакета

- [x] 1.1 Создать `packages/@biorate/hygen/` с `package.json` по шаблону `@biorate/config` (main/module/types/exports, `bin: { hygen: './dist/cjs/bin.js' }`, `files: ['dist/**','README.md','LICENSE']`, скрипты clean/build:cjs/build:esm/build:types/build/prepublishOnly, postbuild через `.scripts/write-package-type.js` и `tsc-esm-fix`); проверить: `pnpm i` в корне линкует пакет в workspace
- [x] 1.2 Создать набор tsconfig (`tsconfig.json` strict + `tsconfig.build.json` + cjs/esm/types профили, корневой `index.ts`-шим `export * from './src'`) и `.npmignore`/`.gitignore` по образцу `@biorate/config`; проверить: пустая сборка `pnpm --filter @biorate/hygen run build` проходит без ошибок компиляции
- [x] 1.3 Указать зависимости: 12 рантайм-deps точными версиями (ejs, enquirer, chalk, yargs-parser, fs-extra, execa, front-matter, change-case, inflection, debug, ora, ignore-walk), `@biorate/errors: workspace:*`, `@types/*` в devDeps; проверить: `pnpm i` устанавливает без предупреждений о peer-конфликтах
- [x] 1.4 Скопировать `LICENSE` (MIT upstream-копирайт) и `CHANGELOG.md`; проверить: файлы присутствуют, лицензия указывает на оригинальный проект

## 2. Код

- [x] 2.1 Перенести ядро `src/` upstream (engine, render, params, prompt, config, config-resolver, context, help, logger, newline, execute, types, index; без `bin.timed.ts`) с правкой импортов под двойную сборку; проверить: `pnpm --filter @biorate/hygen run build` собирает три выхода
- [x] 2.2 Перенести `src/ops/` (add, inject, injector, shell, echo, setup, result, index) и `src/templates/` (встроенные шаблоны); проверить: сборка включает шаблоны в `dist`, `tsc -p tsconfig.build.types.json` без ошибок
- [x] 2.3 Создать `src/errors.ts` с классами на `BaseError` (`TemplateRenderError`, `InjectionTargetNotFoundError`, `ShellCommandError`, `TemplateNotFoundError`, `PromptError` — состав уточнить по местам `throw`) и заменить сырые `Error` по коду; проверить: grep по `src/` не находит `throw new Error\(`/`new TypeError\(` вне `errors.ts`
- [x] 2.4 Перенести `bin.ts` как CLI-точку (`dist/cjs/bin.js`), с shebang и без dist-относительных хаков upstream; проверить: `node packages/@biorate/hygen/dist/cjs/bin.js --help` выводит справку

## 3. Тесты (Jest → Vitest)

- [x] 3.1 Создать `tests/` и (при необходимости) локальный `vitest.config.ts` через `mergeConfig` корневого, по образцу `@biorate/migrations`; проверить: `pnpm --filter @biorate/hygen run test` запускает пустой набор
- [x] 3.2 Перенести юнит-спеки ядра (engine, render, params, config-resolver, newline, helpers) с заменами `jest.fn`→`vi.fn`, `jest.mock`→`vi.mock` и фикстурами в `tests/fixtures/`; проверить: перенесённые спеки зелёные
- [x] 3.3 Перенести спеки ops (add, inject, injector, shell) и CLI-спеки; metaverse-тесты не переносить; проверить: `pnpm --filter @biorate/hygen run test` — весь набор зелёный
- [x] 3.4 Убедиться, что тесты на тексты ошибок обновлены под классы `BaseError`; проверить: нет спеков, проверяющих `instanceof Error` от «сырых» классов

## 4. Документация

- [x] 4.1 Перенести 11 страниц `hygen.io/docs/*.md` в `packages/@biorate/hygen/docs/`, убрав docusaurus-frontmatter и переписав абсолютные ссылки `https://hygen.io/...` на относительные; проверить: ни одна ссылка в `docs/` не указывает на hygen.io, кроме явных упоминаний проекта
- [x] 4.2 Написать `README.md` пакета: назначение, quick-start (`hygen init self`, `hygen generator new`), пометка «форк jondot/hygen (MIT)», ссылка на `docs/`; проверить: команды из README выполняются в песочнице `/tmp/opencode`

## 5. Верификация

- [x] 5.1 Смоук-прогон CLI: в `/tmp/opencode/sandbox` выполнить `hygen init self` → `hygen generator new mygen` → `hygen mygen new`; проверить: создаются `_templates` и `app/hello.js`
- [x] 5.2 Смоук-прогон инъекции: шаблон с `inject: true` + `skip_if` на `package.json` песочницы — дважды; проверить: вставка одна, повтор пропущен
- [x] 5.3 `pnpm pack --dry-run` в пакете; проверить: в архив не попадают `src/`, `tests/`, `docs/`, конфиги
- [x] 5.4 Прогон по монорепо: `pnpm run build` и `pnpm run test` затронутых соседей (`@biorate/errors` и зависимые от него) — зелёные; форматирование пакета под корневой `.prettierrc`

## Workflow follow-up

- Прогнать `openspec validate` перед apply.
- Не коммитить и не публиковать без явного запроса автора (правила монорепо).
- Архивировать change после прохождения ревью автора.

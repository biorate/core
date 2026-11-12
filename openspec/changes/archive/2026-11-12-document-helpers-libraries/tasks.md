# Tasks

## Group 1 — Docs

- [x] 1.1 `docs/extensibility.md`: extend the helpers section with "External libraries as
      helpers" — lodash example (plain object), `@biorate/*` sibling-package example,
      function form with lazy resolution + friendly missing-library error, installation
      requirement note.
- [x] 1.2 `docs/faq.md`: entry "Can I use lodash / other libraries in templates?" — yes,
      via `helpers` in the project config file, link to extensibility.
- [x] 1.3 Verification: prettier clean on touched files, relative links resolve,
      `openspec validate document-helpers-libraries`; code untouched (`git status` shows
      only the two docs files + change artifacts).

## Group 2 — Finalize

- [x] 2.1 Check `openspec status` all done; present summary (commit/archive on explicit
      user command only).

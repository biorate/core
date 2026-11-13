> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).

# IntelliJ IDEA plugin

Hygen templates (`.t` files) are plain text, so by default your IDE treats them as
unmodelled files. The [biorate/idea-hygen-plugin](https://github.com/biorate/idea-hygen-plugin)
adds syntax highlighting, validation, completion and host-language injection for
`@biorate/hygen` templates.

## What the plugin provides

- **Template recognition** — a dedicated file type for hygen templates. The set of
  filename patterns is configurable (default `*.t`, with presets `*.ejs.t`, `*.tmpl` and
  custom globs available); changes apply live, without restarting the IDE.
- **Syntax highlighting** — YAML frontmatter (the `--- … ---` block) and EJS tags in the
  template body, with configurable colors (a colors settings page plus a preview scheme).
- **Host-language injection** — the template body gets highlighting and analysis for the
  target language (JS/TS etc.), determined from the extension in the `to:` frontmatter
  value (including when the path contains EJS interpolations).
- **JavaScript injection into EJS "islands"** — code inside `<% … %>`, `<%= … %>` and
  their trim variants gets full JS support: highlighting, error analysis and completion.
  References resolve through synthetic declarations (no false "unknown symbol"): `h`,
  template context variables, and helpers from the project hygen config
  (`.hygen.js`/`.hygen.cjs`/`.hygen.mjs`/`.hygen.ts`). All EJS islands of a template are
  analyzed as a single JavaScript document, so braces or declarations spanning islands no
  longer raise false errors (and declarations from earlier islands are visible in later ones).
- **Structural inspections**:
  - _Unknown frontmatter key_ (warning) — an unknown frontmatter key against the
    `@biorate/hygen` fork's key set: `to`, `inject`, `sh`, `before`, `after`, `prepend`,
    `append`, `at_line`, `skip_if`, `skip_if_not`, `create_if_missing`, `replace`,
    `unless_exists`, `local`, `setup`, `force`, `message`, `echo`, `spinner`,
    `sh_ignore_exit`, `mode`, `verbose`, `from`, `eof_last`, `mirror`;
  - _Unterminated frontmatter block_ / _Unterminated EJS tag_ (error);
  - _Mutually exclusive inject and replace_ (error);
  - _Anchor option without inject mode_ (warning) — anchor options (`before`, `after`,
    `prepend`, `append`, `at_line`) without `inject` mode;
  - _EJS tags in hook file_ (warning) — `prompt.js`/`index.js`/`prompt.ts`/`index.ts`,
    where the engine does not process them;
  - _Setup value without owner/repo_ (warning) — a `setup:` value without the
    `owner/repo` reference shape the engine expects (it throws `SetupRepositoryError`);
  - _From file not found_ (warning) — a `from:` value whose file does not exist relative
    to the nearest `_templates` directory (silent when no `_templates` is found).
- **Completion** — frontmatter keys with descriptions of the fork's semantics; members of
  the `h` object (`h.changeCase.*` — 40 methods, `h.inflection.*` — 16 methods, plus
  `h.capitalize`, `h.path` and others); template context variables, including the engine
  spec-variables `ts` (run timestamp) and `_` (positional CLI arguments). That is 25
  frontmatter keys and 56 `h` members in total.
- **Template context** — the plugin understands which variables are available in a
  template: engine defaults (`name`, `Name`, `names`, `Names`, plus the spec-variables
  `ts` and `_`), `localsDefaults` from the project hygen config, variables requested in
  prompt hooks, and variables declared in the template itself.

## Requirements

- IntelliJ IDEA **2024.3+** (`since-build 243`).
  - Basic features (highlighting, inspections, frontmatter completion) work in
    **Community Edition**.
  - JavaScript/TypeScript injection (into the template body and EJS islands) requires
    **IDEA Ultimate** — it relies on the JavaScript plugin.
- The plugin is built from source: it is **not yet published on the Marketplace**.

## Installation

Build the plugin:

```bash
./gradlew buildPlugin
```

The artifact appears in `build/distributions/idea-hygen-plugin-<version>.zip`. In the IDE
choose **Settings → Plugins → ⚙ → Install Plugin from Disk…** and pick the zip.
Alternatively, unpack the zip and copy the plugin directory into the IDE's plugins folder,
then restart the IDE.

## Configuration

**Settings → Tools → Hygen Templates**:

- An editable list of filename patterns for hygen templates, with presets `*.t` (default),
  `*.ejs.t`, `*.tmpl`, plus any custom patterns; input is validated and changes apply
  immediately, without restarting the IDE.
- Files inside `_templates/**` (within an action folder) are **all** considered templates,
  except `prompt.js` / `index.js` / `prompt.ts` / `index.ts` — those stay ordinary JS/TS
  files (hook files). This matches the engine's own behavior.
- The default pattern `*.t` claims the `.t` extension IDE-wide — if you have other `.t`
  files, narrow the pattern list.

## Links

- Plugin repository: [biorate/idea-hygen-plugin](https://github.com/biorate/idea-hygen-plugin)

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).

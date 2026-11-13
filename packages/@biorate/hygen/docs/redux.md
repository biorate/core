> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).
>
> Based on: [Upstream Redux (ducks) example](https://github.com/jondot/hygen/blob/master/docs/redux.md)

# Redux (ducks) example

Redux is the poster child of `hygen`. No matter the granularity you select for your Redux
architecture, you still end up with a lot of boilerplate.

A typical [ducks](https://github.com/erikras/ducks-modular-redux) architecture:

```bash
app/
  components/
    icon.js
    avatar.js
  modules/
    boot.js      <-- glues modules together: requires chat, app, and auth.
    app/
      index.js
      view.js
      state.js
    auth/
      index.js
      view.js
      state.js
```

Adding a module means adding a folder, the `index`/`view`/`state` files, and wiring the
`reducer`, exported `actions` and more into `boot.js`.

The generator layout:

```bash
_templates/
  module/
    new/
      index.ejs.t
      view.ejs.t
      state.ejs.t
      inject_boot.ejs.t   <-- adds a 'require' clause to boot.js
```

Here's `index`:

```javascript
---
to: app/modules/<%= name %>/index.js
---
//
// requires, mappings, etc....
//
export default connect(...)(<%= Name %>)
```

A similar trick applies to `view` and `state`.

Now add a `require` line to `boot.js`, which looks like this:

```javascript
// ... some bootstrapping code ...

const modules = [require('auth').default, require('app').default];

// ... rest of bootstrapping code ...
```

Let's build `inject_boot.ejs.t`. We use `inject: true`, and locate our injected line after
`const modules =[`:

```javascript
---
to: app/modules/boot.js
inject: true
skip_if: <%= name %>
after: "const modules = ["
---
require('./<%= name %>').default,
```

Anchoring `after` to `"const modules = ["` (a regex) locates the array opening. The
`skip_if: <%= name %>` guard keeps the module from being required more than once for the
same `name`.

After running it:

```javascript
// ... some bootstrapping code ...

const modules = [
  require('chat').default,
  require('auth').default,
  require('app').default,
];

// ... rest of bootstrapping code ...
```

Generate a new module with:

```bash
hygen module new settings
```

If the `before`/`after` anchor does not match `boot.js`, this fork raises
`InjectionAnchorNotFoundError` and leaves the file untouched — see
[Injection](./templates#injection) and [Errors](./faq#errors-and-troubleshooting).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).

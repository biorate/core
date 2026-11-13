> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).
>
> Based on: [Upstream Express.js example](https://github.com/jondot/hygen/blob/master/docs/express.md)

# Express.js example

[Express.js](https://expressjs.com/) is arguably the most popular web framework for Node.js.
A typical app structure celebrates `routes` and `handlers`; views and data are left for
interpretation (probably because of the rise of microservices and client-side apps).

An app structure may look like this:

```
app/
  routes.js
  handlers/
    health.js
    shazam.js
```

While `routes.js` glues everything together:

```javascript
// ... some code ...
const health = require('./handlers/health');
const shazam = require('./handlers/shazam');
app.get('/health', health);
app.post('/shazam', shazam);

module.exports = app;
```

Unlike React Native, you can load modules dynamically here. There is still a need for
judgement when constructing the routes (`app.get/post` part).

Using `hygen`, build this with a generator:

```bash
hygen route new --method post auth
```

The interesting part is the injection. Let's say the generator is structured as:

```
_templates/
  route/
    new/
      handler.ejs.t
      inject_handler.ejs.t
```

`inject_handler` looks like this:

```yaml
---
inject: true
to: app/routes.js
skip_if: <%= name %>
before: 'module.exports = app'
---
app.<%= method %>('/<%= name %>', <%= name %>)
```

We anchor this inject to `before: "module.exports = app"`: instead of appending content to
a given line, we prepend (insert before) it. The `skip_if: <%= name %>` guard keeps the
route from being registered twice.

If `before`/`after` does not match the file, the injection raises
`InjectionAnchorNotFoundError` and the run fails (`success: false`, file untouched) — this
fork does not silently no-op. See [Injection](./templates#injection) and
[Errors](./faq#errors-and-troubleshooting).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).

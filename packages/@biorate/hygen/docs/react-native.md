> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream React Native example](https://github.com/jondot/hygen/blob/master/docs/react-native.md)

# React Native example

The [Redux use case](./redux) is more than suitable for React Native, but React Native has
one unique (and arguably limiting) property: you cannot `require` anything dynamically.

So all of the fancy glob-and-require glue code can't be done:

```javascript
// this can't be done
each((m) => require(m), glob('modules/**/state'));
```

This means more manual work and bookkeeping — which `hygen` helps maintain.

## Injecting with `hygen`

If every module, component or file you add is generated with `hygen`, you can maintain
these dependencies centrally:

```bash
_templates/
   component/
     new/
       component.ejs.t
       inject_component.ejs.t   <-- let's look at this
```

And here's how `inject_component` looks:

```javascript
---
inject: true
to: app/globs/all-components.js
skip_if: <%= name %>
after: "const components = ["
---
<%= Name %>: require('../components/<%= name %>').default,
```

This assumes a central file in `globs/all-components.js` glues all components into one
re-exportable module:

```javascript
const components = {
  Avatar: require('../components/avatar').default,
  Icon: require('../components/icon').default,
};
export default components;
```

Running:

```bash
hygen component new --name intro
```

builds:

```javascript
const components = {
  Avatar: require('../components/avatar').default,
  Icon: require('../components/icon').default,
  Intro: require('../components/intro').default,
};
export default components;
```

Then import the new component anywhere:

```javascript
import { Intro } from 'app/globs/all-components';
```

The `after` anchor (`"const components = ["`, a regex) locates the insertion point; the
`skip_if: <%= name %>` guard prevents a component from being registered twice. If the anchor
does not match, this fork raises `InjectionAnchorNotFoundError`, the run fails
(`success: false`) and the file is left untouched — see
[Injection](./templates#injection) and [Errors](./faq#errors-and-troubleshooting).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).

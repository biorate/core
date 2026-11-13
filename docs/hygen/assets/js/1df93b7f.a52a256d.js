'use strict';
(self.webpackChunkhygen_docs_site = self.webpackChunkhygen_docs_site || []).push([
  [583],
  {
    1010(e, n, t) {
      t.r(n), t.d(n, { default: () => G });
      t(2503);
      var s = t(1953),
        i = t(4740),
        r = t(2861),
        a = [
          {
            name: 'Boosty',
            url: 'https://boosty.to/llevkin',
            description: 'Support the project on Boosty',
          },
        ];
      const o = 'hero_syme',
        c = 'heroInner_VWeJ',
        l = 'heroTitle_ohkl',
        d = 'heroSubtitle_GKHc',
        h = 'heroButtons_gdhS',
        p = 'section_rC2D',
        m = 'sectionTitle_czhA',
        u = 'sectionSubtitle_miqL',
        g = 'featureGrid_g0sL',
        f = 'featureCard_PiI4',
        j = 'panel_fODc',
        x = 'differencesList_gv4v',
        b = 'inlineCode_Ratb',
        y = 'linkRow_IKgP',
        v = 'supportCard_XY4F',
        k = 'note_q9Cc';
      var N = t(159),
        w = 'https://github.com/jondot/hygen',
        _ = [
          {
            title: 'Glob batch actions',
            href: '/docs/glob-batch',
            body: 'Scaffold a whole directory tree from a single template with a `glob:` pattern, `base:`/`stripExtensions:` path shaping and per-match `skipIfExists`.',
          },
          {
            title: 'Content transforms',
            href: '/docs/content-transforms',
            body: 'Post-process the rendered output before it is written or injected with a named `transforms:` namespace in the config file \u2014 prettier is the canonical use.',
          },
          {
            title: 'Conditional skip',
            href: '/docs/conditional-skip',
            body: 'A template can decide at render time whether it runs: `skip:` (EJS-rendered) skips the action when truthy, reported as a skipped status, not a failure.',
          },
          {
            title: 'Interactive picker',
            href: '/docs/interactive-picker',
            body: 'Run `hygen` with no arguments and pick a generator then an action from a two-level terminal picker; forced off in non-TTY environments.',
          },
        ],
        A = [
          'Identity escaping \u2014 `<%= %>` does not HTML-escape (the EJS `escape` option is the identity), because the tool generates code, not HTML.',
          '`--version` flag \u2014 `hygen --version` / `hygen -v` prints `Hygen v<version>` and exits.',
          'Anchor-not-found error \u2014 a missing `inject` anchor fails with `InjectionAnchorNotFoundError` instead of silently no-oping.',
          'New inject options \u2014 `create_if_missing: true`, `replace: true`, and `skip_if_not: true`.',
          'Composition \u2014 action and name positionals accept comma lists; `mirror: true` writes to the path mirroring its template location.',
          '`--name` flag removed (breaking) \u2014 use the positional name; two legacy escapes (`HYGEN_LEGACY_NAME`, `legacyNameFlag`) restore the old behavior.',
          'Glob batch actions, named content transforms, conditional action skipping and an interactive generator/action picker.',
          'Error classes \u2014 `BaseError`-derived classes (`src/errors.ts`) instead of raw `Error`.',
          'Strict TypeScript / Vitest \u2014 authored in strict TypeScript, tests migrated to Vitest.',
        ];
      function S() {
        return (0, N.jsx)('header', {
          className: o,
          children: (0, N.jsxs)('div', {
            className: c,
            children: [
              (0, N.jsx)('h1', { className: l, children: '@biorate/hygen' }),
              (0, N.jsxs)('p', {
                className: d,
                children: [
                  'The scalable code generator that lives in your project \u2014 a fork of',
                  ' ',
                  (0, N.jsx)('a', { href: w, children: 'jondot/hygen' }),
                  ' (v6.2.11, MIT) adapted to the @biorate/* monorepo conventions.',
                ],
              }),
              (0, N.jsxs)('div', {
                className: h,
                children: [
                  (0, N.jsx)(i.A, {
                    className: 'button button--primary button--lg',
                    to: '/docs/quick-start',
                    children: 'Get Started',
                  }),
                  (0, N.jsx)(i.A, {
                    className: 'button button--secondary button--lg',
                    href: 'https://www.npmjs.com/package/@biorate/hygen',
                    children: 'npm',
                  }),
                ],
              }),
            ],
          }),
        });
      }
      function E() {
        return (0, N.jsxs)('section', {
          className: p,
          children: [
            (0, N.jsx)('h2', { className: m, children: 'Usage examples' }),
            (0, N.jsxs)('p', {
              className: u,
              children: [
                'The same command line you already know, extended with fork-native features: glob batch actions, content transforms, conditional',
                (0, N.jsx)('span', { className: b, children: ' skip:' }),
                ' and the interactive picker.',
              ],
            }),
            (0, N.jsxs)('div', {
              className: j,
              children: [
                (0, N.jsx)('h3', {
                  children: 'Glob batch \u2014 one action, a whole directory',
                }),
                (0, N.jsx)(r.A, {
                  language: 'yaml',
                  children:
                    "# _templates/module/new/spec.ejs.t\n---\nglob: module/**/*\nto: src/<%= name %>/\nbase: module\nstripExtensions: ['.t']\n---\n# The glob template itself writes nothing; every match becomes its own file.\n",
                }),
                (0, N.jsx)(r.A, {
                  language: 'bash',
                  children:
                    'hygen module new billing\n#       added: src/billing/service.ts\n#       added: src/billing/index.ts',
                }),
              ],
            }),
            (0, N.jsxs)('div', {
              className: j,
              children: [
                (0, N.jsx)('h3', {
                  children: 'Content transforms \u2014 post-process before writing',
                }),
                (0, N.jsx)(r.A, {
                  language: 'javascript',
                  children:
                    "// .hygen.js\nconst prettier = require('prettier');\nmodule.exports = {\n  transforms: {\n    prettier: (content, locals) => prettier.format(content, { parser: 'typescript' }),\n  },\n};",
                }),
                (0, N.jsx)(r.A, {
                  language: 'yaml',
                  children:
                    '---\nto: src/gen/<%= name %>.ts\ntransform: trim | prettier\n---\nexport const <%= name %> = <%- value %>;',
                }),
              ],
            }),
            (0, N.jsxs)('div', {
              className: j,
              children: [
                (0, N.jsx)('h3', {
                  children: 'Conditional skip \u2014 decide at render time',
                }),
                (0, N.jsx)(r.A, {
                  language: 'yaml',
                  children:
                    "---\nto: tests/<%= name %>.spec.ts\nskip: <%= wantTests ? 'false' : 'no tests requested' %>\n---\ndescribe('<%= name %>', () => { /* ... */ });",
                }),
              ],
            }),
            (0, N.jsxs)('div', {
              className: j,
              children: [
                (0, N.jsx)('h3', {
                  children: 'Interactive picker \u2014 no arguments, pick it live',
                }),
                (0, N.jsx)(r.A, {
                  language: 'bash',
                  children:
                    'hygen\n# ? Select a generator  (Use arrow keys)\n#   1) mailer\n#   2) module\n# ? Select an action\n#   1) new\n# runs exactly as if you had typed: hygen <generator> <action>',
                }),
              ],
            }),
          ],
        });
      }
      function I() {
        return (0, N.jsxs)('section', {
          className: p,
          children: [
            (0, N.jsx)('h2', { className: m, children: 'Fork features' }),
            (0, N.jsx)('div', {
              className: g,
              children: _.map(function (e) {
                return (0,
                N.jsxs)('div', { className: f, children: [(0, N.jsx)('h3', { children: (0, N.jsx)(i.A, { to: e.href, children: e.title }) }), (0, N.jsx)('p', { children: e.body })] }, e.title);
              }),
            }),
          ],
        });
      }
      function C() {
        return (0, N.jsxs)('section', {
          className: p,
          children: [
            (0, N.jsx)('h2', {
              id: 'differences-from-upstream',
              className: m,
              children: 'Differences from upstream',
            }),
            (0, N.jsxs)('p', {
              className: u,
              children: [
                (0, N.jsx)('code', { children: '@biorate/hygen' }),
                ' is a fork of ',
                (0, N.jsx)('a', { href: w, children: 'jondot/hygen' }),
                ' ',
                '(v6.2.11, MIT). Here is how it differs from upstream.',
              ],
            }),
            (0, N.jsxs)('div', {
              className: j,
              children: [
                (0, N.jsx)('ul', {
                  className: x,
                  children: A.map(function (e) {
                    return (0, N.jsx)('li', { children: e }, e);
                  }),
                }),
                (0, N.jsxs)('div', {
                  className: y,
                  children: [
                    (0, N.jsx)(i.A, {
                      className: 'button button--outline button--secondary',
                      to: '/docs/faq',
                      children: 'Read the FAQ',
                    }),
                    (0, N.jsx)(i.A, {
                      className: 'button button--outline button--secondary',
                      to: '/docs/quick-start',
                      children: 'Get started',
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }
      function T() {
        return (0, N.jsxs)('section', {
          className: p,
          children: [
            (0, N.jsx)('h2', { className: m, children: 'Ecosystem & tools' }),
            (0, N.jsxs)('p', {
              className: u,
              children: [
                'Share generators as packages, turn existing code into a generator, ship a standalone binary \u2014 and edit ',
                (0, N.jsx)('code', { children: '.t' }),
                ' templates in IntelliJ IDEA.',
              ],
            }),
            (0, N.jsxs)('div', {
              className: g,
              children: [
                (0, N.jsxs)('div', {
                  className: f,
                  children: [
                    (0, N.jsx)('h3', { children: 'Packages' }),
                    (0, N.jsxs)('p', {
                      children: [
                        'Publish compiled generators as versioned npm packages and consume them with',
                        ' ',
                        (0, N.jsx)('code', { children: 'hygen-add' }),
                        '.',
                      ],
                    }),
                    (0, N.jsx)(i.A, {
                      to: '/docs/packages',
                      children: 'Packages guide \u2192',
                    }),
                  ],
                }),
                (0, N.jsxs)('div', {
                  className: f,
                  children: [
                    (0, N.jsx)('h3', { children: 'IntelliJ IDEA plugin' }),
                    (0, N.jsxs)('p', {
                      children: [
                        'The ',
                        (0, N.jsx)('a', {
                          href: 'https://github.com/biorate/idea-hygen-plugin',
                          children: 'biorate/idea-hygen-plugin',
                        }),
                        ' provides file type recognition for ',
                        (0, N.jsx)('code', { children: '.t' }),
                        ' templates, syntax highlighting of frontmatter and EJS tags, host-language injection, completion of frontmatter keys /',
                        ' ',
                        (0, N.jsx)('code', { children: 'h' }),
                        ' helpers / context variables and more. Requires IDEA 2024.3+ (Community vs Ultimate capabilities differ).',
                      ],
                    }),
                    (0, N.jsx)(i.A, {
                      to: '/docs/ide-plugin',
                      children: 'Plugin docs \u2192',
                    }),
                  ],
                }),
                (0, N.jsxs)('div', {
                  className: f,
                  children: [
                    (0, N.jsx)('h3', { children: 'Create & standalone' }),
                    (0, N.jsxs)('p', {
                      children: [
                        'Wrap existing code with ',
                        (0, N.jsx)('code', { children: 'hygen-create' }),
                        ', or ship a self-contained binary with the standalone distribution.',
                      ],
                    }),
                    (0, N.jsx)(i.A, {
                      to: '/docs/create',
                      children: 'Create guide \u2192',
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }
      function q() {
        return (0, N.jsxs)('section', {
          className: p,
          children: [
            (0, N.jsx)('h2', { className: m, children: 'Support' }),
            (0, N.jsx)('p', {
              className: u,
              children:
                "If @biorate/hygen is useful to you, consider supporting the fork's maintainers. Picking a platform below is the quickest way to help the project keep moving.",
            }),
            (0, N.jsx)('div', {
              className: y,
              children: a.map(function (e) {
                return (0,
                N.jsx)('a', { className: v, href: e.url, target: '_blank', rel: 'noopener noreferrer', children: e.name }, e.name);
              }),
            }),
            (0, N.jsxs)('p', {
              className: k,
              children: [
                'Donation platform URLs are configured in ',
                (0, N.jsx)('code', { children: 'src/data/donations.ts' }),
                '.',
                ' ',
                'Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.',
              ],
            }),
          ],
        });
      }
      function G() {
        return (0, N.jsxs)(s.A, {
          title: '@biorate/hygen',
          description:
            'The scalable code generator that lives in your project \u2014 a fork of jondot/hygen with glob batch actions, content transforms, conditional skip and an interactive picker.',
          children: [
            (0, N.jsx)(S, {}),
            (0, N.jsxs)('main', {
              children: [
                (0, N.jsx)(E, {}),
                (0, N.jsx)(I, {}),
                (0, N.jsx)(C, {}),
                (0, N.jsx)(T, {}),
                (0, N.jsx)(q, {}),
              ],
            }),
          ],
        });
      }
    },
  },
]);

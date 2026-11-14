'use strict';
(self.webpackChunkhygen_docs_site = self.webpackChunkhygen_docs_site || []).push([
  [879],
  {
    5779(e, n, r) {
      r.r(n),
        r.d(n, {
          assets: () => l,
          contentTitle: () => c,
          default: () => h,
          frontMatter: () => o,
          metadata: () => s,
          toc: () => d,
        });
      const s = JSON.parse(
        '{"id":"extensibility","title":"extensibility","description":"Part of @biorate/hygen \u2014 a fork of jondot/hygen (v6.2.11, MIT), adapted to the @biorate/* monorepo. Rewritten for this fork\'s semantics; see Differences from upstream.","source":"@site/../docs/extensibility.md","sourceDirName":".","slug":"/extensibility","permalink":"/core/hygen/docs/extensibility","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"docs","previous":{"title":"interactive-picker","permalink":"/core/hygen/docs/interactive-picker"},"next":{"title":"faq","permalink":"/core/hygen/docs/faq"}}',
      );
      var i = r(159),
        t = r(8758);
      const o = {},
        c = 'Extensibility',
        l = {},
        d = [
          { value: 'Project config file', id: 'project-config-file', level: 2 },
          { value: 'File names and priority', id: 'file-names-and-priority', level: 3 },
          { value: 'Nearest directory wins', id: 'nearest-directory-wins', level: 3 },
          { value: 'Module systems', id: 'module-systems', level: 3 },
          { value: 'TypeScript', id: 'typescript', level: 3 },
          { value: 'Backward compatibility', id: 'backward-compatibility', level: 3 },
          { value: 'Project lifecycle hooks', id: 'project-lifecycle-hooks', level: 3 },
          {
            value: 'Action hooks and lifecycle',
            id: 'action-hooks-and-lifecycle',
            level: 2,
          },
          { value: 'Where action hooks live', id: 'where-action-hooks-live', level: 3 },
          { value: 'The hooks class', id: 'the-hooks-class', level: 3 },
          { value: 'The prompt section', id: 'the-prompt-section', level: 3 },
          {
            value: 'Declarative parameters (<code>params</code>)',
            id: 'declarative-parameters-params',
            level: 3,
          },
          {
            value: 'Flag-key normalization (<code>argCase</code>)',
            id: 'flag-key-normalization-argcase',
            level: 3,
          },
          { value: 'Ordering and composition', id: 'ordering-and-composition', level: 3 },
          { value: 'Failure semantics', id: 'failure-semantics', level: 3 },
          { value: 'Dry mode', id: 'dry-mode', level: 3 },
          { value: 'Helpers', id: 'helpers', level: 2 },
          {
            value: 'External libraries as helpers',
            id: 'external-libraries-as-helpers',
            level: 3,
          },
          {
            value: 'Lodash (plain object form)',
            id: 'lodash-plain-object-form',
            level: 4,
          },
          {
            value: 'Sibling <code>@biorate/*</code> package (monorepo usage)',
            id: 'sibling-biorate-package-monorepo-usage',
            level: 4,
          },
          {
            value: 'Function form (lazy resolution with a friendly error)',
            id: 'function-form-lazy-resolution-with-a-friendly-error',
            level: 4,
          },
          { value: 'Content transforms', id: 'content-transforms', level: 2 },
          {
            value: 'Customizing logger, template location and shell executor',
            id: 'customizing-logger-template-location-and-shell-executor',
            level: 2,
          },
          {
            value: 'Embeddable <code>runner()</code> API',
            id: 'embeddable-runner-api',
            level: 2,
          },
          { value: 'Attribution', id: 'attribution', level: 2 },
        ];
      function a(e) {
        const n = {
          a: 'a',
          blockquote: 'blockquote',
          code: 'code',
          em: 'em',
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          header: 'header',
          li: 'li',
          ol: 'ol',
          p: 'p',
          pre: 'pre',
          strong: 'strong',
          table: 'table',
          tbody: 'tbody',
          td: 'td',
          th: 'th',
          thead: 'thead',
          tr: 'tr',
          ul: 'ul',
          ...(0, t.R)(),
          ...e.components,
        };
        return (0, i.jsxs)(i.Fragment, {
          children: [
            (0, i.jsxs)(n.blockquote, {
              children: [
                '\n',
                (0, i.jsxs)(n.p, {
                  children: [
                    'Part of ',
                    (0, i.jsx)(n.strong, { children: '@biorate/hygen' }),
                    ' \u2014 a fork of ',
                    (0, i.jsx)(n.a, {
                      href: 'https://github.com/jondot/hygen',
                      children: 'jondot/hygen',
                    }),
                    ' (v6.2.11, MIT), adapted to the ',
                    (0, i.jsx)(n.code, { children: '@biorate/*' }),
                    " monorepo. Rewritten for this fork's semantics; see ",
                    (0, i.jsx)(n.a, { href: '/', children: 'Differences from upstream' }),
                    '.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.p, {
                  children: [
                    'Based on: ',
                    (0, i.jsx)(n.a, {
                      href: 'https://github.com/jondot/hygen/blob/master/docs/extensibility.md',
                      children: 'Upstream extensibility',
                    }),
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsx)(n.header, {
              children: (0, i.jsx)(n.h1, {
                id: 'extensibility',
                children: 'Extensibility',
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: 'hygen' }),
                ' is extensible via a project config file (helpers, logger, template location, shell\nexecutor) and, programmatically, via the embeddable ',
                (0, i.jsx)(n.code, { children: 'runner()' }),
                ' API.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h2, {
              id: 'project-config-file',
              children: 'Project config file',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: 'hygen' }),
                ' looks for a config file by walking up the directory tree from where you run\n',
                (0, i.jsx)(n.code, { children: 'hygen' }),
                ', stopping at the first directory that contains any candidate file.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'file-names-and-priority',
              children: 'File names and priority',
            }),
            '\n',
            (0, i.jsx)(n.p, {
              children:
                'The runner checks the candidates in each directory in this order:',
            }),
            '\n',
            (0, i.jsxs)(n.table, {
              children: [
                (0, i.jsx)(n.thead, {
                  children: (0, i.jsxs)(n.tr, {
                    children: [
                      (0, i.jsx)(n.th, { children: 'Priority' }),
                      (0, i.jsx)(n.th, { children: 'File name' }),
                      (0, i.jsx)(n.th, { children: 'Notes' }),
                    ],
                  }),
                }),
                (0, i.jsxs)(n.tbody, {
                  children: [
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '1' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: '.hygen.js' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            "Follows the host project's ",
                            (0, i.jsx)(n.code, { children: 'type' }),
                            ' field',
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '2' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: '.hygen.cjs' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Explicit CommonJS' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '3' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: '.hygen.mjs' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Explicit ESM' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '4' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: '.hygen.ts' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: 'TypeScript, transpiled on the fly',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'nearest-directory-wins',
              children: 'Nearest directory wins',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The walk goes from the current directory up to the filesystem root, and the first directory\ncontaining ',
                (0, i.jsx)(n.strong, { children: 'any' }),
                ' candidate is used; within that directory, the priority order decides\nbetween candidates. This means:',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.ul, {
              children: [
                '\n',
                (0, i.jsx)(n.li, {
                  children: 'You can set up a single file per project.',
                }),
                '\n',
                (0, i.jsx)(n.li, {
                  children: 'Sub-projects can override behavior with their own file.',
                }),
                '\n',
                (0, i.jsx)(n.li, {
                  children: 'You can drop one in your directory for a global default.',
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'When candidates exist in several directories on the way up, only the nearest one is loaded\nand the rest are ignored \u2014 for example a ',
                (0, i.jsx)(n.code, { children: '.hygen.cjs' }),
                ' in a subdirectory beats a ',
                (0, i.jsx)(n.code, { children: '.hygen.js' }),
                '\nhigher up.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, { id: 'module-systems', children: 'Module systems' }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The resolved file is loaded with a dynamic ',
                (0, i.jsx)(n.code, { children: 'import()' }),
                ', so module-system semantics follow\nthe file extension for the explicit formats:',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.ul, {
              children: [
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.code, { children: '.hygen.cjs' }),
                    ' is CommonJS (',
                    (0, i.jsx)(n.code, { children: 'module.exports' }),
                    ').',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.code, { children: '.hygen.mjs' }),
                    ' is ESM (',
                    (0, i.jsx)(n.code, { children: 'export default' }),
                    ' / named ',
                    (0, i.jsx)(n.code, { children: 'export' }),
                    ').',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    'A plain ',
                    (0, i.jsx)(n.code, { children: '.hygen.js' }),
                    ' follows the ',
                    (0, i.jsx)(n.strong, { children: "host project's" }),
                    ' module system \u2014 the nearest\n',
                    (0, i.jsx)(n.code, { children: 'package.json' }),
                    ' ',
                    (0, i.jsx)(n.code, { children: 'type' }),
                    ' field. In a ',
                    (0, i.jsx)(n.code, { children: '"type": "module"' }),
                    ' project a ',
                    (0, i.jsx)(n.code, { children: '.hygen.js' }),
                    ' written with\n',
                    (0, i.jsx)(n.code, { children: 'module.exports' }),
                    ' will fail, so use ',
                    (0, i.jsx)(n.code, { children: '.hygen.cjs' }),
                    ' there instead.',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                "These explicit formats work independently of the host project's ",
                (0, i.jsx)(n.code, { children: 'type' }),
                ' field.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, { id: 'typescript', children: 'TypeScript' }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: '.hygen.ts' }),
                ' files are transpiled on the fly: the runner lazily registers\n',
                (0, i.jsx)(n.code, { children: 'ts-node/register/transpile-only' }),
                ' on first use, so ',
                (0, i.jsx)(n.code, { children: 'ts-node' }),
                ' must be available (install it\nwith ',
                (0, i.jsx)(n.code, { children: 'npm i -D ts-node' }),
                ' if it is not already a dependency).',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'backward-compatibility',
              children: 'Backward compatibility',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Projects with an existing ',
                (0, i.jsx)(n.code, { children: '.hygen.js' }),
                ' keep resolving exactly as before \u2014 it remains the\nhighest priority candidate.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'project-lifecycle-hooks',
              children: 'Project lifecycle hooks',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The config file may declare an optional ',
                (0, i.jsx)(n.code, { children: 'hooks' }),
                ' field: a ',
                (0, i.jsx)(n.strong, { children: 'plain object' }),
                ' with the four\nlifecycle methods ',
                (0, i.jsx)(n.code, { children: 'beforeAll' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'beforeEach' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'afterEach' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'afterAll' }),
                '. Project hooks apply\nto ',
                (0, i.jsx)(n.strong, { children: 'every' }),
                ' generator run, wrapping whatever the action-level hooks do (see\n',
                (0, i.jsx)(n.a, {
                  href: '#ordering-and-composition',
                  children: 'Ordering and composition',
                }),
                '):',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "// .hygen.js\nmodule.exports = {\n  helpers: {/* ... */},\n  hooks: {\n    async beforeAll(ctx) {\n      ctx.logger.log(`run starting in ${ctx.cwd}`);\n    },\n    async beforeEach(ctx) {\n      // runs before each (name, action) pair's prompt phase\n    },\n    async afterEach(ctx, results) {\n      // results is the pair's ActionResult[]\n    },\n    async afterAll(ctx, results) {\n      // results accumulates all pair results of the run\n    },\n  },\n};\n",
              }),
            }),
            '\n',
            (0, i.jsx)(n.p, { children: 'Key points:' }),
            '\n',
            (0, i.jsxs)(n.ul, {
              children: [
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'Plain object, not a class.' }),
                    ' Unlike action hooks (a class, see\n',
                    (0, i.jsx)(n.a, {
                      href: '#the-hooks-class',
                      children: 'The hooks class',
                    }),
                    '), the project-level ',
                    (0, i.jsx)(n.code, { children: 'hooks' }),
                    ' is a plain object with\nthe same four methods \u2014 there is no ',
                    (0, i.jsx)(n.code, { children: 'prompt' }),
                    ' section at this level.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'State via closure.' }),
                    " Since the object is plain, any cross-run or cross-pair state must\nlive in the config module's closure (a variable captured by the hook methods).",
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'Lenient validation.' }),
                    ' Only function-valued entries are used; unknown or non-function\nentries are ignored with a warning instead of failing the run.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    'Run-scoped methods (',
                    (0, i.jsx)(n.code, { children: 'beforeAll' }),
                    ', ',
                    (0, i.jsx)(n.code, { children: 'afterAll' }),
                    ') are called once per run and receive\n',
                    (0, i.jsx)(n.code, { children: "action: '*'" }),
                    ' with no ',
                    (0, i.jsx)(n.code, { children: 'name' }),
                    '.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    'All methods are optional and may be ',
                    (0, i.jsx)(n.code, { children: 'async' }),
                    '.',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h2, {
              id: 'action-hooks-and-lifecycle',
              children: 'Action hooks and lifecycle',
            }),
            '\n',
            (0, i.jsx)(n.p, {
              children:
                'An action folder can carry a hook module that both prompts and observes the run through\nlifecycle methods.',
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'where-action-hooks-live',
              children: 'Where action hooks live',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The runner checks the candidates in the action folder in this order; the first existing\nfile wins and ',
                (0, i.jsx)(n.strong, { children: 'nothing else is loaded' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.table, {
              children: [
                (0, i.jsx)(n.thead, {
                  children: (0, i.jsxs)(n.tr, {
                    children: [
                      (0, i.jsx)(n.th, { children: 'Priority' }),
                      (0, i.jsx)(n.th, { children: 'File name' }),
                      (0, i.jsx)(n.th, { children: 'Notes' }),
                    ],
                  }),
                }),
                (0, i.jsxs)(n.tbody, {
                  children: [
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '1' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'hooks.ts' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: 'Modern form \u2014 TypeScript, on-the-fly',
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '2' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'hooks.js' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'Modern form \u2014 follows host project ',
                            (0, i.jsx)(n.code, { children: 'type' }),
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '3' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'hooks.mjs' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Modern form \u2014 explicit ESM' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '4' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'hooks.cjs' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: 'Modern form \u2014 explicit CommonJS',
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '5' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'index.js' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Legacy prompt hook' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '6' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'index.ts' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Legacy prompt hook' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '7' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'prompt.cjs' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Legacy prompt hook' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '8' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'prompt.js' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Legacy prompt hook' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, { children: '9' }),
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'prompt.ts' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Legacy prompt hook' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, i.jsxs)(n.ul, {
              children: [
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    'The four ',
                    (0, i.jsx)(n.code, { children: 'hooks.*' }),
                    ' files always take priority over the legacy files.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    'Legacy modules (',
                    (0, i.jsx)(n.code, { children: 'index.*' }),
                    ', ',
                    (0, i.jsx)(n.code, { children: 'prompt.*' }),
                    ') keep working unchanged and have ',
                    (0, i.jsx)(n.strong, { children: 'no lifecycle\nmethods' }),
                    ' \u2014 they only prompt (see ',
                    (0, i.jsx)(n.a, { href: './prompts', children: 'prompt hooks' }),
                    ').',
                  ],
                }),
                '\n',
                (0, i.jsx)(n.li, {
                  children:
                    'Hook files are not rendered as templates; they are loaded as modules.',
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, { id: 'the-hooks-class', children: 'The hooks class' }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'A ',
                (0, i.jsx)(n.code, { children: 'hooks.*' }),
                ' file ',
                (0, i.jsx)(n.strong, {
                  children: 'must export a class as its default export',
                }),
                '; otherwise a\n',
                (0, i.jsx)(n.code, { children: 'HookModuleError' }),
                ' naming the file is thrown. The runner constructs ',
                (0, i.jsx)(n.strong, { children: 'one instance per\naction run' }),
                ' and reuses it for every ',
                (0, i.jsx)(n.code, { children: '(name, action)' }),
                ' pair, so instance fields carry state\nacross pairs.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'All methods are optional and may be ',
                (0, i.jsx)(n.code, { children: 'async' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.table, {
              children: [
                (0, i.jsx)(n.thead, {
                  children: (0, i.jsxs)(n.tr, {
                    children: [
                      (0, i.jsx)(n.th, { children: 'Method' }),
                      (0, i.jsx)(n.th, { children: 'Called' }),
                    ],
                  }),
                }),
                (0, i.jsxs)(n.tbody, {
                  children: [
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'beforeAll(ctx)' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: "Once per action run, before that action's pairs",
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'beforeEach(ctx)' }),
                        }),
                        (0, i.jsx)(n.td, { children: "Before the pair's prompt phase" }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, {
                            children: 'afterEach(ctx, results)',
                          }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            "After the pair's execution; ",
                            (0, i.jsx)(n.code, { children: 'results' }),
                            " is that pair's ",
                            (0, i.jsx)(n.code, { children: 'ActionResult[]' }),
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, {
                            children: 'afterAll(ctx, results)',
                          }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'Once per action run; ',
                            (0, i.jsx)(n.code, { children: 'results' }),
                            " accumulates all of the action's pair results",
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, {
                            children: 'prompt({ prompter, args, h })',
                          }),
                        }),
                        (0, i.jsx)(n.td, {
                          children:
                            'The prompt section \u2014 replaces the legacy prompt hook',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The ',
                (0, i.jsx)(n.code, { children: 'ctx' }),
                ' object passed to the lifecycle methods:',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.table, {
              children: [
                (0, i.jsx)(n.thead, {
                  children: (0, i.jsxs)(n.tr, {
                    children: [
                      (0, i.jsx)(n.th, { children: 'Field' }),
                      (0, i.jsx)(n.th, { children: 'Description' }),
                    ],
                  }),
                }),
                (0, i.jsxs)(n.tbody, {
                  children: [
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'cwd' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Working directory of the run' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'templates' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Resolved templates directory' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'generator' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'Generator name (e.g. ',
                            (0, i.jsx)(n.code, { children: 'mailer' }),
                            ')',
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'action' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'Action name (',
                            (0, i.jsx)(n.code, { children: 'new' }),
                            ', or ',
                            (0, i.jsx)(n.code, { children: 'new:subaction' }),
                            ') \u2014 ',
                            (0, i.jsx)(n.code, { children: "'*'" }),
                            ' for run-scoped hooks',
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'subaction' }),
                        }),
                        (0, i.jsx)(n.td, { children: 'Subaction, when present' }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'name' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: 'Current name expansion, when present',
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'args' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'CLI flags plus ',
                            (0, i.jsx)(n.code, { children: 'name' }),
                            ', before prompt answers',
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'h' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children:
                            'Helpers (built-in + project), resolved once per run from CLI args on first read',
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'logger' }),
                        }),
                        (0, i.jsx)(n.td, { children: "The run's logger" }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'dry' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            (0, i.jsx)(n.code, { children: 'true' }),
                            ' in ',
                            (0, i.jsx)(n.code, { children: '--dry' }),
                            ' runs',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Run-scoped hooks (',
                (0, i.jsx)(n.code, { children: 'project.beforeAll' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'project.afterAll' }),
                ') receive ',
                (0, i.jsx)(n.code, { children: "action: '*'" }),
                ' and no\n',
                (0, i.jsx)(n.code, { children: 'name' }),
                '.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'the-prompt-section',
              children: 'The prompt section',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The ',
                (0, i.jsx)(n.code, { children: 'prompt({ prompter, args, h })' }),
                ' method is the prompt phase of the class \u2014 it replaces\nthe legacy prompt hook, and its returned object becomes template variables. The ',
                (0, i.jsx)(n.code, { children: 'h' }),
                "\nnamespace is resolved lazily on first read from the run's CLI arguments (positionals plus\nflags). Everything documented on the ",
                (0, i.jsx)(n.a, { href: './prompts', children: 'prompt hooks' }),
                ' page (prompter usage,\nfiltering, ',
                (0, i.jsx)(n.code, { children: 'args' }),
                ') applies.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.h3, {
              id: 'declarative-parameters-params',
              children: [
                'Declarative parameters (',
                (0, i.jsx)(n.code, { children: 'params' }),
                ')',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'A class-based hook module can also export a ',
                (0, i.jsx)(n.strong, { children: 'parameter schema' }),
                ' \u2014 a ',
                (0, i.jsx)(n.code, { children: 'params' }),
                ' array that\ndrives flag coercion, prompting and validation for the action, replacing hand-written\nprompt questions with one declaration:',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-ts',
                children:
                  "// hooks.ts\nclass Hooks {\n  beforeAll(ctx) {\n    /* ... */\n  }\n}\nexport const params = [\n  { name: 'label', type: 'string', required: true, message: 'Component name?' },\n  { name: 'count', type: 'number', default: 1 },\n  { name: 'dry', type: 'boolean' },\n  { name: 'stamp', type: (raw) => new Date(raw ?? Date.now()) }, // custom type\n];\nexport default Hooks;\n",
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Per ',
                (0, i.jsx)(n.code, { children: '(name, action)' }),
                ' pair the engine:',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.ol, {
              children: [
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'Coerces' }),
                    ' each declared parameter found among the CLI flags to its type\n(',
                    (0, i.jsx)(n.code, { children: "'3'" }),
                    ' \u2192 ',
                    (0, i.jsx)(n.code, { children: '3' }),
                    ' for ',
                    (0, i.jsx)(n.code, { children: 'number' }),
                    ', ',
                    (0, i.jsx)(n.code, { children: "'true'" }),
                    ' \u2192 ',
                    (0, i.jsx)(n.code, { children: 'true' }),
                    ' for ',
                    (0, i.jsx)(n.code, { children: 'boolean' }),
                    '). A value that cannot be\ncoerced fails the run naming the parameter and the expected type.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'Prompts once' }),
                    ' for every ',
                    (0, i.jsx)(n.em, { children: 'required' }),
                    ' parameter that was not supplied as a flag\n(',
                    (0, i.jsx)(n.code, { children: 'message' }),
                    ' is the question text, ',
                    (0, i.jsx)(n.code, { children: 'default' }),
                    ' the initial answer). Parameters already\nsupplied are never asked again.',
                  ],
                }),
                '\n',
                (0, i.jsxs)(n.li, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'Validates' }),
                    ' the merged values against the declared types; a ',
                    (0, i.jsx)(n.code, { children: 'required' }),
                    ' parameter\nthat stayed absent fails the run naming the parameter.',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: 'type' }),
                ' accepts ',
                (0, i.jsx)(n.code, { children: "'string'" }),
                ' (default), ',
                (0, i.jsx)(n.code, { children: "'number'" }),
                ', ',
                (0, i.jsx)(n.code, { children: "'boolean'" }),
                ' \u2014 or a ',
                (0, i.jsx)(n.strong, { children: 'function' }),
                ' whose\nreturn value becomes the parameter value (a thrown error surfaces under the parameter\nname). An unknown string type fails when the hooks are loaded, so a schema mistake never\nreaches a run. Only the modern class form (',
                (0, i.jsx)(n.code, { children: 'hooks.*' }),
                ', kind ',
                (0, i.jsx)(n.code, { children: 'class' }),
                ') honors ',
                (0, i.jsx)(n.code, { children: 'params' }),
                ';\nlegacy modules keep their own ',
                (0, i.jsx)(n.code, { children: 'params(...)' }),
                ' function.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.h3, {
              id: 'flag-key-normalization-argcase',
              children: [
                'Flag-key normalization (',
                (0, i.jsx)(n.code, { children: 'argCase' }),
                ')',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'By default flag keys keep their CLI spelling: ',
                (0, i.jsx)(n.code, { children: '--my-flag' }),
                ' reaches templates as the\n',
                (0, i.jsx)(n.code, { children: 'my-flag' }),
                ' local. When the runner configuration declares ',
                (0, i.jsx)(n.code, { children: "argCase: 'upper-underscore'" }),
                ',\nhyphenated and camel-cased flag keys are normalized to ',
                (0, i.jsx)(n.code, { children: 'UPPER_UNDERSCORE' }),
                '\n(',
                (0, i.jsx)(n.code, { children: '--my-flag' }),
                ' and ',
                (0, i.jsx)(n.code, { children: '--myFlag' }),
                ' both become ',
                (0, i.jsx)(n.code, { children: 'MY_FLAG' }),
                '). The reserved keys (',
                (0, i.jsx)(n.code, { children: '_' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'ts' }),
                ',\n',
                (0, i.jsx)(n.code, { children: 'name' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'generator' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'action' }),
                ') are never normalized.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'ordering-and-composition',
              children: 'Ordering and composition',
            }),
            '\n',
            (0, i.jsx)(n.p, {
              children: 'Project hooks wrap action hooks like nested test suites:',
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                children:
                  'project.beforeAll\n  action.beforeAll\n    for each (name, action) pair:\n      project.beforeEach\n      action.beforeEach\n      prompt -> render -> execute\n      action.afterEach(results)\n      project.afterEach(results)\n  action.afterAll\nproject.afterAll\n',
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: 'project.beforeAll' }),
                '/',
                (0, i.jsx)(n.code, { children: 'afterAll' }),
                ' run once per run; the action-level ones run once per action\nrun. ',
                (0, i.jsx)(n.code, { children: 'beforeEach' }),
                ' runs ',
                (0, i.jsx)(n.strong, { children: 'before' }),
                ' the prompt phase; ',
                (0, i.jsx)(n.code, { children: 'afterEach' }),
                ' runs ',
                (0, i.jsx)(n.strong, { children: 'after' }),
                ' execution.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.p, {
              children:
                'Because the class instance persists across pairs, instance fields make per-run state\ntrivial \u2014 for example a counter that increments per pair:',
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-typescript',
                children:
                  '// _templates/mailer/new/hooks.ts\nexport default class Hooks {\n  private n = 0;\n\n  async beforeEach(ctx) {\n    this.n += 1;\n    ctx.logger.log(`pair #${this.n}`);\n  }\n}\n',
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'With ',
                (0, i.jsx)(n.code, { children: 'hygen mailer new a,b' }),
                ' the two name expansions see ',
                (0, i.jsx)(n.code, { children: '1' }),
                ' then ',
                (0, i.jsx)(n.code, { children: '2' }),
                '.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, { id: 'failure-semantics', children: 'Failure semantics' }),
            '\n',
            (0, i.jsxs)(n.table, {
              children: [
                (0, i.jsx)(n.thead, {
                  children: (0, i.jsxs)(n.tr, {
                    children: [
                      (0, i.jsx)(n.th, { children: 'Hook that throws' }),
                      (0, i.jsx)(n.th, { children: 'Effect' }),
                    ],
                  }),
                }),
                (0, i.jsxs)(n.tbody, {
                  children: [
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'beforeAll' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'Every pair it guards is skipped and marked ',
                            (0, i.jsx)(n.code, { children: 'failed' }),
                            ' with the hook error; its matching ',
                            (0, i.jsx)(n.code, { children: 'afterAll' }),
                            ' still runs. A project ',
                            (0, i.jsx)(n.code, { children: 'beforeAll' }),
                            ' failure guards all pairs; an action ',
                            (0, i.jsx)(n.code, { children: 'beforeAll' }),
                            " failure guards only that action's pairs.",
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'beforeEach' }),
                        }),
                        (0, i.jsxs)(n.td, {
                          children: [
                            'That pair is skipped and marked ',
                            (0, i.jsx)(n.code, { children: 'failed' }),
                            '; both ',
                            (0, i.jsx)(n.code, { children: 'afterEach' }),
                            ' levels still run for it.',
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'afterEach' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: 'The pair is recorded as failed; the run fails.',
                        }),
                      ],
                    }),
                    (0, i.jsxs)(n.tr, {
                      children: [
                        (0, i.jsx)(n.td, {
                          children: (0, i.jsx)(n.code, { children: 'afterAll' }),
                        }),
                        (0, i.jsx)(n.td, {
                          children: 'The run fails even when every pair succeeded.',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Pair-attributable failures (',
                (0, i.jsx)(n.code, { children: 'beforeEach' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'afterEach' }),
                ") are reported with the pair's\n",
                (0, i.jsx)(n.code, { children: 'action' }),
                ' and ',
                (0, i.jsx)(n.code, { children: 'name' }),
                ' in ',
                (0, i.jsx)(n.code, { children: 'failures' }),
                '/',
                (0, i.jsx)(n.code, { children: 'statuses' }),
                '. Run-scoped failures (',
                (0, i.jsx)(n.code, { children: 'afterAll' }),
                ', and\n',
                (0, i.jsx)(n.code, { children: 'beforeAll' }),
                ' with no pair to guard) use the sentinel ',
                (0, i.jsx)(n.code, { children: "action: '*'" }),
                ' with no ',
                (0, i.jsx)(n.code, { children: 'name' }),
                '.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'A single-pair \xd7 single-action run rethrows the original hook error unchanged. Without\n',
                (0, i.jsx)(n.code, { children: '--keep-going' }),
                ' the run fails with the pair label; with ',
                (0, i.jsx)(n.code, { children: '--keep-going' }),
                ' hook failures are\ncollected per pair and the remaining pairs still run.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, { id: 'dry-mode', children: 'Dry mode' }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'In ',
                (0, i.jsx)(n.code, { children: '--dry' }),
                ' runs hooks are called exactly as usual and receive ',
                (0, i.jsx)(n.code, { children: 'ctx.dry === true' }),
                '; no files\nare written. A hook can use ',
                (0, i.jsx)(n.code, { children: 'ctx.dry' }),
                ' to skip its own side effects.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h2, { id: 'helpers', children: 'Helpers' }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Add functions to the ',
                (0, i.jsx)(n.code, { children: 'h' }),
                ' helper namespace from ',
                (0, i.jsx)(n.code, { children: '.hygen.js' }),
                '. A template that uses a function\ncalled ',
                (0, i.jsx)(n.code, { children: 'extended' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-yaml',
                children:
                  "---\nto: given/hygen-js/new.md\n---\nthis demonstrates hygen loaded up .hygen.js and extended helpers.\n<%= h.extended('hello') %>\n",
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Define it in a project-root ',
                (0, i.jsx)(n.code, { children: '.hygen.js' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  'module.exports = {\n  helpers: {\n    extended: (s) => s.toUpperCase(),\n  },\n};\n',
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Beyond inlining a utility, you can ',
                (0, i.jsx)(n.code, { children: 'require' }),
                ' any code in your project and export it for\n',
                (0, i.jsx)(n.code, { children: 'hygen' }),
                ' to use.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h3, {
              id: 'external-libraries-as-helpers',
              children: 'External libraries as helpers',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Anything ',
                (0, i.jsx)(n.code, { children: 'require' }),
                '-able in the project where you run ',
                (0, i.jsx)(n.code, { children: 'hygen' }),
                ' can be exposed to templates\nthe same way \u2014 utility libraries, sibling packages in a monorepo, your own modules.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.blockquote, {
              children: [
                '\n',
                (0, i.jsxs)(n.p, {
                  children: [
                    (0, i.jsx)(n.strong, { children: 'Note:' }),
                    ' the library must be an installed dependency of the project where ',
                    (0, i.jsx)(n.code, { children: 'hygen' }),
                    '\nruns. ',
                    (0, i.jsx)(n.code, { children: 'hygen' }),
                    ' resolves ',
                    (0, i.jsx)(n.code, { children: 'require' }),
                    ' from the running project, not from its own bundle \u2014\na library that is not installed there will fail to load.',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h4, {
              id: 'lodash-plain-object-form',
              children: 'Lodash (plain object form)',
            }),
            '\n',
            (0, i.jsx)(n.p, {
              children:
                'Require the library at config load and bind it (whole or in wrappers) under a namespace:',
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "// .hygen.js\nconst _ = require('lodash');\n\nmodule.exports = {\n  helpers: {\n    _: _,\n    slug: (s) => _.kebabCase(s),\n  },\n};\n",
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Use it in a template as ',
                (0, i.jsx)(n.code, { children: 'h.<namespace>' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-yaml',
                children:
                  '---\nto: given/hygen-js/libraries.md\n---\n<%= h._.capitalize(name) %>\n<%= h.slug(name) %>\n',
              }),
            }),
            '\n',
            (0, i.jsxs)(n.h4, {
              id: 'sibling-biorate-package-monorepo-usage',
              children: [
                'Sibling ',
                (0, i.jsx)(n.code, { children: '@biorate/*' }),
                ' package (monorepo usage)',
              ],
            }),
            '\n',
            (0, i.jsx)(n.p, {
              children:
                'The same mechanism works for sibling packages in the monorepo, as long as the running\nproject depends on them:',
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "// .hygen.js\nconst { changeCase } = require('@biorate/change-case');\n\nmodule.exports = {\n  helpers: { changeCase },\n};\n",
              }),
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-yaml',
                children: '<%= h.changeCase.paramCase(name) %>\n',
              }),
            }),
            '\n',
            (0, i.jsx)(n.h4, {
              id: 'function-form-lazy-resolution-with-a-friendly-error',
              children: 'Function form (lazy resolution with a friendly error)',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: 'helpers' }),
                ' can also be a function ',
                (0, i.jsx)(n.code, { children: '(locals, config) => Helpers' }),
                ". It is invoked for every\ntemplate render \u2014 once for the frontmatter attributes and once for the body \u2014 with that\naction's locals (",
                (0, i.jsx)(n.code, { children: 'name' }),
                ', flags and prompt answers included), and lazily at most once per\nrun when lifecycle hooks or a class ',
                (0, i.jsx)(n.code, { children: 'prompt' }),
                ' section read ',
                (0, i.jsx)(n.code, { children: 'h' }),
                ". A hook-scoped call\nreceives the run's CLI arguments (",
                (0, i.jsx)(n.code, { children: '_' }),
                ' positionals plus flags, without the per-pair\n',
                (0, i.jsx)(n.code, { children: 'name' }),
                ' and without prompt answers).',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Because the same factory can be called several times in one run, it must be re-entrant\nand must not depend on per-template or prompt-provided values: ',
                (0, i.jsx)(n.code, { children: 'locals' }),
                ' is the raw\nargument object of that particular call, not a stable per-run store. Outside rendering\nthe runner never calls the factory with empty locals.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'This is the place for lazy resolution: wrap the ',
                (0, i.jsx)(n.code, { children: 'require' }),
                ' in ',
                (0, i.jsx)(n.code, { children: 'try/catch' }),
                ' and throw a\nfriendly error instead of the raw ',
                (0, i.jsx)(n.code, { children: 'Cannot find module' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "// .hygen.js\nmodule.exports = {\n  helpers: (locals, config) => {\n    let _;\n    try {\n      _ = require('lodash');\n    } catch (e) {\n      throw new Error(\n        `lodash is required by this generator's config \u2014 install it: npm i -D lodash`,\n      );\n    }\n    return {\n      _: _,\n      slug: (s) => _.kebabCase(s),\n    };\n  },\n};\n",
              }),
            }),
            '\n',
            (0, i.jsx)(n.h2, {
              id: 'content-transforms',
              children: 'Content transforms',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'Besides helpers, the config file can declare a ',
                (0, i.jsx)(n.code, { children: 'transforms' }),
                ' namespace: named\npost-processors that run over the rendered template content before it is written or\ninjected. Each transform is a function ',
                (0, i.jsx)(n.code, {
                  children: '(content, locals) => string | Promise<string>',
                }),
                ';\na template opts in with the ',
                (0, i.jsx)(n.code, { children: 'transform:' }),
                ' frontmatter attribute, and several transforms can\nbe chained left-to-right with ',
                (0, i.jsx)(n.code, { children: '|' }),
                '.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'See ',
                (0, i.jsx)(n.a, {
                  href: './content-transforms',
                  children: 'Content transforms',
                }),
                ' for the full reference \u2014 the config shape,\nchaining, and the failure/edge modes.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h2, {
              id: 'customizing-logger-template-location-and-shell-executor',
              children: 'Customizing logger, template location and shell executor',
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The same ',
                (0, i.jsx)(n.code, { children: '.hygen.js' }),
                ' file can customize the logger, the templates folder, and the shell\nexecutor:',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "const path = require('path');\n\nmodule.exports = {\n  templates: `${__dirname}/_templates`,\n  logger: {\n    ok: (msg) => process.stdout.write(msg),\n    notice: (msg) => process.stdout.write(msg),\n    warn: (msg) => process.stderr.write(msg),\n    err: (msg) => process.stderr.write(msg),\n    log: (msg) => process.stdout.write(msg),\n    colorful: (msg) => process.stdout.write(msg),\n  },\n  exec: (sh, body) => {\n    console.log(`[dry exec] ${sh}`);\n  },\n};\n",
              }),
            }),
            '\n',
            (0, i.jsxs)(n.h2, {
              id: 'embeddable-runner-api',
              children: [
                'Embeddable ',
                (0, i.jsx)(n.code, { children: 'runner()' }),
                ' API',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'The same pipeline the CLI uses is available programmatically as ',
                (0, i.jsx)(n.code, { children: 'runner(argv, config)' }),
                ' from\nthe package entry point. It is useful for building your own binary, test harness, or tool\nover ',
                (0, i.jsx)(n.code, { children: 'hygen' }),
                ':',
              ],
            }),
            '\n',
            (0, i.jsx)(n.pre, {
              children: (0, i.jsx)(n.code, {
                className: 'language-ts',
                children:
                  "import { runner } from '@biorate/hygen';\nimport * as path from 'path';\n\nasync function main() {\n  const result = await runner(['mailer', 'new', 'autumn-newsletter'], {\n    cwd: process.cwd(),\n    templates: path.join(process.cwd(), 'templates'),\n    logger: {\n      ok: (msg: string) => console.log(msg),\n      notice: (msg: string) => console.log(msg),\n      warn: (msg: string) => console.warn(msg),\n      err: (msg: string) => console.error(msg),\n      log: (msg: string) => console.log(msg),\n      colorful: (msg: string) => console.log(msg),\n    },\n    createPrompter: <Q, T>() => ({\n      prompt: async (_arg0: Q) => ({}) as T,\n    }),\n    exec: (sh: string, body: string) => {\n      void sh;\n      void body;\n    },\n  });\n\n  if (!result.success) {\n    console.error(result.failure?.message);\n    process.exit(1);\n  }\n}\n\nvoid main();\n",
              }),
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: 'RunnerConfig' }),
                ' requires ',
                (0, i.jsx)(n.code, { children: 'cwd' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'logger' }),
                ' (a ',
                (0, i.jsx)(n.code, { children: 'Logger' }),
                '-shaped object), ',
                (0, i.jsx)(n.code, { children: 'createPrompter' }),
                ', and\n',
                (0, i.jsx)(n.code, { children: 'exec' }),
                '. Everything else \u2014 ',
                (0, i.jsx)(n.code, { children: 'templates' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'templatesOverride' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'helpers' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'localsDefaults' }),
                ',\n',
                (0, i.jsx)(n.code, { children: 'debug' }),
                ' \u2014 is optional. The result (',
                (0, i.jsx)(n.code, { children: 'RunnerResult' }),
                ') exposes ',
                (0, i.jsx)(n.code, { children: 'success' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'time' }),
                ', ',
                (0, i.jsx)(n.code, { children: 'actions' }),
                ', and\na ',
                (0, i.jsx)(n.code, { children: 'failure' }),
                ' block when the run fails.',
              ],
            }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                'For the full API reference see the ',
                (0, i.jsx)(n.a, {
                  href: 'https://biorate.github.io/core/modules/hygen.html',
                  children: 'typedoc',
                }),
                '.',
              ],
            }),
            '\n',
            (0, i.jsx)(n.h2, { id: 'attribution', children: 'Attribution' }),
            '\n',
            (0, i.jsxs)(n.p, {
              children: [
                (0, i.jsx)(n.code, { children: '@biorate/hygen' }),
                ' is a fork of ',
                (0, i.jsx)(n.a, {
                  href: 'https://github.com/jondot/hygen',
                  children: 'jondot/hygen',
                }),
                ' (v6.2.11,\nMIT); original work \xa9 Dotan Nahum, fork adaptations \xa9 Leonid Levkin. See\n',
                (0, i.jsx)(n.a, { href: '/', children: 'Differences from upstream' }),
                ' and the ',
                (0, i.jsx)(n.a, {
                  href: 'https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE',
                  children: 'LICENSE',
                }),
                '.',
              ],
            }),
          ],
        });
      }
      function h(e = {}) {
        const { wrapper: n } = { ...(0, t.R)(), ...e.components };
        return n ? (0, i.jsx)(n, { ...e, children: (0, i.jsx)(a, { ...e }) }) : a(e);
      }
    },
    8758(e, n, r) {
      r.d(n, { R: () => o, x: () => c });
      var s = r(2503);
      const i = {},
        t = s.createContext(i);
      function o(e) {
        const n = s.useContext(t);
        return s.useMemo(
          function () {
            return 'function' == typeof e ? e(n) : { ...n, ...e };
          },
          [n, e],
        );
      }
      function c(e) {
        let n;
        return (
          (n = e.disableParentContext
            ? 'function' == typeof e.components
              ? e.components(i)
              : e.components || i
            : o(e.components)),
          s.createElement(t.Provider, { value: n }, e.children)
        );
      }
    },
  },
]);

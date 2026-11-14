'use strict';
(self.webpackChunkhygen_docs_site = self.webpackChunkhygen_docs_site || []).push([
  [229],
  {
    8747(e, n, r) {
      r.r(n),
        r.d(n, {
          assets: () => l,
          contentTitle: () => a,
          default: () => h,
          frontMatter: () => o,
          metadata: () => s,
          toc: () => d,
        });
      const s = JSON.parse(
        '{"id":"prompts","title":"prompts","description":"Part of @biorate/hygen \u2014 a fork of jondot/hygen (v6.2.11, MIT), adapted to the @biorate/* monorepo. Rewritten for this fork\'s semantics; see Differences from upstream.","source":"@site/../docs/prompts.md","sourceDirName":".","slug":"/prompts","permalink":"/core/hygen/docs/prompts","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"docs","previous":{"title":"quick-start","permalink":"/core/hygen/docs/quick-start"},"next":{"title":"generators","permalink":"/core/hygen/docs/generators"}}',
      );
      var t = r(159),
        i = r(8758);
      const o = {},
        a = 'Prompt hooks',
        l = {},
        d = [
          { value: 'Where the hook lives', id: 'where-the-hook-lives', level: 2 },
          {
            value: 'File names and lookup order',
            id: 'file-names-and-lookup-order',
            level: 2,
          },
          { value: 'The three hook forms', id: 'the-three-hook-forms', level: 2 },
          {
            value: 'Form 1: a question array (declarative)',
            id: 'form-1-a-question-array-declarative',
            level: 3,
          },
          {
            value: 'Form 2: a <code>prompt</code> function (full control)',
            id: 'form-2-a-prompt-function-full-control',
            level: 3,
          },
          {
            value: 'Form 3: a <code>params</code> function (no prompting at all)',
            id: 'form-3-a-params-function-no-prompting-at-all',
            level: 3,
          },
          {
            value: 'Filtering: ask only what&#39;s missing',
            id: 'filtering-ask-only-whats-missing',
            level: 2,
          },
          { value: 'Hooks under lists', id: 'hooks-under-lists', level: 2 },
          { value: '<code>name</code> precedence', id: 'name-precedence', level: 3 },
          {
            value: 'Answers become template variables',
            id: 'answers-become-template-variables',
            level: 2,
          },
          { value: 'A complete example', id: 'a-complete-example', level: 2 },
          { value: 'See also', id: 'see-also', level: 2 },
        ];
      function c(e) {
        const n = {
          a: 'a',
          blockquote: 'blockquote',
          code: 'code',
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          header: 'header',
          li: 'li',
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
          ...(0, i.R)(),
          ...e.components,
        };
        return (0, t.jsxs)(t.Fragment, {
          children: [
            (0, t.jsxs)(n.blockquote, {
              children: [
                '\n',
                (0, t.jsxs)(n.p, {
                  children: [
                    'Part of ',
                    (0, t.jsx)(n.strong, { children: '@biorate/hygen' }),
                    ' \u2014 a fork of ',
                    (0, t.jsx)(n.a, {
                      href: 'https://github.com/jondot/hygen',
                      children: 'jondot/hygen',
                    }),
                    ' (v6.2.11, MIT), adapted to the ',
                    (0, t.jsx)(n.code, { children: '@biorate/*' }),
                    " monorepo. Rewritten for this fork's semantics; see ",
                    (0, t.jsx)(n.a, { href: '/', children: 'Differences from upstream' }),
                    '.',
                  ],
                }),
                '\n',
                (0, t.jsxs)(n.p, {
                  children: [
                    'Based on: ',
                    (0, t.jsx)(n.a, {
                      href: 'https://github.com/jondot/hygen/blob/master/docs/generators.md',
                      children: 'Upstream generators doc',
                    }),
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, t.jsx)(n.header, {
              children: (0, t.jsx)(n.h1, {
                id: 'prompt-hooks',
                children: 'Prompt hooks',
              }),
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'A prompt hook is a JavaScript module in the action folder that collects or computes the\nvariables handed to the templates of that action. This page is the complete reference:\nfile names and lookup order, the three hook forms, filtering semantics, and TypeScript\nsupport. For a quick introduction see ',
                (0, t.jsx)(n.a, {
                  href: './generators#interactive-prompts',
                  children: 'generators',
                }),
                '.',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h2, {
              id: 'where-the-hook-lives',
              children: 'Where the hook lives',
            }),
            '\n',
            (0, t.jsxs)(n.blockquote, {
              children: [
                '\n',
                (0, t.jsxs)(n.p, {
                  children: [
                    (0, t.jsx)(n.strong, { children: 'Modern form:' }),
                    ' the class-based ',
                    (0, t.jsx)(n.code, { children: 'hooks.ts' }),
                    ' / ',
                    (0, t.jsx)(n.code, { children: 'hooks.js' }),
                    ' / ',
                    (0, t.jsx)(n.code, { children: 'hooks.mjs' }),
                    ' / ',
                    (0, t.jsx)(n.code, { children: 'hooks.cjs' }),
                    '\nfile is the preferred form \u2014 it also carries lifecycle methods (',
                    (0, t.jsx)(n.code, { children: 'beforeAll' }),
                    ',\n',
                    (0, t.jsx)(n.code, { children: 'beforeEach' }),
                    ', ',
                    (0, t.jsx)(n.code, { children: 'afterEach' }),
                    ', ',
                    (0, t.jsx)(n.code, { children: 'afterAll' }),
                    ') around the run. See\n',
                    (0, t.jsx)(n.a, {
                      href: './extensibility#action-hooks-and-lifecycle',
                      children: 'Action hooks and lifecycle',
                    }),
                    '. The legacy\nprompt files documented below remain fully supported.',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The hook file sits in the action folder and is ',
                (0, t.jsx)(n.strong, { children: 'shared by every template' }),
                ' in that\nfolder \u2014 it runs once per action, before any template renders:',
              ],
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                children:
                  '_templates/\n  mailer/\n    new/           <- the "mailer new" action\n      prompt.js    <- one hook for html.ejs.t and text.ejs.t\n      html.ejs.t\n      text.ejs.t\n',
              }),
            }),
            '\n',
            (0, t.jsx)(n.h2, {
              id: 'file-names-and-lookup-order',
              children: 'File names and lookup order',
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The runner looks for the ',
                (0, t.jsx)(n.strong, { children: 'first existing' }),
                ' file in the action folder, in this order:',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.table, {
              children: [
                (0, t.jsx)(n.thead, {
                  children: (0, t.jsxs)(n.tr, {
                    children: [
                      (0, t.jsx)(n.th, { children: 'Priority' }),
                      (0, t.jsx)(n.th, { children: 'File name' }),
                      (0, t.jsx)(n.th, { children: 'Notes' }),
                    ],
                  }),
                }),
                (0, t.jsxs)(n.tbody, {
                  children: [
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '1' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'hooks.ts' }),
                        }),
                        (0, t.jsxs)(n.td, {
                          children: [
                            (0, t.jsx)(n.strong, { children: 'Modern form' }),
                            ' \u2014 TypeScript, transpiled on the fly',
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '2' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'hooks.js' }),
                        }),
                        (0, t.jsxs)(n.td, {
                          children: [
                            "Modern form \u2014 follows the host project's ",
                            (0, t.jsx)(n.code, { children: 'type' }),
                            ' field',
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '3' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'hooks.mjs' }),
                        }),
                        (0, t.jsx)(n.td, { children: 'Modern form \u2014 explicit ESM' }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '4' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'hooks.cjs' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children: 'Modern form \u2014 explicit CommonJS',
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '5' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'index.js' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children: 'Legacy \u2014 preferred for advanced hooks',
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '6' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'index.ts' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children: 'Legacy \u2014 TypeScript, transpiled on the fly',
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '7' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'prompt.cjs' }),
                        }),
                        (0, t.jsx)(n.td, { children: 'Legacy \u2014 explicit CommonJS' }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '8' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'prompt.js' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children: 'Legacy \u2014 the conventional choice',
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '9' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'prompt.ts' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children: 'Legacy \u2014 TypeScript, transpiled on the fly',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The first existing file wins and nothing else is loaded \u2014 a ',
                (0, t.jsx)(n.code, { children: 'hooks.*' }),
                ' file always takes\npriority over the legacy files. A ',
                (0, t.jsx)(n.code, { children: 'hooks.*' }),
                ' file must default-export a ',
                (0, t.jsx)(n.strong, { children: 'class' }),
                ' (the\nlegacy forms export a hook object or array instead). Legacy modules keep working\nunchanged. For the full class contract see\n',
                (0, t.jsx)(n.a, {
                  href: './extensibility#the-hooks-class',
                  children: 'The hooks class',
                }),
                '.',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'If none exists, no prompting happens and the action proceeds with the CLI variables only.\nTypeScript hooks work out of the box: the runner lazily registers\n',
                (0, t.jsx)(n.code, { children: 'ts-node/register/transpile-only' }),
                ' on first use. Both module systems are supported \u2014\n',
                (0, t.jsx)(n.code, { children: 'module.exports' }),
                ' (CommonJS) and ',
                (0, t.jsx)(n.code, { children: 'export default' }),
                ' / named ',
                (0, t.jsx)(n.code, { children: 'export' }),
                ' (ESM); the runner\nperforms a dynamic ',
                (0, t.jsx)(n.code, { children: 'import()' }),
                ' and unwraps ',
                (0, t.jsx)(n.code, { children: 'default' }),
                ' when present.',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.blockquote, {
              children: [
                '\n',
                (0, t.jsxs)(n.p, {
                  children: [
                    'Note: in legacy modules ',
                    (0, t.jsx)(n.code, { children: 'params' }),
                    ' is a ',
                    (0, t.jsx)(n.strong, { children: 'function' }),
                    ' that resolves the prompt answers.\nA modern class ',
                    (0, t.jsx)(n.code, { children: 'hooks.*' }),
                    ' module may instead export a declarative ',
                    (0, t.jsx)(n.code, { children: 'params' }),
                    ' ',
                    (0, t.jsx)(n.strong, { children: 'array' }),
                    '\n(typed coercion, prompts and validation from descriptors) \u2014 see\n',
                    (0, t.jsx)(n.a, {
                      href: './extensibility#declarative-parameters-params',
                      children: 'Declarative parameters',
                    }),
                    '.',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h2, {
              id: 'the-three-hook-forms',
              children: 'The three hook forms',
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                "The runner inspects the module's exports and picks the matching form. The check order is\nfixed: ",
                (0, t.jsxs)(n.strong, {
                  children: [
                    (0, t.jsx)(n.code, { children: 'params' }),
                    ' first, then ',
                    (0, t.jsx)(n.code, { children: 'prompt' }),
                    ', then a plain question array',
                  ],
                }),
                ' \u2014 e.g. if a module\nexports ',
                (0, t.jsx)(n.code, { children: 'params' }),
                ', the ',
                (0, t.jsx)(n.code, { children: 'prompt' }),
                ' export (if any) is never called.',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h3, {
              id: 'form-1-a-question-array-declarative',
              children: 'Form 1: a question array (declarative)',
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The simplest form \u2014 an array of ',
                (0, t.jsx)(n.a, {
                  href: 'https://github.com/enquirer/enquirer#prompt-options',
                  children: 'enquirer',
                }),
                '\nquestions. The runner asks only the questions whose answers were ',
                (0, t.jsx)(n.strong, { children: 'not' }),
                ' already provided\non the CLI (see ',
                (0, t.jsx)(n.a, {
                  href: '#filtering-ask-only-whats-missing',
                  children: 'filtering',
                }),
                '):',
              ],
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "// _templates/mailer/new/prompt.js\nmodule.exports = [\n  {\n    type: 'input',\n    name: 'message', // becomes the <%= message %> template variable\n    message: \"What's your message?\",\n    validate: (v) => v.length > 0 || 'Required',\n  },\n  {\n    type: 'confirm',\n    name: 'typescript',\n    message: 'Use TypeScript?',\n    initial: true,\n  },\n];\n",
              }),
            }),
            '\n',
            (0, t.jsxs)(n.h3, {
              id: 'form-2-a-prompt-function-full-control',
              children: [
                'Form 2: a ',
                (0, t.jsx)(n.code, { children: 'prompt' }),
                ' function (full control)',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The hook receives ',
                (0, t.jsx)(n.code, { children: '{ prompter, inquirer, args, h }' }),
                ' and decides itself what to ask, in how\nmany steps, and whether to ask at all. Everything the function returns merges into the\ntemplate variables:',
              ],
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "module.exports = {\n  async prompt({ prompter, args, h }) {\n    // custom shortcut: no prompting when the value came from the CLI\n    if (args.author) return {};\n\n    const { kind } = await prompter.prompt([\n      { type: 'select', name: 'kind', message: 'Kind?', choices: ['worker', 'service'] },\n    ]);\n\n    const { name } = await prompter.prompt([\n      {\n        type: 'input',\n        name: 'name',\n        message: `${kind} name?`,\n        initial: h.changeCase.paramCase(`My${kind}`),\n      },\n    ]);\n\n    return { kind, name };\n  },\n};\n",
              }),
            }),
            '\n',
            (0, t.jsx)(n.p, { children: 'Hook arguments:' }),
            '\n',
            (0, t.jsxs)(n.table, {
              children: [
                (0, t.jsx)(n.thead, {
                  children: (0, t.jsxs)(n.tr, {
                    children: [
                      (0, t.jsx)(n.th, { children: 'Field' }),
                      (0, t.jsx)(n.th, { children: 'Description' }),
                    ],
                  }),
                }),
                (0, t.jsxs)(n.tbody, {
                  children: [
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'prompter' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children:
                            'The enquirer-compatible prompter instance configured for this run',
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'inquirer' }),
                        }),
                        (0, t.jsxs)(n.td, {
                          children: [
                            'An ',
                            (0, t.jsx)(n.strong, { children: 'alias' }),
                            ' of ',
                            (0, t.jsx)(n.code, { children: 'prompter' }),
                            ', kept for compatibility with inquirer-era templates',
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'args' }),
                        }),
                        (0, t.jsx)(n.td, {
                          children:
                            'The parsed CLI arguments of this run (flags and positionals)',
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: 'h' }),
                        }),
                        (0, t.jsxs)(n.td, {
                          children: [
                            'The built-in helpers (',
                            (0, t.jsx)(n.code, { children: 'h.changeCase' }),
                            ', ',
                            (0, t.jsx)(n.code, { children: 'h.inflection' }),
                            ', ',
                            (0, t.jsx)(n.code, { children: 'h.path' }),
                            ', ',
                            (0, t.jsx)(n.code, { children: 'h.capitalize' }),
                            ') \u2014 same ',
                            (0, t.jsx)(n.code, { children: 'h' }),
                            ' as in templates',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, t.jsxs)(n.h3, {
              id: 'form-3-a-params-function-no-prompting-at-all',
              children: [
                'Form 3: a ',
                (0, t.jsx)(n.code, { children: 'params' }),
                ' function (no prompting at all)',
              ],
            }),
            '\n',
            (0, t.jsx)(n.p, {
              children:
                'A pure computation hook: derive the template variables from existing data \u2014 CLI args,\nproject files, environment. The user is never asked anything:',
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                className: 'language-javascript',
                children:
                  "const path = require('path');\n\nmodule.exports = {\n  params({ args, h }) {\n    const pkg = require(path.join(process.cwd(), 'package.json'));\n    return {\n      name: args.name || pkg.name,\n      author: pkg.author,\n      year: new Date().getFullYear(),\n    };\n  },\n};\n",
              }),
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'Because ',
                (0, t.jsx)(n.code, { children: 'params' }),
                ' is checked ',
                (0, t.jsx)(n.strong, { children: 'first' }),
                ', a module exporting it turns the hook into a silent\nvariable-computation step even if a ',
                (0, t.jsx)(n.code, { children: 'prompt' }),
                ' export is also present.',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h2, {
              id: 'filtering-ask-only-whats-missing',
              children: "Filtering: ask only what's missing",
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'In the declarative form (question array) the runner filters the questions by their ',
                (0, t.jsx)(n.code, { children: 'name' }),
                '\nagainst the CLI arguments: a question is asked only when ',
                (0, t.jsx)(n.code, { children: 'args[name]' }),
                ' is ',
                (0, t.jsx)(n.code, { children: 'undefined' }),
                ',\n',
                (0, t.jsx)(n.code, { children: 'null' }),
                ', or an empty string; a question whose variable already carries a CLI value is\n',
                (0, t.jsx)(n.strong, { children: 'skipped' }),
                '. This is what keeps generators usable non-interactively:',
              ],
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                className: 'language-bash',
                children:
                  '# asks for "message" (nothing provided)\nhygen mailer new fancy-mailer\n\n# asks nothing: both variables came from the CLI \u2014 safe in CI\nhygen mailer new fancy-mailer --message "Hello"\n',
              }),
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'In the ',
                (0, t.jsx)(n.code, { children: 'prompt' }),
                '-function form filtering is ',
                (0, t.jsx)(n.strong, { children: 'your' }),
                ' responsibility \u2014 the runner hands you\n',
                (0, t.jsx)(n.code, { children: 'args' }),
                ' and you decide what to ask (or return early, as in the example above).',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h2, { id: 'hooks-under-lists', children: 'Hooks under lists' }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'When a run expands multiple actions and/or names (see ',
                (0, t.jsx)(n.a, {
                  href: './generators#multiple-actions-and-names-in-one-run',
                  children: 'generators',
                }),
                '),\nthe hook is ',
                (0, t.jsx)(n.strong, { children: 'not' }),
                ' asked once for the whole run. The execution unit is one ',
                (0, t.jsx)(n.code, { children: '(name, action)' }),
                '\npair, and each pair runs its own prompt hook before rendering:',
              ],
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                className: 'language-bash',
                children:
                  'hygen mailer new,html a,b\n# new for "a" -> new for "b" -> html for "a" -> html for "b"\n# the hook in _templates/mailer/new and the hook in _templates/mailer/html\n# both run once per (name x action) pair\n',
              }),
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'So a ',
                (0, t.jsx)(n.code, { children: 'new' }),
                " folder with several names gets its hook asked once per name, and each listed\naction's hook runs independently. This multiplies prompt interruptions exactly by the\nnumber of pairs. The sharing mechanism is ",
                (0, t.jsx)(n.strong, { children: 'CLI flags' }),
                ': supply a variable once on the\ncommand line and every pair starts with it \u2014 the declarative form already skips questions\nwhose answers came from the CLI (see ',
                (0, t.jsx)(n.a, {
                  href: '#filtering-ask-only-whats-missing',
                  children: 'filtering',
                }),
                '), so an\nanswered variable is never re-asked in a later pair.',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.h3, {
              id: 'name-precedence',
              children: [(0, t.jsx)(n.code, { children: 'name' }), ' precedence'],
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The ',
                (0, t.jsx)(n.code, { children: 'name' }),
                ' variable follows a fixed precedence chain when several sources provide it:',
              ],
            }),
            '\n',
            (0, t.jsxs)(n.table, {
              children: [
                (0, t.jsx)(n.thead, {
                  children: (0, t.jsxs)(n.tr, {
                    children: [
                      (0, t.jsx)(n.th, { children: 'Precedence' }),
                      (0, t.jsx)(n.th, { children: 'Source' }),
                      (0, t.jsx)(n.th, { children: 'Example' }),
                    ],
                  }),
                }),
                (0, t.jsxs)(n.tbody, {
                  children: [
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '1 (highest)' }),
                        (0, t.jsx)(n.td, { children: 'prompt hook answer' }),
                        (0, t.jsxs)(n.td, {
                          children: [
                            'a ',
                            (0, t.jsx)(n.code, { children: 'prompt.js' }),
                            ' value',
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '2' }),
                        (0, t.jsx)(n.td, { children: 'positional name list' }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, {
                            children: 'hygen mailer new a,b',
                          }),
                        }),
                      ],
                    }),
                    (0, t.jsxs)(n.tr, {
                      children: [
                        (0, t.jsx)(n.td, { children: '3 (lowest)' }),
                        (0, t.jsxs)(n.td, {
                          children: [(0, t.jsx)(n.code, { children: '--name' }), ' flag'],
                        }),
                        (0, t.jsx)(n.td, {
                          children: (0, t.jsx)(n.code, { children: '--name fancy' }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                "The hook's answer always wins. The positional name list is the primary name source; the\n",
                (0, t.jsx)(n.code, { children: '--name' }),
                ' flag participates ',
                (0, t.jsx)(n.strong, { children: 'only under the legacy escape' }),
                ' (',
                (0, t.jsx)(n.code, { children: 'HYGEN_LEGACY_NAME=1' }),
                ' or\n',
                (0, t.jsx)(n.code, { children: 'legacyNameFlag: true' }),
                ' in ',
                (0, t.jsx)(n.code, { children: 'RunnerConfig' }),
                '), in which case a positional element overrides it.\nWhen the run expands a name ',
                (0, t.jsx)(n.strong, { children: 'list' }),
                ', ',
                (0, t.jsx)(n.code, { children: 'name' }),
                ' is the scalar of the current expansion\nregardless of how it was arrived at. (The ',
                (0, t.jsx)(n.code, { children: '--name' }),
                ' flag is removed by default \u2014 use a\ncomma-separated positional name list instead.)',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h2, {
              id: 'answers-become-template-variables',
              children: 'Answers become template variables',
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'Everything the hook yields \u2014 question answers or the object returned from\n',
                (0, t.jsx)(n.code, { children: 'prompt' }),
                '/',
                (0, t.jsx)(n.code, { children: 'params' }),
                ' \u2014 is merged with the CLI variables and rendered into the templates:',
              ],
            }),
            '\n',
            (0, t.jsx)(n.pre, {
              children: (0, t.jsx)(n.code, {
                className: 'language-ejs',
                children: '---\nto: app/emails/<%= name %>.txt\n---\n<%= message %>\n',
              }),
            }),
            '\n',
            (0, t.jsx)(n.p, {
              children:
                'CLI flags take precedence in the declarative form (already-provided answers are filtered\nout); in the function forms you control the precedence yourself.',
            }),
            '\n',
            (0, t.jsx)(n.h2, {
              id: 'a-complete-example',
              children: 'A complete example',
            }),
            '\n',
            (0, t.jsxs)(n.p, {
              children: [
                'The kitchen-sink fixture in this package is a real, tested hook:\n',
                (0, t.jsx)(n.a, {
                  href: 'https://github.com/biorate/core/blob/master/packages/@biorate/hygen/tests/fixtures/kitchen-sink/_templates/sink/new/prompt.js',
                  children: (0, t.jsx)(n.code, {
                    children: 'tests/fixtures/kitchen-sink/_templates/sink/new/prompt.js',
                  }),
                }),
                ' \u2014\na ',
                (0, t.jsx)(n.code, { children: 'prompt' }),
                ' function with a CLI shortcut and a defaulted question.',
              ],
            }),
            '\n',
            (0, t.jsx)(n.h2, { id: 'see-also', children: 'See also' }),
            '\n',
            (0, t.jsxs)(n.ul, {
              children: [
                '\n',
                (0, t.jsxs)(n.li, {
                  children: [
                    (0, t.jsx)(n.a, { href: './generators', children: 'generators' }),
                    ' \u2014 organizing generators and actions, and running several actions/names in one command',
                  ],
                }),
                '\n',
                (0, t.jsxs)(n.li, {
                  children: [
                    (0, t.jsx)(n.a, { href: './templates', children: 'templates' }),
                    ' \u2014 the frontmatter reference and helpers',
                  ],
                }),
                '\n',
                (0, t.jsxs)(n.li, {
                  children: [
                    (0, t.jsx)(n.a, {
                      href: './extensibility',
                      children: 'extensibility',
                    }),
                    ' \u2014 the project config file and embedding via ',
                    (0, t.jsx)(n.code, { children: 'runner()' }),
                  ],
                }),
                '\n',
              ],
            }),
          ],
        });
      }
      function h(e = {}) {
        const { wrapper: n } = { ...(0, i.R)(), ...e.components };
        return n ? (0, t.jsx)(n, { ...e, children: (0, t.jsx)(c, { ...e }) }) : c(e);
      }
    },
    8758(e, n, r) {
      r.d(n, { R: () => o, x: () => a });
      var s = r(2503);
      const t = {},
        i = s.createContext(t);
      function o(e) {
        const n = s.useContext(i);
        return s.useMemo(
          function () {
            return 'function' == typeof e ? e(n) : { ...n, ...e };
          },
          [n, e],
        );
      }
      function a(e) {
        let n;
        return (
          (n = e.disableParentContext
            ? 'function' == typeof e.components
              ? e.components(t)
              : e.components || t
            : o(e.components)),
          s.createElement(i.Provider, { value: n }, e.children)
        );
      }
    },
  },
]);

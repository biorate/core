import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import fg from 'fast-glob';
import fm from 'front-matter';
import walk from 'ignore-walk';
import createDebug from 'debug';
import type { RenderedAction, RunnerConfig } from './types';
import context from './context';
import {
  GlobMirrorConflictError,
  TemplateConfigError,
  TemplateRenderError,
  UnknownTransformError,
} from './errors';
const debug = createDebug('hygen:render');

/**
 * @description Evaluates a rendered `skip:` attribute into a skip flag/reason
 * following the documented truthiness contract. Template rendering yields strings,
 * so the boolean spellings are normalised case-insensitively: an empty string, the
 * literal `false` and the rendered string `'false'` are falsy and run the action
 * (returns `undefined`); `true`/`'true'` skips without a reason (returns `true`);
 * any other non-empty value (including `0`) is truthy and is used as the skip
 * reason string (returns that string). */
const evaluateSkip = (rendered: unknown): true | string | undefined => {
  if (rendered === undefined) return undefined;
  if (rendered === '' || rendered === false) return undefined;
  if (rendered === true) return true;
  const value = String(rendered).trim();
  if (value === '') return undefined;
  if (value.toLowerCase() === 'false') return undefined;
  if (value.toLowerCase() === 'true') return true;
  return value;
};

// for some reason lodash/fp takes 90ms to load.
// inline what we use here with the regular lodash.
const map =
  <T, R>(f: (v: T) => R) =>
  (arr: T[]) =>
    arr.map(f);
const filter =
  <T>(f: (v: T) => boolean) =>
  (arr: T[]) =>
    arr.filter(f);

const ignores = [
  'hooks.ts',
  'hooks.js',
  'hooks.mjs',
  'hooks.cjs',
  'prompt.js',
  'index.js',
  'prompt.ts',
  'index.ts',
  '.hygenignore',
  '.DS_Store',
  '.Spotlight-V100',
  '.Trashes',
  'ehthumbs.db',
  'Thumbs.db',
];
// template values (frontmatter attrs / body) are user-defined and dynamic
const renderTemplate = (
  tmpl: any,
  locals: Record<string, any>,
  config: Partial<RunnerConfig>,
  file: string,
) => {
  if (typeof tmpl !== 'string') return tmpl;
  try {
    // `<%= %>` must not HTML-escape: the tool generates code, not HTML.
    return ejs.render(tmpl, context(locals, config), {
      escape: (s: string) => s,
    });
  } catch (error) {
    throw new TemplateRenderError(file, error);
  }
};

async function getFiles(dir: string): Promise<string[]> {
  const files = walk
    .sync({ path: dir, ignoreFiles: ['.hygenignore'] })
    .map((f: string) => path.join(dir, f));
  return files;
}

/**
 * @description Applies the `transform:` chain declared on a rendered action to
 * its body, after rendering and before any operation consumes it. Names are
 * `|`-chained and applied left-to-right with whitespace trimmed; each transform
 * is resolved from `config.transforms` and awaited (transforms may be async),
 * receiving the rendered content and the run locals used for the body render.
 * A `transform:` declared on a shell-only action (an `sh` attribute with no file
 * output) is NOT applied — the runner emits a warning instead, keeping the
 * intent visible without failing the command. An unknown name throws
 * `UnknownTransformError`, failing the action (a `--keep-going` run collects it
 * into the failures list via the existing engine behaviour).
 * */
const applyTransforms = async (
  content: string,
  attributes: Record<string, any>,
  locals: Record<string, unknown>,
  config: Partial<RunnerConfig>,
): Promise<string> => {
  const nameList = attributes.transform;
  if (nameList == null) return content;

  // a shell-only action writes no file, so transforming the body is a no-op;
  // warn (as decided) instead of silently dropping the transform attribute.
  const hasFileOutput =
    Boolean(attributes.to) || (attributes.mirror === true && attributes.sh === undefined);
  if (attributes.sh !== undefined && !hasFileOutput) {
    config.logger?.warn(
      `transform [${String(nameList)}] is ignored for sh: action (no file output)`,
    );
    return content;
  }

  const transforms = config.transforms ?? {};
  let result = content;
  for (const rawName of String(nameList).split('|')) {
    const name = rawName.trim();
    if (!name) continue;
    const transform = transforms[name];
    if (typeof transform !== 'function') {
      throw new UnknownTransformError(name);
    }
    result = await transform(result, locals);
  }
  return result;
};

/**
 * @description Renders every file in an action folder into `RenderedAction` items:
 * reads and sorts the files, parses frontmatter and renders both the attributes
 * and the body with EJS. The `<%= %>` escape is a no-op so generated code is not
 * HTML-escaped.
 * @param args - The parsed run arguments (must include `actionfolder`).
 * @param config - A (partial) runner configuration for the template context.
 * @returns The fully rendered action items, one per template file.
 * */
export const render = async (
  args: Record<string, any>,
  config: Partial<RunnerConfig>,
): Promise<RenderedAction[]> =>
  getFiles(args.actionfolder)
    .then((things) => things.sort((a, b) => a.localeCompare(b))) // TODO: add a test to verify this sort
    .then(filter((f: string) => !ignores.find((ig) => f.endsWith(ig)))) // TODO: add a
    // test for ignoring prompt.js and index.js
    .then(
      filter((file: string) =>
        args.subaction
          ? !!file.replace(args.actionfolder, '').match(args.subaction)
          : true,
      ),
    )
    .then(
      map((file: string) =>
        fs.readFile(file).then((text) => ({ file, text: text.toString() })),
      ),
    )
    .then((_: Promise<{ file: string; text: string }>[]) => Promise.all(_))
    .then(
      map(({ file, text }: { file: string; text: string }) => {
        debug('Pre-formatting file: %o', file);
        return { file, ...fm<Record<string, any>>(text, { allowUnsafe: true }) };
      }),
    )
    .then(
      map(
        ({
          file,
          attributes,
          body,
        }: {
          file: string;
          attributes: Record<string, any>;
          body: string;
        }) => expandItem(file, attributes, body, args, config),
      ),
    )
    .then((_: Promise<RenderedAction[]>[]) => Promise.all(_))
    .then((_: RenderedAction[][]) => _.flat());

/**
 * @description Renders a single parsed template into its `RenderedAction`s. A
 * template with a `glob:` attribute is a batch spec: it expands into one action
 * per matched file and produces no action of its own. Every other template
 * renders its attributes and body and yields exactly one action.
 * */
const expandItem = async (
  file: string,
  attributes: Record<string, any>,
  body: string,
  args: Record<string, any>,
  config: Partial<RunnerConfig>,
): Promise<RenderedAction[]> => {
  const renderedAttrs = Object.entries(attributes).reduce(
    (obj: Record<string, any>, [key, value]) => {
      return {
        ...obj,
        [key]: renderTemplate(value, args, config, file),
      };
    },
    {},
  );
  debug('Rendering file: %o', file);
  if (renderedAttrs.glob) {
    if (renderedAttrs.mirror === true) {
      throw new GlobMirrorConflictError(file);
    }
    return expandGlob(file, renderedAttrs, args, config);
  }
  const locals = { ...args, attributes: renderedAttrs };
  // a skipped action runs no operation and no transform (nothing consumes the
  // body); the skip flag/reason is carried on the action for the executor to
  // log and record as `skipped`.
  const skip = evaluateSkip(renderedAttrs.skip);
  if (skip !== undefined) {
    return [{ file, attributes: renderedAttrs, body: '', skip }];
  }
  return [
    {
      file,
      attributes: renderedAttrs,
      body: await applyTransforms(
        renderTemplate(body, locals, config, file),
        renderedAttrs,
        locals,
        config,
      ),
    },
  ];
};

/**
 * @description Expands a `glob:` template into one rendered file action per
 * matched source file. Matches are resolved relative to the template's own
 * directory, then the `base:` prefix is stripped and any `stripExtensions:`
 * suffix removed from each relative path; the resulting path is rendered with
 * EJS and joined with the rendered destination folder (`to:`/`destination:`,
 * treated as a directory). Each matched file's content is rendered with EJS
 * using the run locals. The `to`/`destination` join stays relative so the add
 * operation resolves it against `cwd` exactly as a plain `to:` target.
 * */
const expandGlob = async (
  file: string,
  attributes: Record<string, any>,
  args: Record<string, any>,
  config: Partial<RunnerConfig>,
): Promise<RenderedAction[]> => {
  // a `skip:` on a glob spec skips the whole batch: no glob match, no expanded
  // action, no operation — the skip flag/reason is carried on a single marker
  // action for the executor to log and record as `skipped`.
  const skip = evaluateSkip(attributes.skip);
  if (skip !== undefined) {
    return [{ file, attributes: {}, body: '', skip }];
  }
  const baseDir = path.dirname(file);
  const matches = (
    await fg(attributes.glob as string, {
      cwd: baseDir,
      absolute: true,
      onlyFiles: true,
      dot: false,
    })
  ).sort();
  const basePrefix = attributes.base
    ? (attributes.base as string).replace(/[\\/]+$/, '')
    : undefined;
  const stripExts: string[] =
    attributes.stripExtensions == null
      ? []
      : Array.isArray(attributes.stripExtensions)
      ? attributes.stripExtensions
      : [attributes.stripExtensions];
  const destFolder = (attributes.to ?? attributes.destination) as string | undefined;
  if (!destFolder) {
    // a glob spec writes every matched file under one destination folder; a
    // missing `to:`/`destination:` is a template configuration error.
    throw new TemplateConfigError(
      `glob template [${file}] must declare a 'to:' (or 'destination:') destination folder`,
    );
  }

  const renderedItems: RenderedAction[] = [];
  for (const match of matches) {
    let rel = path.relative(baseDir, match);
    if (basePrefix) {
      if (rel === basePrefix) {
        rel = '';
      } else if (rel.startsWith(basePrefix + path.sep)) {
        rel = rel.slice(basePrefix.length + 1);
      }
    }
    for (const ext of stripExts) {
      if (ext && rel.endsWith(ext)) {
        rel = rel.slice(0, -ext.length);
        break;
      }
    }
    const renderedRel = renderTemplate(rel, args, config, file);
    const outAttributes: Record<string, unknown> = {
      to: path.join(destFolder, renderedRel),
    };
    if (attributes.skipIfExists !== undefined) {
      outAttributes.skipIfExists = attributes.skipIfExists;
    }
    // a `transform:` on a glob spec propagates to every expanded file action.
    if (attributes.transform !== undefined) {
      outAttributes.transform = attributes.transform;
    }
    renderedItems.push({
      file: match,
      attributes: outAttributes,
      body: await applyTransforms(
        renderTemplate((await fs.readFile(match)).toString(), args, config, match),
        outAttributes,
        args,
        config,
      ),
    });
  }
  return renderedItems;
};

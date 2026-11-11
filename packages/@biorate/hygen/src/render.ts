import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import fm from 'front-matter';
import walk from 'ignore-walk';
import createDebug from 'debug';
import type { RenderedAction, RunnerConfig } from './types';
import context from './context';
import { TemplateRenderError } from './errors';
const debug = createDebug('hygen:render');

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
    return ejs.render(tmpl, context(locals, config));
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

const render = async (
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
        }) => {
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
          return {
            file,
            attributes: renderedAttrs,
            body: renderTemplate(
              body,
              { ...args, attributes: renderedAttrs },
              config,
              file,
            ),
          };
        },
      ),
    );

export default render;

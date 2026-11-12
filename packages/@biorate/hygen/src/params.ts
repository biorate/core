import path from 'path';
import yargs from 'yargs-parser';
import fs from 'fs-extra';
import type { ParamsResult, RunnerConfig } from './types';
import { CliArgumentError, TemplateNotFoundError } from './errors';

/** @description The default action folder name used when no action is specified. */
export const DEFAULT_ACTION = '_default';

/** @description Split a comma-separated positional into its elements (undefined passthrough). */
const splitList = (value: string | undefined): string[] | undefined =>
  value ? value.split(',') : undefined;

/**
 * @description Resolves the command positionals into a generator and its action/name
 * lists. The action and name positionals split on `,` into arrays. While a single
 * action folder named exactly as the (raw) action positional takes precedence, a
 * comma list is validated per element against `templates/<gen>/<action>`, throwing
 * a `TemplateNotFoundError` naming the missing element. The bare-variant behavior is
 * preserved: when the named action folder does not exist, the second positional is
 * treated as the (comma-list) name for the generator's `_default` action.
 * */
const resolvePositionals = async (templates: string, args: string[]) => {
  /*
  we want a to create flexible resolution and allow both:

  1. [gen] [action] [NAME]
  2. [gen] [NAME] which, if NAME=action, has a conflict, so goes to the generator with
      an empty name, otherwise -- goes to the new '_default' generator, with a name of 'NAME'

  E.g.
  for a template layout of:
  init/
    repo/
    ..

  init repo (repo exists, so goes to the repo gen, this is not a default named 'repo'!)
  init repo MyName
  init MyName (default, name=MyName), default because 'repo' does not exist
  init (default, name=[empty]), default always!
  */
  let [generator, action, name] = args;
  const actionList = splitList(action);
  const nameList = splitList(name);

  // a folder named exactly `action` (comma included) wins as a single action
  // (byte-compatible with the previous single-positional resolution).
  if (
    generator &&
    action &&
    (await fs.pathExists(path.join(templates, generator, action)))
  ) {
    return { generator, actions: [action], names: nameList };
  }

  // a comma list of actions: validate each element, naming the specific missing one.
  if (generator && action && actionList && actionList.length > 1) {
    const missing: string[] = [];
    for (const part of actionList) {
      if (!(await fs.pathExists(path.join(templates, generator, part)))) {
        missing.push(part);
      }
    }
    if (missing.length === 0) {
      return { generator, actions: actionList, names: nameList };
    }
    // at least one element is a real action: it is an action list with a bad element
    if (missing.length < actionList.length) {
      throw new TemplateNotFoundError(generator, missing[0]);
    }
    // none exist: treat as bare names for the default action (fall through)
  }

  if (
    generator &&
    (await fs.pathExists(path.join(templates, generator, DEFAULT_ACTION)))
  ) {
    [generator, name] = args;
    return { generator, actions: [DEFAULT_ACTION], names: splitList(name) };
  }
  return { generator, actions: actionList, names: nameList };
};

/**
 * @description Resolves the run arguments from the CLI-style argv: determines the
 * generator/action/name positionals (flexibly resolving `[gen] [NAME]` and
 * `[gen] [action] [NAME]`, with comma-separated action/name lists), parses data
 * options and returns the CLI-level base args plus the expansion lists (`actions`
 * / `names`). The per-pair pipeline (prompt hook, render, ops) is driven by the
 * engine loop, which consumes these lists.
 * @param config - The runner configuration (provides `templates`).
 * @param externalArgv - The CLI-style argument array.
 * @returns The resolved run parameters (base args + expansion lists).
 * */
const params = async (
  { templates }: RunnerConfig,
  externalArgv: string[],
): Promise<ParamsResult> => {
  const argv = yargs(externalArgv);
  const { _, ...cleanArgv } = argv;

  // expansion consumes only positional lists: a repeated `--name` flag (array value)
  // is rejected, pointing the user at the comma-separated positional list.
  if (Array.isArray(cleanArgv.name)) {
    throw new CliArgumentError(
      "repeating the '--name' flag is not supported; use a comma-separated positional name list instead (e.g. 'hygen <gen> <action> a,b').",
    );
  }

  // the actionable flow needs a templates dir; when absent the code exits
  // before any path join happens, so templates is non-null here in practice.
  const { generator, actions, names } = await resolvePositionals(
    templates!,
    argv._.map(String),
  );

  if (!generator || !actions) {
    return {
      generator,
      actions,
      names,
      templates,
      cleanArgv,
    };
  }
  return {
    templates,
    generator,
    actions,
    names,
    cleanArgv,
    // include positionals as special args for templates to consume,
    // and a unique timestamp for this run
    _,
    ts: process.env.HYGEN_TS || new Date().getTime(),
    ...cleanArgv,
  };
};

export default params;

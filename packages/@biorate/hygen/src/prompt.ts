import path from 'path';
import fs from 'fs';
import type { Prompter, RunnerConfig } from './types';
import helpers from './helpers';
import { pickableGenerators, generatorActions } from './help';

const hooksfiles = ['index.js', 'index.ts', 'prompt.cjs', 'prompt.js', 'prompt.ts'];
/**
 * @description Runs the prompt hook for an action folder (if present) or falls
 * back to prompting for any unknown/empty params via the prompter. TypeScript
 * hook files are transpiled on the fly with `ts-node`.
 * @param createPrompter - Factory producing the prompter to use.
 * @param actionfolder - The action folder to inspect for a prompt hook.
 * @param args - The CLI-supplied arguments used to skip already-provided params.
 * @returns The prompt answers (or the resolved hook params), an object when no hook/prompt applies.
 * */
const prompt = async <Q, T>(
  createPrompter: () => Prompter<Q, T>,
  actionfolder: string,
  args: Record<string, any>,
): Promise<T | object> => {
  const hooksfile = hooksfiles
    .map((f) => path.resolve(path.join(actionfolder, f)))
    .find((f) => fs.existsSync(f));

  if (!hooksfile) {
    return Promise.resolve({});
  }
  const isTypeScriptHook = /\.ts$/.test(hooksfile);

  // Lazily support TS hook files
  if (isTypeScriptHook) {
    require('ts-node/register/transpile-only');
  }
  // shortcircuit without prompter
  let hooksModule = await import(hooksfile);
  if (hooksModule.default) {
    hooksModule = hooksModule.default;
  }

  if (hooksModule.params) {
    return hooksModule.params({ args, h: helpers });
  }

  // lazy loads prompter
  // everything below requires it
  const prompter = createPrompter();
  if (hooksModule.prompt) {
    return hooksModule.prompt({
      prompter,
      inquirer: prompter,
      args,
      h: helpers,
    });
  }

  return prompter.prompt(
    // prompt _only_ for things we've not seen on the CLI
    hooksModule.filter(
      (p: { name: string } & Record<string, any>) =>
        args[p.name] === undefined || args[p.name] === null || args[p.name].length === 0,
    ),
  );
};

/** @description An enquirer select-style question used by the interactive picker. */
interface PickQuestion {
  type: 'select';
  name: string;
  message: string;
  choices: string[];
}

/** @description A picker answer map (`{ <question name>: <chosen value> }`). */
type PickAnswer = Record<string, unknown>;

/** @description The result of the interactive generator/action picker. */
export interface PickResult {
  /** @description The chosen generator name. */
  generator: string;
  /** @description The chosen action name within the generator. */
  action: string;
}

/**
 * @description Reads the answer value under a question name when it is a non-empty
 * string; otherwise `undefined` (a prompter that did not answer as expected).
 */
const answerValue = (answer: PickAnswer, name: string): string | undefined => {
  const value = answer[name];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

/**
 * @description Runs the two-level interactive generator/action picker. Lists the
 * generators discoverable in the templates root (a top-level directory containing
 * at least one action subdirectory), then the action subdirectories of the chosen
 * generator; the selection is returned as if it had been passed positionally. When
 * the templates root is absent or holds no pickable generator, a "no generators
 * found" guidance message is logged and `null` is returned — no empty menu is shown.
 * @param config - The resolved runner configuration (templates, prompter, logger).
 * @returns The picked `{ generator, action }`, or `null` when no selection is possible.
 * */
export const pickGeneratorAction = async (
  config: RunnerConfig,
): Promise<PickResult | null> => {
  const { templates, logger } = config;
  if (!templates || !fs.existsSync(templates)) {
    logger.log(`No generators found.

  The interactive picker needs a _templates folder here, or anywhere up the folder tree.
  Create one with: $ hygen init self
`);
    return null;
  }

  const generators = pickableGenerators(templates);
  if (generators.length === 0) {
    logger.log(`No generators found.

  Every top-level folder in _templates should hold at least one action subfolder.
  Create one with: $ hygen with-prompt new my-generator
`);
    return null;
  }

  const prompter = config.createPrompter<PickQuestion, PickAnswer>();
  const generatorAnswer = await prompter.prompt({
    type: 'select',
    name: 'generator',
    message: 'Select a generator:',
    choices: generators,
  });
  const generator = answerValue(generatorAnswer, 'generator');
  if (!generator) return null;

  const actions = generatorActions(templates, generator);
  const actionPrompter = config.createPrompter<PickQuestion, PickAnswer>();
  const actionAnswer = await actionPrompter.prompt({
    type: 'select',
    name: 'action',
    message: `Select an action for ${generator}:`,
    choices: actions,
  });
  const action = answerValue(actionAnswer, 'action');
  if (!action) return null;

  return { generator, action };
};

export default prompt;

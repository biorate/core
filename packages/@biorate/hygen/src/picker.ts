import fs from 'fs';
import type { PickResult, RunnerConfig } from './types';
import { pickableGenerators, generatorActions } from './help';

/** @description An enquirer select-style question used by the interactive picker. */
interface PickQuestion {
  type: 'select';
  name: string;
  message: string;
  choices: string[];
}

/** @description A picker answer map (`{ <question name>: <chosen value> }`). */
type PickAnswer = Record<string, unknown>;

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

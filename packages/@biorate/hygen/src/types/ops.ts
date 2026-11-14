import type { ActionResult } from './results';
import type { RenderedAction } from './attributes';
import type { RunnerConfig } from './config';

/**
 * @description A single operation applied to one rendered action. Receives the
 * rendered action, the run's arguments and the runner configuration, and
 * resolves to the operation outcome. */
export type Op = (
  action: RenderedAction,
  args: Record<string, unknown>,
  config: RunnerConfig,
) => Promise<ActionResult>;

/**
 * @description Locates the insertion index (in a pre-split line array) for one
 * inject anchor kind. Each locator closes over its own anchor value and target
 * path so the caller needs only the lines to operate on. */
export interface AnchorLocator {
  locate: (lines: string[]) => number;
}

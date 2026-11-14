/** @description The result of the interactive generator/action picker. */
export interface PickResult {
  /** @description The chosen generator name. */
  generator: string;
  /** @description The chosen action name within the generator. */
  action: string;
}

/**
 * @description A question/answer interaction used by template prompt hooks.
 * `Q` is the prompt/question shape and `T` the resolved answer shape. */
export interface Prompter<Q, T> {
  /** @description Ask a single prompt and resolve with the answer. */
  prompt: (arg0: Q) => Promise<T>;
}

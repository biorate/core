/**
 * @description A callable helper exposed to templates through the `h` context
 * value. Accepts arbitrary arguments and returns an arbitrary value. */
export type Helper = (...args: unknown[]) => unknown;

/**
 * @description A map of helper name to helper value, merged into the `h`
 * namespace. A value may be a callable (invocable in templates as
 * `h.name(args)`) or a scalar (usable as data in templates and resolvable by
 * `$IDENTIFIER$` path macros in mirrored targets). */
export type Helpers = Record<string, unknown>;

/**
 * @description A named content transform registered under `config.transforms`.
 * Receives the rendered content and the run locals used for rendering, and
 * returns the (possibly transformed) content. May be asynchronous. */
export type Transform = (
  content: string,
  locals: Record<string, unknown>,
) => string | Promise<string>;

/** @description A map of transform name to transform function. */
export type Transforms = Record<string, Transform>;

import path from 'path';
import { PathMacroResolutionError } from './errors';
import type { RunnerConfig } from './types';
import context from './context';

/**
 * @description Matches a path macro of the form `$IDENTIFIER$` inside a single
 * path segment. Identifiers follow the JavaScript identifier charset; `$` is a
 * legal filename character on Linux, macOS and Windows, so template folders
 * named with macros check out on all three platforms. */
const MACRO_PATTERN = /\$([A-Za-z_][A-Za-z0-9_]*)\$/g;

/**
 * @description Builds the macro lookup dictionary: the same locals context
 * templates see (prompt-hook answers, positional/flag `name`, CLI args, config
 * defaults) merged with the `h` helper namespace (built-in + config helpers
 * factory exports), so both `$name$` and `$CLIENT_NAME$` resolve.
 * @param args - The run arguments for the current pass.
 * @param config - The runner configuration (helpers may be a factory).
 * @returns The flat identifier dictionary. */
const macroDictionary = (args: Record<string, any>, config: RunnerConfig) => {
  const ctx = context(args, config) as Record<string, any> & { h: Record<string, any> };
  return { ...ctx, ...ctx.h };
};

/**
 * @description Resolves `$IDENTIFIER$` macros in a mirrored target path,
 * segment by segment. Each macro is substituted with the string value of the
 * identifier from the run locals (a macro is always a scalar: name expansion
 * runs one pass per name, so each pass sees a single value). An identifier with
 * no resolvable value throws `PathMacroResolutionError` naming the template
 * file, the offending segment and the identifier. Paths without `$` are
 * returned unchanged, so macro-free templates resolve exactly as before.
 * @param rel - The mirrored target path (relative, template suffix already
 * stripped per the suffix convention).
 * @param args - The run arguments for the current pass.
 * @param config - The runner configuration.
 * @param file - The template file path (for error reporting).
 * @returns The resolved path. */
const resolvePathMacros = (
  rel: string,
  args: Record<string, any>,
  config: RunnerConfig,
  file: string,
): string => {
  if (!rel.includes('$')) return rel;
  const dict = macroDictionary(args, config);
  return rel
    .split(path.sep)
    .map((segment) =>
      segment.replace(MACRO_PATTERN, (_match: string, identifier: string) => {
        const value = dict[identifier];
        if (value === undefined || value === null) {
          throw new PathMacroResolutionError(file, segment, identifier);
        }
        return String(value);
      }),
    )
    .join(path.sep);
};

export { resolvePathMacros };

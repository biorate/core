import { InjectionAnchorNotFoundError } from '../errors';
import type { AnchorLocator } from '../types';

const EOLRegex = /\r?\n/;

const pragmaticIndex = (
  pattern: string,
  lines: string[],
  isBefore: boolean,
  anchor: string,
  to: string,
): number => {
  const oneLineMatchIndex = lines.findIndex((l) => l.match(pattern));

  // joins the text and looks for line number,
  // we dont care about platform line-endings correctness other than joining/splitting
  // for all platforms
  if (oneLineMatchIndex < 0) {
    const fullText = lines.join('\n');
    const fullMatch = fullText.match(new RegExp(pattern, 'm'));

    if (fullMatch && fullMatch.length) {
      if (isBefore) {
        const fullTextUntilMatchStart = fullText.substring(0, fullMatch.index);
        return fullTextUntilMatchStart.split(EOLRegex).length - 1;
      }
      const matchEndIndex = (fullMatch.index ?? 0) + fullMatch.toString().length;
      const fullTextUntilMatchEnd = fullText.substring(0, matchEndIndex);
      return fullTextUntilMatchEnd.split(EOLRegex).length;
    }
  }

  // Fixes upstream bug #404: an unfound `before`/`after` anchor was a silent no-op
  // (or a misplaced top-of-file insertion for `after`). It now throws so the inject
  // operation fails and the target file stays untouched.
  if (oneLineMatchIndex < 0) {
    throw new InjectionAnchorNotFoundError(anchor, to);
  }

  return oneLineMatchIndex + (isBefore ? 0 : 1);
};

const locatorByKind: Record<string, (value: unknown, to: string) => AnchorLocator> = {
  at_line: (l) => ({ locate: () => l as number }),
  prepend: () => ({ locate: () => 0 }),
  append: () => ({ locate: (lines) => lines.length - 1 }),
  before: (v, to) => ({
    locate: (lines) => pragmaticIndex(String(v), lines, true, 'before', to),
  }),
  after: (v, to) => ({
    locate: (lines) => pragmaticIndex(String(v), lines, false, 'after', to),
  }),
};

/**
 * @description Resolves the first anchor key present in `attributes` to a locator and
 * returns the insertion line index; `-1` when no anchor attribute is present. */
export const indexByLocation = (
  attributes: Record<string, unknown>,
  lines: string[],
  to: string,
): number => {
  const pair = Object.entries(attributes).find(([k]) => locatorByKind[k]);
  if (pair) {
    const [k, v] = pair;
    return locatorByKind[k](v, to).locate(lines);
  }
  return -1;
};

import type { RenderedAction } from '../types';
import newline from '../newline';
import { InjectionAnchorNotFoundError, TemplateConfigError } from '../errors';

const EOLRegex = /\r?\n/;

const getPragmaticIndex = (
  pattern: string,
  lines: string[],
  isBefore: boolean,
  anchor: string,
  to: string,
) => {
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
const locations: Record<string, (l: unknown, lines: string[], to: string) => number> = {
  at_line: (l) => l as number,
  prepend: () => 0,
  append: (_, lines) => lines.length - 1,
  before: (_, lines, to) => getPragmaticIndex(String(_), lines, true, 'before', to),
  after: (_, lines, to) => getPragmaticIndex(String(_), lines, false, 'after', to),
};
const indexByLocation = (
  attributes: Record<string, any>,
  lines: string[],
  to: string,
): number => {
  const pair = Object.entries(attributes).find(([k, _]) => locations[k]);
  if (pair) {
    const [k, v] = pair;
    return locations[k](v, lines, to);
  }
  return -1;
};
const REPLACE_ANCHORS = ['before', 'after'] as const;

const injector = (action: RenderedAction, content: string, to = ''): string => {
  const {
    attributes: { skip_if, eof_last, replace },
    attributes,
    body,
  } = action;
  // `skip_if_not: true` inverts the `skip_if` condition: injection runs only
  // when the text/regex is present instead of only when it is absent.
  const shouldSkip = skip_if
    ? !!content.match(skip_if) !== !!attributes.skip_if_not
    : false;

  if (shouldSkip) {
    return content;
  }

  if (replace) {
    if (attributes.inject) {
      throw new TemplateConfigError(
        '`inject: true` and `replace: true` are mutually exclusive: use exactly one',
      );
    }
    const activeAnchor = REPLACE_ANCHORS.find(
      (anchor) => attributes[anchor] !== undefined,
    );
    if (!activeAnchor) {
      throw new TemplateConfigError(
        '`replace: true` requires a `before` or `after` anchor',
      );
    }
    const pattern = String(attributes[activeAnchor]);
    const regex = new RegExp(pattern, 'm');
    if (!regex.test(content)) {
      throw new InjectionAnchorNotFoundError(pattern, to);
    }
    // String.replace with a function replacer substitutes only the first match
    // and keeps `$` sequences in the body literal.
    return content.replace(regex, () => body);
  }

  //
  // we care about producing platform-correct line endings.
  // however the "correct" line endings should be detected from the actual
  // CONTENT given, and not the underlying operating system.
  // this is similar to how a text editor behaves.
  //
  const NL = newline(content);
  const lines = content.split(NL);

  // returns -1 (end) if no attrs
  const idx = indexByLocation(attributes, lines, to);

  const trimEOF = idx >= 0 && eof_last === false && /\r?\n$/.test(body);
  const insertEOF = idx >= 0 && eof_last === true && !/\r?\n$/.test(body);

  if (trimEOF) {
    lines.splice(idx, 0, body.replace(/\r?\n$/, ''));
  } else if (insertEOF) {
    lines.splice(idx, 0, `${body}${NL}`);
  } else if (idx >= 0) {
    lines.splice(idx, 0, body);
  }
  return lines.join(NL);
};

export default injector;

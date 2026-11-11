import type { RenderedAction } from '../types';
import newline from '../newline';
import { InjectionAnchorNotFoundError, TemplateConfigError } from '../errors';
import { indexByLocation } from './anchors';

const REPLACE_ANCHORS = ['before', 'after'] as const;

/**
 * @description Applies injection semantics to `content`: `skip_if`/`skip_if_not`
 * short-circuit, `replace` swaps a matched anchor region, and the anchor-family
 * options (`before`/`after`/`prepend`/`append`/`at_line`) splice the body at a
 * resolved line index. Throws `InjectionAnchorNotFoundError`/`TemplateConfigError`
 * on invalid anchor usage.
 * @param action - The rendered action (attributes + body) driving the injection.
 * @param content - The target file content to inject into.
 * @param to - The target path (used in error messages).
 * @returns The modified content with the body injected (or unchanged when skipped).
 * */
const injector = (action: RenderedAction, content: string, to = ''): string => {
  const {
    attributes: { skip_if, eof_last, replace },
    attributes,
    body,
  } = action;
  // `skip_if_not: true` inverts the `skip_if` condition: injection runs only
  // when the text/regex is present instead of only when it is absent.
  const skipIf = typeof skip_if === 'string' ? skip_if : '';
  const skipIfNot = attributes.skip_if_not === true;
  const shouldSkip = skipIf ? !!content.match(skipIf) !== skipIfNot : false;

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

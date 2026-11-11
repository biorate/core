import { EOL } from 'os';
/**
 * @description Detects the end-of-line sequence dominant in `string` (CRLF vs LF),
 * defaulting to the platform EOL when the string has no newlines. Used to keep
 * injected content's line endings consistent with the target file.
 * @param string - The text to inspect for newline characters.
 * @returns The detected newline sequence (`\r\n` or `\n`).
 * */
const newline = (string: string) => {
  const newlines = string.match(/(?:\r?\n)/g) || [];

  if (newlines.length === 0) {
    return EOL;
  }

  const crlf = newlines.filter((newline) => newline === '\r\n').length;
  const lf = newlines.length - crlf;

  return crlf > lf ? '\r\n' : '\n';
};

export default newline;

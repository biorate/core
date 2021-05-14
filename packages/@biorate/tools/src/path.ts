import {
  dirname as dir,
  basename as base,
  extname as ext,
  join,
  normalize,
} from 'path';

export function dirname(filepath: string, full = false) {
  return !full ? dir(filepath).split('/').pop() : dir(filepath);
}

export function basename(filepath: string, ext = '.js') {
  return base(filepath, ext);
}

export function extname(filepath: string) {
  return ext(basename(filepath, ''));
}

export function create(...args: string[]) {
  return normalize(join(...args));
}

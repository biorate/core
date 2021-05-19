import { dirname as dir, basename as base, extname as ext, join, normalize } from 'path';

/**
 * @description
 * Get full path to file or its directory name
 * @param filepath - Path
 * @param full - Get full path or file directory name only?
 * @example
 * ```ts
 * import { path } from '@biorate/tools';
 * console.log(path.dirname('/www/root/index.html')); // root
 * console.log(path.dirname('/www/root/index.html', true)); // /www/root
 * ```
 */
export function dirname(filepath: string, full = false) {
  return !full ? dir(filepath).split('/').pop() : dir(filepath);
}

/**
 * @description
 * Get file basename, with .js ext by default
 * @param filepath - Path
 * @param ext - extname of file
 * @example
 * ```ts
 * import { path } from '@biorate/tools';
 * console.log(path.basename('/www/root/index.js', '.js')); // index
 * console.log(path.basename('/www/root/index.js', '')); // index.js
 * console.log(path.basename('/www/root/index.html', '.html')); // index
 * console.log(path.basename('/www/root/index.html')); // index.html
 * ```
 */
export function basename(filepath: string, ext = '.js') {
  return base(filepath, ext);
}

/**
 * @description
 * Get file extname
 * @param filepath - Path
 * @example
 * ```ts
 * import { path } from '@biorate/tools';
 * console.log(path.extname('/www/root/index.js')); // .js
 * console.log(path.extname('/www/root/index.html')); // .html
 * ```
 */
export function extname(filepath: string) {
  return ext(basename(filepath, ''));
}

/**
 * @description
 * Create normalized path from strings
 * @example
 * ```ts
 * import { path } from '@biorate/tools';
 * console.log(path.create('www', 'root/a/b/', '/c/', '', '/index.js'));
 *   // www/root/a/b/c/index.js
 * ```
 */
export function create(...args: string[]) {
  return normalize(join(...args));
}
